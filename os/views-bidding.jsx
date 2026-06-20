/* Bidding & Bid Leveling — bid packages, vendor quotes side-by-side,
   low-bid highlighting, and award. AUTOMATION: awarding a package drafts
   a subcontract in Commitments. Vendors come from the Directory.
   Wired to DROS.actions.createBidPackage / addQuote / awardBid. */
const {useState:useStateBd} = React;

function BiddingView({user}){
  const t=DRtok; const {state}=useStore();
  const bids=state.bids||[];
  const projects=state.projects.filter(p=>!['Closed'].includes(p.stage));
  const subs=(state.directory||[]).filter(c=>c.status==='active' && c.type==='Subcontractor');
  const vname=id=>{ const v=window.dirVendor&&dirVendor(id); return v?v.name:'—'; };

  const [sel,setSel]=useStateBd(()=> (bids.find(b=>b.status==='open')||bids[0]||{}).id || null);
  const [f,setF]=useStateBd({pkg:'',pid:(projects[0]||{}).id,costCode:'',scope:'',due:''});
  const [q,setQ]=useStateBd({vendorId:(subs[0]||{}).id||'',amount:'',note:''});

  const open=bids.filter(b=>b.status==='open');
  const awarded=bids.filter(b=>b.status==='awarded');
  const awardedVal=awarded.reduce((s,b)=>{ const aw=b.quotes.find(x=>x.vendorId===b.awardedTo); return s+(aw?aw.amount:0); },0);
  const totalQuotes=open.reduce((s,b)=>s+b.quotes.length,0);
  const avgBidders=open.length?(totalQuotes/open.length).toFixed(1):'0';
  const selBid=bids.find(b=>b.id===sel)||open[0]||bids[0];

  const lowOf=b=> b.quotes.length? Math.min(...b.quotes.map(x=>x.amount)) : 0;
  const create=()=>{ if(!f.pkg.trim()){drToast('Name the package');return;} const id='bd'+Date.now(); drToast(DROS.actions.createBidPackage(f,user)); setF({...f,pkg:'',costCode:'',scope:'',due:''}); setTimeout(()=>{ const nb=(DROS.state.bids||[])[0]; if(nb) setSel(nb.id); },0); };
  const addQ=()=>{ if(!selBid||!q.vendorId||!q.amount){drToast('Pick a vendor and amount');return;} drToast(DROS.actions.addQuote(selBid.id,q.vendorId,q.amount,q.note,user)); setQ({...q,amount:'',note:''}); };

  const inp={width:'100%',border:`1px solid ${t.line}`,borderRadius:9,padding:'9px 12px',fontSize:13.5,fontFamily:t.fBody,outline:'none'};
  const lbl={fontSize:11.5,fontWeight:700,color:t.muted,display:'block',marginBottom:5};

  return (
    <div>
      <PageHead title="Bidding & Bid Leveling" sub={`${open.length} open packages · ${awarded.length} awarded · ${fmt$(awardedVal)} awarded value`}/>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:16}}>
        <Kpi icon={IC.flag} label="Open Packages" value={String(open.length)} tint="cyan"/>
        <Kpi icon={IC.inbox} label="Bids Received" value={String(totalQuotes)} tint="warn" sub="on open packages"/>
        <Kpi icon={IC.user} label="Avg Bidders" value={avgBidders} tint="gold"/>
        <Kpi icon={IC.check} label="Awarded Value" value={fmtM(awardedVal)} tint="ok"/>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1.7fr 1fr',gap:16,alignItems:'start'}}>
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          {/* leveling for selected */}
          {selBid && <Card title={`Leveling · ${selBid.pkg}`} meta={selBid.status==='awarded'?'Awarded':`${selBid.quotes.length} bids`} pad={false}>
            <div style={{padding:'12px 18px',borderBottom:`1px solid ${t.lineSoft}`,display:'flex',gap:16,flexWrap:'wrap',fontSize:12,color:t.muted}}>
              <span><b style={{color:t.ink2}}>Project:</b> {DROS.P(selBid.pid)?.name||selBid.pid}</span>
              <span><b style={{color:t.ink2}}>Cost code:</b> <span style={{fontFamily:t.fMono}}>{selBid.costCode||'—'}</span></span>
              <span><b style={{color:t.ink2}}>Due:</b> {selBid.due}</span>
            </div>
            {selBid.scope && <div style={{padding:'10px 18px',fontSize:12.5,color:t.ink2,borderBottom:`1px solid ${t.lineSoft}`}}>{selBid.scope}</div>}
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
              <thead><tr>{['Vendor','Notes','Amount',''].map((h,i)=>
                <th key={i} style={{textAlign:i===2?'right':'left',fontSize:10,letterSpacing:'.05em',textTransform:'uppercase',color:t.muted,fontWeight:700,padding:'10px 16px',background:t.cardTint,borderBottom:`1px solid ${t.line}`}}>{h}</th>)}</tr></thead>
              <tbody>
                {selBid.quotes.length===0 && <tr><td colSpan={4} style={{padding:'16px',fontSize:13,color:t.muted}}>No bids yet — add one on the right.</td></tr>}
                {selBid.quotes.slice().sort((a,b)=>a.amount-b.amount).map((qt,i)=>{ const low=qt.amount===lowOf(selBid); const won=selBid.awardedTo===qt.vendorId;
                  return <tr key={i} style={{borderBottom:`1px solid ${t.lineSoft}`,background:won?'rgba(30,158,106,.06)':low?'rgba(29,180,232,.04)':'transparent'}}>
                    <td style={{padding:'12px 16px'}}><div style={{display:'flex',alignItems:'center',gap:9}}><span style={{fontWeight:700,color:t.ink}}>{vname(qt.vendorId)}</span>{low&&!won&&<span style={{fontSize:9.5,fontWeight:800,letterSpacing:'.05em',textTransform:'uppercase',color:t.blue,background:'#EAF4FC',padding:'2px 7px',borderRadius:20}}>Low</span>}{won&&<Pill kind="ok">Awarded</Pill>}</div></td>
                    <td style={{padding:'12px 16px',color:t.muted,fontSize:12}}>{qt.note||'—'}</td>
                    <td style={{padding:'12px 16px',textAlign:'right',fontVariantNumeric:'tabular-nums',fontWeight:700,color:low?t.blue:t.ink}}>{fmt$(qt.amount)}</td>
                    <td style={{padding:'12px 16px',textAlign:'right'}}>{selBid.status==='open'
                      ? <button onClick={()=>drToast(DROS.actions.awardBid(selBid.id,qt.vendorId,user))} style={{fontSize:11.5,fontWeight:700,color:'#fff',background:t.blue,border:0,padding:'6px 12px',borderRadius:8,cursor:'pointer'}}>Award</button>
                      : won?<DIcon d={IC.check} s={16} style={{color:t.ok}}/>:''}</td>
                  </tr>;})}
              </tbody>
            </table>
          </Card>}

          {/* all packages */}
          <Card title="Bid Packages" meta={String(bids.length)} pad={false}>
            {bids.map((b,i)=>{ const low=lowOf(b); const on=selBid&&b.id===selBid.id;
              return <div key={b.id} onClick={()=>setSel(b.id)} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 18px',borderBottom:i<bids.length-1?`1px solid ${t.lineSoft}`:'none',cursor:'pointer',background:on?t.cardTint:'transparent'}}>
                <CodeTile code={b.pid} s={30} r={8} fs={10}/>
                <div style={{flex:1,minWidth:0}}><div style={{fontSize:13,fontWeight:700,color:t.ink}}>{b.pkg}</div><div style={{fontSize:11.5,color:t.muted,marginTop:1}}>Due {b.due} · {b.quotes.length} bids{low?` · low ${fmt$(low)}`:''}</div></div>
                {b.status==='awarded'?<Pill kind="ok">Awarded</Pill>:<Pill kind="warn">Open</Pill>}
              </div>;})}
          </Card>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          {selBid && selBid.status==='open' && <Card title="Add a Bid">
            <div style={{display:'flex',flexDirection:'column',gap:11}}>
              <div style={{fontSize:11.5,color:t.muted}}>To <b style={{color:t.ink}}>{selBid.pkg}</b></div>
              <div><label style={lbl}>Vendor</label><select value={q.vendorId} onChange={e=>setQ({...q,vendorId:e.target.value})} style={{...inp,fontWeight:600,color:t.ink,background:'#fff',cursor:'pointer'}}>{subs.map(v=><option key={v.id} value={v.id}>{v.name} · {v.trade}</option>)}</select></div>
              <div style={{display:'flex',gap:10}}>
                <div style={{flex:1}}><label style={lbl}>Amount ($)</label><input type="number" value={q.amount} onChange={e=>setQ({...q,amount:e.target.value})} placeholder="26200" style={inp}/></div>
                <div style={{flex:1.4}}><label style={lbl}>Note</label><input value={q.note} onChange={e=>setQ({...q,note:e.target.value})} placeholder="Inclusions / exclusions" style={inp}/></div>
              </div>
              <button onClick={addQ} style={{background:t.blue,color:'#fff',border:0,borderRadius:10,padding:'11px',fontSize:13.5,fontWeight:700,cursor:'pointer'}}>Log bid</button>
            </div>
          </Card>}

          <Card title="New Bid Package">
            <div style={{display:'flex',flexDirection:'column',gap:11}}>
              <div><label style={lbl}>Package name</label><input value={f.pkg} onChange={e=>setF({...f,pkg:e.target.value})} placeholder="e.g. Roofing — Harbor View" style={inp}/></div>
              <div><label style={lbl}>Project</label><select value={f.pid} onChange={e=>setF({...f,pid:e.target.value})} style={{...inp,fontWeight:600,color:t.ink,background:'#fff',cursor:'pointer'}}>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
              <div style={{display:'flex',gap:10}}>
                <div style={{flex:1}}><label style={lbl}>Cost code</label><input value={f.costCode} onChange={e=>setF({...f,costCode:e.target.value})} placeholder="07-310" style={{...inp,fontFamily:t.fMono}}/></div>
                <div style={{flex:1}}><label style={lbl}>Bids due</label><input value={f.due} onChange={e=>setF({...f,due:e.target.value})} placeholder="Jul 02" style={inp}/></div>
              </div>
              <div><label style={lbl}>Scope</label><input value={f.scope} onChange={e=>setF({...f,scope:e.target.value})} placeholder="Short scope summary" style={inp}/></div>
              <button onClick={create} style={{background:t.blue,color:'#fff',border:0,borderRadius:10,padding:'11px',fontSize:13.5,fontWeight:700,cursor:'pointer'}}>Open package</button>
              <div style={{fontSize:11.5,color:t.muted,textAlign:'center'}}>Awarding a package drafts a subcontract in Commitments automatically.</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

window.BiddingView=BiddingView;
