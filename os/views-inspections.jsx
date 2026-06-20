/* Inspections & Checklists — run a template (Pre-Pour, Framing QC,
   Safety Walk, Drywall QC) on a project, mark each item pass/fail/NA,
   then close it. AUTOMATION: every failed item opens an issue on the
   project. Wired to DROS.actions.startInspection / setInspectionItem /
   closeInspection. */
const {useState:useStateIn} = React;

const inspStatus = { open:['In progress','warn'], passed:['Passed','ok'], failed:['Failed','bad'] };
const resultMap = {
  pass:['Pass', DRtok.ok,  DRtok.okBg],
  fail:['Fail', DRtok.bad, DRtok.badBg],
  na:  ['N/A',  DRtok.idle,DRtok.idleBg],
};

function InspectionRow({insp, expanded, onToggle, user, t}){
  const p=DROS.P(insp.pid);
  const [sl,sk]=inspStatus[insp.status]||inspStatus.open;
  const done=insp.items.filter(i=>i.result).length;
  const pct=Math.round(done/insp.items.length*100);
  const open=insp.status==='open';
  return (
    <div style={{borderBottom:`1px solid ${t.lineSoft}`}}>
      <div onClick={onToggle} style={{display:'flex',alignItems:'center',gap:12,padding:'13px 18px',cursor:'pointer'}}>
        <CodeTile code={insp.pid} s={32} r={8} fs={10.5}/>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:13.5,fontWeight:700,color:t.ink}}>{insp.template}</div>
          <div style={{fontSize:11.5,color:t.muted,marginTop:1}}>{p?p.name:insp.pid} · {insp.date} · {insp.by}</div>
        </div>
        <div style={{width:96,flex:'none'}}><div style={{display:'flex',alignItems:'center',gap:7}}><Bar pct={pct} h={6}/><span style={{fontSize:11,fontWeight:700,color:t.ink2,minWidth:30,textAlign:'right'}}>{pct}%</span></div></div>
        <Pill kind={sk}>{sl}</Pill>
        <DIcon d={IC.chevron} s={16} style={{color:t.faint,transform:expanded?'rotate(90deg)':'none',transition:'.15s'}}/>
      </div>
      {expanded && <div style={{padding:'4px 18px 16px'}}>
        <div style={{border:`1px solid ${t.line}`,borderRadius:11,overflow:'hidden'}}>
          {insp.items.map((it,idx)=>(
            <div key={idx} style={{display:'flex',alignItems:'center',gap:12,padding:'11px 14px',borderBottom:idx<insp.items.length-1?`1px solid ${t.lineSoft}`:'none',background:it.result==='fail'?'rgba(208,73,74,.04)':'#fff'}}>
              <div style={{flex:1,fontSize:13,fontWeight:600,color:t.ink2}}>{it.text}</div>
              {open ? (
                <div style={{display:'flex',gap:5,flex:'none'}}>
                  {['pass','fail','na'].map(r=>{ const [rl,rc,rb]=resultMap[r]; const on=it.result===r; return (
                    <button key={r} onClick={()=>DROS.actions.setInspectionItem(insp.id,idx,r)} style={{border:`1px solid ${on?rc:t.line}`,background:on?rb:'#fff',color:on?rc:t.muted,borderRadius:8,padding:'6px 12px',fontSize:11.5,fontWeight:800,cursor:'pointer',minWidth:46}}>{rl}</button>);})}
                </div>
              ) : (
                it.result ? (()=>{ const [rl,rc,rb]=resultMap[it.result]; return <span style={{flex:'none',color:rc,background:rb,borderRadius:8,padding:'5px 11px',fontSize:11.5,fontWeight:800}}>{rl}</span>; })() : <span style={{flex:'none',color:t.faint,fontSize:11.5,fontWeight:700}}>—</span>
              )}
            </div>
          ))}
        </div>
        {open && <div style={{display:'flex',alignItems:'center',gap:12,marginTop:12}}>
          <button onClick={()=>drToast(DROS.actions.closeInspection(insp.id,user))} disabled={done<insp.items.length}
            style={{background:done<insp.items.length?t.line:t.blue,color:'#fff',border:0,borderRadius:9,padding:'10px 16px',fontSize:13,fontWeight:700,cursor:done<insp.items.length?'default':'pointer'}}>Close inspection</button>
          <span style={{fontSize:11.5,color:t.muted}}>{done<insp.items.length?`Mark all ${insp.items.length} items to close.`:'Any failed items open an issue automatically.'}</span>
        </div>}
      </div>}
    </div>
  );
}

