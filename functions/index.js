const {onCall, HttpsError} = require('firebase-functions/v2/https');
const {defineSecret} = require('firebase-functions/params');
const logger = require('firebase-functions/logger');

/* Resend API key — set it as a secret, never commit it:
     firebase functions:secrets:set RESEND_API_KEY
   (see functions/README.md) */
const RESEND_API_KEY = defineSecret('RESEND_API_KEY');

/* Verified sender. The domain (dunriteconstruction.app) must be verified
   in Resend → Domains before mail will deliver. Until then, Resend's
   onboarding sender "onboarding@resend.dev" works for testing. */
const FROM = 'DunRite OS <notifications@dunriteconstruction.app>';

/* Callable from the web app:
     firebase.functions().httpsCallable('sendNotification')({ to, subject, text })
   `to` may be a string or an array of addresses. */
exports.sendNotification = onCall(
  { secrets: [RESEND_API_KEY], cors: true, region: 'us-central1' },
  async (req) => {
    const { to, subject, text, html } = req.data || {};
    if (!to || !subject) {
      throw new HttpsError('invalid-argument', 'Both "to" and "subject" are required.');
    }
    const recipients = Array.isArray(to) ? to.filter(Boolean) : [to];
    if (!recipients.length) {
      throw new HttpsError('invalid-argument', 'At least one recipient is required.');
    }

    const payload = { from: FROM, to: recipients, subject };
    if (html) payload.html = html;
    if (text) payload.text = text;
    if (!html && !text) payload.text = subject;

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

