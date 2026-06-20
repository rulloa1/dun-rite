/* ============================================================
   Dun Rite OS — Authentication layer
   When live sync is configured AND the Firebase Auth SDK is present,
   this turns on real email + password sign-in and resolves each
   person's name/role from the DR_TEAM map in sync-config.js.
   If sync isn't configured it reports enabled=false and the app
   uses the local account picker exactly as before (zero change).
   ============================================================ */
window.DROSAuth = (function(){
  let enabled = false, fbAuth = null;
  const subs = new Set();

  const team = () => window.DR_TEAM || {};
  function resolve(email){
    const e = (email||'').toLowerCase();
    const t = team()[e];
    if(t) return {email:e, name:t.name, role:t.role, title:t.title, initials:(t.name||e).split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()};
    const name = e.split('@')[0];
    return {email:e, name, role:'pm', title:'Team Member', initials:name.slice(0,2).toUpperCase()};
  }

  function init(){
    const cfg = window.DR_FIREBASE;
    const configured = cfg && cfg.apiKey && !/YOUR_/i.test(cfg.apiKey);
    const requireSignIn = (function(){ try{ return localStorage.getItem('dr_require_signin')==='1'; }catch(e){ return false; } })();
    if(!configured || !requireSignIn || typeof firebase === 'undefined' || !firebase.auth){ enabled = false; return; }
    try{
      fbAuth = firebase.auth();   // firebase.initializeApp already ran in sync.js
      enabled = true;
      fbAuth.onAuthStateChanged(u => { const mapped = u ? resolve(u.email) : null; subs.forEach(fn=>fn(mapped)); });
    }catch(e){ console.error('[DROSAuth] init failed', e); enabled = false; }
  }

  return {
    get enabled(){ return enabled; },
    init,
    onChange(fn){ subs.add(fn); return ()=>subs.delete(fn); },
    resolve,
    async signIn(email, pwd){
      try{ await fbAuth.signInWithEmailAndPassword(email.trim(), pwd); return {ok:true}; }
      catch(e){ return {ok:false, err:e.message.replace(/^Firebase:\s*/,'').replace(/\(auth.*$/,'')}; }
    },
    async signOut(){ try{ await fbAuth.signOut(); }catch(e){} },
  };
})();
DROSAuth.init();
