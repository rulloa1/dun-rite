/* ============================================================
   DunRite OS — Microsoft 365 link (OneDrive / SharePoint)
   Connect a Microsoft 365 document library so every job's files back
   up alongside the rest of the OS.
     • If an Azure app (microsoftClientId) is configured, "Sign in with
       Microsoft" runs a real MSAL popup against Microsoft Graph.
     • Otherwise you paste a OneDrive/SharePoint folder link (prototype
       connector) — same surface, swap for live Graph file APIs later.
   Mirrors the Dropbox connector. Stays silent/no-op in the preview.
   ============================================================ */
window.DRMicrosoft = (function(){
  const KEY='dr_msft';
  let status='off';                 // off | connected
  let info={account:'', folder:'', url:'', when:null};
  const subs=new Set();
  const emit=()=>subs.forEach(fn=>fn(status,info));
  function onStatus(fn){ subs.add(fn); fn(status,info); return ()=>subs.delete(fn); }

  function cfg(){ return window.DR_CONNECT||{}; }
  function canSignIn(){ return !!cfg().microsoftClientId; }

  function folderName(link){
    link=String(link||'').trim();
    const m=link.replace(/[?#].*$/,'').match(/\/([^\/]+)\/?$/);
    if(m) return decodeURIComponent(m[1]).replace(/[-_+]|%20/g,' ').trim();
    return 'OneDrive';
  }
  function load(){
    try{ const raw=localStorage.getItem(KEY); if(raw){ info=Object.assign({account:'',folder:'',url:'',when:null}, JSON.parse(raw)||{}); status='connected'; } }catch(e){}
  }
  function persist(){ try{ localStorage.setItem(KEY, JSON.stringify(info)); }catch(e){} }

  function connect(opts){
    opts=opts||{}; const url=String(opts.url||'').trim();
    info={
      account: opts.account || 'Microsoft 365',
      folder:  opts.folder  || folderName(url),
      url:     url || 'https://www.office.com',
      when:    Date.now()
    };
    status='connected'; persist();
    if(window.drToast) drToast('Microsoft 365 connected \u00b7 '+info.folder);
    emit();
  }
  function disconnect(){
    status='off'; info={account:'',folder:'',url:'',when:null};
    try{ localStorage.removeItem(KEY); }catch(e){}
    if(window.drToast) drToast('Microsoft 365 disconnected');
    emit();
  }

  /* ---- real sign-in via MSAL (Microsoft Graph) when configured ---- */
  let _msal=null;
  function ensureMsal(){
    return new Promise((res,rej)=>{
      if(window.msal && window.msal.PublicClientApplication) return res();
      if(!canSignIn()) return rej(new Error('no-key'));
      if(![...document.scripts].some(s=>/msal-browser/.test(s.src||''))){
        const s=document.createElement('script');
        s.src='https://alcdn.msftauth.net/lib/1.4.0/js/msal-browser.min.js';
        s.async=true; s.onerror=()=>rej(new Error('load-failed'));
        document.head.appendChild(s);
      }
      const t0=Date.now();
      (function w(){ if(window.msal&&window.msal.PublicClientApplication) return res(); if(Date.now()-t0>9000) return rej(new Error('load-timeout')); setTimeout(w,120); })();
    });
  }
  async function signIn(){
    try{
      await ensureMsal();
      const c=cfg();
      if(!_msal){
        _msal=new msal.PublicClientApplication({
          auth:{ clientId:c.microsoftClientId, authority:'https://login.microsoftonline.com/'+(c.microsoftTenant||'common'), redirectUri: location.origin },
          cache:{ cacheLocation:'localStorage' }
        });
        if(_msal.initialize) await _msal.initialize();
      }
      const r=await _msal.loginPopup({ scopes:['User.Read','Files.ReadWrite'] });
      const acct=r&&r.account; const name=acct?(acct.username||acct.name):'Microsoft 365';
      connect({ account:name, folder:'OneDrive \u2014 '+name, url:'https://www.office.com/onedrive' });
      return {ok:true};
    }catch(e){
      if(window.drToast) drToast(e.message==='no-key'
        ? 'Add your Microsoft (Azure) client ID in os/connect-config.js to enable sign-in.'
        : 'Microsoft sign-in failed \u2014 paste a OneDrive/SharePoint link instead.');
      return {ok:false, err:e.message};
    }
  }

  function openUrl(){ return info.url || 'https://www.office.com'; }

  load();
  setTimeout(emit, 300);
  return { connect, disconnect, signIn, onStatus, openUrl, folderName, canSignIn,
           get status(){return status;}, get info(){return info;} };
})();
