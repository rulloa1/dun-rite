/* ============================================================
   DunRite OS — Spreadsheet sync
   Connect a Google Sheet (any share/edit link or a published CSV).
   The app polls it and upserts projects, so editing the sheet
   updates the app for everyone. CORS-friendly via Google's gviz CSV.
   ============================================================ */
window.DROSheets = (function(){
  const KEY='dr_sheet_url';            // pasted CSV / share link
  const PKEY='dr_sheet_picked';        // Google-picked sheet {id,title}
  let status='off';            // off | syncing | ok | error
  let _gToken=null, _tokenClient=null, _gapiPickerReady=false;
  let info={rows:0,added:0,updated:0,when:null,error:null};
  let timer=null;
  const subs=new Set();
  const emit=()=>subs.forEach(fn=>fn(status,info));
  function onStatus(fn){ subs.add(fn); fn(status,info); return ()=>subs.delete(fn); }

  /* turn any Google Sheets link into a CSV endpoint */
  function toCsvUrl(u){
    u=String(u||'').trim(); if(!u) return '';
    if(/output=csv/i.test(u)) return u;                       // already published CSV
    if(/\/pub(\?|$)/i.test(u)) return u + (u.includes('?')?'&':'?') + 'output=csv';
    const id=(u.match(/\/spreadsheets\/d\/(?:e\/)?([a-zA-Z0-9-_]+)/)||[])[1];
    if(id){
      const gid=(u.match(/[#&?]gid=(\d+)/)||[])[1]||'0';
      return `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv&gid=${gid}`;
    }
    return u;                                                  // assume a direct CSV link
  }

  /* minimal CSV parser (quotes + commas + newlines) */
  function parseCSV(text){
    const rows=[]; let row=[], cur='', q=false;
    for(let i=0;i<text.length;i++){ const c=text[i];
      if(q){ if(c==='"'){ if(text[i+1]==='"'){cur+='"';i++;} else q=false; } else cur+=c; }
      else { if(c==='"') q=true; else if(c===','){ row.push(cur); cur=''; }
        else if(c==='\n'){ row.push(cur); rows.push(row); row=[]; cur=''; }
        else if(c==='\r'){} else cur+=c; }
    }
    if(cur!==''||row.length){ row.push(cur); rows.push(row); }
    return rows.filter(r=>r.some(c=>String(c).trim()!==''));
  }
  function toObjects(text){
    const rows=parseCSV(text); if(rows.length<2) return [];
    const head=rows[0].map(h=>h.trim());
    return rows.slice(1).map(r=>{ const o={}; head.forEach((h,i)=>o[h]=r[i]!=null?r[i]:''); return o; });
  }

  async function syncNow(){
    const picked=getPicked();
    if(picked && canPick()){
      status='syncing'; emit();
      try{ await syncPicked(picked); }
      catch(e){ info=Object.assign({},info,{error:e.message||'Sync failed', when:Date.now()}); status='error'; emit(); }
      return;
    }
    const raw=localStorage.getItem(KEY); if(!raw) return;
    status='syncing'; emit();
    try{
      const url=toCsvUrl(raw);
      const res=await fetch(url, {cache:'no-store'});
      if(!res.ok) throw new Error('HTTP '+res.status);
      const text=await res.text();
      if(/<html/i.test(text)) throw new Error('Sheet is not shared publicly');
      const objs=toObjects(text);
      const r=DROS.actions.importRows(objs);
      info={rows:objs.length, added:r.added, updated:r.updated, tasks:r.tasks, budget:r.budget, when:Date.now(), error:null};
      status='ok'; emit();
    }catch(e){
      info=Object.assign({},info,{error:e.message||'Sync failed', when:Date.now()});
      status='error'; emit();
    }
  }

  /* ---- one-click connect via Google Picker ----
     Uses the visitor's signed-in Google session to pick a sheet from
     their Drive, then reads it with the Sheets API (works on private
     sheets too). Requires DR_CONNECT.googleClientId + googleApiKey and
     a registered domain (not the design preview). */
  function gcfg(){ return window.DR_CONNECT||{}; }
  function canPick(){ const c=gcfg(); return !!(c.googleClientId && c.googleApiKey); }
  function getPicked(){ try{ return JSON.parse(localStorage.getItem(PKEY)||'null'); }catch(e){ return null; } }
  function loadScriptOnce(src){
    return new Promise((res,rej)=>{
      if([...document.scripts].some(s=>s.src===src)){ res(); return; }
      const s=document.createElement('script'); s.src=src; s.async=true; s.defer=true;
      s.onload=()=>res(); s.onerror=()=>rej(new Error('load '+src));
      document.head.appendChild(s);
    });
  }
  function waitFor(test){ return new Promise((res,rej)=>{ const t0=Date.now(); (function w(){ if(test()) return res(); if(Date.now()-t0>9000) return rej(new Error('load-timeout')); setTimeout(w,100); })(); }); }
  async function ensureGoogle(){
    const c=gcfg(); if(!c.googleClientId||!c.googleApiKey) throw new Error('no-key');
    if(!window.gapi){ await loadScriptOnce('https://apis.google.com/js/api.js'); await waitFor(()=>!!window.gapi); }
    if(!_gapiPickerReady){ await new Promise(r=>gapi.load('picker', r)); _gapiPickerReady=true; }
    if(!(window.google&&google.accounts&&google.accounts.oauth2)){ await loadScriptOnce('https://accounts.google.com/gsi/client'); await waitFor(()=>!!(window.google&&google.accounts&&google.accounts.oauth2)); }
    if(!_tokenClient){ _tokenClient=google.accounts.oauth2.initTokenClient({ client_id:c.googleClientId, scope:'https://www.googleapis.com/auth/drive.readonly', callback:()=>{} }); }
  }
  function requestToken(){
    return new Promise((res,rej)=>{
      _tokenClient.callback=(resp)=>{ if(resp&&resp.access_token){ _gToken=resp.access_token; res(_gToken); } else rej(new Error((resp&&resp.error)||'token-failed')); };
      try{ _tokenClient.requestAccessToken({prompt:''}); }catch(e){ rej(e); }
    });
  }
  async function pickSheet(){
    try{
      await ensureGoogle();
      const token=await requestToken();
      const c=gcfg();
      return await new Promise(resolve=>{
        const view=new google.picker.View(google.picker.ViewId.SPREADSHEETS);
        const picker=new google.picker.PickerBuilder()
          .setOAuthToken(token).setDeveloperKey(c.googleApiKey)
          .addView(view)
          .setCallback(data=>{
            const A=google.picker.Action;
            if(data.action===A.PICKED){ const d=data.docs[0]; connectPicked(d.id, d.name); resolve({ok:true}); }
            else if(data.action===A.CANCEL){ resolve({ok:false, cancelled:true}); }
          }).build();
        picker.setVisible(true);
      });
    }catch(e){
      if(window.drToast) drToast(e.message==='no-key'
        ? 'Add your Google client ID + API key in os/connect-config.js to enable Drive picking.'
        : 'Couldn\u2019t reach Google \u2014 paste a sheet link instead.');
      return {ok:false, err:e.message};
    }
  }
  function connectPicked(id, title){
    localStorage.setItem(PKEY, JSON.stringify({id, title:title||''}));
    localStorage.removeItem(KEY);   // picked mode supersedes a pasted link
    if(window.drToast) drToast('Google Sheet connected · '+(title||id));
    start();
  }
  function valuesToObjects(values){
    if(!values||values.length<2) return [];
    const head=values[0].map(h=>String(h).trim());
    return values.slice(1).map(r=>{ const o={}; head.forEach((h,i)=>o[h]=r[i]!=null?r[i]:''); return o; }).filter(o=>Object.values(o).some(v=>String(v).trim()!==''));
  }
  async function syncPicked(p){
    const c=gcfg();
    await ensureGoogle();
    if(!_gToken) await requestToken();
    const url=`https://sheets.googleapis.com/v4/spreadsheets/${p.id}/values/A1:ZZ10000?key=${encodeURIComponent(c.googleApiKey)}`;
    let res=await fetch(url, {headers:{Authorization:'Bearer '+_gToken}, cache:'no-store'});
    if(res.status===401){ _gToken=null; await requestToken(); res=await fetch(url, {headers:{Authorization:'Bearer '+_gToken}, cache:'no-store'}); }
    if(!res.ok) throw new Error('Sheets API '+res.status);
    const json=await res.json();
    const objs=valuesToObjects(json.values||[]);
    const r=DROS.actions.importRows(objs);
    info={rows:objs.length, added:r.added, updated:r.updated, tasks:r.tasks, budget:r.budget, when:Date.now(), error:null, source:'google', title:p.title};
    status='ok'; emit();
  }

  function start(){ stop(); if(getPicked() || localStorage.getItem(KEY)){ syncNow(); timer=setInterval(syncNow, 30000); } }
  function stop(){ if(timer){ clearInterval(timer); timer=null; } }
  function connect(url){ localStorage.removeItem(PKEY); localStorage.setItem(KEY, url.trim()); start(); }
  function disconnect(){ localStorage.removeItem(KEY); localStorage.removeItem(PKEY); stop(); status='off'; info={rows:0,added:0,updated:0,when:null,error:null}; emit(); }
  function getUrl(){ return localStorage.getItem(KEY)||''; }

  // begin polling if previously connected (after store + sync are ready)
  setTimeout(start, 600);
  return { connect, disconnect, syncNow, onStatus, getUrl, toCsvUrl, canPick, pickSheet, getPicked, get status(){return status;}, get info(){return info;} };
})();
