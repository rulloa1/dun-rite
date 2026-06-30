/* Commitments — subcontracts & purchase orders with cost codes, a
   signature workflow (draft → out for signature → executed) and
   invoiced-to-date. Vendors come from the Directory; executed value
   rolls into the budget picture. Wired to DROS.actions. */
const {useState:useStateCm, useEffect:useEffectCm} = React;

const cmStatus = {
  draft:    ['Draft',         'idle'],
  out:      ['Out for sig.',  'warn'],
  executed: ['Executed',      'ok'],
};

function CommitmentsView({user}){
  const t=DRtok; const {state}=useStore();
  const all=state.commitments||[];
  const projects=state.projects.filter(p=>!['Lead','Bidding'].includes(p.stage));
  const vendors=(state.directory||[]).filter(c=>c.status==='active' && ['Subcontractor','Vendor'].includes(c.type));

  const [pid,setPid]=useStateCm(()=>localStorage.getItem('dr_active_project')||'all');
  useEffectCm(()=>{ const onStorageCm=e=>{ if(e.key==='dr_active_project') setPid(e.newValue||'all'); }; window.addEventListener('storage',onStorageCm); return ()=>window.removeEventListener('storage',onStorageCm); },[]);
  const [type,setType]=useStateCm('all');
  const [f,setF]=useStateCm({type:'sub',pid:(projects[0]||{}).id,vendorId:(vendors[0]||{}).id||'',title:'',costCode:'',amount:''});

  const rows=all.filter(c=>(pid==='all'||c.pid===pid) && (type==='all'||c.type===type));
  const committed=all.filter(c=>c.status!=='draft').reduce((s,c)=>s+c.amount,0);
  const executed=all.filter(c=>c.status==='executed').reduce((s,c)=>s+c.amount,0);
  const outCt=all.filter(c=>c.status==='out').length;
  const invoiced=all.reduce((s,c)=>s+(c.invoiced||0),0);
  const vname=id=>{ const v=window.dirVendor&&dirVendor(id); return v?v.name:'—'; };

  const create=()=>{ if(!f.title.trim()||!f.amount){drToast('Add a title and amount');return;} drToast(DROS.actions.createCommitment(f,user)); setF({...f,title:'',costCode:'',amount:''}); };
  const inp={width:'100%',border:`1px solid ${t.line}`,borderRadius:9,padding:'9px 12px',fontSize:13.5,fontFamily:t.fBody,outline:'none'};
  const lbl={fontSize:11.5,fontWeight:700,color:t.muted,display:'block',marginBottom:5};

  return (
    <div>
      <PageHead title="Commitments" sub={`${all.length} contracts & POs · ${fmt$(committed)} committed · ${fmt$(invoiced)} invoiced to date`}/>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:16}}>
        <Kpi icon={IC.doc} label="Committed" value={fmtM(committed)} tint="cyan" sub="subs + POs issued"/>
        <Kpi icon={IC.check} label="Executed" value={fmtM(executed)} tint="ok" sub="signed & in budget"/>
        <Kpi icon={IC.edit} label="Out for Signature" value={String(outCt)} tint="warn"/>
        <Kpi icon={IC.dollar} label="Invoiced to Date" value={fmtM(invoiced)} tint="gold"/>
      </div>

      <div style={{display:'flex',gap:10,marginBottom:14,flexWrap:'wrap',alignItems:'center'}}>
        <select value={pid} onChange={e=>setPid(e.target.value)} style={{border:`1px solid ${t.line}`,borderRadius:10,padding:'9px 13px',fontSize:13,fontFamily:t.fBody,fontWeight:600,color:t.ink,background:'#fff',cursor:'pointer',outline:'none'}}>
          <option value="all">All projects</option>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <div style={{display:'flex',gap:6}}>
          {[['all','All'],['sub','Subcontracts'],['po','Purchase Orders']].map(([k,l])=>{ const on=type===k; return (
            <button key={k} onClick={()=>setType(k)} style={{border:`1px solid ${on?t.blue:t.line}`,background:on?'#EAF4FC':'#fff',color:on?t.blue:t.muted,borderRadius:9,padding:'8px 13px',fontSize:12.5,fontWeight:700,cursor:'pointer'}}>{l}</button>);})}
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1.7fr 1fr',gap:16,alignItems:'start'}}>
        <Card title="Subcontracts & Purchase Orders" meta={`${rows.length} shown`} pad={false}>
          <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:12.5,minWidth:660}}>
            <thead><tr>{['#','Project','Vendor / Title','Cost Code','Amount','Invoiced','Status'].map((h,i)=>
              <th key={i} style={{textAlign:i>=4&&i<=5?'right':'left',fontSize:10,letterSpacing:'.05em',textTransform:'uppercase',color:t.muted,fontWeight:700,padding:'11px 14px',background:t.cardTint,borderBottom:`1px solid ${t.line}`,whiteSpace:'nowrap'}}>{h}</th>)}</tr></thead>
            <tbody>
              {rows.length===0 && <tr><td colSpan={7} style={{padding:'16px 14px',fontSize:13,color:t.muted}}>No commitments match.</td></tr>}
              {rows.map(c=>{ const [sl,sk]=cmStatus[c.status]||cmStatus.draft; const ipct=c.amount?Math.round((c.invoiced/c.amount)*100):0;
                return <tr key={c.id} style={{borderBottom:`1px solid ${t.lineSoft}`}}>
                  <td style={{padding:'11px 14px'}}><span style={{fontFamily:t.fMono,fontSize:12,fontWeight:600,color:c.type==='po'?t.gold:t.navy}}>{c.num}</span></td>
                  <td style={{padding:'11px 14px'}}><div style={{display:'flex',alignItems:'center',gap:8}}><CodeTile code={c.pid} s={24} r={6} fs={9}/></div></td>
                  <td style={{padding:'11px 14px'}}><div style={{fontWeight:700,color:t.ink}}>{vname(c.vendorId)}</div><div style={{fontSize:11.5,color:t.muted,marginTop:1}}>{c.title}</div></td>
                  <td style={{padding:'11px 14px',fontFamily:t.fMono,fontSize:11.5,color:t.muted,whiteSpace:'nowrap'}}>{c.costCode||'—'}</td>
                  <td style={{padding:'11px 14px',textAlign:'right',fontVariantNumeric:'tabular-nums',fontWeight:700,color:t.ink,whiteSpace:'nowrap'}}>{fmt$(c.amount)}</td>
                  <td style={{padding:'11px 14px',minWidth:96}}><div style={{display:'flex',alignItems:'center',gap:7}}><Bar pct={ipct} h={6}/><span style={{fontSize:11,fontWeight:700,color:t.ink2,minWidth:30,textAlign:'right'}}>{ipct}%</span></div></td>
                  <td style={{padding:'11px 14px'}}>
                    {c.status==='executed'
                      ? <Pill kind="ok">Executed</Pill>
                      : <button onClick={()=>drToast(DROS.actions.advanceCommitment(c.id,user))} style={{fontSize:11.5,fontWeight:700,color:'#fff',background:c.status==='draft'?t.blue:t.ok,border:0,padding:'6px 11px',borderRadius:8,cursor:'pointer',whiteSpace:'nowrap'}}>{c.status==='draft'?'Send out':'Mark executed'}</button>}
                  </td>
                </tr>;})}
            </tbody>
          </table>
          </div>
        </Card>

        <Card title="New Commitment">
          <div style={{display:'flex',flexDirection:'column',gap:11}}>
            <div style={{display:'flex',gap:7}}>
              {[['sub','Subcontract'],['po','Purchase Order']].map(([k,l])=>{ const on=f.type===k; return (
                <button key={k} onClick={()=>setF({...f,type:k})} style={{flex:1,border:`1px solid ${on?t.blue:t.line}`,background:on?'#EAF4FC':'#fff',color:on?t.blue:t.muted,borderRadius:9,padding:'9px',fontSize:12.5,fontWeight:700,cursor:'pointer'}}>{l}</button>);})}
            </div>
            <div><label style={lbl}>Project</label>
              <select value={f.pid} onChange={e=>setF({...f,pid:e.target.value})} style={{...inp,fontWeight:600,color:t.ink,background:'#fff',cursor:'pointer'}}>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
            <div><label style={lbl}>Vendor</label>
              <select value={f.vendorId} onChange={e=>setF({...f,vendorId:e.target.value})} style={{...inp,fontWeight:600,color:t.ink,background:'#fff',cursor:'pointer'}}>
                {vendors.length===0 && <option value="">No active vendors</option>}
                {vendors.map(v=><option key={v.id} value={v.id}>{v.name} · {v.trade}</option>)}</select></div>
            {(()=>{ const ins=window.DROS&&DROS.insuranceStatus&&DROS.insuranceStatus(f.vendorId); if(!ins) return null;
              if(ins.state==='expired'||ins.state==='missing') return <div style={{fontSize:11.5,color:t.bad,background:t.badBg,borderRadius:8,padding:'8px 10px',display:'flex',gap:7,alignItems:'flex-start'}}><span style={{flex:'none',marginTop:1}}><DIcon d={IC.alert} s={13}/></span><span>{ins.state==='expired'?'This sub\u2019s insurance is expired':'No certificate of insurance on file'} — review the Insurance tab before issuing.</span></div>;
              if(ins.state==='expiring') return <div style={{fontSize:11.5,color:t.warn,background:t.warnBg,borderRadius:8,padding:'8px 10px',display:'flex',gap:7,alignItems:'flex-start'}}><span style={{flex:'none',marginTop:1}}><DIcon d={IC.alert} s={13}/></span><span>Insurance expires in {ins.days}d — confirm a renewal.</span></div>;
              return null; })()}
            <div><label style={lbl}>Scope / title</label><input value={f.title} onChange={e=>setF({...f,title:e.target.value})} placeholder="e.g. Electrical rough & trim" style={inp}/></div>
            <div style={{display:'flex',gap:10}}>
              <div style={{flex:1}}><label style={lbl}>Cost code</label><input value={f.costCode} onChange={e=>setF({...f,costCode:e.target.value})} placeholder="16-100" style={{...inp,fontFamily:t.fMono}}/></div>
              <div style={{flex:1}}><label style={lbl}>Amount ($)</label><input type="number" value={f.amount} onChange={e=>setF({...f,amount:e.target.value})} placeholder="52993" style={inp}/></div>
            </div>
            <button onClick={create} style={{background:t.blue,color:'#fff',border:0,borderRadius:10,padding:'11px',fontSize:13.5,fontWeight:700,cursor:'pointer'}}>Create commitment</button>
            <div style={{fontSize:11.5,color:t.muted,textAlign:'center'}}>Starts as a draft — send it out, then mark executed to commit it to the budget.</div>
          </div>
        </Card>
      </div>
    </div>
  );
}

window.CommitmentsView=CommitmentsView;
