/* Project detail + Budget + Schedule + Automations + Placeholder.
   Uses window globals: useStore, go, drToast, DROS, shared primitives,
   and helpers from views-home (fmtM, fmt$, ago, healthMap, CodeTile). */

const {useState:useStateP} = React;

/* ---------------- Project detail ---------------- */
function ProjectView({user, pid, tab}){
  const t=DRtok; const {state}=useStore();
  const p=DROS.P(pid);
  const [active,setActive]=useStateP(tab || (DROS.P(pid)&&DROS.P(pid).stage==='Closed'?'Reconciliation':'Overview'));
  React.useEffect(()=>{ setActive(tab || (p&&p.stage==='Closed'?'Reconciliation':'Overview')); },[tab,pid]);
  if(!p) return <div style={{color:t.muted}}>Project not found.</div>;
  const bud=Math.round(p.spent/p.contract*100); const over=p.spent>p.contract;
  const [hl,hk]=healthMap[p.health]||['—','idle'];
  const isOwner=user.role==='owner';
  const tabs=['Overview','Tasks','Daily Log','Change Orders','Photos'].concat(['Lead','Bidding'].includes(p.stage)?[]:['Reconciliation']);

  return (
    <div>
      {/* back + header */}
      <button onClick={()=>go({view:'pipeline'})} style={{display:'inline-flex',alignItems:'center',gap:6,background:'none',border:0,color:t.muted,fontSize:13,fontWeight:600,cursor:'pointer',marginBottom:14,padding:0}}>
        <DIcon d={['M15 6l-6 6 6 6']} s={16}/>Back to pipeline
      </button>
      <div style={{display:'flex',alignItems:'flex-start',gap:16,marginBottom:18}}>
        <CodeTile code={p.id} s={52} r={13} fs={16}/>
        <div style={{flex:1}}>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <h1 style={{fontFamily:t.fHead,fontWeight:800,fontSize:24,letterSpacing:'-.02em',color:t.ink,margin:0}}>{p.name}</h1>
            <Pill kind={hk}>{hl}</Pill>
          </div>
          <div style={{color:t.muted,fontSize:13,marginTop:5,display:'flex',gap:16,flexWrap:'wrap'}}>
            <span>{p.phase}</span><span>PM: {p.pm}</span><span>Super: {p.super}</span><span>Due {p.due}</span>
          </div>
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{fontFamily:t.fDisp,fontWeight:800,fontSize:22,color:t.ink,lineHeight:1}}>{fmtM(p.contract)}</div>
          <div style={{fontSize:11.5,color:t.muted,fontWeight:600,marginTop:4}}>{fmtM(p.spent)} spent · {bud}%</div>
        </div>
      </div>
      {/* tabs */}
      <div style={{display:'flex',gap:4,borderBottom:`1px solid ${t.line}`,marginBottom:18}}>
        {tabs.map(tb=>(
          <button key={tb} onClick={()=>setActive(tb)} style={{background:'none',border:0,borderBottom:`2px solid ${active===tb?t.blue:'transparent'}`,color:active===tb?t.ink:t.muted,fontSize:13.5,fontWeight:active===tb?700:500,padding:'10px 14px',cursor:'pointer',marginBottom:-1}}>{tb}</button>
        ))}
      </div>

      {active==='Overview' && <OverviewTab p={p}/>}
      {active==='Tasks' && <TasksTab p={p} user={user}/>}
      {active==='Daily Log' && <DailyTab p={p} user={user}/>}
      {active==='Change Orders' && <COTab p={p} user={user} isOwner={isOwner}/>}
      {active==='Photos' && <PhotosTab p={p} user={user}/>}
      {active==='Reconciliation' && <ReconTab p={p} user={user}/>}
    </div>
  );
}

