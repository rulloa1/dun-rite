/* ============================================================
   DunRite OS — QuickBooks Online link (contractor accounting)
   Push invoices to QuickBooks so the books stay current.
     • If an Intuit app (quickbooksClientId) is configured, "Connect to
       QuickBooks" launches the real Intuit OAuth window. Token exchange
       runs server-side (see functions/) — that's how Intuit requires it.
     • Otherwise connect by entering your company name (prototype) so the
       sync flow + status work end-to-end while you wire up OAuth.
   Mirrors the other connectors. No-ops safely in the preview.
   ============================================================ */
window.DRQuickBooks = (function(){
  const KEY='dr_qbo';
  let status='off';                 // off | connected
  let info={company:'', realm:'', url:'', when:null, synced:0};
  const subs=new Set();
  const emit=()=>subs.forEach(fn=>fn(status,info));
  function onStatus(fn){ subs.add(fn); fn(status,info); return ()=>subs.delete(fn); }

  function cfg(){ return window.DR_CONNECT||{}; }
  function canOAuth(){ return !!cfg().quickbooksClientId; }

  function load(){
    try{ const raw=localStorage.getItem(KEY); if(raw){ info=Object.assign(info, JSON.parse(raw)||{}); status='connected'; } }catch(e){}
  }
  function persist(){ try{ localStorage.setItem(KEY, JSON.stringify(info)); }catch(e){} }

  function connect(opts){
    opts=opts||{};
    info={
      company: opts.company || 'QuickBooks Online',
      realm:   opts.realm   || '',
      url:     'https://qbo.intuit.com',
      when:    Date.now(),
      synced:  info.synced||0
    };
    status='connected'; persist();
    if(window.drToast) drToast('QuickBooks connected \u00b7 '+info.company);
    emit();
  }
  function disconnect(){
    status='off'; info={company:'',realm:'',url:'',when:null,synced:0};
    try{ localStorage.removeItem(KEY); }catch(e){}
    if(window.drToast) drToast('QuickBooks disconnected');
    emit();
  }

  /* Real Intuit OAuth — opens the consent window. The redirect lands on
     <origin>/qbo-callback, where a Cloud Function exchanges the code for
     tokens (Intuit forbids client-side secret exchange). */
  function connectOAuth(){
    const c=cfg();
    if(!c.quickbooksClientId){ if(window.drToast) drToast('Add your QuickBooks client ID in os/connect-config.js to enable sign-in.'); return; }
    const redirect=location.origin+'/qbo-callback';
    const url='https://appcenter.intuit.com/connect/oauth2'
      +'?client_id='+encodeURIComponent(c.quickbooksClientId)
      +'&response_type=code'
      +'&scope='+encodeURIComponent('com.intuit.quickbooks.accounting')
      +'&redirect_uri='+encodeURIComponent(redirect)
      +'&state=dunrite';
    window.open(url,'qbo','width=600,height=760');
    if(window.drToast) drToast('Finish in the QuickBooks window \u2014 token exchange runs server-side.');
  }

  function markSynced(n){ info.synced=(info.synced||0)+(n||0); persist(); emit(); }
  function openUrl(){ return info.url || 'https://qbo.intuit.com'; }


  /* Listen for the token-exchange Cloud Function's popup postMessage.
     When the /qbo-callback page posts { qbo:'ok', company, realmId }
     we call connect() so the sidebar badge and sync all update. */
  window.addEventListener('message', function(event){
    if (!event.data || event.data.qbo !== 'ok') return;
    const d = event.data;
    connect({ company: d.company || 'QuickBooks Online', realm: d.realmId || '' });
  });

  load();
  setTimeout(emit, 300);
  return { connect, disconnect, connectOAuth, onStatus, openUrl, canOAuth, markSynced,
           get status(){return status;}, get info(){return info;} };
})();
