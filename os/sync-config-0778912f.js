/* ============================================================
   Dun Rite OS — Live Sync configuration
   ------------------------------------------------------------
   FILL THIS IN ONCE to turn on live sync across every device and
   person. Until it's filled in, the app runs fine on this device
   using local storage. Setup takes about 5 minutes — see
   os/SYNC_SETUP.md for step-by-step instructions.

   Get these two values from the Firebase console:
     1. Create a free project at https://console.firebase.google.com
     2. Build > Realtime Database > Create Database (start in test mode)
     3. Project settings > General > Your apps > Web app  → copy apiKey
     4. Realtime Database page → copy the URL at the top
        (looks like https://your-project-default-rtdb.firebaseio.com)
   ============================================================ */
window.DR_FIREBASE = {
  apiKey:      "YOUR_API_KEY_HERE",
  databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
  // the rest are optional for realtime-database-only sync:
  authDomain:  "",
  projectId:   "",
  appId:       ""
};

/* Allow connecting from inside the app (Settings → Connect) without
   editing this file: a saved config in localStorage wins. */
try{
  var _saved = JSON.parse(localStorage.getItem('dr_firebase_cfg'));
  if(_saved && _saved.apiKey){ Object.assign(window.DR_FIREBASE, _saved); }
}catch(e){}

/* ------------------------------------------------------------
   TEAM ROSTER — maps each sign-in email to a name + role.
   Used only when live sync is on (real password sign-in). Add a
   line per person; create their login in Firebase console →
   Authentication → Users (or enable Email/Password sign-up).
   Roles: owner | pm | super | office
   ------------------------------------------------------------ */
window.DR_TEAM = {
  "owner@dunrite.com":  { name:"Jerry Ruskin",  role:"owner",  title:"Owner" },
  "mike.rcccon@yahoo.com": { name:"Michael Chandler", role:"owner", title:"Executive" },
  "roryulloa@gmail.com": { name:"Rory Ulloa", role:"admin", title:"Construction Technology Specialist" },
  "sarah@dunrite.com":  { name:"Sarah Johnson", role:"pm",     title:"Project Manager" },
  "mike@dunrite.com":   { name:"Mike Torres",   role:"super",  title:"Superintendent" },
  "lisa@dunrite.com":   { name:"Lisa Chen",     role:"office", title:"Office / Bookkeeper" }
};
