/* ============================================================
   DunRite OS — notification client
   Thin wrapper over the `sendNotification` Cloud Function (Resend).
   • If Firebase Functions is loaded AND the app has been connected
     (Live Sync configured), it calls the function and real email goes out.
   • Otherwise it no-ops gracefully (console log only) so the prototype
     and the design preview never break or block on it.
   See functions/README.md for the backend + setup.
   ============================================================ */
window.DRNotify = (function(){
  let fns = null, ready = false;

  function ensure(){
    if(ready) return true;
    try{
      if(typeof firebase === 'undefined' || !firebase.functions) return false;
      if(!(firebase.apps && firebase.apps.length)) return false; // app initialized by os/sync.js when configured
      fns = firebase.app().functions('us-central1');
      ready = true;
    }catch(e){ ready = false; }
    return ready;
  }

  function send(opts){
    opts = opts || {};
    const to = opts.to;
    if(!to || (Array.isArray(to) && !to.length)){
      return Promise.resolve({ ok:false, skipped:'no-recipient' });
    }
    if(!ensure()){
      // Local / not-configured / preview: don't send, don't fail.
      console.info('[DRNotify] (local) would email', to, '·', opts.subject);
      return Promise.resolve({ ok:false, local:true });
    }
    return fns.httpsCallable('sendNotification')({ to:to, subject:opts.subject, text:opts.text, html:opts.html })
      .then(function(r){ return { ok:true, id:(r.data && r.data.id) || null }; })
      .catch(function(e){ console.warn('[DRNotify] send failed:', e && e.message); return { ok:false, err:e && e.message }; });
  }

  setTimeout(ensure, 900);
  return { send:send, ensure:ensure, get enabled(){ return ensure(); } };
})();
