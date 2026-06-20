/* App shell: store hook, toasts, login (account picker), navigable
   sidebar/topbar, and the router. Renders the whole Operating System. */
const {useState, useEffect} = React;

/* ---- store hook ---- */
function useStore(){
  const [,force]=useState(0);
  useEffect(()=>DROS.subscribe(()=>force(n=>n+1)),[]);
  return {state:DROS.state};
}
window.useStore=useStore;

/* ---- toasts ---- */
let _toastId=0;
function ToastHost(){
  const t=DRtok; const [items,setItems]=useState([]);
  useEffect(()=>{
    window.drToast=(msg)=>{ if(!msg) return; const id=++_toastId; setItems(x=>[...x,{id,msg}]); setTimeout(()=>setItems(x=>x.filter(i=>i.id!==id)),4200); };
  },[]);
  return <div style={{position:'fixed',right:24,bottom:24,zIndex:1000,display:'flex',flexDirection:'column',gap:10,maxWidth:380}}>
    {items.map(i=>(
      <div key={i.id} style={{background:t.navyDeep,color:'#fff',borderRadius:12,padding:'13px 16px',boxShadow:'0 12px 34px rgba(13,30,48,.34)',display:'flex',gap:11,alignItems:'flex-start',animation:'drslide .2s ease'}}>
        <span style={{width:26,height:26,borderRadius:8,background:'rgba(29,180,232,.2)',color:t.cyan,display:'grid',placeItems:'center',flex:'none'}}><DIcon d={IC.bolt} s={15}/></span>
        <span style={{fontSize:12.5,lineHeight:1.4,fontWeight:500,color:'#EAF1F7'}}>{i.msg}</span>
      </div>
    ))}
  </div>;
}
window.drToast=()=>{};

/* ---- live-sync status badge + connect modal ---- */
function SyncBadge(){
  const t=DRtok; const [s,setS]=useState((window.DROSSync&&DROSSync.status)||'local'); const [open,setOpen]=useState(false);
  useEffect(()=>{ if(window.DROSSync) return DROSSync.onStatus(setS); },[]);
  const map={live:['Live',t.ok,t.okBg],connecting:['Connecting',t.warn,t.warnBg],local:['Local',t.idle,t.idleBg]};
  const [label,c,bg]=map[s]||map.local;
  return <React.Fragment>
    <button onClick={()=>setOpen(true)} title="Live sync settings" style={{display:'inline-flex',alignItems:'center',gap:6,height:40,padding:'0 12px',borderRadius:10,background:bg,color:c,fontSize:12,fontWeight:700,flex:'none',border:0,cursor:'pointer'}}>
      <span style={{width:7,height:7,borderRadius:'50%',background:'currentColor',boxShadow:s==='live'?`0 0 8px ${t.ok}`:'none'}}/>{label}
    </button>
    {open && <ConnectModal status={s} onClose={()=>setOpen(false)}/>}
  </React.Fragment>;
}

