/* ============================================================
   Dun Rite OS — Spreadsheet sync
   Connect a Google Sheet (any share/edit link or a published CSV).
   The app polls it and upserts projects, so editing the sheet
   updates the app for everyone. CORS-friendly via Google's gviz CSV.
   ============================================================ */
window.DROSheets = (function(){
  const KEY='dr_sheet_url';
  let status='off';            // off | syncing | ok | error
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

  function start(){ stop(); if(localStorage.getItem(KEY)){ syncNow(); timer=setInterval(syncNow, 30000); } }
  function stop(){ if(timer){ clearInterval(timer); timer=null; } }
  function connect(url){ localStorage.setItem(KEY, url.trim()); start(); }
  function disconnect(){ localStorage.removeItem(KEY); stop(); status='off'; info={rows:0,added:0,updated:0,when:null,error:null}; emit(); }
  function getUrl(){ return localStorage.getItem(KEY)||''; }

  // begin polling if previously connected (after store + sync are ready)
  setTimeout(start, 600);
  return { connect, disconnect, syncNow, onStatus, getUrl, toCsvUrl, get status(){return status;}, get info(){return info;} };
})();
