/* ============================================================
   DunRite OS — Dropbox link
   Connect a Dropbox team/shared folder so every job's documents
   back up to the same place. Prototype connector: we store the
   shared-folder link locally and expose connection state + an
   "Open in Dropbox" target. (Real deployment would swap this for
   the Dropbox OAuth + /files API — same surface, live data.)
   ============================================================ */
window.DRDropbox = (function(){
  const KEY='dr_dropbox';
  let status='off';                 // off | connected
  let info={account:'', folder:'', url:'', when:null};
  const subs=new Set();
  const emit=()=>subs.forEach(fn=>fn(status,info));
  function onStatus(fn){ subs.add(fn); fn(status,info); return ()=>subs.delete(fn); }

  /* derive a friendly folder name from a Dropbox link or path */
  function folderName(link){
    link=String(link||'').trim();
    const m=link.replace(/[?#].*$/,'').match(/\/([^\/]+)\/?$/);
    if(m) return decodeURIComponent(m[1]).replace(/[-_+]+/g,' ').trim();
    return 'DunRite';
  }

  function load(){
    try{
      const raw=localStorage.getItem(KEY);
      if(raw){ const d=JSON.parse(raw)||{}; info=Object.assign({account:'',folder:'',url:'',when:null}, d); status='connected'; }
    }catch(e){}
  }

  function connect(opts){
    opts=opts||{};
    const url=String(opts.url||'').trim();
    info={
      account: opts.account || 'DunRite Construction',
      folder:  opts.folder  || folderName(url),
      url:     url || 'https://www.dropbox.com/home',
      when:    Date.now()
    };
    status='connected';
    try{ localStorage.setItem(KEY, JSON.stringify(info)); }catch(e){}
    if(window.drToast) drToast('Dropbox connected · '+info.folder);
    if(window.DROS&&DROS.actions&&DROS.actions.logActivity){ /* optional hook */ }
    emit();
  }
  function disconnect(){
    status='off'; info={account:'',folder:'',url:'',when:null};
    try{ localStorage.removeItem(KEY); }catch(e){}
    if(window.drToast) drToast('Dropbox disconnected');
    emit();
  }
  /* Open target for a job/folder. Shared links don't take reliable
     subpaths, so we open the connected base folder. */
  function openUrl(){ return info.url || 'https://www.dropbox.com/home'; }

  /* ---- one-click connect via Dropbox Chooser (Drop-ins) ----
     Uses the visitor's already-signed-in Dropbox session, so picking a
     backup folder is a single click. Requires DR_CONNECT.dropboxAppKey
     and runs only on a registered domain (not the design preview). */
  function appKey(){ return (window.DR_CONNECT||{}).dropboxAppKey || ''; }
  function canChoose(){ return !!appKey(); }
  function ensureDropins(){
    return new Promise((res,rej)=>{
      if(window.Dropbox) return res();
      const key=appKey();
      if(!key) return rej(new Error('no-key'));
      if(!document.getElementById('dropboxjs')){
        const s=document.createElement('script');
        s.id='dropboxjs';
        s.src='https://www.dropbox.com/static/api/2/dropins.js';
        s.setAttribute('data-app-key', key);
        s.onerror=()=>rej(new Error('load-failed'));
        document.head.appendChild(s);
      }
      const t0=Date.now();
      (function wait(){ if(window.Dropbox) return res(); if(Date.now()-t0>9000) return rej(new Error('load-timeout')); setTimeout(wait,120); })();
    });
  }
  function chooseFolder(){
    return ensureDropins().then(()=>new Promise(resolve=>{
      window.Dropbox.choose({
        success: files=>{ const f=files&&files[0]; if(f){ connect({url:f.link, folder:f.name}); resolve({ok:true}); } else resolve({ok:false}); },
        cancel:  ()=>resolve({ok:false, cancelled:true}),
        linkType:'preview', multiselect:false, folderselect:true,
      });
    })).catch(e=>{
      if(window.drToast) drToast(e.message==='no-key'
        ? 'Add your Dropbox app key in os/connect-config.js to enable one-click connect.'
        : 'Couldn\u2019t reach Dropbox \u2014 paste a folder link instead.');
      return {ok:false, err:e.message};
    });
  }

  load();
  setTimeout(emit, 300);
  return { connect, disconnect, onStatus, openUrl, folderName, canChoose, chooseFolder,
           get status(){return status;}, get info(){return info;} };
})();
