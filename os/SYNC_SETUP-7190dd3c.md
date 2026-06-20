# Dun Rite OS — Turn on Live Sync (≈5 minutes)

Out of the box the app works on each device using that device's local storage.
To make **everyone share one live workspace** (the owner on his laptop, the super
on his phone, the office PC — all seeing the same data update in real time),
do this once:

## 1. Create a free Firebase project
1. Go to **https://console.firebase.google.com** and sign in with a Google account.
2. Click **Add project** → name it `dun-rite` → continue (you can disable Analytics) → **Create**.

## 2. Turn on the Realtime Database
1. In the left menu: **Build → Realtime Database → Create Database**.
2. Pick a location → choose **Start in test mode** → **Enable**.
3. At the top of that page you'll see a URL like
   `https://dun-rite-default-rtdb.firebaseio.com` — **copy it**.

## 3. Get your web key
1. Click the **gear icon → Project settings**.
2. Scroll to **Your apps**, click the **web** icon (`</>`), register an app named `Dun Rite`.
3. In the config shown, **copy the `apiKey` value**.

## 4. Paste both into the app
Open **`os/sync-config.js`** and replace the two placeholders:

```js
window.DR_FIREBASE = {
  apiKey:      "PASTE_YOUR_API_KEY",
  databaseURL: "https://dun-rite-default-rtdb.firebaseio.com",
  ...
};
```

Save and reload. The badge in the top bar will switch from **Local** to **Live**.
That's it — every device that opens the app now shares the same workspace.

## Notes
- **Test mode** lets anyone with the link read/write for 30 days — fine for getting
  going. Lock it down with the steps below before relying on it.
- Nothing else changes: the same logins, screens, and automations work identically,
  they're just shared live instead of per-device.
- To go back to local-only, blank out the `apiKey` again.

---

# Lock it down — real sign-in + database rules

Once sync works, switch from open test mode to proper accounts (≈5 more minutes).

## A. Turn on password sign-in
1. Firebase console → **Build → Authentication → Get started**.
2. Enable the **Email/Password** provider → Save.
3. Go to the **Users** tab → **Add user** for each team member
   (email + a starter password). Use the same emails listed in
   `os/sync-config.js` under `DR_TEAM` so they get the right role:
   - `owner@dunrite.com` → owner
   - `sarah@dunrite.com` → PM, `mike@dunrite.com` → super, `lisa@dunrite.com` → office
   - Add/rename to match your real team — each line maps an email to a name + role.

As soon as auth is enabled, the app's login screen automatically switches from the
account picker to **email + password**. No code change needed.

## B. Restrict the database to signed-in users
1. Firebase console → **Build → Realtime Database → Rules** tab.
2. Replace the rules with:

```json
{
  "rules": {
    "workspace": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

3. Click **Publish**.

Now only people you've created accounts for can read or write the workspace.
That's the whole system locked down — shared, live, and private to your team.
