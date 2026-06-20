/* Home-screen views: Portfolio (owner), My Work (crew/pm), Pipeline.
   Content only — the shell provides chrome. Uses window globals:
   useStore, go, drToast, and the shared primitives. */

const fmtM = n => n>=1e6 ? '$'+(n/1e6).toFixed(2)+'M' : '$'+Math.round(n/1e3)+'K';
const fmt$ = n => '$'+(+n).toLocaleString();
const healthMap = {ok:['On Track','ok'], warn:['Watch','warn'], bad:['At Risk','bad']};
const ago = ts => { const m=Math.round((Date.now()-ts)/60000); if(m<60)return m+'m'; const h=Math.round(m/60); if(h<24)return h+'h'; return Math.round(h/24)+'d'; };

function CodeTile({code, s=30, r=8, fs=11}){
  return <div style={{width:s,height:s,borderRadius:r,background:`linear-gradient(135deg,${DRtok.cyan},${DRtok.blue})`,color:'#fff',display:'grid',placeItems:'center',fontFamily:DRtok.fHead,fontWeight:800,fontSize:fs,flex:'none'}}>{code}</div>;
}

/* ---------------- Portfolio (owner) ---------------- */
function PortfolioView({user}){
  const t=DRtok; const {state}=useStore(); const r=DROS.rollups();
  const rows=[...r.active].sort((a,b)=>({bad:0,warn:1,ok:2}[a.health]-{bad:0,warn:1,ok:2}[b.health]));
  return (
    <div>
      <div style={{marginBottom:18}}>
        <h1 style={{fontFamily:t.fHead,fontWeight:800,fontSize:26,letterSpacing:'-.025em',color:t.ink,margin:0}}>Good morning, {user.name.split(' ')[0]}</h1>
        <div style={{color:t.muted,fontSize:13.5,marginTop:4}}>{r.active.length} active projects · {fmtM(r.contractValue)} under contract · {r.pendingCOs.length+r.atRisk} open items</div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:16}}>
        <Kpi icon={IC.building} label="Active Projects" value={String(r.active.length)} sub="2 closing this month" tint="cyan"/>
        <Kpi icon={IC.dollar} label="Contract Value" value={fmtM(r.contractValue)} tint="gold" sub="across active jobs"/>
        <Kpi icon={IC.dollar} label="Billed to Date" value={r.billedPct+'%'} sub="of contract" tint="ok"/>
        <Kpi icon={IC.alert} label="Needs Decision" value={String(r.pendingCOs.length)} sub="awaiting you" tint="warn"/>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1.62fr 1fr',gap:16}}>
        <Card title="All Projects" meta="click a row to open" pad={false}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:12.5}}>
            <thead><tr>{['Project','Status','Progress','Budget','Due','⚠'].map(h=>
              <th key={h} style={{textAlign:'left',fontSize:10,letterSpacing:'.06em',textTransform:'uppercase',color:t.muted,fontWeight:700,padding:'11px 14px',background:t.cardTint,borderBottom:`1px solid ${t.line}`}}>{h}</th>)}</tr></thead>
            <tbody>
              {rows.map(p=>{ const [hl,hk]=healthMap[p.health]||['—','idle']; const bud=Math.round(p.spent/p.contract*100); const over=p.spent>p.contract;
                return <tr key={p.id} onClick={()=>go({view:'project',pid:p.id})} style={{borderBottom:`1px solid ${t.lineSoft}`,cursor:'pointer'}}
                  onMouseEnter={e=>e.currentTarget.style.background=t.cardTint} onMouseLeave={e=>e.currentTarget.style.background=''}>
                  <td style={{padding:'11px 14px'}}><div style={{display:'flex',alignItems:'center',gap:10}}>
                    <CodeTile code={p.id}/><div><div style={{fontWeight:600,color:t.ink,fontSize:13}}>{p.name}</div>
                    <div style={{fontSize:11,color:t.faint,marginTop:1}}>{p.phase} · {p.pm.split(' ')[0]}</div></div></div></td>
                  <td style={{padding:'11px 14px'}}><Pill kind={hk}>{hl}</Pill></td>
                  <td style={{padding:'11px 14px',minWidth:110}}><div style={{display:'flex',alignItems:'center',gap:8}}><Bar pct={p.pct} h={7}/><span style={{fontWeight:700,color:t.ink,fontSize:12}}>{p.pct}%</span></div></td>
                  <td style={{padding:'11px 14px',minWidth:96}}><div style={{display:'flex',alignItems:'center',gap:8}}><BudgetBar pct={bud} over={over}/><span style={{fontWeight:700,fontSize:12,color:over?t.bad:t.ink2}}>{bud}%</span></div></td>
                  <td style={{padding:'11px 14px',fontSize:12.5,color:t.ink2,fontWeight:600,whiteSpace:'nowrap'}}>{p.due}</td>
                  <td style={{padding:'11px 14px'}}>{p.cos.filter(c=>c.status==='pending').length>0?<span style={{fontWeight:700,fontSize:12,color:p.health==='bad'?t.bad:t.warn}}>{p.cos.filter(c=>c.status==='pending').length}</span>:<span style={{color:t.ok}}><DIcon d={IC.check} s={15}/></span>}</td>
                </tr>;})}
            </tbody>
          </table>
        </Card>
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <Card title="Needs Your Decision" meta={String(r.pendingCOs.length)}>
            {r.pendingCOs.length===0 && <div style={{fontSize:13,color:t.muted,padding:'6px 2px'}}>All clear — nothing waiting on you.</div>}
            {r.pendingCOs.map((c,i)=>(
              <div key={c.id} style={{display:'flex',gap:11,alignItems:'center',padding:'11px 0',borderBottom:i<r.pendingCOs.length-1?`1px solid ${t.lineSoft}`:'none'}}>
                <div style={{...circ(),width:32,height:32,background:c.health==='bad'?t.badBg:t.warnBg,color:c.health==='bad'?t.bad:t.warn,flex:'none'}}><DIcon d={IC.alert} s={16}/></div>
                <div style={{flex:1,minWidth:0}}><div style={{fontSize:12.5,fontWeight:700,color:t.ink}}>{c.code} · {fmt$(c.amt)}</div><div style={{fontSize:11.5,color:t.muted,marginTop:1}}>{c.pname} — {c.desc}</div></div>
                <button onClick={()=>drToast(DROS.actions.approveCO(c.pid,c.id,user))} style={{fontSize:11.5,fontWeight:700,color:'#fff',background:t.blue,border:0,padding:'6px 12px',borderRadius:8,cursor:'pointer'}}>Approve</button>
              </div>
            ))}
          </Card>
          <Card title="Live Activity" meta="today">
            <div style={{display:'flex',flexDirection:'column',gap:13}}>
              {state.activity.slice(0,5).map(a=>(
                <div key={a.id} style={{display:'flex',gap:11,alignItems:'flex-start'}}>
                  <Avatar initials={a.who} s={28}/>
                  <div style={{flex:1}}><div style={{fontSize:12.5,color:t.ink,fontWeight:600}}>{a.text}</div><div style={{fontSize:11.5,color:t.muted,marginTop:1}}>{a.meta}</div></div>
                  <span style={{fontSize:11,color:t.faint,whiteSpace:'nowrap'}}>{ago(a.ts)}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ---------------- My Work (crew / pm) ---------------- */
function MyWorkView({user}){
  const t=DRtok; const {state}=useStore();
  const mine=state.projects.filter(p=>(p.super===user.name||p.pm===user.name)&&['Active','Punch'].includes(p.stage));
  const tasks=[]; mine.forEach(p=>p.tasks.forEach(tk=>{ if(!tk.who||tk.who===user.id) tasks.push({...tk,pid:p.id,pname:p.name}); }));
  const open=tasks.filter(tk=>!tk.done);
  const firstActive=mine.find(p=>p.stage==='Active')||mine[0];
  const dueColor=d=>d==='Today'?[t.bad,t.badBg]:/Tue|Wed|Thu/.test(d)?[t.warn,t.warnBg]:[t.idle,t.idleBg];
  return (
    <div>
      <div style={{marginBottom:16,display:'flex',alignItems:'flex-end',justifyContent:'space-between'}}>
        <div><h1 style={{fontFamily:t.fHead,fontWeight:800,fontSize:26,letterSpacing:'-.025em',color:t.ink,margin:0}}>My Work</h1>
        <div style={{color:t.muted,fontSize:13.5,marginTop:4}}>{mine.length} projects assigned · {open.length} tasks open</div></div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1.5fr 1fr',gap:20}}>
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          {firstActive && <div onClick={()=>go({view:'project',pid:firstActive.id,tab:'Daily Log'})} style={{background:'#fff',border:`1px solid ${t.line}`,borderRadius:14,padding:'15px 17px',display:'flex',alignItems:'center',gap:14,cursor:'pointer',boxShadow:'0 1px 2px rgba(20,33,48,.04)'}}>
            <div style={{width:42,height:42,borderRadius:11,background:'rgba(29,180,232,.10)',display:'grid',placeItems:'center',color:t.blue,flex:'none'}}><DIcon d={IC.doc} s={22}/></div>
            <div style={{flex:1,minWidth:0}}><div style={{fontFamily:t.fHead,fontWeight:700,fontSize:14.5,color:t.ink}}>Daily log not started for {firstActive.name.split(' ')[0]}</div><div style={{fontSize:12.5,color:t.muted,marginTop:2}}>Weather, crew, work done, photos — about 2 min</div></div>
            <div style={{background:t.blue,color:'#fff',padding:'9px 15px',borderRadius:9,fontSize:12.5,fontWeight:700,whiteSpace:'nowrap'}}>Start log</div>
          </div>}
          <Card title="My Tasks" meta={`${open.length} open`} pad={false}>
            {tasks.length===0 && <div style={{fontSize:13,color:t.muted,padding:'16px 18px'}}>No tasks assigned right now.</div>}
            {tasks.map((tk,i)=>{ const [dc,dbg]=dueColor(tk.due);
              return <div key={tk.id} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 18px',borderBottom:i<tasks.length-1?`1px solid ${t.lineSoft}`:'none'}}>
                <button onClick={()=>drToast(DROS.actions.toggleTask(tk.pid,tk.id,user)||'')} style={{width:20,height:20,borderRadius:6,border:`2px solid ${tk.done?t.ok:t.line}`,background:tk.done?t.ok:'#fff',flex:'none',cursor:'pointer',display:'grid',placeItems:'center',padding:0}}>{tk.done&&<DIcon d={IC.check} s={13} style={{color:'#fff'}}/>}</button>
                <div style={{flex:1}}><div style={{fontSize:13.5,fontWeight:600,color:tk.done?t.faint:t.ink,textDecoration:tk.done?'line-through':'none'}}>{tk.title}</div><div style={{fontSize:11.5,color:t.muted,marginTop:1}}>{tk.pname}</div></div>
                {!tk.done&&<span style={{fontSize:11,fontWeight:700,padding:'4px 10px',borderRadius:20,color:dc,background:dbg}}>{tk.due}</span>}
              </div>;})}
          </Card>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <Card title="My Projects" meta={String(mine.length)}>
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              {mine.map(p=>(
                <div key={p.id} onClick={()=>go({view:'project',pid:p.id})} style={{display:'flex',alignItems:'center',gap:12,cursor:'pointer'}}>
                  <CodeTile code={p.id} s={34} r={9} fs={11.5}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><span style={{fontSize:13,fontWeight:600,color:t.ink}}>{p.name}</span><span style={{fontSize:11.5,fontWeight:700,color:t.ink2}}>{p.pct}%</span></div>
                    <div style={{margin:'5px 0 4px'}}><Bar pct={p.pct} h={6}/></div>
                    <div style={{fontSize:11,color:t.faint}}>{p.phase}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card title="Recent on My Projects">
            <div style={{display:'flex',flexDirection:'column',gap:13}}>
              {state.activity.slice(0,4).map(a=>(
                <div key={a.id} style={{display:'flex',gap:11,alignItems:'flex-start'}}>
                  <Avatar initials={a.who} s={28}/>
                  <div style={{flex:1}}><div style={{fontSize:12.5,color:t.ink,fontWeight:600}}>{a.text}</div><div style={{fontSize:11.5,color:t.muted,marginTop:1}}>{a.meta}</div></div>
                  <span style={{fontSize:11,color:t.faint,whiteSpace:'nowrap'}}>{ago(a.ts)}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Pipeline ---------------- */
function PipelineView({user}){
  const t=DRtok; const {state}=useStore();
  const accent={Lead:t.idle,Bidding:t.gold,Active:t.blue,Punch:t.cyan,Closed:t.ok};
  const label={Lead:'Lead',Bidding:'Bidding',Active:'Active',Punch:'Punch / Closeout',Closed:'Closed'};
  const dotFor=h=>h==='ok'?t.ok:h==='warn'?t.warn:h==='bad'?t.bad:t.faint;
  const total=state.projects.reduce((s,p)=>s+p.contract,0);
  const activeVal=state.projects.filter(p=>p.stage==='Active'||p.stage==='Punch').reduce((s,p)=>s+p.contract,0);
  const move=(p,dir)=>{ const i=DROS.STAGES.indexOf(p.stage)+dir; if(i<0||i>=DROS.STAGES.length)return; const ns=DROS.STAGES[i]; drToast(DROS.actions.moveStage(p.id,ns,user)); if(ns==='Closed') go({view:'project',pid:p.id,tab:'Reconciliation'}); };
  return (
    <div>
      <div style={{marginBottom:16,display:'flex',alignItems:'flex-end',justifyContent:'space-between'}}>
        <div><h1 style={{fontFamily:t.fHead,fontWeight:800,fontSize:26,letterSpacing:'-.025em',color:t.ink,margin:0}}>Pipeline</h1>
        <div style={{color:t.muted,fontSize:13.5,marginTop:4}}>Every job, lead to closeout · use ‹ › on a card to advance a stage</div></div>
        <div style={{display:'flex',gap:18}}>
          {[['Pipeline value',fmtM(total)],['Active value',fmtM(activeVal)],['Win rate','58%']].map((s,i)=>(
            <div key={i} style={{textAlign:'right'}}><div style={{fontFamily:t.fDisp,fontWeight:800,fontSize:19,color:t.ink,lineHeight:1}}>{s[1]}</div><div style={{fontSize:11,color:t.muted,fontWeight:600,marginTop:3}}>{s[0]}</div></div>
          ))}
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:12,alignItems:'start'}}>
        {DROS.STAGES.map(stage=>{ const cards=state.projects.filter(p=>p.stage===stage);
          return <div key={stage} style={{background:t.cardTint,border:`1px solid ${t.line}`,borderRadius:14,padding:10,minHeight:340}}>
            <div style={{display:'flex',alignItems:'center',gap:8,padding:'4px 6px 12px'}}>
              <span style={{width:8,height:8,borderRadius:'50%',background:accent[stage]}}/>
              <span style={{fontFamily:t.fHead,fontWeight:700,fontSize:12.5,color:t.ink}}>{label[stage]}</span>
              <span style={{marginLeft:'auto',fontSize:11,fontWeight:700,color:t.muted,background:'#fff',border:`1px solid ${t.line}`,borderRadius:20,padding:'1px 8px'}}>{cards.length}</span>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:9}}>
              {cards.map(c=>{ const idx=DROS.STAGES.indexOf(stage);
                return <div key={c.id} style={{background:'#fff',border:`1px solid ${t.line}`,borderRadius:11,padding:'11px 12px',boxShadow:'0 1px 2px rgba(20,33,48,.04)'}}>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                    <CodeTile code={c.id} s={26} r={7} fs={9.5}/>
                    {c.health&&<span style={{width:8,height:8,borderRadius:'50%',background:dotFor(c.health),marginLeft:'auto'}}/>}
                  </div>
                  <div onClick={()=>go({view:'project',pid:c.id})} style={{cursor:'pointer'}}>
                    <div style={{fontSize:12.5,fontWeight:700,color:t.ink,lineHeight:1.25}}>{c.name}</div>
                    <div style={{fontSize:11,color:t.muted,margin:'3px 0 8px'}}>{c.phase}{c.pct>0&&c.pct<100?` · ${c.pct}%`:''}</div>
                    {c.pct>0&&c.pct<100&&<div style={{marginBottom:8}}><Bar pct={c.pct} h={5}/></div>}
                  </div>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:2}}>
                    <span style={{fontFamily:t.fHead,fontWeight:800,fontSize:12.5,color:t.ink2}}>{fmtM(c.contract)}</span>
                    <div style={{display:'flex',gap:4}}>
                      <button disabled={idx===0} onClick={()=>move(c,-1)} style={{width:22,height:22,borderRadius:6,border:`1px solid ${t.line}`,background:'#fff',color:idx===0?t.line:t.muted,cursor:idx===0?'default':'pointer',fontSize:13,lineHeight:1,padding:0}}>‹</button>
                      <button disabled={idx===4} onClick={()=>move(c,1)} style={{width:22,height:22,borderRadius:6,border:`1px solid ${t.line}`,background:'#fff',color:idx===4?t.line:t.blue,cursor:idx===4?'default':'pointer',fontSize:13,lineHeight:1,padding:0}}>›</button>
                    </div>
                  </div>
                </div>;})}
            </div>
          </div>;})}
      </div>
    </div>
  );
}

Object.assign(window,{PortfolioView,MyWorkView,PipelineView,CodeTile,fmtM,fmt$,ago,healthMap});
