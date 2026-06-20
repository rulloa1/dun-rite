/* Project detail + Budget + Schedule + Automations + Placeholder.
   Uses window globals: useStore, go, drToast, DROS, shared primitives,
   and helpers from views-home (fmtM, fmt$, ago, healthMap, CodeTile). */

const {useState:useStateP} = React;

/* ---------------- Project detail ---------------- */
function ProjectView({user, pid, tab}){
  const t=DRtok; const {state}=useStore();
  const p=DROS.P(pid);
  const [active,setActive]=useStateP(tab||'Overview');
  if(!p) return <div style={{color:t.muted}}>Project not found.</div>;
  const bud=Math.round(p.spent/p.contract*100); const over=p.spent>p.contract;
  const [hl,hk]=healthMap[p.health]||['—','idle'];
  const isOwner=user.role==='owner';
  const tabs=['Overview','Tasks','Daily Log','Change Orders','Photos'];

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
  const add=()=>{ if(!val.trim())return; p.tasks.push({id:'t'+Date.now(),title:val.trim(),who:user.id,done:false,due:'This week'}); DROS.save(); DROS.actions.toggleTask(p.id,'__noop__',user); setVal(''); };
  // toggleTask with noop id just forces emit; simpler: call save+emit via a real action. Use a dedicated emit:
  const addClean=()=>{ if(!val.trim())return; p.tasks.push({id:'t'+Date.now(),title:val.trim(),who:user.id,done:false,due:'This week'}); DROS.actions.moveStage(p.id,p.stage,user); setVal(''); drToast('Task added'); };
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

function PhotosTab({p,user}){
  const t=DRtok; const n=p.photos||0;
  return (
    <Card title="Photos" meta={`${n} on file`} action={<button onClick={()=>drToast(DROS.actions.addPhotos(p.id,3,user))} style={{display:'inline-flex',alignItems:'center',gap:6,background:t.blue,color:'#fff',border:0,borderRadius:9,padding:'8px 13px',fontSize:12.5,fontWeight:600,cursor:'pointer'}}><DIcon d={IC.camera} s={15}/>Add photos</button>}>
      {n===0 && <div style={{fontSize:13,color:t.muted,padding:'10px 0'}}>No photos yet. Uploads auto-tag to <b>{p.phase}</b> and file by date.</div>}
      <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:8}}>
        {Array.from({length:Math.min(n,18)}).map((_,i)=>(
          <div key={i} style={{aspectRatio:'1',borderRadius:9,background:`linear-gradient(135deg,${t.lineSoft},${t.line})`,display:'grid',placeItems:'center',color:t.faint}}><DIcon d={IC.camera} s={18}/></div>
        ))}
      </div>
    </Card>
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

Object.assign(window,{ProjectView,BudgetView,ScheduleView,AutomationsView,PlaceholderView});
