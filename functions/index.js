const {onCall, HttpsError} = require('firebase-functions/v2/https');
const {defineSecret} = require('firebase-functions/params');
const logger = require('firebase-functions/logger');
const {buildInviteEmail, buildInviteText, buildNotificationEmail} = require('./email-templates');

/* Resend API key — set it as a secret, never commit it:
     firebase functions:secrets:set RESEND_API_KEY
   (see functions/README.md) */
const RESEND_API_KEY = defineSecret('RESEND_API_KEY');

/* Verified sender. The domain (dunriteconstruction.app) must be verified
   in Resend → Domains before mail will deliver. Until then, Resend's
   onboarding sender "onboarding@resend.dev" works for testing. */
const FROM = 'DunRite OS <notifications@dunriteconstruction.app>';

/* Only this address may invite users (enforced in the sendInvite callable). */
const WORKSPACE_ADMIN_EMAIL = 'roryulloa@gmail.com';

/* Workspace membership for sendNotification (keep roughly in sync with DR_TEAM
   in src/app/sync-config.js). Any address on an allowed domain, plus the
   explicit external members below, may trigger notifications. */
const ALLOWED_EMAIL_DOMAINS = ['dunrite.com'];
const TEAM_EXTRA_EMAILS = new Set(['roryulloa@gmail.com', 'mike.rcccon@yahoo.com']);
function isTeamMember(email){
  email = (email || '').toLowerCase();
  if (!email) return false;
  if (TEAM_EXTRA_EMAILS.has(email)) return true;
  return ALLOWED_EMAIL_DOMAINS.includes(email.split('@')[1] || '');
}

/* Callable from the web app:
     firebase.functions().httpsCallable('sendNotification')({ to, subject, text })
   `to` may be a string or an array of addresses. */
