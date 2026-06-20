# DunRite OS — Email Notifications (Cloud Function)

Sends notification emails (e.g. "a change order needs your approval") from the
deployed app via a Firebase Cloud Function + [Resend](https://resend.com).

It is **opt-in and safe**: with nothing configured, the app logs notifications
to the console and sends nothing. Email only goes out on your deployed site
once the steps below are done.

## What sends mail
The client calls `sendNotification` (see `os/notify.js`). The store fires it on:
- **Change order created** → emails owners/admins ("needs approval")
- **High-priority issue logged** → emails owners/admins ("needs attention")
- **Insurance updated / renewed** → emails the subcontractor that their COI on file changed
- **Insurance alert** (Insurance tab → "Notify subs & team" / per-row bell) → emails the
  affected subcontractor(s) and the team

There is also a **scheduled** function, `insuranceReminders` (`functions/index.js`):
it runs daily (08:00) and automatically emails subcontractors whose COI is expiring
(≤30 days) or expired, plus a summary to your team. It reads the live workspace from
Realtime Database, so **Live Sync must be connected** for it to see your data.
Set the team recipients with an env var when deploying, e.g.:
```bash
firebase functions:config:set  # (or use .env) — INSURANCE_ALERT_TO=mike.rcccon@yahoo.com,roryulloa@gmail.com
```
Adjust the cron/timezone in the `onSchedule({ schedule, timeZone })` options.

Recipients are the users in `os/store.js` whose role is `owner`/`admin` **and**
who have an `email` set. Add/adjust emails there.

## One-time setup (~10 min)

1. **Create a Resend account** at resend.com and add an API key.
2. **Verify your sending domain** (Resend → Domains → add `dunriteconstruction.app`,
   then add the DNS records it shows). Until verified, change `FROM` in
   `functions/index.js` to `onboarding@resend.dev` for testing.
3. **Install the Firebase CLI** if needed: `npm i -g firebase-tools`.
4. From `dunrite-app/`:
   ```bash
   cd functions && npm install && cd ..
   firebase functions:secrets:set RESEND_API_KEY      # paste your re_... key
   firebase deploy --only functions
   ```
5. **Point the app at your Firebase project.** The function is only reachable
   once the web app has initialized Firebase — open the app, click the **Live**
   badge (top bar), and enter your Firebase API key + Realtime Database URL.
   `os/notify.js` picks it up automatically.

## Test it
With the app live + Firebase connected, create a Change Order on any project —
the owners/admins with an email on file get a message. Watch logs with:
```bash
firebase functions:log --only sendNotification
```

## Locking it down (recommended later)
`onCall` currently accepts any caller. To require sign-in, enable the app's
"Require sign-in" toggle (Live Sync modal) and add an `if (!req.auth) throw ...`
check at the top of `sendNotification`.