function OverviewTab({p}){
  const t=DRtok; const {state}=useStore();
  const bud=Math.round(p.spent/p.contract*100); const over=p.spent>p.contract;
  const acts=state.activity.filter(a=>a.meta&&a.meta.includes(p.name)).slice(0,5);
  return (
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
      <Card title="Progress">
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:14}}>
          <Bar pct={p.pct} h={10}/><span style={{fontFamily:t.fHead,fontWeight:800,fontSize:18,color:t.ink}}>{p.pct}%</span>
        </div>
        <div style={{fontSize:13,color:t.ink2}}>Current phase: <b style={{color:t.ink}}>{p.phase}</b></div>
        <div style={{fontSize:13,color:t.ink2,marginTop:6}}>{p.tasks?.filter(x=>!x.done).length||0} open tasks · {p.photos||0} photos · {p.logs?.length||0} daily logs</div>
      </Card>
      <Card title="Budget">
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:10}}>
          <BudgetBar pct={bud} over={over}/><span style={{fontFamily:t.fHead,fontWeight:800,fontSize:18,color:over?t.bad:t.ink}}>{bud}%</span>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',fontSize:13,color:t.ink2}}><span>Contract</span><b style={{color:t.ink}}>{fmt$(p.contract)}</b></div>
        <div style={{display:'flex',justifyContent:'space-between',fontSize:13,color:t.ink2,marginTop:6}}><span>Spent</span><b style={{color:over?t.bad:t.ink}}>{fmt$(p.spent)}</b></div>
        {over && <div style={{marginTop:10,fontSize:12,color:t.bad,fontWeight:600,background:t.badBg,padding:'7px 10px',borderRadius:8}}>Over contract by {fmt$(p.spent-p.contract)} — auto-flagged to owner</div>}
      </Card>
      <div style={{gridColumn:'1 / -1'}}>
        <Card title="Recent Activity">
          {acts.length===0 && <div style={{fontSize:13,color:t.muted}}>No recent activity on this project.</div>}
          <div style={{display:'flex',flexDirection:'column',gap:13}}>
            {acts.map(a=>(<div key={a.id} style={{display:'flex',gap:11,alignItems:'flex-start'}}><Avatar initials={a.who} s={28}/>
              <div style={{flex:1}}><div style={{fontSize:12.5,color:t.ink,fontWeight:600}}>{a.text}</div><div style={{fontSize:11.5,color:t.muted,marginTop:1}}>{a.meta}</div></div>
              <span style={{fontSize:11,color:t.faint}}>{ago(a.ts)}</span></div>))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function TasksTab({p,user}){
  const t=DRtok; const [val,setVal]=useStateP('');
  const addClean=()=>{ if(!val.trim())return; drToast(DROS.actions.addTask(p.id,val.trim(),user)); setVal(''); };
  return (
    <Card title="Tasks" meta={`${p.tasks.filter(x=>!x.done).length} open`} pad={false}>
      {p.tasks.length===0 && <div style={{fontSize:13,color:t.muted,padding:'16px 18px'}}>No tasks yet.</div>}
      {p.tasks.map((tk,i)=>(
        <div key={tk.id} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 18px',borderBottom:`1px solid ${t.lineSoft}`}}>
          <button onClick={()=>drToast(DROS.actions.toggleTask(p.id,tk.id,user)||'')} style={{width:20,height:20,borderRadius:6,border:`2px solid ${tk.done?t.ok:t.line}`,background:tk.done?t.ok:'#fff',flex:'none',cursor:'pointer',display:'grid',placeItems:'center',padding:0}}>{tk.done&&<DIcon d={IC.check} s={13} style={{color:'#fff'}}/>}</button>
          <div style={{flex:1,fontSize:13.5,fontWeight:600,color:tk.done?t.faint:t.ink,textDecoration:tk.done?'line-through':'none'}}>{tk.title}</div>
          <span style={{fontSize:11.5,color:t.faint}}>{tk.due}</span>
        </div>
      ))}
      <div style={{display:'flex',gap:8,padding:'14px 18px'}}>
        <input value={val} onChange={e=>setVal(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addClean()} placeholder="Add a task…" style={{flex:1,border:`1px solid ${t.line}`,borderRadius:9,padding:'9px 12px',fontSize:13.5,fontFamily:t.fBody,outline:'none'}}/>
        <button onClick={addClean} style={{background:t.blue,color:'#fff',border:0,borderRadius:9,padding:'9px 16px',fontSize:13,fontWeight:600,cursor:'pointer'}}>Add</button>
      </div>
    </Card>
  );
}

function DailyTab({p,user}){
  const t=DRtok; const {state}=useStore();
  const [f,setF]=useStateP({crew:'',weather:'',work:''});
  const submit=()=>{ if(!f.work.trim()){drToast('Add what got done first');return;} drToast(DROS.actions.submitDailyLog(p.id,f,user)); setF({crew:'',weather:'',work:''}); };
  const inp={border:`1px solid ${t.line}`,borderRadius:9,padding:'9px 12px',fontSize:13.5,fontFamily:t.fBody,outline:'none',width:'100%'};
  return (
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,alignItems:'start'}}>
      <Card title="Log Today">
        <div style={{display:'flex',flexDirection:'column',gap:11}}>
          <div style={{display:'flex',gap:10}}>
            <div style={{flex:1}}><label style={{fontSize:11.5,fontWeight:700,color:t.muted,display:'block',marginBottom:5}}>Crew on site</label><input type="number" value={f.crew} onChange={e=>setF({...f,crew:e.target.value})} placeholder="12" style={inp}/></div>
            <div style={{flex:2}}><label style={{fontSize:11.5,fontWeight:700,color:t.muted,display:'block',marginBottom:5}}>Weather</label><input value={f.weather} onChange={e=>setF({...f,weather:e.target.value})} placeholder="Clear, 84°" style={inp}/></div>
          </div>
          <div><label style={{fontSize:11.5,fontWeight:700,color:t.muted,display:'block',marginBottom:5}}>Work completed</label><textarea value={f.work} onChange={e=>setF({...f,work:e.target.value})} placeholder="What got done today…" rows={3} style={{...inp,resize:'vertical'}}/></div>
          <button onClick={submit} style={{background:t.blue,color:'#fff',border:0,borderRadius:10,padding:'11px',fontSize:13.5,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:7}}><DIcon d={IC.bolt} s={16}/>Submit — updates schedule & dashboard</button>
          <div style={{fontSize:11.5,color:t.muted,textAlign:'center'}}>Submitting advances % complete and posts to the owner's dashboard automatically.</div>
        </div>
      </Card>
      <Card title="Recent Logs" meta={`${p.logs.length}`}>
        {p.logs.length===0 && <div style={{fontSize:13,color:t.muted}}>No logs yet.</div>}
        <div style={{display:'flex',flexDirection:'column',gap:0}}>
          {p.logs.map((l,i)=>(
            <div key={l.id} style={{padding:'11px 0',borderBottom:i<p.logs.length-1?`1px solid ${t.lineSoft}`:'none'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}><b style={{fontSize:13,color:t.ink}}>{l.date}</b><span style={{fontSize:11.5,color:t.faint}}>{l.crew} crew · {l.weather}</span></div>
              <div style={{fontSize:12.5,color:t.ink2}}>{l.work}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function COTab({p,user,isOwner}){
  const t=DRtok; const [f,setF]=useStateP({desc:'',amt:''});
  const create=()=>{ if(!f.desc.trim()||!f.amt){drToast('Add a description and amount');return;} drToast(DROS.actions.createCO(p.id,f,user)); setF({desc:'',amt:''}); };
  const inp={border:`1px solid ${t.line}`,borderRadius:9,padding:'9px 12px',fontSize:13.5,fontFamily:t.fBody,outline:'none'};
  return (
    <div style={{display:'grid',gridTemplateColumns:'1.3fr 1fr',gap:16,alignItems:'start'}}>
      <Card title="Change Orders" meta={`${p.cos.length}`} pad={false}>
        {p.cos.length===0 && <div style={{fontSize:13,color:t.muted,padding:'16px 18px'}}>No change orders.</div>}
        {p.cos.map((c,i)=>(
          <div key={c.id} style={{display:'flex',alignItems:'center',gap:12,padding:'13px 18px',borderBottom:i<p.cos.length-1?`1px solid ${t.lineSoft}`:'none'}}>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:t.ink}}>{c.code} · {fmt$(c.amt)}</div><div style={{fontSize:12,color:t.muted,marginTop:1}}>{c.desc}</div></div>
            {c.status==='approved'
              ? <Pill kind="ok">Approved</Pill>
              : isOwner
                ? <button onClick={()=>drToast(DROS.actions.approveCO(p.id,c.id,user))} style={{fontSize:11.5,fontWeight:700,color:'#fff',background:t.blue,border:0,padding:'6px 12px',borderRadius:8,cursor:'pointer'}}>Approve</button>
                : <Pill kind="warn">Pending</Pill>}
          </div>
        ))}
      </Card>
      <Card title="New Change Order">
        <div style={{display:'flex',flexDirection:'column',gap:11}}>
          <div><label style={{fontSize:11.5,fontWeight:700,color:t.muted,display:'block',marginBottom:5}}>Description</label><input value={f.desc} onChange={e=>setF({...f,desc:e.target.value})} placeholder="Added scope…" style={{...inp,width:'100%'}}/></div>
          <div><label style={{fontSize:11.5,fontWeight:700,color:t.muted,display:'block',marginBottom:5}}>Amount ($)</label><input type="number" value={f.amt} onChange={e=>setF({...f,amt:e.target.value})} placeholder="9400" style={{...inp,width:'100%'}}/></div>
          <button onClick={create} style={{background:t.blue,color:'#fff',border:0,borderRadius:10,padding:'11px',fontSize:13.5,fontWeight:700,cursor:'pointer'}}>Submit for approval</button>
          <div style={{fontSize:11.5,color:t.muted,textAlign:'center'}}>Routes straight to the owner. On approval, budget updates itself.</div>
        </div>
      </Card>
    </div>
  );
}

/* resize/compress an image File to a small JPEG data URL for storage */
function resizeImage(file, max=1400, quality=0.72){
  return new Promise((resolve,reject)=>{
    const fr=new FileReader();
    fr.onerror=()=>reject(new Error('read failed'));
    fr.onload=()=>{
      const img=new Image();
      img.onerror=()=>reject(new Error('decode failed'));
      img.onload=()=>{
        let w=img.width, h=img.height;
        if(w>max||h>max){ const s=Math.min(max/w, max/h); w=Math.round(w*s); h=Math.round(h*s); }
        const c=document.createElement('canvas'); c.width=w; c.height=h;
        c.getContext('2d').drawImage(img,0,0,w,h);
        try{ resolve(c.toDataURL('image/jpeg', quality)); }catch(e){ reject(e); }
      };
      img.src=fr.result;
    };
    fr.readAsDataURL(file);
  });
}

function PhotosTab({p,user}){
  const t=DRtok;
  const gallery=p.gallery||[];
  const extra=Math.max(0,(p.photos||0)-gallery.length); // seed-only placeholder count
  const [busy,setBusy]=useStateP(false);
  const [view,setView]=useStateP(null);
  const inputRef=React.useRef(null);

  const pick=()=>{ if(inputRef.current) inputRef.current.click(); };
  const onPick=async(e)=>{
    const files=[...(e.target.files||[])].filter(f=>/^image\//.test(f.type));
    if(!files.length) return;
    setBusy(true);
    const items=[];
    for(const f of files){ try{ const src=await resizeImage(f); items.push({id:'ph'+Date.now()+Math.random().toString(36).slice(2,6), src, name:f.name, ts:Date.now(), by:user.initials}); }catch(err){} }
    if(items.length) drToast(DROS.actions.addGalleryPhotos(p.id, items, user));
    else drToast('Could not read those files — try JPG or PNG images.');
    setBusy(false);
    if(inputRef.current) inputRef.current.value='';
  };

  const lightbox = view && (
    <div onClick={()=>setView(null)} style={{position:'fixed',inset:0,zIndex:1300,background:'rgba(8,16,26,.86)',backdropFilter:'blur(2px)',WebkitBackdropFilter:'blur(2px)',display:'grid',placeItems:'center',padding:32,cursor:'zoom-out'}}>
      <img src={view.src} alt={view.name} style={{maxWidth:'92%',maxHeight:'88%',borderRadius:10,boxShadow:'0 24px 70px rgba(0,0,0,.55)'}}/>
      <div style={{position:'absolute',bottom:24,left:0,right:0,textAlign:'center',color:'#cfe0ee',fontSize:12.5,fontFamily:t.fBody}}>{view.name} · {view.by} · click anywhere to close</div>
    </div>
  );

  return (
    <React.Fragment>
      <Card title="Photos" meta={`${p.photos||0} on file`} action={
        <button onClick={pick} disabled={busy} style={{display:'inline-flex',alignItems:'center',gap:6,background:t.blue,color:'#fff',border:0,borderRadius:9,padding:'8px 13px',fontSize:12.5,fontWeight:600,cursor:busy?'default':'pointer',opacity:busy?.7:1}}><DIcon d={IC.camera} s={15}/>{busy?'Uploading…':'Upload photos'}</button>}>
        <input ref={inputRef} type="file" accept="image/*" multiple onChange={onPick} style={{display:'none'}}/>
        {gallery.length===0 && extra===0 && (
          <div onClick={pick} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:9,padding:'30px 0',border:`2px dashed ${t.line}`,borderRadius:12,cursor:'pointer',color:t.muted,background:t.cardTint}}>
            <div style={{width:46,height:46,borderRadius:12,background:'#fff',border:`1px solid ${t.line}`,display:'grid',placeItems:'center',color:t.blue}}><DIcon d={IC.camera} s={22}/></div>
            <div style={{fontSize:13.5,fontWeight:700,color:t.ink}}>Upload site photos</div>
            <div style={{fontSize:12,color:t.muted}}>Auto-tagged to <b>{p.phase}</b> and filed by date · JPG or PNG</div>
          </div>
        )}
        {(gallery.length>0 || extra>0) && (
          <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:8}}>
            <button onClick={pick} disabled={busy} style={{aspectRatio:'1',borderRadius:9,border:`2px dashed ${t.line}`,background:t.cardTint,color:t.muted,display:'grid',placeItems:'center',cursor:busy?'default':'pointer',gap:3}}>
              <DIcon d={IC.plus} s={18} style={{color:t.blue}}/><span style={{fontSize:10,fontWeight:800,letterSpacing:'.03em'}}>{busy?'…':'ADD'}</span>
            </button>
            {gallery.map(ph=>(
              <div key={ph.id} onClick={()=>setView(ph)} style={{position:'relative',aspectRatio:'1',borderRadius:9,overflow:'hidden',cursor:'zoom-in',border:`1px solid ${t.line}`}}>
                <img src={ph.src} alt={ph.name} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
                <button onClick={e=>{e.stopPropagation(); DROS.actions.removeGalleryPhoto(p.id,ph.id);}} title="Remove photo" style={{position:'absolute',top:4,right:4,width:22,height:22,borderRadius:6,border:0,background:'rgba(14,26,40,.62)',color:'#fff',cursor:'pointer',display:'grid',placeItems:'center',fontSize:14,lineHeight:1,padding:0}}>×</button>
              </div>
            ))}
            {Array.from({length:Math.min(extra,17)}).map((_,i)=>(
              <div key={'x'+i} style={{aspectRatio:'1',borderRadius:9,background:`linear-gradient(135deg,${t.lineSoft},${t.line})`,display:'grid',placeItems:'center',color:t.faint}}><DIcon d={IC.camera} s={18}/></div>
            ))}
          </div>
        )}
      </Card>
      {view && (window.Portal ? <Portal>{lightbox}</Portal> : lightbox)}
    </React.Fragment>
  );
}

/* ---------------- Budget ---------------- */
function BudgetView(){
  const t=DRtok; const {state}=useStore();
  const rows=state.projects.filter(p=>['Active','Punch'].includes(p.stage));
  const contract=rows.reduce((s,p)=>s+p.contract,0), spent=rows.reduce((s,p)=>s+p.spent,0);
  return (
    <div>
      <h1 style={{fontFamily:t.fHead,fontWeight:800,fontSize:26,letterSpacing:'-.025em',color:t.ink,margin:'0 0 4px'}}>Budget &amp; Cost</h1>
      <div style={{color:t.muted,fontSize:13.5,marginBottom:18}}>Live across active jobs · updates itself as invoices and COs post</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:16}}>
        <Kpi icon={IC.dollar} label="Total Contract" value={fmtM(contract)} tint="cyan"/>
        <Kpi icon={IC.dollar} label="Total Spent" value={fmtM(spent)} tint="gold" sub={Math.round(spent/contract*100)+'% of contract'}/>
        <Kpi icon={IC.dollar} label="Remaining" value={fmtM(contract-spent)} tint="ok"/>
      </div>
      <Card title="By Project" pad={false}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
          <thead><tr>{['Project','Contract','Spent','Variance','Used'].map(h=>
            <th key={h} style={{textAlign:h==='Project'?'left':'right',fontSize:10,letterSpacing:'.06em',textTransform:'uppercase',color:t.muted,fontWeight:700,padding:'11px 16px',background:t.cardTint,borderBottom:`1px solid ${t.line}`}}>{h}</th>)}</tr></thead>
          <tbody>
            {rows.map(p=>{ const bud=Math.round(p.spent/p.contract*100); const over=p.spent>p.contract; const v=p.contract-p.spent;
              return <tr key={p.id} style={{borderBottom:`1px solid ${t.lineSoft}`}}>
                <td style={{padding:'12px 16px'}}><div style={{display:'flex',alignItems:'center',gap:10}}><CodeTile code={p.id} s={28} r={7} fs={10}/><span style={{fontWeight:600,color:t.ink}}>{p.name}</span></div></td>
                <td style={{padding:'12px 16px',textAlign:'right',fontVariantNumeric:'tabular-nums',color:t.ink2}}>{fmt$(p.contract)}</td>
                <td style={{padding:'12px 16px',textAlign:'right',fontVariantNumeric:'tabular-nums',color:t.ink2}}>{fmt$(p.spent)}</td>
                <td style={{padding:'12px 16px',textAlign:'right',fontVariantNumeric:'tabular-nums',fontWeight:700,color:over?t.bad:t.ok}}>{over?'-':''}{fmt$(Math.abs(v))}</td>
                <td style={{padding:'12px 16px',minWidth:130}}><div style={{display:'flex',alignItems:'center',gap:8}}><BudgetBar pct={bud} over={over}/><span style={{fontWeight:700,fontSize:12,color:over?t.bad:t.ink2}}>{bud}%</span></div></td>
              </tr>;})}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ---------------- Schedule ---------------- */
function ScheduleView(){
  const t=DRtok; const {state}=useStore();
  const rows=state.projects.filter(p=>['Active','Punch'].includes(p.stage));
  return (
    <div>
      <h1 style={{fontFamily:t.fHead,fontWeight:800,fontSize:26,letterSpacing:'-.025em',color:t.ink,margin:'0 0 4px'}}>Schedule</h1>
      <div style={{color:t.muted,fontSize:13.5,marginBottom:18}}>Phase progress across jobs · advances automatically from daily logs</div>
      <Card pad={false}>
        {rows.map((p,i)=>(
          <div key={p.id} style={{display:'flex',alignItems:'center',gap:16,padding:'15px 18px',borderBottom:i<rows.length-1?`1px solid ${t.lineSoft}`:'none'}}>
            <CodeTile code={p.id} s={34} r={9} fs={11}/>
            <div style={{width:200}}><div style={{fontSize:13.5,fontWeight:600,color:t.ink}}>{p.name}</div><div style={{fontSize:11.5,color:t.faint,marginTop:2}}>{p.phase}</div></div>
            <div style={{flex:1}}><Bar pct={p.pct} h={9}/></div>
            <div style={{width:46,textAlign:'right',fontWeight:700,fontSize:13,color:t.ink}}>{p.pct}%</div>
            <div style={{width:70,textAlign:'right',fontSize:12.5,color:t.ink2,fontWeight:600}}>{p.due}</div>
          </div>
        ))}
      </Card>
    </div>
  );
}

/* ---------------- Automations (info) ---------------- */
function AutomationsView(){
  const t=DRtok;
  const flows=[
    {icon:IC.doc,when:'Super submits the daily log',auto:['Schedule % auto-advances','Owner dashboard refreshes','Crew hours start the timesheet'],kills:'No weekly status report'},
    {icon:IC.camera,when:'Crew uploads site photos',auto:['Auto-tagged to project + phase','Filed by date','Attached to today\u2019s log'],kills:'No renaming or filing'},
    {icon:IC.edit,when:'PM writes a change order',auto:['Routes to owner for approval','Budget + contract adjust on approval','Pipeline value recalculates'],kills:'No email chain or re-keying'},
    {icon:IC.receipt,when:'An invoice comes in',auto:['Matched to approved COs','Budget vs. actual updates','Overages flagged to owner'],kills:'No spreadsheet reconciling'},
    {icon:IC.calendar,when:'A task slips its date',auto:['Project flags \u201cAt Risk\u201d','PM notified instantly','Owner sees it on the dashboard'],kills:'No status meeting needed'},
    {icon:IC.check,when:'Punch list hits zero & paid',auto:['Project moves to \u201cClosed\u201d','Folder archives automatically','Closeout bundle assembled'],kills:'No manual handoff packet'},
  ];
  return (
    <div>
      <div style={{background:`linear-gradient(135deg,${t.navyDeep},${t.navy})`,borderRadius:16,padding:'20px 24px',color:'#fff',display:'flex',alignItems:'center',gap:16,marginBottom:18}}>
        <div style={{width:48,height:48,borderRadius:13,background:'rgba(29,180,232,.18)',display:'grid',placeItems:'center',color:t.cyan,flex:'none'}}><DIcon d={IC.bolt} s={26}/></div>
        <div style={{flex:1}}><h1 style={{fontFamily:t.fHead,fontWeight:800,fontSize:21,letterSpacing:'-.02em',margin:0}}>Runs automatically — no extra steps</h1><div style={{fontSize:13,color:'#9FB3C6',marginTop:4}}>Your team only does the work. Every handoff below happens on its own.</div></div>
        <div style={{textAlign:'right'}}><div style={{fontFamily:t.fDisp,fontWeight:800,fontSize:26,color:t.cyan,lineHeight:1}}>6</div><div style={{fontSize:11,color:'#9FB3C6',fontWeight:600,marginTop:3}}>steps removed</div></div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
        {flows.map((f,i)=>(
          <div key={i} style={{background:t.card,border:`1px solid ${t.line}`,borderRadius:14,padding:'15px 16px',display:'flex',flexDirection:'column'}}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}><div style={{...circ(),width:32,height:32,background:'#EAF4FC',color:t.blue,flex:'none'}}><DIcon d={f.icon} s={17}/></div>
              <div><div style={{fontSize:9.5,fontWeight:800,letterSpacing:'.09em',textTransform:'uppercase',color:t.faint}}>When</div><div style={{fontSize:13,fontWeight:700,color:t.ink,lineHeight:1.2,marginTop:1}}>{f.when}</div></div></div>
            <div style={{display:'flex',alignItems:'center',gap:7,margin:'2px 0 10px'}}><span style={{display:'inline-flex',alignItems:'center',gap:5,background:t.okBg,color:t.ok,fontSize:10.5,fontWeight:800,letterSpacing:'.04em',textTransform:'uppercase',padding:'3px 9px',borderRadius:20}}><DIcon d={IC.bolt} s={12}/>Automatic</span><span style={{flex:1,height:1,background:t.lineSoft}}/></div>
            <div style={{display:'flex',flexDirection:'column',gap:7,flex:1}}>{f.auto.map((a,j)=>(<div key={j} style={{display:'flex',gap:8,alignItems:'flex-start',fontSize:12.5,color:t.ink2,lineHeight:1.35}}><span style={{color:t.ok,marginTop:2,flex:'none'}}><DIcon d={IC.check} s={14}/></span>{a}</div>))}</div>
            <div style={{marginTop:12,paddingTop:11,borderTop:`1px dashed ${t.line}`,display:'flex',gap:7,alignItems:'center'}}><span style={{color:t.faint,fontSize:13,fontWeight:800}}>✗</span><span style={{fontSize:11.5,color:t.muted,fontWeight:600}}>{f.kills}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Placeholder ---------------- */
function PlaceholderView({title}){
  const t=DRtok;
  return (
    <div style={{display:'grid',placeItems:'center',height:'70%',textAlign:'center'}}>
      <div>
        <div style={{width:56,height:56,borderRadius:15,background:t.cardTint,border:`1px solid ${t.line}`,display:'grid',placeItems:'center',color:t.faint,margin:'0 auto 14px'}}><DIcon d={IC.layers} s={26}/></div>
        <h2 style={{fontFamily:t.fHead,fontWeight:800,fontSize:20,color:t.ink,margin:0}}>{title}</h2>
        <div style={{fontSize:13.5,color:t.muted,marginTop:6,maxWidth:340}}>This module is part of the full system. The core flow — projects, tasks, daily logs, change orders and the owner rollup — is live now.</div>
      </div>
    </div>
  );
}

function ReconTab({p,user}){
  const t=DRtok; const {state}=useStore();
  const p1=DROS.phase1(p.id), p2=DROS.phase2(p.id);
  const [report,setReport]=useStateP('');
  const [busy,setBusy]=useStateP(false);
  const hasAI=typeof window.claude!=='undefined' && window.claude && window.claude.complete;
  const closed=p.stage==='Closed';
  const pos=p1.net>=0;
  const mPct=p1.margin*100;
  const uncollectedPct=p1.billed?Math.round(p1.ar/p1.billed*100):0;

  const buildPrompt=()=>`You are a Senior Construction Controller writing a CLOSEOUT job reconciliation for "${p.name}" using ONLY these figures. Phase 1 is a DIRECTIONAL quick P&L (billed minus the four cost buckets); it ignores uncollected A/R and future callbacks — note that.
PHASE 1 — Billed ${fmt$(p1.billed)} minus Material ${fmt$(p1.material)} + Labor(employees) ${fmt$(p1.labor)} + Subs ${fmt$(p1.subs)} + Equipment ${fmt$(p1.equipment)} = Net ${fmt$(p1.net)} (${mPct.toFixed(1)}% margin). Collected ${fmt$(p1.collected)}, outstanding A/R ${fmt$(p1.ar)}.
Subs by trade: ${p2.subs.byTrade.map(s=>s.trade+' '+fmt$(s.cost)).join(', ')||'none'}.
Equipment: ${p2.equipment.map(q=>q.machine+' '+q.hours+'h@$'+q.hr+'/hr').join(', ')||'none'}.
Stage ${p.stage}, ${p.pct}% complete.
Write with short headers: (1) Findings — bullets with dollars; (2) Margin by bucket — where it's strong/weak; (3) Billed vs collected — A/R exposure; (4) Lessons learned — what went well / poorly / one process improvement; (5) Closeout recommendation. Under ~240 words, plain text.`;

  const generate=async()=>{
    if(!hasAI){ setReport('The AI controller analysis runs on your deployed site. The Phase 1 & Phase 2 tables here are computed live from job data.'); return; }
    setBusy(true); setReport('');
    try{ const txt=await window.claude.complete(buildPrompt()); setReport((txt||'').trim()||'No analysis returned.'); }
    catch(e){ setReport('Could not generate the analysis right now — try Regenerate.'); }
    setBusy(false);
  };
  React.useEffect(()=>{ if(closed && !report && !busy) generate(); },[]);

  const th={textAlign:'left',fontSize:10,letterSpacing:'.05em',textTransform:'uppercase',color:t.muted,fontWeight:700,padding:'9px 14px',background:t.cardTint,borderBottom:`1px solid ${t.line}`};
  const td={padding:'9px 14px',fontSize:12.5,color:t.ink2,borderBottom:`1px solid ${t.lineSoft}`};
  const tdr={...td,textAlign:'right',fontVariantNumeric:'tabular-nums',fontWeight:600,color:t.ink};

  const copyReport=()=>{
    const lines=[`JOB RECONCILIATION — ${p.name} (${p.id})  ·  ${p.stage}, ${p.pct}% complete`,'',
      'PHASE 1 — QUICK P&L (directional)',
      `  Billed revenue        ${fmt$(p1.billed)}`,
      `  Material              ${fmt$(p1.material)}`,
      `  Labor (employees)     ${fmt$(p1.labor)}`,
      `  Subcontractors        ${fmt$(p1.subs)}`,
      `  Equipment             ${fmt$(p1.equipment)}`,
      `  Net profit            ${fmt$(p1.net)}  (${mPct.toFixed(1)}% margin)`,
      `  Collected ${fmt$(p1.collected)} | Outstanding A/R ${fmt$(p1.ar)}`,'',
      'PHASE 2 — DETAIL',
      '  Material by supplier:', ...p2.material.map(m=>`    ${m.supplier} (${m.po}) ${fmt$(m.amt)}`),
      '  Employee labor:', ...p2.employees.map(e=>`    ${e.name} ${e.hours}h × $${e.rate} = ${fmt$(e.cost)}`),
      '  Subs by trade:', ...p2.subs.byTrade.map(s=>`    ${s.trade} ${fmt$(s.cost)}`),
      '  Equipment:', ...p2.equipment.map(q=>`    ${q.machine} ${q.hours}h × $${q.hr}/hr = ${fmt$(q.cost)}`),
      '', report].join('\n');
    try{ navigator.clipboard.writeText(lines); drToast('Reconciliation copied to clipboard'); }catch(e){ drToast('Copy not available here'); }
  };

  const PhaseTag=({n,label})=>(<span style={{display:'inline-flex',alignItems:'center',gap:7,fontSize:10.5,fontWeight:800,letterSpacing:'.04em',textTransform:'uppercase',color:t.cyan,background:'rgba(29,180,232,.10)',borderRadius:20,padding:'4px 11px'}}>Phase {n}<span style={{color:t.muted,fontWeight:600,textTransform:'none',letterSpacing:0}}>{label}</span></span>);
  const tiles=[{k:'Material',v:p1.material,c:t.blue},{k:'Labor · employees',v:p1.labor,c:t.navy},{k:'Subcontractors',v:p1.subs,c:t.gold},{k:'Equipment',v:p1.equipment,c:t.cyan}];

  return (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      {/* header strip */}
      <div style={{background:`linear-gradient(135deg,${t.navyDeep},${t.navy})`,borderRadius:16,padding:'18px 22px',color:'#fff',display:'flex',alignItems:'center',gap:16}}>
        <div style={{width:46,height:46,borderRadius:12,background:'rgba(29,180,232,.18)',display:'grid',placeItems:'center',color:t.cyan,flex:'none'}}><DIcon d={IC.receipt} s={24}/></div>
        <div style={{flex:1}}>
          <div style={{fontFamily:t.fHead,fontWeight:800,fontSize:18}}>Job Reconciliation</div>
          <div style={{fontSize:12.5,color:'#9FB3C6',marginTop:2}}>{closed?'Closeout report — generated automatically at job close.':'Live job-to-date snapshot — finalizes when the job closes.'}</div>
        </div>
        <div style={{textAlign:'right',marginRight:6}}><div style={{fontFamily:t.fDisp,fontWeight:800,fontSize:22,color:pos?'#fff':'#FBB',lineHeight:1}}>{fmtM(p1.net)}</div><div style={{fontSize:11,color:'#9FB3C6',marginTop:3}}>net profit · {mPct.toFixed(1)}%</div></div>
        <button onClick={copyReport} title="Copy report" style={{background:'rgba(255,255,255,.1)',color:'#fff',border:0,borderRadius:9,padding:'9px 12px',fontSize:12.5,fontWeight:700,cursor:'pointer',flex:'none'}}>Copy</button>
      </div>

      {/* ===== PHASE 1 — Quick P&L ===== */}
      <div>
        <div style={{display:'flex',alignItems:'center',gap:11,marginBottom:11}}><PhaseTag n="1" label="Quick P&L"/><span style={{fontSize:12,color:t.muted,fontFamily:t.fMono}}>Billed − (Material + Labor + Subs + Equipment)</span></div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:12}}>
          {tiles.map(x=>(<div key={x.k} style={{background:'#fff',border:`1px solid ${t.line}`,borderRadius:14,padding:'14px 15px',boxShadow:'0 1px 2px rgba(20,33,48,.04)'}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}><span style={{width:9,height:9,borderRadius:3,background:x.c,flex:'none'}}/><span style={{fontSize:11.5,fontWeight:700,color:t.muted,textTransform:'uppercase',letterSpacing:'.03em'}}>{x.k}</span></div>
            <div style={{fontFamily:t.fDisp,fontWeight:800,fontSize:21,color:t.ink,letterSpacing:'-.01em'}}>{fmt$(x.v)}</div>
            <div style={{fontSize:11,color:t.faint,marginTop:3}}>{p1.cost?Math.round(x.v/p1.cost*100):0}% of cost</div>
          </div>))}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1.2fr 1fr 1fr',gap:12}}>
          <div style={{background:t.cardTint,border:`1px solid ${t.line}`,borderRadius:14,padding:'14px 16px'}}><div style={{fontSize:11.5,fontWeight:700,color:t.muted,textTransform:'uppercase',letterSpacing:'.03em'}}>Billed revenue</div><div style={{fontFamily:t.fDisp,fontWeight:800,fontSize:22,color:t.ink,marginTop:4}}>{fmt$(p1.billed)}</div><div style={{fontSize:11,color:t.faint,marginTop:3}}>− total cost {fmt$(p1.cost)}</div></div>
          <div style={{background:pos?t.okBg:t.badBg,border:`1px solid ${pos?'rgba(30,158,106,.25)':'rgba(208,73,74,.25)'}`,borderRadius:14,padding:'14px 16px'}}><div style={{fontSize:11.5,fontWeight:700,color:pos?t.ok:t.bad,textTransform:'uppercase',letterSpacing:'.03em'}}>Net profit</div><div style={{fontFamily:t.fDisp,fontWeight:800,fontSize:22,color:pos?t.ok:t.bad,marginTop:4}}>{fmt$(p1.net)}</div></div>
          <div style={{background:pos?t.okBg:t.badBg,border:`1px solid ${pos?'rgba(30,158,106,.25)':'rgba(208,73,74,.25)'}`,borderRadius:14,padding:'14px 16px'}}><div style={{fontSize:11.5,fontWeight:700,color:pos?t.ok:t.bad,textTransform:'uppercase',letterSpacing:'.03em'}}>Margin</div><div style={{fontFamily:t.fDisp,fontWeight:800,fontSize:22,color:pos?t.ok:t.bad,marginTop:4}}>{mPct.toFixed(1)}%</div></div>
        </div>
        <div style={{display:'flex',gap:10,alignItems:'flex-start',marginTop:12,background:t.warnBg,border:`1px solid rgba(224,138,30,.28)`,borderRadius:11,padding:'10px 13px'}}>
          <span style={{flex:'none',color:t.warn,marginTop:1}}><DIcon d={IC.alert} s={15}/></span>
          <span style={{fontSize:12.5,color:t.ink2,lineHeight:1.5}}><b style={{color:t.ink}}>Phase 1 is directional, not final.</b> It uses billed invoices and ignores uncollected A/R and future warranty callbacks. {p1.ar>0 && <span><b>{fmt$(p1.ar)}</b> ({uncollectedPct}% of billed) is still outstanding — collect it before this margin is real.</span>}</span>
        </div>
      </div>

      {/* billed vs collected */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
        {[['Billed', p1.billed, t.ink, 'invoices sent + paid'],['Collected', p1.collected, t.ok, 'cash in the door'],['Outstanding A/R', p1.ar, p1.ar>0?t.warn:t.ok, 'sent, not yet paid']].map(([k,v,c,sub])=>(
          <div key={k} style={{background:'#fff',border:`1px solid ${t.line}`,borderRadius:14,padding:'13px 15px'}}><div style={{fontSize:11.5,fontWeight:700,color:t.muted,textTransform:'uppercase',letterSpacing:'.03em'}}>{k}</div><div style={{fontFamily:t.fDisp,fontWeight:800,fontSize:20,color:c,marginTop:4}}>{fmt$(v)}</div><div style={{fontSize:11,color:t.faint,marginTop:2}}>{sub}</div></div>))}
      </div>

      {/* ===== PHASE 2 — Detailed ===== */}
      <div style={{display:'flex',alignItems:'center',gap:11,marginTop:4}}><PhaseTag n="2" label="Detailed Financial"/><span style={{fontSize:12,color:t.muted}}>Every bucket itemized — reconciles to Phase 1.</span></div>

      <Card title="Revenue" meta={`${p2.invoices.length} invoices · billed ${fmt$(p1.billed)}`} pad={false}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead><tr><th style={th}>Invoice</th><th style={th}>Date</th><th style={{...th,textAlign:'right'}}>Amount</th><th style={{...th,textAlign:'right'}}>Status</th></tr></thead>
          <tbody>
            {p2.invoices.length===0 && <tr><td style={td} colSpan={4}>No invoices on this job.</td></tr>}
            {p2.invoices.map(v=>(<tr key={v.id}><td style={{...td,fontWeight:700,color:t.navy,fontFamily:t.fMono,fontSize:12}}>{v.num}</td><td style={td}>{v.date}</td><td style={tdr}>{fmt$(v.amt)}</td><td style={{...td,textAlign:'right'}}>{v.status==='paid'?<Pill kind="ok">Paid</Pill>:v.status==='sent'?<Pill kind="warn">Unpaid</Pill>:<Pill kind="idle">Draft</Pill>}</td></tr>))}
          </tbody>
        </table>
      </Card>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,alignItems:'start'}}>
        <Card title="Material" meta={fmt$(p1.material)} pad={false}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr><th style={th}>Supplier / PO</th><th style={{...th,textAlign:'right'}}>Cost</th></tr></thead>
            <tbody>
              {p2.material.length===0 && <tr><td style={td} colSpan={2}>No material cost recorded.</td></tr>}
              {p2.material.map((m,i)=>(<tr key={i}><td style={td}><div style={{fontWeight:600,color:t.ink}}>{m.supplier}</div><div style={{fontSize:11,color:t.faint}}>{m.po} · {m.item}</div></td><td style={tdr}>{fmt$(m.amt)}</td></tr>))}
            </tbody>
          </table>
        </Card>
        <Card title="Equipment" meta={`${fmt$(p1.equipment)} · rates from Equipment Rates`} pad={false}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr><th style={th}>Machine</th><th style={{...th,textAlign:'right'}}>Hrs</th><th style={{...th,textAlign:'right'}}>$/hr</th><th style={{...th,textAlign:'right'}}>Cost</th></tr></thead>
            <tbody>
              {p2.equipment.length===0 && <tr><td style={td} colSpan={4}>No equipment hours logged.</td></tr>}
              {p2.equipment.map((q,i)=>(<tr key={i}><td style={td}><div style={{fontWeight:600,color:t.ink}}>{q.machine}</div><div style={{fontSize:11,color:t.faint}}>{q.label}{q.mode==='rented'?' · rented':''}</div></td><td style={tdr}>{q.hours}</td><td style={tdr}>${q.hr}</td><td style={tdr}>{fmt$(q.cost)}</td></tr>))}
            </tbody>
          </table>
        </Card>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,alignItems:'start'}}>
        <Card title="Labor · Employees" meta={`${fmt$(p1.labor)} · hours × rate`} pad={false}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr><th style={th}>Crew / Role</th><th style={{...th,textAlign:'right'}}>Hrs</th><th style={{...th,textAlign:'right'}}>Rate</th><th style={{...th,textAlign:'right'}}>Cost</th></tr></thead>
            <tbody>
              {p2.employees.length===0 && <tr><td style={td} colSpan={4}>No employee labor recorded.</td></tr>}
              {p2.employees.map((e,i)=>(<tr key={i}><td style={td}><div style={{fontWeight:600,color:t.ink}}>{e.name}</div><div style={{fontSize:11,color:t.faint}}>{e.role}</div></td><td style={tdr}>{e.hours}</td><td style={tdr}>${e.rate}</td><td style={tdr}>{fmt$(e.cost)}</td></tr>))}
            </tbody>
          </table>
        </Card>
        <Card title="Labor · Subcontractors" meta={`${fmt$(p1.subs)} · by trade`} pad={false}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr><th style={th}>Trade</th><th style={th}>Subcontractor(s)</th><th style={{...th,textAlign:'right'}}>Cost</th></tr></thead>
            <tbody>
              {p2.subs.byTrade.length===0 && <tr><td style={td} colSpan={3}>No subcontractor cost on this job.</td></tr>}
              {p2.subs.byTrade.map((s,i)=>(<tr key={i}><td style={{...td,fontWeight:700,color:t.navy}}>{s.trade}</td><td style={{...td,fontSize:11.5,color:t.muted}}>{s.rows.map(r=>r.vendor).join(', ')}</td><td style={tdr}>{fmt$(s.cost)}</td></tr>))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* reconciliation note */}
      <div style={{display:'flex',alignItems:'center',gap:10,background:t.okBg,border:`1px solid rgba(30,158,106,.25)`,borderRadius:11,padding:'11px 14px'}}>
        <span style={{flex:'none',color:t.ok}}><DIcon d={IC.check} s={16}/></span>
        <span style={{fontSize:12.5,color:t.ink2}}>Phase 2 detail (<b>{fmt$(p2.totalCost)}</b> total cost) reconciles to the Phase 1 net of <b>{fmt$(p1.net)}</b>.</span>
      </div>

      {/* AI controller's analysis */}
      <Card title="Controller's Analysis" meta={hasAI?'AI · Claude':'available on deploy'} action={
        <button onClick={generate} disabled={busy} style={{background:t.blue,color:'#fff',border:0,borderRadius:9,padding:'8px 14px',fontSize:12.5,fontWeight:700,cursor:busy?'default':'pointer',opacity:busy?.7:1}}>{busy?'Generating…':(report?'Regenerate':'Generate')}</button>}>
        {!report && !busy && <div style={{fontSize:13,color:t.muted,padding:'8px 0'}}>Generate a senior-controller read of the three-phase numbers: findings, margin by bucket, A/R exposure, lessons learned, and the closeout recommendation. Runs automatically when a job closes.</div>}
        {busy && <div style={{fontSize:13,color:t.faint,padding:'8px 0'}}>Reconciling the numbers…</div>}
        {report && <div style={{fontSize:13.5,lineHeight:1.6,color:t.ink2,whiteSpace:'pre-wrap'}}>{report}</div>}
      </Card>
    </div>
  );
}

Object.assign(window,{ProjectView,BudgetView,ScheduleView,AutomationsView,PlaceholderView});
