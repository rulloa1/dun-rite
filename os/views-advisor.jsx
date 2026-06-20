/* Profit Advisor — OWNER ONLY. Turns the live portfolio into concrete
   "money moves" (computed from the store) and a Claude-powered chat that
   reasons over the same data. Gated to role==='owner' by the shell. */
const {useState:useStateAdv, useRef:useRefAdv} = React;

const ADV_SYSTEM = "You are a sharp, plain-spoken profit advisor for the OWNER of DunRite Construction Group, a general contractor. Use ONLY the portfolio data provided — reference real project names and dollar figures. Give specific, prioritized, money-focused advice (ways to bill faster, recover margin, win work, cut risk). Be concise: short sentences, lead with the dollars, no filler, no disclaimers.";

function advMoves(state){
  const inv=state.invoices||[];
  const draft=inv.filter(v=>v.status==='draft'); const draftSum=draft.reduce((a,v)=>a+v.amt,0);
  const sent=inv.filter(v=>v.status==='sent'); const sentSum=sent.reduce((a,v)=>a+v.amt,0);
  let coSum=0, coCount=0; state.projects.forEach(p=>p.cos.forEach(c=>{ if(c.status==='pending'){coSum+=c.amt;coCount++;} }));
  const over=state.projects.filter(p=>p.spent>p.contract); const overSum=over.reduce((a,p)=>a+(p.spent-p.contract),0);
  const pipe=state.projects.filter(p=>['Lead','Bidding'].includes(p.stage)); const pipeSum=pipe.reduce((a,p)=>a+p.contract,0);
  const moves=[];
  if(draftSum>0) moves.push({id:'draft',icon:IC.receipt,tint:['rgba(29,180,232,.10)',DRtok.blue],amount:draftSum,title:'Send drafted invoices',detail:`${draft.length} invoice${draft.length>1?'s':''} drafted but not sent — bill now to pull cash forward.`,cta:'Open Invoices',view:'invoices'});
  if(coSum>0) moves.push({id:'co',icon:IC.edit,tint:['rgba(208,149,39,.12)',DRtok.gold],amount:coSum,title:'Approve pending change orders',detail:`${coCount} change order${coCount>1?'s':''} awaiting sign-off — billable scope and margin sitting idle.`,cta:'Review COs',view:'changeorders'});
  if(sentSum>0) moves.push({id:'ar',icon:IC.dollar,tint:['rgba(224,138,30,.12)',DRtok.warn],amount:sentSum,title:'Collect outstanding A/R',detail:`${sent.length} invoice${sent.length>1?'s':''} sent and unpaid — follow up to close the cash gap.`,cta:'Open Invoices',view:'invoices'});
  if(overSum>0) moves.push({id:'over',icon:IC.alert,tint:['rgba(208,73,74,.12)',DRtok.bad],amount:overSum,title:'Recover cost overruns',detail:`${over.map(p=>p.name.split(' ').slice(0,2).join(' ')).join(', ')} over contract — push change orders to recover it.`,cta:'See Budget',view:'budget'});
  if(pipeSum>0) moves.push({id:'pipe',icon:IC.flag,tint:['rgba(30,158,106,.12)',DRtok.ok],amount:pipeSum,title:'Advance the pipeline',detail:`${pipe.length} lead${pipe.length>1?'s':''}/bid${pipe.length>1?'s':''} worth this much — chase them to keep backlog full.`,cta:'Open Pipeline',view:'pipeline'});
  moves.sort((a,b)=>b.amount-a.amount);
  return {moves, onTable: draftSum+coSum+sentSum+overSum};
}

function advContext(state){
  const a=DROS.rollups(); const L=[];
  L.push(`Active contract value ${fmt$(a.contractValue)}, spent ${fmt$(a.spent)} (${a.billedPct}% billed).`);
  state.projects.forEach(p=>{ if(['Active','Punch'].includes(p.stage)){ const m=p.contract-p.spent, mp=p.contract?Math.round(m/p.contract*100):0; L.push(`${p.name}: ${p.stage}, ${p.pct}% done, contract ${fmt$(p.contract)}, spent ${fmt$(p.spent)}, margin ${fmt$(m)} (${mp}%), ${p.cos.filter(c=>c.status==='pending').length} pending CO.`); } });
  const inv=state.invoices||[];
  L.push(`Invoices: ${fmt$(inv.filter(v=>v.status==='draft').reduce((s,v)=>s+v.amt,0))} drafted, ${fmt$(inv.filter(v=>v.status==='sent').reduce((s,v)=>s+v.amt,0))} sent/unpaid, ${fmt$(inv.filter(v=>v.status==='paid').reduce((s,v)=>s+v.amt,0))} collected.`);
  const pipe=state.projects.filter(p=>['Lead','Bidding'].includes(p.stage));
  L.push(`Pipeline: ${pipe.length} leads/bids worth ${fmt$(pipe.reduce((s,p)=>s+p.contract,0))}.`);
  const subs=(state.directory||[]).filter(c=>c.type==='Subcontractor'&&c.status==='active');
  const bad=subs.filter(s=>['expired','missing'].includes(DROS.insuranceStatus(s.id).state)).length;
  if(bad) L.push(`${bad} active subs have expired/missing insurance (liability + work-stoppage risk).`);
  return L.join('\n');
}