exports.sendNotification = onCall(
  { secrets: [RESEND_API_KEY], cors: true, region: 'us-central1' },
  async (req) => {
    // Require an authenticated caller so the endpoint can't be used anonymously
    // to send mail from your domain. (Enforced once real sign-in is enabled;
    // see dunrite-os/SETUP-AUTH.md.)
    if (!req.auth) {
      throw new HttpsError('unauthenticated', 'You must be signed in to send notifications.');
    }
    // Membership check: only known workspace members may send.
    if (!isTeamMember((req.auth.token && req.auth.token.email) || '')) {
      throw new HttpsError('permission-denied', 'Only DunRite workspace members can send notifications.');
    }
    const { to, subject, text, html } = req.data || {};
    if (!to || !subject) {
      throw new HttpsError('invalid-argument', 'Both "to" and "subject" are required.');
    }
    const recipients = Array.isArray(to) ? to.filter(Boolean) : [to];
    if (!recipients.length) {
      throw new HttpsError('invalid-argument', 'At least one recipient is required.');
    }

    const payload = { from: FROM, to: recipients, subject };
    // Use caller-supplied HTML if given; otherwise wrap the text/subject in the
    // branded notification template so every email is on-brand.
    payload.html = html || buildNotificationEmail({ title: subject, text: text || subject, theme: 'dark' });
    payload.text = text || subject;

    let res;
    try {
      res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + RESEND_API_KEY.value(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    } catch (e) {
      logger.error('Resend request failed', e);
      throw new HttpsError('internal', 'Could not reach the email provider.');
    }

    if (!res.ok) {
      const detail = await res.text();
      logger.error('Resend send failed', res.status, detail);
      throw new HttpsError('internal', 'Email send failed (' + res.status + ').');
    }

    const data = await res.json().catch(() => ({}));
    logger.info('Email sent', data.id || '(no id)', '→', recipients.join(', '));
    return { ok: true, id: data.id || null };
  }
);

/* Callable: send a branded workspace-invite email.
     sendInvite({ to, name, role, email, tempPassword, signInUrl, inviter })
   Builds the HTML + text from email-templates.js so the design and the
   correct "DunRite" branding live in one place. */
exports.sendInvite = onCall(
  { secrets: [RESEND_API_KEY], cors: true, region: 'us-central1' },
  async (req) => {
    /* Only the workspace administrator (Rory Ulloa) may invite users. When the
       caller is signed in (real auth mode), enforce it server-side. In the
       account-picker mode there is no auth token to verify, so the UI gate in
       views-directory.jsx is the control there. */
    const caller = req.auth && req.auth.token ? (req.auth.token.email || '').toLowerCase() : '';
    if (req.auth && caller !== WORKSPACE_ADMIN_EMAIL) {
      throw new HttpsError('permission-denied', 'Only the workspace administrator can invite users.');
    }
    const d = req.data || {};
    const to = d.to || d.email;
    if (!to) throw new HttpsError('invalid-argument', 'A recipient "to"/"email" is required.');
    const opts = {
      name: d.name,
      email: d.email || to,
      role: d.role || 'Team Member',
      tempPassword: d.tempPassword,
      signInUrl: d.signInUrl || 'https://dunriteconstruction.app',
      inviter: d.inviter,
      theme: d.theme || 'dark',
    };
    // Provision the Firebase Auth login so the invitee can actually sign in
    // (idempotent: skips if the account already exists). Best-effort — the
    // invite email still goes out even if provisioning fails.
    let provisioned = false, provisionNote = null;
    if (opts.tempPassword) {
      try {
        await admin.auth().createUser({
          email: opts.email,
          password: opts.tempPassword,
          displayName: opts.name || undefined,
          emailVerified: false,
        });
        provisioned = true;
      } catch (e) {
        provisionNote = (e && e.code) || 'create-failed';
        if (provisionNote !== 'auth/email-already-exists') logger.warn('createUser failed', e && e.message);
      }
    }
    const payload = {
      from: FROM,
      to: [to],
      subject: `You've been added to DunRite OS${opts.role ? ' as ' + opts.role : ''}`,
      html: buildInviteEmail(opts),
      text: buildInviteText(opts),
    };
    let res;
    try {
      res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + RESEND_API_KEY.value(), 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (e) {
      logger.error('Resend request failed', e);
      throw new HttpsError('internal', 'Could not reach the email provider.');
    }
    if (!res.ok) {
      const detail = await res.text();
      logger.error('sendInvite failed', res.status, detail);
      throw new HttpsError('internal', 'Invite send failed (' + res.status + ').');
    }
    const data = await res.json().catch(() => ({}));
    logger.info('Invite sent', data.id || '(no id)', '→', to, provisioned ? '(login created)' : (provisionNote || ''));
    return { ok: true, id: data.id || null, provisioned, provisionNote };
  }
);

/* ============================================================
   QuickBooks Online OAuth callback
   ---------------------------------
   Intuit redirects to <origin>/qbo-callback?code=...&realmId=...
   after the user consents. This function:
     1. Exchanges the authorization code for access + refresh tokens
     2. Fetches the company name from the QBO API
     3. Stores tokens in Firebase Realtime DB at /qbo/{realmId}
     4. Returns a tiny HTML page that posts {qbo:'ok'} to the opener
        and closes the popup window.

   Secrets required (set via `firebase functions:secrets:set`):
     QB_CLIENT_ID     — from developer.intuit.com → Keys & OAuth
     QB_CLIENT_SECRET — same page, keep this server-side only

   firebase.json must rewrite /qbo-callback → this function
   (before the SPA catch-all).
   ============================================================ */
const {onRequest} = require('firebase-functions/v2/https');

const QB_CLIENT_ID     = defineSecret('QB_CLIENT_ID');
const QB_CLIENT_SECRET = defineSecret('QB_CLIENT_SECRET');

const QBO_REDIRECT = 'https://dunriteconstruction.app/qbo-callback';

exports.qboCallback = onRequest(
  { secrets: [QB_CLIENT_ID, QB_CLIENT_SECRET], cors: false, region: 'us-central1' },
  async (req, res) => {
    const { code, realmId, error } = req.query;

    function closePopup(msg) {
      const safeMsg = JSON.stringify(msg);
      const icon = msg.ok ? '✅ QuickBooks connected' : '❌ ' + (msg.error || 'Connection failed');
      res.set('Content-Type', 'text/html');
      res.send(
        '<!doctype html><html><head><meta charset="utf-8"><title>QuickBooks</title>' +
        '<style>body{font-family:sans-serif;display:flex;align-items:center;justify-content:center;' +
        'height:100vh;margin:0;background:#1a1f2e;color:#e2e8f0;font-size:1.1rem}</style></head><body>' +
        '<p>' + icon + ' — closing…</p>' +
        '<script>try{window.opener&&window.opener.postMessage(' + safeMsg + ",'*');}catch(e){}" +
        'setTimeout(function(){window.close();},900);</script></body></html>'
      );
    }

    if (error) {
      logger.warn('QBO OAuth error param', error);
      return closePopup({ qbo: 'error', error: String(error) });
    }
    if (!code || !realmId) {
      return closePopup({ qbo: 'error', error: 'Missing code or realmId' });
    }

    // ── 1. Exchange code for tokens ───────────────────────────
    let tokens;
    try {
      const creds = Buffer.from(
        QB_CLIENT_ID.value() + ':' + QB_CLIENT_SECRET.value()
      ).toString('base64');
      const tokenRes = await fetch(
        'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer',
        {
          method: 'POST',
          headers: {
            'Authorization': 'Basic ' + creds,
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type:   'authorization_code',
            code:         String(code),
            redirect_uri: QBO_REDIRECT,
          }).toString(),
        }
      );
      if (!tokenRes.ok) {
        const detail = await tokenRes.text();
        logger.error('QBO token exchange failed', tokenRes.status, detail);
        return closePopup({ qbo: 'error', error: 'Token exchange failed (' + tokenRes.status + ')' });
      }
      tokens = await tokenRes.json();
    } catch (e) {
      logger.error('QBO token exchange error', e);
      return closePopup({ qbo: 'error', error: 'Network error during token exchange' });
    }

    // ── 2. Fetch company name ─────────────────────────────────
    let company = 'QuickBooks Online';
    try {
      const isProduction = (QB_CLIENT_ID.value() || '').startsWith('AB') ||
                           process.env.QB_ENV !== 'sandbox';
      const apiBase = isProduction
        ? 'https://quickbooks.api.intuit.com'
        : 'https://sandbox-quickbooks.api.intuit.com';
      const infoRes = await fetch(
        apiBase + '/v3/company/' + realmId + '/companyinfo/' + realmId + '?minorversion=65',
        {
          headers: {
            'Authorization': 'Bearer ' + tokens.access_token,
            'Accept': 'application/json',
          },
        }
      );
      if (infoRes.ok) {
        const d = await infoRes.json();
        company = (d.QueryResponse && d.QueryResponse.CompanyInfo &&
                   d.QueryResponse.CompanyInfo[0] && d.QueryResponse.CompanyInfo[0].CompanyName)
               || (d.CompanyInfo && d.CompanyInfo.CompanyName)
               || company;
      }
    } catch (e) {
      logger.warn('Could not fetch QBO company info', e && e.message);
    }

    // ── 3. Persist tokens in Realtime DB ──────────────────────
    try {
      await admin.database().ref('qbo/' + realmId).set({
        realmId:               String(realmId),
        company,
        accessToken:           tokens.access_token,
        refreshToken:          tokens.refresh_token,
        tokenType:             tokens.token_type  || 'Bearer',
        expiresIn:             tokens.expires_in  || 3600,
        xRefreshTokenExpiresIn:tokens.x_refresh_token_expires_in || 8726400,
        connectedAt:           Date.now(),
      });
    } catch (e) {
      logger.error('Failed to store QBO tokens in RTDB', e);
      // non-fatal — the popup will still close successfully
    }

    logger.info('QBO connected', realmId, company);
    return closePopup({ qbo: 'ok', ok: true, company, realmId: String(realmId) });
  }
);

/* ============================================================
   Scheduled insurance reminders
   Runs daily; emails subcontractors whose COI is expiring (≤30 days)
   or expired, plus a summary to your team (set INSURANCE_ALERT_TO).
   Reads the live workspace from Realtime Database (Live Sync must be on).
   ============================================================ */
const {onSchedule} = require('firebase-functions/v2/scheduler');
const admin = require('firebase-admin');
admin.initializeApp();

async function resendSend(key, msg){
  try{
    const res = await fetch('https://api.resend.com/emails', {
      method:'POST',
      headers:{ 'Authorization':'Bearer '+key, 'Content-Type':'application/json' },
      body: JSON.stringify({ from: FROM, to: Array.isArray(msg.to)?msg.to:[msg.to], subject: msg.subject, text: msg.text })
    });
    if(!res.ok){ logger.error('Resend failed', res.status, await res.text()); }
    return res.ok;
  }catch(e){ logger.error('Resend error', e); return false; }
}

exports.insuranceReminders = onSchedule(
  { schedule: '0 8 * * *', timeZone: 'America/Chicago', secrets: [RESEND_API_KEY], region: 'us-central1' },
  async () => {
    const key = RESEND_API_KEY.value();
    const snap = await admin.database().ref('workspace').get();
    const ws = snap.val() || {};
    const dir = Array.isArray(ws.directory) ? ws.directory : [];
    const ins = ws.insurance || {};
    const now = Date.now(), DAY = 86400000;
    const issues = [];

    dir.forEach((c) => {
      if(c.type !== 'Subcontractor' || c.status !== 'active') return;
      const rec = ins[c.id];
      if(!rec || !rec.policies || !rec.policies.length) return;
      let soonest = Infinity, soonestStr = null;
      rec.policies.forEach((p) => { const t = Date.parse(p.expires); if(!isNaN(t) && t < soonest){ soonest = t; soonestStr = p.expires; } });
      if(soonest === Infinity) return;
      const days = Math.floor((soonest - now) / DAY);
      if(days <= 30) issues.push({ c, days, expires: soonestStr, expired: days < 0 });
    });

    for(const it of issues){
      if(it.c.email){
        await resendSend(key, {
          to: it.c.email,
          subject: `Action needed: your insurance is ${it.expired ? 'expired' : 'expiring'} — DunRite`,
          text: `Hi ${it.c.contact || it.c.name}, our records show ${it.c.name}'s insurance is ${it.expired ? ('expired on ' + it.expires) : ('expiring in ' + it.days + ' days (' + it.expires + ')')}. Please send DunRite an updated certificate of insurance to stay eligible for active work.`
        });
      }
    }

    const teamTo = (process.env.INSURANCE_ALERT_TO || '').split(',').map((s) => s.trim()).filter(Boolean);
    if(issues.length && teamTo.length){
      await resendSend(key, {
        to: teamTo,
        subject: `${issues.length} subcontractor(s) with expiring/expired insurance`,
        text: issues.map((i) => `• ${i.c.name}: ${i.expired ? 'EXPIRED' : (i.days + 'd left')} (${i.expires})`).join('\n')
      });
    }

    logger.info('insuranceReminders processed', issues.length, 'subs with COI issues');
    return null;
  }
);

