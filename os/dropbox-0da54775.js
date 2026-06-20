/* ============================================================
   Dun Rite OS — Dropbox link
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
    return 'Dun Rite';
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
      account: opts.account || 'Dun Rite Construction',
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

  load();
  setTimeout(emit, 300);
  return { connect, disconnect, onStatus, openUrl, folderName,
           get status(){return status;}, get info(){return info;} };
})();
