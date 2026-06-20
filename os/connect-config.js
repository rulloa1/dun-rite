/* ============================================================
   DunRite OS — One-click connect credentials
   Fill these in to enable real "connect to my account" buttons:
     • Dropbox Chooser  → pick a backup folder from your signed-in Dropbox
     • Google Picker    → pick a sheet from your signed-in Google Drive

   Until a key is filled in, the matching button falls back to the
   paste-a-link flow (everything still works, just one extra step).

   WHERE THE KEYS COME FROM
   ------------------------
   dropboxAppKey   dropbox.com/developers → Create app → "App key".
                   Under the app's settings, add your site's domain to
                   "Chooser / Saver / Embedder domains".
   googleClientId  console.cloud.google.com → APIs & Services →
                   Credentials → OAuth 2.0 Client ID (Web application).
                   Add your domain under "Authorized JavaScript origins".
   googleApiKey    same Credentials page → "API key". Then enable the
                   "Google Picker API" under APIs & Services → Library.
   microsoftClientId  Azure Portal → Entra ID → App registrations → New.
                   Add a Single-Page App redirect URI of your site origin,
                   and Graph delegated scopes Files.ReadWrite + User.Read.
   microsoftTenant 'common' for any work/personal account, or your tenant
                   ID to restrict sign-in to your organization.
   quickbooksClientId  developer.intuit.com → your app → Keys & OAuth →
                   Client ID. Add a redirect URI of <origin>/qbo-callback.
                   (Token exchange runs server-side — see functions/.)
   quickbooksEnv   'sandbox' while testing, 'production' once live.

   IMPORTANT: keys are tied to the exact domain the app is served from.
   For this project that is:  https://dunriteconstruction.app
   Register that origin on each provider:
     • Dropbox app → Settings → "Chooser / Saver / Embedder domains"
     • Google OAuth client → "Authorized JavaScript origins"
   The keys will NOT work inside the design preview — only on the
   deployed site at dunriteconstruction.app.
   ============================================================ */
window.DR_CONNECT = {
  dropboxAppKey:     '',   // e.g. 'a1b2c3d4e5f6g7h'
  googleClientId:    '',   // e.g. '1234567890-abc123.apps.googleusercontent.com'
  googleApiKey:      '',   // e.g. 'AIzaSyD...'
  microsoftClientId: '',   // Azure app (SPA) client ID, e.g. '11111111-2222-3333-4444-555555555555'
  microsoftTenant:   'common',  // 'common' | 'organizations' | your tenant ID
  quickbooksClientId:'',   // Intuit app client ID (developer.intuit.com)
  quickbooksEnv:     'production',  // 'sandbox' | 'production'
};