function ConnectModal({status, onClose}){
  const t=DRtok;
  const cfg=window.DR_FIREBASE||{};
  const live = status==='live' || status==='connecting';
  const [apiKey,setApiKey]=useState(/YOUR_/i.test(cfg.apiKey||'')?'':(cfg.apiKey||''));
  const [dbUrl,setDbUrl]=useState(/YOUR_PROJECT/i.test(cfg.databaseURL||'')?'':(cfg.databaseURL||''));
  const [reqSignIn,setReqSignIn]=useState((function(){ try{return localStorage.getItem('dr_require_signin')==='1';}catch(e){return false;} })());
  const fixUrl = (window.DROSSync&&DROSSync.normalizeDbUrl) ? DROSSync.normalizeDbUrl : (x=>x);
  const cleaned = dbUrl.trim() ? fixUrl(dbUrl) : '';
  const wasFixed = cleaned && cleaned !== dbUrl.trim();
  const save=()=>{ if(!apiKey.trim()||!dbUrl.trim()){ return; } localStorage.setItem('dr_firebase_cfg', JSON.stringify({apiKey:apiKey.trim(), databaseURL:cleaned})); localStorage.setItem('dr_require_signin', reqSignIn?'1':'0'); location.reload(); };
  const disconnect=()=>{ localStorage.removeItem('dr_firebase_cfg'); localStorage.removeItem('dr_require_signin'); location.reload(); };
  const inp={width:'100%',border:`1px solid ${t.line}`,borderRadius:9,padding:'10px 12px',fontSize:13,fontFamily:t.fMono,outline:'none'};
  const lbl={fontSize:11.5,fontWeight:700,color:t.muted,display:'block',marginBottom:5};
  const steps=[['1','Create a free project at console.firebase.google.com'],['2','Build → Realtime Database → Create (test mode). Copy the URL.'],['3','Project settings → Your apps → Web → copy the apiKey.'],['4','Paste both below and Save. Add teammates under Authentication → Users.']];
  return (
    <div onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(14,26,40,.82)',backdropFilter:'blur(3px)',WebkitBackdropFilter:'blur(3px)',zIndex:1200,display:'grid',placeItems:'center',padding:24}}>
      <div onClick={e=>e.stopPropagation()} style={{width:560,maxWidth:'100%',maxHeight:'90vh',overflowY:'auto',background:'#fff',borderRadius:18,boxShadow:'0 24px 60px rgba(13,30,48,.4)',fontFamily:t.fBody}}>
        <div style={{background:`linear-gradient(135deg,${t.navyDeep},${t.navy})`,padding:'20px 24px',color:'#fff',display:'flex',alignItems:'center',gap:13,position:'sticky',top:0,zIndex:1}}>
          <div style={{width:40,height:40,borderRadius:11,background:'rgba(29,180,232,.18)',display:'grid',placeItems:'center',color:t.cyan,flex:'none'}}><DIcon d={IC.bolt} s={20}/></div>
          <div style={{flex:1}}><div style={{fontFamily:t.fHead,fontWeight:800,fontSize:17}}>Live Sync</div><div style={{fontSize:12.5,color:'#9FB3C6',marginTop:2}}>{live?'Connected — everyone shares this workspace live.':'Connect to share one workspace across every device & person.'}</div></div>
          <div style={{fontSize:11,fontWeight:800,letterSpacing:'.05em',textTransform:'uppercase',color:live?t.ok:'#9FB3C6',background:'rgba(255,255,255,.08)',padding:'5px 10px',borderRadius:20}}>{status}</div>
        </div>
        <div style={{padding:'22px 24px'}}>
          <div style={{display:'flex',flexDirection:'column',gap:13}}>
            <div><label style={lbl}>Firebase API key</label><input value={apiKey} onChange={e=>setApiKey(e.target.value)} placeholder="AIza…" style={inp}/></div>
            <div><label style={lbl}>Realtime Database URL</label><input value={dbUrl} onChange={e=>setDbUrl(e.target.value)} placeholder="https://your-project-default-rtdb.firebaseio.com" style={inp}/>
              {wasFixed && <div style={{fontSize:11.5,color:t.ok,marginTop:6,display:'flex',gap:6,alignItems:'flex-start'}}><span style={{flex:'none',marginTop:1}}><DIcon d={IC.check} s={13}/></span><span>We'll use <b style={{fontFamily:t.fMono}}>{cleaned}</b> — paste the console link and we fix it for you.</span></div>}
            </div>
            <label style={{display:'flex',alignItems:'center',gap:11,padding:'11px 13px',border:`1px solid ${t.line}`,borderRadius:10,cursor:'pointer',background:t.cardTint}}>
              <input type="checkbox" checked={reqSignIn} onChange={e=>setReqSignIn(e.target.checked)} style={{width:17,height:17,accentColor:t.blue,flex:'none'}}/>
              <span style={{flex:1}}><span style={{fontSize:13,fontWeight:700,color:t.ink,display:'block'}}>Require email &amp; password sign-in</span><span style={{fontSize:11.5,color:t.muted}}>Leave off to keep the quick account picker. Turn on once you've added users in Firebase → Authentication.</span></span>
            </label>
          </div>
          <div style={{display:'flex',gap:10,marginTop:18}}>
            <button onClick={save} style={{flex:1,background:t.blue,color:'#fff',border:0,borderRadius:10,padding:'12px',fontSize:13.5,fontWeight:700,cursor:'pointer'}}>{live?'Update & reconnect':'Connect & go live'}</button>
            {live && <button onClick={disconnect} style={{background:'#fff',color:t.bad,border:`1px solid ${t.line}`,borderRadius:10,padding:'12px 16px',fontSize:13.5,fontWeight:700,cursor:'pointer'}}>Disconnect</button>}
            <button onClick={onClose} style={{background:'#fff',color:t.muted,border:`1px solid ${t.line}`,borderRadius:10,padding:'12px 16px',fontSize:13.5,fontWeight:600,cursor:'pointer'}}>Close</button>
          </div>
          <div style={{marginTop:18,paddingTop:16,borderTop:`1px solid ${t.lineSoft}`}}>
            <div style={{fontSize:11.5,fontWeight:800,letterSpacing:'.04em',textTransform:'uppercase',color:t.faint,marginBottom:10}}>How to get your keys (≈5 min)</div>
            <div style={{display:'flex',flexDirection:'column',gap:9}}>
              {steps.map(([n,txt])=>(<div key={n} style={{display:'flex',gap:10,alignItems:'flex-start'}}><span style={{width:20,height:20,borderRadius:6,background:t.cardTint,color:t.blue,fontWeight:800,fontSize:11,display:'grid',placeItems:'center',flex:'none'}}>{n}</span><span style={{fontSize:12.5,color:t.ink2,lineHeight:1.4}}>{txt}</span></div>))}
            </div>
            <div style={{fontSize:11.5,color:t.muted,marginTop:12}}>Full walkthrough: <b>os/SYNC_SETUP.md</b></div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- Dropbox connect badge + modal ---- */
function DropboxBadge(){
  const t=DRtok; const [s,setS]=useState(window.DRDropbox?DRDropbox.status:'off'); const [open,setOpen]=useState(false);
  useEffect(()=>{ if(window.DRDropbox) return DRDropbox.onStatus(setS); },[]);
  useEffect(()=>{ const h=()=>setOpen(true); window.addEventListener('dr-open-dropbox',h); return ()=>window.removeEventListener('dr-open-dropbox',h); },[]);
  const live = s==='connected';
  const c = live?'#0061FF':t.idle, bg = live?'rgba(0,97,255,.10)':t.idleBg;
  return <React.Fragment>
    <button onClick={()=>setOpen(true)} title="Connect Dropbox" style={{display:'inline-flex',alignItems:'center',gap:7,height:40,padding:'0 12px',borderRadius:10,background:bg,color:c,fontSize:12.5,fontWeight:700,border:0,cursor:'pointer'}}>
      <DropboxLogo s={15} color={live?'#0061FF':'#6A7889'}/>Dropbox
    </button>
    {open && <DropboxModal onClose={()=>setOpen(false)}/>}
  </React.Fragment>;
}

function DropboxModal({onClose}){
  const t=DRtok;
  const [url,setUrl]=useState(window.DRDropbox?DRDropbox.info.url:'');
  const [s,setS]=useState(window.DRDropbox?DRDropbox.status:'off');
  const [info,setInfo]=useState(window.DRDropbox?DRDropbox.info:{});
  useEffect(()=>{ if(window.DRDropbox) return DRDropbox.onStatus((st,inf)=>{setS(st);setInfo(inf||{});}); },[]);
  const live = s==='connected';
  const connect=()=>{ if(!url.trim())return; DRDropbox.connect({url:url.trim()}); };
  const disconnect=()=>{ DRDropbox.disconnect(); setUrl(''); };
  const inp={width:'100%',border:`1px solid ${t.line}`,borderRadius:9,padding:'10px 12px',fontSize:12.5,fontFamily:t.fMono,outline:'none'};
  const lbl={fontSize:11.5,fontWeight:700,color:t.muted,display:'block',marginBottom:5};
  const when = info&&info.when ? new Date(info.when).toLocaleDateString([], {month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}) : null;
  const steps=[
    ['1','In Dropbox, open the team folder that holds your Dun Rite jobs.'],
    ['2','Click Share → Copy link (or grab the folder path).'],
    ['3','Paste it below and connect — the OS document folders map to it.'],
    ['4','Files filed in the OS mirror into Dropbox; “Open in Dropbox” jumps straight there.'],
  ];
  return (
    <div onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(14,26,40,.82)',backdropFilter:'blur(3px)',WebkitBackdropFilter:'blur(3px)',zIndex:1200,display:'grid',placeItems:'center',padding:24}}>
      <div onClick={e=>e.stopPropagation()} style={{width:560,maxWidth:'100%',maxHeight:'90vh',overflowY:'auto',background:'#fff',borderRadius:18,boxShadow:'0 24px 60px rgba(13,30,48,.4)',fontFamily:t.fBody}}>
        <div style={{background:`linear-gradient(135deg,${t.navyDeep},${t.navy})`,padding:'20px 24px',color:'#fff',display:'flex',alignItems:'center',gap:13,position:'sticky',top:0,zIndex:1}}>
          <div style={{width:40,height:40,borderRadius:11,background:'rgba(76,144,255,.20)',display:'grid',placeItems:'center',flex:'none'}}><DropboxLogo s={21} color="#4C90FF"/></div>
          <div style={{flex:1}}><div style={{fontFamily:t.fHead,fontWeight:800,fontSize:17}}>Dropbox backup</div><div style={{fontSize:12.5,color:'#9FB3C6',marginTop:2}}>{live?`Connected — files back up to ${info.folder||'your team folder'}.`:'Connect a Dropbox folder to back up every job\u2019s documents.'}</div></div>
          {live && <div style={{fontSize:11,fontWeight:800,letterSpacing:'.05em',textTransform:'uppercase',color:t.ok,background:'rgba(255,255,255,.08)',padding:'5px 10px',borderRadius:20}}>linked</div>}
        </div>
        <div style={{padding:'22px 24px'}}>
          <label style={lbl}>Dropbox folder link (or shared-folder URL)</label>
          <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://www.dropbox.com/scl/fo/…" style={inp}/>
          {live && <div style={{fontSize:12,color:'#0061FF',background:'rgba(0,97,255,.07)',borderRadius:9,padding:'9px 11px',marginTop:10,display:'flex',alignItems:'center',gap:8}}><DropboxLogo s={15}/>Backing up to <b>{info.folder}</b>{when?` · since ${when}`:''}</div>}
          <div style={{display:'flex',gap:10,marginTop:16}}>
            <button onClick={connect} style={{flex:1,background:'#0061FF',color:'#fff',border:0,borderRadius:10,padding:'12px',fontSize:13.5,fontWeight:700,cursor:'pointer'}}>{live?'Update link':'Connect Dropbox'}</button>
            {live && <a href={info.url||'#'} target="_blank" rel="noopener" style={{display:'inline-flex',alignItems:'center',gap:7,background:'#fff',color:'#0061FF',border:`1px solid ${t.line}`,borderRadius:10,padding:'12px 16px',fontSize:13.5,fontWeight:700,textDecoration:'none'}}><DIcon d={IC.external} s={15}/>Open</a>}
            {live && <button onClick={disconnect} style={{background:'#fff',color:t.bad,border:`1px solid ${t.line}`,borderRadius:10,padding:'12px 16px',fontSize:13.5,fontWeight:700,cursor:'pointer'}}>Disconnect</button>}
            {!live && <button onClick={onClose} style={{background:'#fff',color:t.muted,border:`1px solid ${t.line}`,borderRadius:10,padding:'12px 16px',fontSize:13.5,fontWeight:600,cursor:'pointer'}}>Close</button>}
          </div>
          <div style={{marginTop:18,paddingTop:16,borderTop:`1px solid ${t.lineSoft}`}}>
            <div style={{fontSize:11.5,fontWeight:800,letterSpacing:'.04em',textTransform:'uppercase',color:t.faint,marginBottom:10}}>How to connect</div>
            <div style={{display:'flex',flexDirection:'column',gap:9}}>
              {steps.map(([n,txt])=>(<div key={n} style={{display:'flex',gap:10,alignItems:'flex-start'}}><span style={{width:20,height:20,borderRadius:6,background:'rgba(0,97,255,.10)',color:'#0061FF',fontWeight:800,fontSize:11,display:'grid',placeItems:'center',flex:'none'}}>{n}</span><span style={{fontSize:12.5,color:t.ink2,lineHeight:1.4}}>{txt}</span></div>))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- spreadsheet sync badge + modal ---- */
function SheetBadge(){
  const t=DRtok; const [s,setS]=useState(window.DROSheets?DROSheets.status:'off'); const [open,setOpen]=useState(false);
  useEffect(()=>{ if(window.DROSheets) return DROSheets.onStatus(setS); },[]);
  const map={off:[t.idle,t.idleBg,'Sheet'],syncing:[t.warn,t.warnBg,'Syncing'],ok:[t.ok,t.okBg,'Sheet'],error:[t.bad,t.badBg,'Sheet']};
  const [c,bg,label]=map[s]||map.off;
  return <React.Fragment>
    <button onClick={()=>setOpen(true)} title="Connect a spreadsheet" style={{display:'inline-flex',alignItems:'center',gap:6,height:40,padding:'0 12px',borderRadius:10,background:bg,color:c,fontSize:12,fontWeight:700,flex:'none',border:0,cursor:'pointer'}}>
      <DIcon d={IC.grid} s={15}/>{label}
    </button>
    {open && <SheetModal onClose={()=>setOpen(false)}/>}
  </React.Fragment>;
}

function SheetModal({onClose}){
  const t=DRtok;
  const [url,setUrl]=useState(window.DROSheets?DROSheets.getUrl():'');
  const [s,setS]=useState(window.DROSheets?DROSheets.status:'off');
  const [info,setInfo]=useState(window.DROSheets?DROSheets.info:{});
  useEffect(()=>{ if(window.DROSheets) return DROSheets.onStatus((st,inf)=>{setS(st);setInfo(inf||{});}); },[]);
  const connect=()=>{ if(!url.trim())return; DROSheets.connect(url.trim()); };
  const disconnect=()=>{ DROSheets.disconnect(); setUrl(''); };
  const inp={width:'100%',border:`1px solid ${t.line}`,borderRadius:9,padding:'10px 12px',fontSize:12.5,fontFamily:t.fMono,outline:'none'};
  const lbl={fontSize:11.5,fontWeight:700,color:t.muted,display:'block',marginBottom:5};
  const live = s!=='off';
  const when = info&&info.when ? new Date(info.when).toLocaleTimeString([], {hour:'numeric',minute:'2-digit'}) : null;
  const steps=[['1','In Google Sheets: Share → General access → “Anyone with the link” (Viewer).'],['2','Copy the sheet link and paste it below — we convert it to a live feed.'],['3','Add a Type column: leave blank for projects, or “task” / “budget” for those rows.'],['4','Edits sync every 30 seconds. Use “Sync now” for an instant refresh.']];
  return (
    <div onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(14,26,40,.82)',backdropFilter:'blur(3px)',WebkitBackdropFilter:'blur(3px)',zIndex:1200,display:'grid',placeItems:'center',padding:24}}>
      <div onClick={e=>e.stopPropagation()} style={{width:560,maxWidth:'100%',maxHeight:'90vh',overflowY:'auto',background:'#fff',borderRadius:18,boxShadow:'0 24px 60px rgba(13,30,48,.4)',fontFamily:t.fBody}}>
        <div style={{background:`linear-gradient(135deg,${t.navyDeep},${t.navy})`,padding:'20px 24px',color:'#fff',display:'flex',alignItems:'center',gap:13,position:'sticky',top:0,zIndex:1}}>
          <div style={{width:40,height:40,borderRadius:11,background:'rgba(29,180,232,.18)',display:'grid',placeItems:'center',color:t.cyan,flex:'none'}}><DIcon d={IC.grid} s={20}/></div>
          <div style={{flex:1}}><div style={{fontFamily:t.fHead,fontWeight:800,fontSize:17}}>Spreadsheet sync</div><div style={{fontSize:12.5,color:'#9FB3C6',marginTop:2}}>{live?'Connected — project rows update from your sheet.':'Connect a Google Sheet to drive projects from a spreadsheet.'}</div></div>
          {live && <div style={{fontSize:11,fontWeight:800,letterSpacing:'.05em',textTransform:'uppercase',color:s==='error'?'#FBB':t.ok,background:'rgba(255,255,255,.08)',padding:'5px 10px',borderRadius:20}}>{s}</div>}
        </div>
        <div style={{padding:'22px 24px'}}>
          <label style={lbl}>Google Sheet link (or published CSV URL)</label>
          <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://docs.google.com/spreadsheets/d/…" style={inp}/>
          {s==='error' && info.error && <div style={{fontSize:12,color:t.bad,background:t.badBg,borderRadius:9,padding:'9px 11px',marginTop:10}}>{info.error}</div>}
          {s==='ok' && <div style={{fontSize:12,color:t.ok,background:t.okBg,borderRadius:9,padding:'9px 11px',marginTop:10,display:'flex',alignItems:'center',gap:7}}><DIcon d={IC.check} s={14}/>{info.rows} rows · {info.added} added · {info.updated} updated · {info.tasks||0} tasks · {info.budget||0} budget{when?` · ${when}`:''}</div>}
          <div style={{display:'flex',gap:10,marginTop:16}}>
            <button onClick={connect} style={{flex:1,background:t.blue,color:'#fff',border:0,borderRadius:10,padding:'12px',fontSize:13.5,fontWeight:700,cursor:'pointer'}}>{live?'Update link':'Connect sheet'}</button>
            {live && <button onClick={()=>DROSheets.syncNow()} style={{background:'#fff',color:t.blue,border:`1px solid ${t.line}`,borderRadius:10,padding:'12px 16px',fontSize:13.5,fontWeight:700,cursor:'pointer'}}>Sync now</button>}
            {live && <button onClick={disconnect} style={{background:'#fff',color:t.bad,border:`1px solid ${t.line}`,borderRadius:10,padding:'12px 16px',fontSize:13.5,fontWeight:700,cursor:'pointer'}}>Disconnect</button>}
            {!live && <button onClick={onClose} style={{background:'#fff',color:t.muted,border:`1px solid ${t.line}`,borderRadius:10,padding:'12px 16px',fontSize:13.5,fontWeight:600,cursor:'pointer'}}>Close</button>}
          </div>
          <div style={{marginTop:18,paddingTop:16,borderTop:`1px solid ${t.lineSoft}`}}>
            <div style={{fontSize:11.5,fontWeight:800,letterSpacing:'.04em',textTransform:'uppercase',color:t.faint,marginBottom:10}}>How to connect</div>
            <div style={{display:'flex',flexDirection:'column',gap:9}}>
              {steps.map(([n,txt])=>(<div key={n} style={{display:'flex',gap:10,alignItems:'flex-start'}}><span style={{width:20,height:20,borderRadius:6,background:t.cardTint,color:t.blue,fontWeight:800,fontSize:11,display:'grid',placeItems:'center',flex:'none'}}>{n}</span><span style={{fontSize:12.5,color:t.ink2,lineHeight:1.4}}>{txt}</span></div>))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- login: real password sign-in when sync is on, else account picker ---- */
function Login({onPick}){
  const t=DRtok;
  const roleColor={owner:t.gold,admin:t.cyan,pm:t.blue,super:t.cyan,office:t.ok};
  const authMode = window.DROSAuth && DROSAuth.enabled;
  const [email,setEmail]=useState(''); const [pwd,setPwd]=useState(''); const [err,setErr]=useState(''); const [busy,setBusy]=useState(false);
  const submit=async()=>{ setErr(''); setBusy(true); const r=await DROSAuth.signIn(email,pwd); setBusy(false); if(!r.ok) setErr(r.err||'Sign-in failed'); };
  const inp={width:'100%',background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.12)',borderRadius:11,padding:'12px 14px',fontSize:14,color:'#fff',fontFamily:t.fBody,outline:'none'};
  return (
    <div style={{minHeight:'100vh',display:'grid',placeItems:'center',fontFamily:t.fBody,padding:24,position:'relative',overflow:'hidden'}}>
      <div aria-hidden="true" className="dr-kb" style={{position:'absolute',inset:0,backgroundImage:'url(assets/login-hero.png)',backgroundSize:'cover',backgroundPosition:'center',transformOrigin:'24% 32%',animation:'drZoomIn 26s ease-out forwards'}}/>
      <div aria-hidden="true" style={{position:'absolute',inset:0,background:'linear-gradient(180deg, rgba(8,17,28,.26) 0%, rgba(8,17,28,.42) 46%, rgba(8,17,28,.80) 100%)'}}/>
      <div style={{position:'relative',width:430,maxWidth:'100%',background:'rgba(10,20,32,.60)',backdropFilter:'blur(10px)',WebkitBackdropFilter:'blur(10px)',border:'1px solid rgba(255,255,255,.13)',borderRadius:20,padding:'30px 28px',boxShadow:'0 24px 60px rgba(5,12,20,.5)'}}>
        <div style={{textAlign:'center',marginBottom:22}}>
          <h1 style={{fontFamily:t.fHead,fontWeight:800,fontSize:22,color:'#fff',margin:0,letterSpacing:'-.01em'}}>Operating System</h1>
          <div style={{color:'#AFC0D0',fontSize:13,marginTop:6}}>{authMode?'Sign in to your workspace':'Pick your account to sign in'}</div>
        </div>
        {authMode ? (
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@dunrite.com" style={inp} autoFocus/>
            <input type="password" value={pwd} onChange={e=>setPwd(e.target.value)} onKeyDown={e=>e.key==='Enter'&&submit()} placeholder="Password" style={inp}/>
            {err && <div style={{background:'rgba(208,73,74,.15)',color:'#FBB',fontSize:12.5,borderRadius:9,padding:'9px 12px'}}>{err}</div>}
            <button onClick={submit} disabled={busy} style={{background:t.blue,color:'#fff',border:0,borderRadius:11,padding:'13px',fontSize:14,fontWeight:700,cursor:busy?'default':'pointer',opacity:busy?.7:1}}>{busy?'Signing in…':'Sign in'}</button>
            <div style={{textAlign:'center',color:'#5C6E80',fontSize:11.5,marginTop:6}}>Accounts are created in Firebase → Authentication</div>
          </div>
        ) : (
          <React.Fragment>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {DROS.USERS.map(u=>(
                <button key={u.id} onClick={()=>onPick(u)} style={{display:'flex',alignItems:'center',gap:14,background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',borderRadius:14,padding:'13px 16px',cursor:'pointer',textAlign:'left',transition:'.15s'}}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,.1)'} onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,.05)'}>
                  <div style={{width:42,height:42,borderRadius:11,background:`linear-gradient(135deg,${t.cyan},${t.blue})`,color:'#fff',display:'grid',placeItems:'center',fontFamily:t.fHead,fontWeight:700,fontSize:15,flex:'none'}}>{u.initials}</div>
                  <div style={{flex:1}}><div style={{color:'#fff',fontSize:14.5,fontWeight:600}}>{u.name}</div><div style={{color:'#9FB3C6',fontSize:12.5,marginTop:1}}>{u.title}</div></div>
                  <span style={{fontSize:10.5,fontWeight:800,letterSpacing:'.05em',textTransform:'uppercase',color:roleColor[u.role],background:'rgba(255,255,255,.07)',padding:'4px 9px',borderRadius:20}}>{u.role}</span>
                </button>
              ))}
            </div>
            <div style={{textAlign:'center',color:'#5C6E80',fontSize:11.5,marginTop:20}}>Everyone shares one live workspace · pick any role to explore</div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

/* ---- nav config ---- */
const NAV_MAIN_R=[{id:'home',label:'Home',icon:IC.grid},{id:'pipeline',label:'Pipeline',icon:IC.flag},{id:'schedule',label:'Schedule',icon:IC.calendar},{id:'budget',label:'Budget',icon:IC.wallet},{id:'automations',label:'Automations',icon:IC.bolt}];
const NAV_LOGS_R=[{id:'documents',label:'Documents',icon:IC.doc},{id:'daily',label:'Daily Reports',icon:IC.clipboard},{id:'issues',label:'Issues',icon:IC.alert},{id:'safety',label:'Safety',icon:IC.alert},{id:'changeorders',label:'Change Orders',icon:IC.edit},{id:'invoices',label:'Invoices',icon:IC.receipt},{id:'rfi',label:'RFI Log',icon:IC.help,badge:'3'},{id:'submittals',label:'Submittals',icon:IC.inbox,badge:'4'}];
const LIVE=new Set(['home','pipeline','schedule','budget','automations','project','documents','issues','invoices','changeorders','daily','rfi','submittals','safety','equipment']);

function ShellNavRow({label,icon,on,badge,dim,onClick}){
  const t=DRtok;
  return <button onClick={onClick} style={{display:'flex',alignItems:'center',gap:12,width:'100%',textAlign:'left',padding:'10px 12px',borderRadius:10,fontSize:14,fontWeight:on?600:500,color:on?'#fff':(dim?'#5C6E80':'#A9B8C6'),background:on?'rgba(29,180,232,.14)':'transparent',position:'relative',border:0,cursor:'pointer',fontFamily:t.fBody}}>
    {on&&<span style={{position:'absolute',left:-14,top:8,bottom:8,width:3,borderRadius:'0 3px 3px 0',background:t.cyan,boxShadow:`0 0 12px ${t.cyan}`}}/>}
    <DIcon d={icon} s={18} style={{color:on?t.cyan:'currentColor'}}/><span style={{flex:1}}>{label}</span>
    {badge&&<span style={{fontSize:11,fontWeight:700,background:on?t.cyan:'rgba(255,255,255,.1)',color:on?t.navyDeep:'#cfe',padding:'2px 7px',borderRadius:20}}>{badge}</span>}
  </button>;
}

const TITLES_R={home:'Home',pipeline:'Pipeline',schedule:'Schedule',budget:'Budget & Cost',automations:'Automations',project:'Project',documents:'Documents',issues:'Issues & Punch List',invoices:'Invoices',changeorders:'Change Orders',daily:'Daily Reports',rfi:'RFI Log',submittals:'Submittals',safety:'Safety Log',equipment:'Equipment'};

/* ============================================================
   Expressive theme layer (Tweaks). Mutates the shared DRtok tokens
   in place + re-renders, so a few controls reshape the whole feel.
   ============================================================ */
const TW_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": ["#1DB4E8","#1583C7","#0F6BA8"],
  "typeface": "Modern",
  "backdrop": "Subtle"
}/*EDITMODE-END*/;

/* accent triads: [bright, primary, deep] */
const ACCENTS = [
  ["#1DB4E8","#1583C7","#0F6BA8"], // Signature cyan
  ["#F2A23C","#E07B2E","#C2611C"], // Sunset (matches the site photo)
  ["#46C08A","#1E8A5B","#156844"], // Field green
  ["#8194AD","#4C5E76","#33425A"], // Graphite
];
const TYPEFACES = {
  Modern:     { disp:"'Archivo Expanded','Archivo',sans-serif", head:"'Archivo',sans-serif", load:null },
  Editorial:  { disp:"'Newsreader',Georgia,serif",            head:"'Newsreader',Georgia,serif",  load:"Newsreader:opsz,wght@6..72,500;6..72,600;6..72,700" },
  Industrial: { disp:"'Saira Condensed',sans-serif",          head:"'Saira Condensed',sans-serif", load:"Saira+Condensed:wght@600;700;800" },
};
const _ORIG = { cyan:DRtok.cyan, blue:DRtok.blue, blue700:DRtok.blue700, fDisp:DRtok.fDisp, fHead:DRtok.fHead };

function applyTheme(tw){
  const a = (Array.isArray(tw.accent)&&tw.accent.length>=3) ? tw.accent : [_ORIG.cyan,_ORIG.blue,_ORIG.blue700];
  DRtok.cyan=a[0]; DRtok.blue=a[1]; DRtok.blue700=a[2];
  const tf = TYPEFACES[tw.typeface] || TYPEFACES.Modern;
  DRtok.fDisp=tf.disp; DRtok.fHead=tf.head;
}
const _loadedFonts=new Set();
function ensureFont(tw){
  const tf=TYPEFACES[tw.typeface]; if(!tf||!tf.load||_loadedFonts.has(tf.load)) return;
  _loadedFonts.add(tf.load);
  const l=document.createElement('link'); l.rel='stylesheet';
  l.href='https://fonts.googleapis.com/css2?family='+tf.load+'&display=swap';
  document.head.appendChild(l);
}

/* subtle, professional per-tab backdrop behind the content column */
const VIEW_ART = {
  home:        {photo:true},
  pipeline:    {icon:IC.flag},
  schedule:    {icon:IC.calendar},
  budget:      {icon:IC.wallet},
  documents:   {icon:IC.doc},
  issues:      {icon:IC.alert},
  invoices:    {icon:IC.receipt},
  changeorders:{icon:IC.edit},
  daily:       {icon:IC.clipboard},
  automations: {icon:IC.bolt},
  rfi:         {icon:IC.help},
  submittals:  {icon:IC.inbox},
  safety:      {icon:IC.alert},
  equipment:   {icon:IC.layers},
  project:     {icon:IC.building},
};
function Backdrop({mode, view}){
  if(!mode || mode==='Off') return null;
  const strong = mode==='Medium';
  const art = VIEW_ART[view] || {icon:IC.grid};
  if(art.photo){
    const w = strong ? ['.85','.91','.985'] : ['.965','.95','.99'];
    return <div aria-hidden="true" className="dr-kb" style={{position:'absolute',inset:0,zIndex:0,pointerEvents:'none',
      backgroundImage:`linear-gradient(180deg, rgba(244,247,250,${w[0]}) 0%, rgba(244,247,250,${w[1]}) 52%, rgba(244,247,250,${w[2]}) 100%), url(assets/site-backdrop.png)`,
      backgroundSize:'cover', backgroundPosition:'center 64%', filter:'grayscale(28%) saturate(.9)', animation:'drKenBurns 46s ease-in-out infinite'}}/>;
  }
  const op = strong ? 0.085 : 0.06;
  return <div aria-hidden="true" style={{position:'absolute',inset:0,zIndex:0,pointerEvents:'none',overflow:'hidden'}}>
    <div style={{position:'absolute',right:'-4%',bottom:'-12%',width:560,height:560,borderRadius:'50%',background:`radial-gradient(circle, ${DRtok.cyan}1f 0%, transparent 66%)`}}/>
    <div style={{position:'absolute',right:-34,bottom:-26,width:430,height:430,backgroundImage:'url(assets/dc-watermark.png)',backgroundSize:'contain',backgroundRepeat:'no-repeat',backgroundPosition:'bottom right',opacity:op,transform:'rotate(-6deg)'}}/>
  </div>;
}

function AppShell({user,route,go,onLogout,theme}){
  const t=DRtok;
  const curId=route.view;
  const Sect=({children})=><div style={{fontSize:11,letterSpacing:'.14em',textTransform:'uppercase',color:'#5C6E80',fontWeight:700,padding:'18px 10px 8px'}}>{children}</div>;
  const crumbTitle=route.view==='project'?(DROS.P(route.pid)?.name||'Project'):(TITLES_R[route.view]||'Home');
  return (
    <div style={{display:'grid',gridTemplateColumns:'264px 1fr',height:'100vh',fontFamily:t.fBody,color:t.ink,background:t.paper,overflow:'hidden'}}>
      <aside style={{background:`linear-gradient(180deg,${t.navyDeep},#0A1420)`,display:'flex',flexDirection:'column',borderRight:'1px solid rgba(255,255,255,.05)',overflow:'hidden'}}>
        <div style={{padding:'26px 20px 18px',flex:'none'}}><img src="assets/dunrite-white.png" alt="DunRite" style={{height:72,width:'auto',display:'block'}}/></div>
        <div style={{flex:1,overflowY:'auto',padding:'0 14px',minHeight:0}}>
          <Sect>Project Controls</Sect>
          <nav style={{display:'flex',flexDirection:'column',gap:2}}>{NAV_MAIN_R.map(n=><ShellNavRow key={n.id} {...n} on={curId===n.id} onClick={()=>go({view:n.id})}/>)}</nav>
          <Sect>Logs &amp; Tracking</Sect>
          <nav style={{display:'flex',flexDirection:'column',gap:2}}>{NAV_LOGS_R.map(n=><ShellNavRow key={n.id} {...n} dim on={curId===n.id} onClick={()=>go({view:n.id,title:n.label})}/>)}</nav>
        </div>
        <div style={{padding:'14px 18px',borderTop:'1px solid rgba(255,255,255,.06)',flex:'none'}}>
          <div style={{display:'flex',gap:12,alignItems:'center',background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.07)',padding:'10px 12px',borderRadius:12}}>
            <Avatar initials={user.initials} c1={t.cyan} c2={t.blue} s={36}/>
            <div style={{lineHeight:1.2,flex:1}}><div style={{fontSize:12.5,color:'#EAF1F7',fontWeight:600}}>{user.name}</div><div style={{fontSize:11,color:'#7E8EA0'}}>{user.title}</div></div>
            <button onClick={onLogout} title="Switch account" style={{background:'none',border:0,color:'#A9B8C6',cursor:'pointer',padding:4,display:'grid',placeItems:'center'}}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{width:16,height:16}}><path d="M10 8V5a1 1 0 011-1h9a1 1 0 011 1v14a1 1 0 01-1 1h-9a1 1 0 01-1-1v-3"/><path d="M3 12h11"/><path d="M8 9l-3 3 3 3"/></svg>
            </button>
          </div>
        </div>
      </aside>
      <div style={{display:'flex',flexDirection:'column',overflow:'hidden',position:'relative'}}>
        <Backdrop mode={theme&&theme.backdrop} view={route.view}/>
        <div style={{height:68,display:'flex',alignItems:'center',gap:18,padding:'0 32px',background:'rgba(244,247,250,.92)',borderBottom:`1px solid ${t.line}`,flex:'none',position:'relative',zIndex:1}}>
          <div style={{display:'flex',alignItems:'center',gap:9,color:t.muted,fontSize:13.5,fontWeight:500}}><DIcon d={IC.building} s={15} style={{color:t.faint}}/><span>Dun Rite</span><DIcon d={IC.chevron} s={15} style={{color:t.faint}}/><b style={{color:t.ink,fontWeight:700}}>{crumbTitle}</b></div>
          <div style={{flex:1}}/>
          <div style={{display:'flex',alignItems:'center',gap:9,background:'#fff',border:`1px solid ${t.line}`,borderRadius:10,padding:'9px 13px',width:280,color:t.muted}}><DIcon d={IC.search} s={16}/><span style={{fontSize:13.5}}>Search RFIs, POs, cost codes…</span></div>
          <div style={{width:40,height:40,borderRadius:10,border:`1px solid ${t.line}`,background:'#fff',display:'grid',placeItems:'center',color:t.ink2,position:'relative',flex:'none'}}><DIcon d={IC.bell} s={18}/><span style={{position:'absolute',top:9,right:10,width:7,height:7,borderRadius:'50%',background:t.bad,border:'2px solid #fff'}}/></div>
          <DropboxBadge/>
          <SheetBadge/>
          <SyncBadge/>
          <div style={{width:40,height:40,borderRadius:11,background:`linear-gradient(135deg,${t.navy},#26425f)`,color:'#fff',display:'grid',placeItems:'center',fontFamily:t.fHead,fontWeight:700,fontSize:14,flex:'none'}}>{user.initials}</div>
        </div>
        <div style={{padding:'24px 32px 48px',overflowY:'auto',flex:1,position:'relative',zIndex:1}}>
          <Content user={user} route={route} go={go}/>
        </div>
      </div>
    </div>
  );
}

function Content({user,route,go}){
  switch(route.view){
    case 'home': return ['owner','admin'].includes(user.role)?<PortfolioView user={user}/>:<MyWorkView user={user}/>;
    case 'pipeline': return <PipelineView user={user}/>;
    case 'project': return <ProjectView user={user} pid={route.pid} tab={route.tab}/>;
    case 'budget': return <BudgetView/>;
    case 'schedule': return <ScheduleView/>;
    case 'automations': return <AutomationsView/>;
    case 'documents': return <DocumentsView user={user}/>;
    case 'issues': return <IssuesView user={user}/>;
    case 'invoices': return <InvoicesView user={user}/>;
    case 'changeorders': return <ChangeOrdersView user={user}/>;
    case 'daily': return <DailyReportsView user={user}/>;
    case 'rfi': return <TrackerView user={user} kind="rfi" title="RFI Log" sub="requests for information" noun="RFI"/>;
    case 'submittals': return <TrackerView user={user} kind="submittals" title="Submittals" sub="submittals in review" noun="submittal"/>;
    case 'safety': return <TrackerView user={user} kind="safety" title="Safety Log" sub="safety items" noun="safety note"/>;
    case 'equipment': return <TrackerView user={user} kind="equipment" title="Equipment & Materials" sub="items on site" noun="item"/>;
    default: return <PlaceholderView title={route.title||'Module'}/>;
  }
}

function App(){
  const KEYU='dr_os_user';
  const { useTweaks, TweaksPanel, TweakSection, TweakColor, TweakRadio } = window;
  const [tw,setTweak]=useTweaks(TW_DEFAULTS);
  applyTheme(tw);
  useEffect(()=>{ ensureFont(tw); },[tw.typeface]);
  const authMode = window.DROSAuth && DROSAuth.enabled;
  const [user,setUser]=useState(()=>{ if(authMode) return null; try{return JSON.parse(localStorage.getItem(KEYU));}catch(e){return null;} });
  const [route,setRoute]=useState({view:'home'});
  const go=(r)=>{ setRoute(r); document.querySelector('[data-scroll]')?.scrollTo?.(0,0); };
  window.go=go;
  useEffect(()=>{ if(authMode){ return DROSAuth.onChange(u=>{ setUser(u); setRoute({view:'home'}); }); } },[]);
  const pick=(u)=>{ localStorage.setItem(KEYU,JSON.stringify(u)); setUser(u); setRoute({view:'home'}); };
  const logout=()=>{ if(authMode){ DROSAuth.signOut(); } else { localStorage.removeItem(KEYU); setUser(null); } };
  return <React.Fragment>
    {user ? <AppShell user={user} route={route} go={go} onLogout={logout} theme={tw}/> : <Login onPick={pick}/>}
    <ToastHost/>
    <TweaksPanel>
      <TweakSection label="Brand accent"/>
      <TweakColor label="Accent" value={tw.accent} options={ACCENTS} onChange={v=>setTweak('accent',v)}/>
      <TweakSection label="Typography"/>
      <TweakRadio label="Headings" value={tw.typeface} options={['Modern','Editorial','Industrial']} onChange={v=>setTweak('typeface',v)}/>
      <TweakSection label="Backdrop photo"/>
      <TweakRadio label="Site photo" value={tw.backdrop} options={['Off','Subtle','Medium']} onChange={v=>setTweak('backdrop',v)}/>
    </TweaksPanel>
  </React.Fragment>;
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