function InspectionsView({user}){
  const t=DRtok; const {state}=useStore();
  const list=state.inspections||[];
  const templates=state.inspectionTemplates||[];
  const active=state.projects.filter(p=>!['Lead','Bidding'].includes(p.stage));
  const [expanded,setExpanded]=useStateIn(()=> (list.find(i=>i.status==='open')||{}).id || null);
  const [f,setF]=useStateIn({pid:(active[0]||{}).id, template:(templates[0]||{}).name||''});

  const open=list.filter(i=>i.status==='open').length;
  const passed=list.filter(i=>i.status==='passed').length;
  const failed=list.filter(i=>i.status==='failed').length;
  const closed=passed+failed;
  const rate=closed?Math.round(passed/closed*100):0;

  const start=()=>{ if(!f.pid||!f.template){drToast('Pick a project and template');return;} const msg=DROS.actions.startInspection(f,user); drToast(msg); setTimeout(()=>{ const ni=(DROS.state.inspections||[])[0]; if(ni) setExpanded(ni.id); },0); };
  const inp={width:'100%',border:`1px solid ${t.line}`,borderRadius:9,padding:'9px 12px',fontSize:13.5,fontFamily:t.fBody,outline:'none'};
  const lbl={fontSize:11.5,fontWeight:700,color:t.muted,display:'block',marginBottom:5};

  return (
    <div>
      <PageHead title="Inspections & Checklists" sub={`${open} in progress · ${passed} passed · ${failed} failed`}/>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:16}}>
        <Kpi icon={IC.clipboard} label="In Progress" value={String(open)} tint="warn"/>
        <Kpi icon={IC.check} label="Passed" value={String(passed)} tint="ok"/>
        <Kpi icon={IC.alert} label="Failed" value={String(failed)} tint="bad"/>
        <Kpi icon={IC.trend} label="Pass Rate" value={rate+'%'} tint="cyan" sub={`${closed} closed`}/>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1.62fr 1fr',gap:16,alignItems:'start'}}>
        <Card title="Inspections" meta={`${list.length} total`} pad={false}>
          {list.length===0 && <div style={{fontSize:13,color:t.muted,padding:'16px 18px'}}>No inspections yet. Start one from a template.</div>}
          {list.map(insp=>(
            <InspectionRow key={insp.id} insp={insp} user={user} t={t} expanded={expanded===insp.id} onToggle={()=>setExpanded(expanded===insp.id?null:insp.id)}/>
          ))}
        </Card>

        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <Card title="Start an Inspection">
            <div style={{display:'flex',flexDirection:'column',gap:11}}>
              <div><label style={lbl}>Project</label>
                <select value={f.pid} onChange={e=>setF({...f,pid:e.target.value})} style={{...inp,fontWeight:600,color:t.ink,background:'#fff',cursor:'pointer'}}>{active.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
              <div><label style={lbl}>Checklist template</label>
                <select value={f.template} onChange={e=>setF({...f,template:e.target.value})} style={{...inp,fontWeight:600,color:t.ink,background:'#fff',cursor:'pointer'}}>{templates.map(tp=><option key={tp.id} value={tp.name}>{tp.name} · {tp.items.length} items</option>)}</select></div>
              <button onClick={start} style={{background:t.blue,color:'#fff',border:0,borderRadius:10,padding:'11px',fontSize:13.5,fontWeight:700,cursor:'pointer'}}>Start inspection</button>
              <div style={{fontSize:11.5,color:t.muted,textAlign:'center'}}>Failed items open punch-list issues automatically on close.</div>
            </div>
          </Card>

          <Card title="Templates" meta={String(templates.length)}>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {templates.map(tp=>(
                <div key={tp.id} style={{display:'flex',alignItems:'center',gap:11}}>
                  <div style={{...circ(),width:30,height:30,borderRadius:8,background:t.cardTint,color:t.blue,flex:'none'}}><DIcon d={IC.clipboard} s={15}/></div>
                  <div style={{flex:1,minWidth:0}}><div style={{fontSize:12.5,fontWeight:700,color:t.ink}}>{tp.name}</div><div style={{fontSize:11,color:t.muted,marginTop:1}}>{tp.items.length} checkpoints</div></div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

window.InspectionsView=InspectionsView;
