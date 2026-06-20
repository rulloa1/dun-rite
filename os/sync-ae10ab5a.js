/* ============================================================
   Dun Rite OS — Live Sync layer
   Mirrors the whole shared workspace to Firebase Realtime Database
   so every device + account sees the same data live. If no keys are
   configured (or the SDK isn't present), it stays silent and the app
   runs on local storage exactly as before. Status: local | connecting | live
   ============================================================ */
window.DROSSync = (function(){
  let status = 'local';
  const statusSubs = new Set();
  function setStatus(s){ if(s===status) return; status=s; statusSubs.forEach(fn=>fn(s)); }
  function onStatus(fn){ statusSubs.add(fn); fn(status); return ()=>statusSubs.delete(fn); }

  let dbRef = null, applyingRemote = false, lastJSON = '', pushTimer = null;

  function configured(cfg){
    return cfg && cfg.apiKey && cfg.databaseURL
      && !/YOUR_|YOUR-/i.test(cfg.apiKey)
      && !/YOUR_PROJECT|YOUR-PROJECT/i.test(cfg.databaseURL);
  }

  /* Self-correct common URL mistakes: people often paste the Firebase
     console address instead of the database URL. Derive the real
     https://<instance>.firebaseio.com from whatever they pasted. */
  function normalizeDbUrl(u){
    if(!u) return u;
    u = String(u).trim();
    try{
      if(/console\.firebase\.google\.com/i.test(u)){
        const m = u.match(/database\/([a-z0-9-]+?)(?:\/|$)/i);
        if(m && m[1]) return 'https://' + m[1] + '.firebaseio.com';
        const pm = u.match(/project\/([a-z0-9-]+)/i);
        if(pm && pm[1]) return 'https://' + pm[1] + '-default-rtdb.firebaseio.com';
      }
      return new URL(u).origin;   // strip any child path
    }catch(e){ return u; }
  }

  function push(st){
    if(!dbRef) return;
    const j = JSON.stringify(st);
    if(j === lastJSON) return;          // nothing changed
    lastJSON = j;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(()=>{ try{ dbRef.set(JSON.parse(j)); }catch(e){ console.error('sync push failed', e); } }, 250);
  }

  function init(){
    const cfg = window.DR_FIREBASE;
    if(!configured(cfg)){ setStatus('local'); return; }
    if(typeof firebase === 'undefined' || !firebase.database){
      console.warn('[DROSSync] Firebase SDK not loaded — staying in local mode.');
      setStatus('local'); return;
    }
    cfg.databaseURL = normalizeDbUrl(cfg.databaseURL);   // auto-fix bad URLs
    try{
      firebase.initializeApp(cfg);
      const db = firebase.database();
      dbRef = db.ref('workspace');
      setStatus('connecting');

      // connection indicator
      db.ref('.info/connected').on('value', snap => setStatus(snap.val() ? 'live' : 'connecting'));

      // remote -> local
      dbRef.on('value', snap => {
        const remote = snap.val();
        if(remote){
          const rj = JSON.stringify(remote);
          if(rj !== JSON.stringify(DROS.state)){
            applyingRemote = true;
            lastJSON = rj;
            DROS.applyRemote(remote);
            applyingRemote = false;
          }
        } else {
          push(DROS.state);            // empty cloud — seed it from this device
        }
      });

      // local -> remote
      DROS.onLocalChange(st => { if(!applyingRemote) push(st); });
    }catch(e){
      console.error('[DROSSync] init failed', e);
      setStatus('local');
    }
  }

  return { init, onStatus, normalizeDbUrl, get status(){ return status; } };
})();

DROSSync.init();