function AdvisorView({user}){
  const t=DRtok; const {state}=useStore();
  const {moves, onTable}=advMoves(state);
  const [msgs,setMsgs]=useStateAdv([]);
  const [q,setQ]=useStateAdv('');
  const [busy,setBusy]=useStateAdv(false);
  const scroller=useRefAdv(null);
  const hasAI = typeof window.claude!=='undefined' && window.claude && window.claude.complete;

  const run=async(question)=>{
    if(!question.trim()||busy) return;
    setQ('');
    setMsgs(m=>[...m,{role:'user',text:question}]);
    if(!hasAI){ setMsgs(m=>[...m,{role:'ai',text:'The live advisor runs on your deployed site. Meanwhile, the Money Moves above are computed straight from your data.'}]); return; }
    setBusy(true);
    setMsgs(m=>[...m,{role:'ai',text:'…',pending:true}]);
    try{
      const prompt = ADV_SYSTEM+"\n\nPORTFOLIO DATA:\n"+advContext(state)+"\n\nOWNER ASKS: "+question+"\n\nAdvisor answer:";
      const text = await window.claude.complete(prompt);
      setMsgs(m=>m.filter(x=>!x.pending).concat({role:'ai',text:(text||'').trim()||'No response — try rephrasing.'}));
    }catch(e){
      setMsgs(m=>m.filter(x=>!x.pending).concat({role:'ai',text:'Could not reach the advisor just now. Try again in a moment.'}));
    }
    setBusy(false);
    setTimeout(()=>{ if(scroller.current) scroller.current.scrollTop=scroller.current.scrollHeight; },50);
  };

  const suggestions=['Where am I leaving money on the table this week?','How do I improve margin on the active jobs?','What should I bill or collect first?','Which risks could cost me the most?'];

  return (
    <div>
      <PageHead title="Profit Advisor" sub="Private to the owner · turns your live numbers into the next dollar."/>

      {/* hero: money on the table */}
      <div style={{background:`linear-gradient(135deg,${t.navyDeep},${t.navy})`,borderRadius:18,padding:'22px 24px',color:'#fff',display:'flex',alignItems:'center',gap:20,marginBottom:16,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',right:-40,top:-50,width:300,height:300,borderRadius:'50%',background:`radial-gradient(circle, ${t.cyan}33 0%, transparent 65%)`,pointerEvents:'none'}}/>
        <div style={{width:54,height:54,borderRadius:15,background:'rgba(29,180,232,.18)',display:'grid',placeItems:'center',color:t.cyan,flex:'none'}}><DIcon d={IC.trend} s={28}/></div>
        <div style={{flex:1,position:'relative'}}>
          <div style={{fontSize:12.5,color:'#9FB3C6',fontWeight:600,letterSpacing:'.02em'}}>MONEY ON THE TABLE RIGHT NOW</div>
          <div style={{fontFamily:t.fDisp,fontWeight:800,fontSize:38,letterSpacing:'-.02em',lineHeight:1.05,marginTop:3}}>{fmtM(onTable)}</div>
          <div style={{fontSize:12.5,color:'#AFC0D0',marginTop:5}}>Across unsent invoices, pending change orders, open A/R and recoverable overruns — act on the moves below.</div>
        </div>
      </div>

      {/* money moves */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:14,marginBottom:18}}>
        {moves.map(mv=>(
          <div key={mv.id} style={{background:'#fff',border:`1px solid ${t.line}`,borderRadius:16,padding:'16px 17px',boxShadow:'0 1px 2px rgba(20,33,48,.04)',display:'flex',flexDirection:'column',gap:9}}>
            <div style={{display:'flex',alignItems:'center',gap:11}}>
              <div style={{width:36,height:36,borderRadius:10,background:mv.tint[0],color:mv.tint[1],display:'grid',placeItems:'center',flex:'none'}}><DIcon d={mv.icon} s={18}/></div>
              <div style={{fontFamily:t.fDisp,fontWeight:800,fontSize:22,color:t.ink,letterSpacing:'-.01em'}}>{fmtM(mv.amount)}</div>
            </div>
            <div style={{fontFamily:t.fHead,fontWeight:700,fontSize:14.5,color:t.ink}}>{mv.title}</div>
            <div style={{fontSize:12.5,color:t.muted,lineHeight:1.45,flex:1}}>{mv.detail}</div>
            <button onClick={()=>go({view:mv.view})} style={{alignSelf:'flex-start',display:'inline-flex',alignItems:'center',gap:6,background:t.cardTint,color:t.blue,border:`1px solid ${t.line}`,borderRadius:9,padding:'7px 13px',fontSize:12.5,fontWeight:700,cursor:'pointer'}}>{mv.cta}<DIcon d={IC.arrow} s={14}/></button>
          </div>
        ))}
      </div>

      {/* ===== Phase 3 — Period Rollup + Equipment Rates ===== */}
      {(()=>{ const p3=DROS.phase3(); const rates=state.equipRates||[]; const pos=p3.net>=0;
        const th={textAlign:'left',fontSize:10,letterSpacing:'.05em',textTransform:'uppercase',color:t.muted,fontWeight:700,padding:'8px 13px',background:t.cardTint,borderBottom:`1px solid ${t.line}`};
        const td={padding:'8px 13px',fontSize:12.5,color:t.ink2,borderBottom:`1px solid ${t.lineSoft}`};
        const tdr={...td,textAlign:'right',fontVariantNumeric:'tabular-nums',fontWeight:600,color:t.ink};
        return (
          <div style={{marginBottom:18}}>
            <div style={{display:'flex',alignItems:'center',gap:11,marginBottom:11}}>
              <span style={{display:'inline-flex',alignItems:'center',gap:7,fontSize:10.5,fontWeight:800,letterSpacing:'.04em',textTransform:'uppercase',color:t.cyan,background:'rgba(29,180,232,.10)',borderRadius:20,padding:'4px 11px'}}>Phase 3<span style={{color:t.muted,fontWeight:600,textTransform:'none',letterSpacing:0}}>Period Rollup</span></span>
              <span style={{fontSize:12,color:t.muted}}>{p3.label} · what's actually left after overhead &amp; owner draws.</span>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,alignItems:'start'}}>
              <Card title="Period P&amp;L" meta={`${p3.jobs.length} job${p3.jobs.length!==1?'s':''} in period`} pad={false}>
                <table style={{width:'100%',borderCollapse:'collapse'}}><tbody>
                  <tr><td style={{...td,fontWeight:700,color:t.ink}}>Job profit (Σ Phase 1 net)</td><td style={{...tdr,fontWeight:800}}>{fmt$(p3.jobProfit)}</td></tr>
                  {p3.overheadRows.map(([k,v],i)=>(<tr key={i}><td style={{...td,paddingLeft:24,color:t.muted}}>− {k}</td><td style={tdr}>{fmt$(v)}</td></tr>))}
                  <tr><td style={{...td,color:t.muted}}>− Owner disbursements</td><td style={tdr}>{fmt$(p3.ownerDraws)}</td></tr>
                  <tr><td style={{...td,fontWeight:800,color:t.ink,borderBottom:'none'}}>Net after overhead</td><td style={{...tdr,fontWeight:800,fontSize:14,color:pos?t.ok:t.bad,borderBottom:'none'}}>{fmt$(p3.net)}</td></tr>
                </tbody></table>
                <div style={{padding:'10px 14px',fontSize:11.5,color:t.muted,background:t.cardTint,lineHeight:1.45}}>The gap between job profit and what's left is exactly what Phase 3 exists to show.</div>
              </Card>
              <div style={{display:'flex',flexDirection:'column',gap:16}}>
                <Card title="Tracked vs. Wheeled Skid Steer" meta="period hours × rate" pad={false}>
                  <table style={{width:'100%',borderCollapse:'collapse'}}>
                    <thead><tr><th style={th}>Drive type</th><th style={{...th,textAlign:'right'}}>Hrs</th><th style={{...th,textAlign:'right'}}>$/hr</th><th style={{...th,textAlign:'right'}}>Period cost</th></tr></thead>
                    <tbody>{p3.drive.map(d=>(<tr key={d.id}><td style={{...td,fontWeight:600,color:t.ink}}>{d.machine}</td><td style={tdr}>{d.hours}</td><td style={tdr}>${d.hr}</td><td style={tdr}>{fmt$(d.cost)}</td></tr>))}</tbody>
                  </table>
                </Card>
                <Card title="Equipment Rates · cost to operate / hr" meta="Fuel + R&amp;M + Deprec + Insurance" pad={false}>
                  <table style={{width:'100%',borderCollapse:'collapse'}}>
                    <thead><tr><th style={th}>Machine</th><th style={{...th,textAlign:'right'}}>Fuel</th><th style={{...th,textAlign:'right'}}>R&amp;M</th><th style={{...th,textAlign:'right'}}>Dep</th><th style={{...th,textAlign:'right'}}>Ins</th><th style={{...th,textAlign:'right'}}>$/hr</th></tr></thead>
                    <tbody>{rates.map(r=>(<tr key={r.id}><td style={td}><div style={{fontWeight:600,color:t.ink}}>{r.machine}</div><div style={{fontSize:10.5,color:t.faint}}>{r.mode}</div></td><td style={tdr}>${r.fuel}</td><td style={tdr}>${r.repair}</td><td style={tdr}>${r.deprec}</td><td style={tdr}>${r.ins}</td><td style={{...tdr,color:t.navy,fontWeight:800}}>${DROS.equipHr(r.id)}</td></tr>))}</tbody>
                  </table>
                </Card>
              </div>
            </div>
          </div>
        ); })()}

      {/* advisor chat */}
      <Card title="Ask your advisor" meta={hasAI?'powered by Claude':'available on deploy'}>
        <div ref={scroller} style={{maxHeight:340,overflowY:'auto',display:'flex',flexDirection:'column',gap:12,marginBottom:14,paddingRight:2}}>
          {msgs.length===0 && (
            <div style={{padding:'4px 0 2px'}}>
              <div style={{fontSize:13,color:t.muted,marginBottom:11}}>Ask anything about making or protecting money on your jobs.</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                {suggestions.map((s,i)=>(<button key={i} onClick={()=>run(s)} style={{border:`1px solid ${t.line}`,background:'#fff',color:t.ink2,borderRadius:20,padding:'8px 13px',fontSize:12.5,fontWeight:600,cursor:'pointer',textAlign:'left'}}>{s}</button>))}
              </div>
            </div>
          )}
          {msgs.map((m,i)=> m.role==='user'
            ? <div key={i} style={{alignSelf:'flex-end',maxWidth:'82%',background:t.blue,color:'#fff',borderRadius:'14px 14px 4px 14px',padding:'10px 13px',fontSize:13.5,lineHeight:1.45,fontWeight:500}}>{m.text}</div>
            : <div key={i} style={{alignSelf:'flex-start',maxWidth:'88%',display:'flex',gap:10,alignItems:'flex-start'}}>
                <div style={{width:28,height:28,borderRadius:8,background:'rgba(29,180,232,.14)',color:t.cyan,display:'grid',placeItems:'center',flex:'none',marginTop:1}}><DIcon d={IC.bolt} s={15}/></div>
                <div style={{background:t.cardTint,border:`1px solid ${t.line}`,borderRadius:'14px 14px 14px 4px',padding:'11px 13px',fontSize:13.5,lineHeight:1.5,color:t.ink2,whiteSpace:'pre-wrap'}}>{m.pending?<span style={{color:t.faint}}>Thinking…</span>:m.text}</div>
              </div>)}
        </div>
        <div style={{display:'flex',gap:8,alignItems:'flex-end'}}>
          <textarea value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); run(q); } }} placeholder="Ask your advisor… (Enter to send)" rows={1} style={{flex:1,border:`1px solid ${t.line}`,borderRadius:11,padding:'11px 13px',fontSize:13.5,fontFamily:t.fBody,outline:'none',resize:'none',lineHeight:1.4}}/>
          <button onClick={()=>run("Give me a prioritized 5-point plan for this week to make and protect the most money, with the dollar impact of each.")} disabled={busy} style={{background:'#fff',color:t.blue,border:`1px solid ${t.line}`,borderRadius:11,padding:'11px 13px',fontSize:12.5,fontWeight:700,cursor:busy?'default':'pointer',whiteSpace:'nowrap',flex:'none'}}>This week's plan</button>
          <button onClick={()=>run(q)} disabled={busy||!q.trim()} style={{background:t.blue,color:'#fff',border:0,borderRadius:11,padding:'11px 17px',fontSize:13.5,fontWeight:700,cursor:(busy||!q.trim())?'default':'pointer',opacity:(busy||!q.trim())?.6:1,flex:'none'}}>{busy?'…':'Ask'}</button>
        </div>
      </Card>
    </div>
  );
}

window.AdvisorView=AdvisorView;
