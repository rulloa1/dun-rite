/* Operational modules: Issues/Punch, Invoices, Change Orders (global),
   Daily Reports (global), and a generic Tracker for RFI / Submittals /
   Safety / Equipment. Uses window globals + shared primitives. */
const {useState:useStateM} = React;

const prio = {high:['High',DRtok.bad,DRtok.badBg], med:['Med',DRtok.warn,DRtok.warnBg], low:['Low',DRtok.idle,DRtok.idleBg]};
function PageHead({title,sub,right}){ const t=DRtok; return (
  <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:18,gap:16,flexWrap:'wrap'}}>
    <div><h1 style={{fontFamily:t.fHead,fontWeight:800,fontSize:26,letterSpacing:'-.025em',color:t.ink,margin:0}}>{title}</h1>
    <div style={{color:t.muted,fontSize:13.5,marginTop:4}}>{sub}</div></div>{right}
  </div>); }
function ProjSelect({value,onChange,projects}){ const t=DRtok; return (
  <select value={value} onChange={e=>onChange(e.target.value)} style={{border:`1px solid ${t.line}`,borderRadius:10,padding:'10px 14px',fontSize:13.5,fontFamily:t.fBody,fontWeight:600,color:t.ink,background:'#fff',cursor:'pointer',outline:'none'}}>
    {projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
  </select>); }
const pname = pid => (DROS.P(pid)||{}).name||pid;

/* ---------------- Issues / Punch List ---------------- */
function IssuesView({user}){
  const t=DRtok; const {state}=useStore();
  const all=[]; state.projects.forEach(p=>p.issues.forEach(i=>all.push({...i,pid:p.id,pname:p.name})));
  const open=all.filter(i=>i.status==='open');
  const active=state.projects.filter(p=>!['Lead','Bidding'].includes(p.stage));
  const [pid,setPid]=useStateM((active[0]||{}).id); const [f,setF]=useStateM({title:'',priority:'med'});
  const add=()=>{ if(!f.title.trim()){drToast('Describe the issue first');return;} drToast(DROS.actions.addIssue(pid,f,user)); setF({title:'',priority:'med'}); };
  return (
    <div>
      <PageHead title="Issues & Punch List" sub={`${open.length} open across ${new Set(open.map(i=>i.pid)).size} jobs`}/>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:16}}>
        <Kpi icon={IC.alert} label="Open Issues" value={String(open.length)} tint="warn"/>
        <Kpi icon={IC.alert} label="High Priority" value={String(open.filter(i=>i.priority==='high').length)} tint="bad"/>
        <Kpi icon={IC.check} label="Resolved" value={String(all.filter(i=>i.status==='closed').length)} tint="ok"/>
        <Kpi icon={IC.flag} label="Punch (Cedar Park)" value={String((DROS.P('CED')?.issues||[]).filter(i=>i.status==='open').length)} tint="cyan"/>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1.55fr 1fr',gap:16,alignItems:'start'}}>
        <Card title="All Issues" meta={`${open.length} open`} pad={false}>
          {all.length===0 && <div style={{fontSize:13,color:t.muted,padding:'16px 18px'}}>No issues logged.</div>}
          {all.sort((a,b)=>(a.status==='open'?0:1)-(b.status==='open'?0:1)).map((i,idx)=>{ const [pl,pc,pb]=prio[i.priority]||prio.med;
            return <div key={i.id} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 18px',borderBottom:idx<all.length-1?`1px solid ${t.lineSoft}`:'none',opacity:i.status==='closed'?.55:1}}>
              <button onClick={()=>drToast(DROS.actions.resolveIssue(i.pid,i.id,user))} style={{width:20,height:20,borderRadius:6,border:`2px solid ${i.status==='closed'?t.ok:t.line}`,background:i.status==='closed'?t.ok:'#fff',flex:'none',cursor:'pointer',display:'grid',placeItems:'center',padding:0}}>{i.status==='closed'&&<DIcon d={IC.check} s={13} style={{color:'#fff'}}/>}</button>
              <div style={{flex:1}}><div style={{fontSize:13.5,fontWeight:600,color:t.ink,textDecoration:i.status==='closed'?'line-through':'none'}}>{i.title}</div><div style={{fontSize:11.5,color:t.muted,marginTop:1}}>{i.pname}</div></div>
              <span style={{fontSize:10.5,fontWeight:800,letterSpacing:'.04em',textTransform:'uppercase',color:pc,background:pb,padding:'3px 9px',borderRadius:20}}>{pl}</span>
            </div>;})}
        </Card>
        <Card title="Log an Issue">
          <div style={{display:'flex',flexDirection:'column',gap:11}}>
            <div><label style={{fontSize:11.5,fontWeight:700,color:t.muted,display:'block',marginBottom:5}}>Project</label><ProjSelect value={pid} onChange={setPid} projects={active}/></div>
            <div><label style={{fontSize:11.5,fontWeight:700,color:t.muted,display:'block',marginBottom:5}}>What's the issue?</label><input value={f.title} onChange={e=>setF({...f,title:e.target.value})} onKeyDown={e=>e.key==='Enter'&&add()} placeholder="Describe it…" style={{width:'100%',border:`1px solid ${t.line}`,borderRadius:9,padding:'9px 12px',fontSize:13.5,fontFamily:t.fBody,outline:'none'}}/></div>
            <div><label style={{fontSize:11.5,fontWeight:700,color:t.muted,display:'block',marginBottom:5}}>Priority</label>
              <div style={{display:'flex',gap:7}}>{['low','med','high'].map(pr=>{ const [pl,pc,pb]=prio[pr]; const on=f.priority===pr;
                return <button key={pr} onClick={()=>setF({...f,priority:pr})} style={{flex:1,border:`1px solid ${on?pc:t.line}`,background:on?pb:'#fff',color:on?pc:t.muted,borderRadius:9,padding:'8px',fontSize:12,fontWeight:700,cursor:'pointer'}}>{pl}</button>;})}</div></div>
            <button onClick={add} style={{background:t.blue,color:'#fff',border:0,borderRadius:10,padding:'11px',fontSize:13.5,fontWeight:700,cursor:'pointer'}}>Log issue</button>
            <div style={{fontSize:11.5,color:t.muted,textAlign:'center'}}>High-priority issues flag the project for the owner automatically.</div>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ---------------- Invoices ---------------- */
function InvoicesView({user}){
  const t=DRtok; const {state}=useStore();
  const inv=state.invoices;
  const sum=s=>inv.filter(v=>v.status===s).reduce((a,v)=>a+v.amt,0);
  const stMap={draft:['Draft','idle'],sent:['Sent','warn'],paid:['Paid','ok']};
  return (
    <div>
      <PageHead title="Invoices" sub="Billing across all jobs · updates cash position as they're paid"/>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:16}}>
        <Kpi icon={IC.receipt} label="Draft" value={fmtM(sum('draft'))} tint="cyan" sub={`${inv.filter(v=>v.status==='draft').length} invoices`}/>
        <Kpi icon={IC.receipt} label="Sent / Outstanding" value={fmtM(sum('sent'))} tint="warn" sub={`${inv.filter(v=>v.status==='sent').length} awaiting payment`}/>
        <Kpi icon={IC.dollar} label="Paid (collected)" value={fmtM(sum('paid'))} tint="ok"/>
      </div>
      <Card title="All Invoices" pad={false}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
          <thead><tr>{['Invoice','Project','Amount','Status','',''].map((h,i)=>
            <th key={i} style={{textAlign:i===2?'right':'left',fontSize:10,letterSpacing:'.06em',textTransform:'uppercase',color:t.muted,fontWeight:700,padding:'11px 16px',background:t.cardTint,borderBottom:`1px solid ${t.line}`}}>{h}</th>)}</tr></thead>
          <tbody>
            {inv.map(v=>{ const [sl,sk]=stMap[v.status];
              return <tr key={v.id} style={{borderBottom:`1px solid ${t.lineSoft}`}}>
                <td style={{padding:'12px 16px'}}><div style={{fontWeight:700,color:t.ink}}>{v.num}</div><div style={{fontSize:11.5,color:t.faint,marginTop:1}}>{v.date}</div></td>
                <td style={{padding:'12px 16px'}}><div style={{display:'flex',alignItems:'center',gap:9}}><CodeTile code={v.pid} s={26} r={7} fs={9.5}/><span style={{color:t.ink2,fontWeight:600}}>{pname(v.pid)}</span></div></td>
                <td style={{padding:'12px 16px',textAlign:'right',fontVariantNumeric:'tabular-nums',fontWeight:700,color:t.ink}}>{fmt$(v.amt)}</td>
                <td style={{padding:'12px 16px'}}><Pill kind={sk}>{sl}</Pill></td>
                <td colSpan={2} style={{padding:'12px 16px',textAlign:'right'}}>
                  {v.status==='draft' && <button onClick={()=>drToast(DROS.actions.setInvoiceStatus(v.id,'sent',user))} style={{fontSize:12,fontWeight:700,color:'#fff',background:t.blue,border:0,padding:'7px 13px',borderRadius:8,cursor:'pointer'}}>Send</button>}
                  {v.status==='sent' && <button onClick={()=>drToast(DROS.actions.setInvoiceStatus(v.id,'paid',user))} style={{fontSize:12,fontWeight:700,color:'#fff',background:t.ok,border:0,padding:'7px 13px',borderRadius:8,cursor:'pointer'}}>Mark paid</button>}
                  {v.status==='paid' && <span style={{fontSize:12,color:t.ok,fontWeight:700,display:'inline-flex',alignItems:'center',gap:5}}><DIcon d={IC.check} s={15}/>Collected</span>}
                </td>
              </tr>;})}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ---------------- Change Orders (global) ---------------- */
function ChangeOrdersView({user}){
  const t=DRtok; const {state}=useStore();
  const all=[]; state.projects.forEach(p=>p.cos.forEach(c=>all.push({...c,pid:p.id,pname:p.name})));
  const pending=all.filter(c=>c.status==='pending');
  const isOwner=user.role==='owner';
  return (
    <div>
      <PageHead title="Change Orders" sub={`${pending.length} pending · ${fmt$(pending.reduce((a,c)=>a+c.amt,0))} awaiting approval`}/>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:16}}>
        <Kpi icon={IC.edit} label="Pending" value={String(pending.length)} tint="warn"/>
        <Kpi icon={IC.dollar} label="Pending Value" value={fmtM(pending.reduce((a,c)=>a+c.amt,0))} tint="cyan"/>
        <Kpi icon={IC.check} label="Approved (to contract)" value={fmtM(all.filter(c=>c.status==='approved').reduce((a,c)=>a+c.amt,0))} tint="ok"/>
      </div>
      <Card title="All Change Orders" pad={false}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
          <thead><tr>{['CO','Project','Description','Amount','Status'].map((h,i)=>
            <th key={i} style={{textAlign:i===3?'right':'left',fontSize:10,letterSpacing:'.06em',textTransform:'uppercase',color:t.muted,fontWeight:700,padding:'11px 16px',background:t.cardTint,borderBottom:`1px solid ${t.line}`}}>{h}</th>)}</tr></thead>
          <tbody>
            {all.sort((a,b)=>(a.status==='pending'?0:1)-(b.status==='pending'?0:1)).map(c=>(
              <tr key={c.id} style={{borderBottom:`1px solid ${t.lineSoft}`}}>
                <td style={{padding:'12px 16px',fontWeight:700,color:t.navy}}>{c.code}</td>
                <td style={{padding:'12px 16px'}}><div style={{display:'flex',alignItems:'center',gap:9}}><CodeTile code={c.pid} s={26} r={7} fs={9.5}/><span style={{color:t.ink2,fontWeight:600}}>{c.pname}</span></div></td>
                <td style={{padding:'12px 16px',color:t.ink2}}>{c.desc}</td>
                <td style={{padding:'12px 16px',textAlign:'right',fontVariantNumeric:'tabular-nums',fontWeight:700,color:t.ink}}>{fmt$(c.amt)}</td>
                <td style={{padding:'12px 16px'}}>{c.status==='approved'?<Pill kind="ok">Approved</Pill>:isOwner?<button onClick={()=>drToast(DROS.actions.approveCO(c.pid,c.id,user))} style={{fontSize:12,fontWeight:700,color:'#fff',background:t.blue,border:0,padding:'7px 13px',borderRadius:8,cursor:'pointer'}}>Approve</button>:<Pill kind="warn">Pending</Pill>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ---------------- Daily Reports (global feed) ---------------- */
function DailyReportsView({user}){
  const t=DRtok; const {state}=useStore();
  const rows=[]; state.projects.forEach(p=>p.logs.forEach(l=>rows.push({...l,pid:p.id,pname:p.name})));
  const active=state.projects.filter(p=>p.stage==='Active');
  return (
    <div>
      <PageHead title="Daily Reports" sub={`${rows.length} reports logged · advances schedules automatically`}
        right={active[0] && <button onClick={()=>go({view:'project',pid:active[0].id,tab:'Daily Log'})} style={{display:'inline-flex',alignItems:'center',gap:7,background:t.blue,color:'#fff',padding:'10px 16px',borderRadius:10,fontSize:13,fontWeight:600,border:0,cursor:'pointer'}}><DIcon d={IC.plus} s={16}/>Log today</button>}/>
      <Card pad={false}>
        {rows.length===0 && <div style={{fontSize:13,color:t.muted,padding:'16px 18px'}}>No daily reports yet.</div>}
        {rows.map((l,i)=>(
          <div key={l.id} style={{display:'flex',gap:14,alignItems:'flex-start',padding:'14px 18px',borderBottom:i<rows.length-1?`1px solid ${t.lineSoft}`:'none'}}>
            <CodeTile code={l.pid} s={34} r={9} fs={11}/>
            <div style={{flex:1}}>
              <div style={{display:'flex',gap:10,alignItems:'center'}}><span style={{fontSize:13.5,fontWeight:700,color:t.ink}}>{l.pname}</span><span style={{fontSize:11.5,color:t.faint}}>{l.date}</span></div>
              <div style={{fontSize:13,color:t.ink2,marginTop:3}}>{l.work}</div>
            </div>
            <div style={{textAlign:'right',flex:'none'}}><div style={{fontSize:12.5,fontWeight:700,color:t.ink}}>{l.crew} crew</div><div style={{fontSize:11.5,color:t.muted,marginTop:1}}>{l.weather}</div></div>
          </div>
        ))}
      </Card>
    </div>
  );
}

/* ---------------- Generic tracker (RFI / Submittals / Safety / Equipment) ---------------- */
function TrackerView({user, kind, title, sub, noun}){
  const t=DRtok; const {state}=useStore();
  const items=state.trackers[kind]||[];
  const open=items.filter(i=>i.status==='open');
  const active=state.projects.filter(p=>!['Lead','Bidding'].includes(p.stage));
  const [pid,setPid]=useStateM((active[0]||{}).id); const [val,setVal]=useStateM('');
  const add=()=>{ if(!val.trim()){drToast(`Describe the ${noun} first`);return;} drToast(DROS.actions.addTrackerItem(kind,pid,val.trim(),user)); setVal(''); };
  return (
    <div>
      <PageHead title={title} sub={`${open.length} open ${sub}`}/>
      <div style={{display:'grid',gridTemplateColumns:'1.55fr 1fr',gap:16,alignItems:'start'}}>
        <Card title={title} meta={`${open.length} open`} pad={false}>
          {items.length===0 && <div style={{fontSize:13,color:t.muted,padding:'16px 18px'}}>Nothing logged yet.</div>}
          {items.sort((a,b)=>(a.status==='open'?0:1)-(b.status==='open'?0:1)).map((i,idx)=>(
            <div key={i.id} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 18px',borderBottom:idx<items.length-1?`1px solid ${t.lineSoft}`:'none',opacity:i.status==='closed'?.55:1}}>
              <button onClick={()=>drToast(DROS.actions.toggleTracker(kind,i.id,user))} style={{width:20,height:20,borderRadius:6,border:`2px solid ${i.status==='closed'?t.ok:t.line}`,background:i.status==='closed'?t.ok:'#fff',flex:'none',cursor:'pointer',display:'grid',placeItems:'center',padding:0}}>{i.status==='closed'&&<DIcon d={IC.check} s={13} style={{color:'#fff'}}/>}</button>
              <div style={{flex:1}}><div style={{fontSize:13.5,fontWeight:600,color:t.ink,textDecoration:i.status==='closed'?'line-through':'none'}}>{i.title}</div><div style={{fontSize:11.5,color:t.muted,marginTop:1}}>{pname(i.pid)} · {i.meta}</div></div>
              <Pill kind={i.status==='closed'?'ok':'warn'}>{i.status==='closed'?'Closed':'Open'}</Pill>
            </div>
          ))}
        </Card>
        <Card title={`New ${noun}`}>
          <div style={{display:'flex',flexDirection:'column',gap:11}}>
            <div><label style={{fontSize:11.5,fontWeight:700,color:t.muted,display:'block',marginBottom:5}}>Project</label><ProjSelect value={pid} onChange={setPid} projects={active}/></div>
            <div><label style={{fontSize:11.5,fontWeight:700,color:t.muted,display:'block',marginBottom:5}}>Description</label><input value={val} onChange={e=>setVal(e.target.value)} onKeyDown={e=>e.key==='Enter'&&add()} placeholder={`Add a ${noun}…`} style={{width:'100%',border:`1px solid ${t.line}`,borderRadius:9,padding:'9px 12px',fontSize:13.5,fontFamily:t.fBody,outline:'none'}}/></div>
            <button onClick={add} style={{background:t.blue,color:'#fff',border:0,borderRadius:10,padding:'11px',fontSize:13.5,fontWeight:700,cursor:'pointer'}}>Add</button>
          </div>
        </Card>
      </div>
    </div>
  );
}

Object.assign(window,{IssuesView,InvoicesView,ChangeOrdersView,DailyReportsView,TrackerView});
