/* Meetings — agendas, minutes and action items. Action items are
   checkable and roll up to the KPIs. Wired to DROS.actions.createMeeting
   / addAgendaItem / setAgendaNotes / toggleAgendaItem / addActionItem /
   toggleActionItem. */
const {useState:useStateMt} = React;

function MeetingsView({user}){
  const t=DRtok; const {state}=useStore();
  const meetings=state.meetings||[];
  const projects=state.projects.filter(p=>!['Lead'].includes(p.stage));
  const [sel,setSel]=useStateMt(()=> (meetings[0]||{}).id || null);
  const [f,setF]=useStateMt({title:'',pid:(projects[0]||{}).id,time:'',topic:''});
  const [ag,setAg]=useStateMt('');
  const [act,setAct]=useStateMt({text:'',who:''});

  const allActions=[]; meetings.forEach(m=>m.actions.forEach(a=>allActions.push(a)));
  const openActions=allActions.filter(a=>!a.done).length;
  const m=meetings.find(x=>x.id===sel)||meetings[0];

  const create=()=>{ if(!f.title.trim()){drToast('Title the meeting');return;} drToast(DROS.actions.createMeeting(f,user)); setF({...f,title:'',time:'',topic:''}); setTimeout(()=>{ const nm=(DROS.state.meetings||[])[0]; if(nm) setSel(nm.id); },0); };
  const addAg=()=>{ if(!ag.trim()||!m)return; DROS.actions.addAgendaItem(m.id,ag,user); setAg(''); };
  const addAct=()=>{ if(!act.text.trim()||!m)return; DROS.actions.addActionItem(m.id,act.text,act.who,user); setAct({text:'',who:''}); };

  const inp={width:'100%',border:`1px solid ${t.line}`,borderRadius:9,padding:'9px 12px',fontSize:13.5,fontFamily:t.fBody,outline:'none'};
  const lbl={fontSize:11.5,fontWeight:700,color:t.muted,display:'block',marginBottom:5};

  return (
    <div>
      <PageHead title="Meetings" sub={`${meetings.length} meetings · ${openActions} open action item${openActions===1?'':'s'}`}/>

      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:16}}>
        <Kpi icon={IC.user} label="Meetings" value={String(meetings.length)} tint="cyan"/>
        <Kpi icon={IC.alert} label="Open Actions" value={String(openActions)} tint="warn"/>
        <Kpi icon={IC.check} label="Closed Actions" value={String(allActions.length-openActions)} tint="ok"/>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1.85fr',gap:16,alignItems:'start'}}>
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <Card title="All Meetings" meta={String(meetings.length)} pad={false}>
            {meetings.map((mt,i)=>{ const on=m&&mt.id===m.id; const openA=mt.actions.filter(a=>!a.done).length;
              return <div key={mt.id} onClick={()=>setSel(mt.id)} style={{display:'flex',alignItems:'center',gap:11,padding:'12px 16px',borderBottom:i<meetings.length-1?`1px solid ${t.lineSoft}`:'none',cursor:'pointer',background:on?t.cardTint:'transparent'}}>
                <CodeTile code={mt.pid} s={30} r={8} fs={10}/>
                <div style={{flex:1,minWidth:0}}><div style={{fontSize:12.5,fontWeight:700,color:t.ink,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{mt.title}</div><div style={{fontSize:11,color:t.muted,marginTop:1}}>{mt.date} · {mt.time}</div></div>
                {openA>0 && <span style={{fontSize:11,fontWeight:700,color:t.warn,background:t.warnBg,borderRadius:20,padding:'2px 8px'}}>{openA}</span>}
              </div>;})}
          </Card>

          <Card title="New Meeting">
            <div style={{display:'flex',flexDirection:'column',gap:11}}>
              <div><label style={lbl}>Title</label><input value={f.title} onChange={e=>setF({...f,title:e.target.value})} placeholder="e.g. Weekly OAC" style={inp}/></div>
              <div style={{display:'flex',gap:10}}>
                <div style={{flex:1.4}}><label style={lbl}>Project</label><select value={f.pid} onChange={e=>setF({...f,pid:e.target.value})} style={{...inp,fontWeight:600,color:t.ink,background:'#fff',cursor:'pointer'}}>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
                <div style={{flex:1}}><label style={lbl}>Time</label><input value={f.time} onChange={e=>setF({...f,time:e.target.value})} placeholder="9:00 AM" style={inp}/></div>
              </div>
              <div><label style={lbl}>First agenda topic</label><input value={f.topic} onChange={e=>setF({...f,topic:e.target.value})} placeholder="Optional" style={inp}/></div>
              <button onClick={create} style={{background:t.blue,color:'#fff',border:0,borderRadius:10,padding:'11px',fontSize:13.5,fontWeight:700,cursor:'pointer'}}>Add meeting</button>
            </div>
          </Card>
        </div>

        {/* detail */}
        {m ? <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <Card>
            <div style={{display:'flex',alignItems:'flex-start',gap:14}}>
              <CodeTile code={m.pid} s={44} r={11} fs={14}/>
              <div style={{flex:1}}>
                <div style={{fontFamily:t.fHead,fontWeight:800,fontSize:18,color:t.ink}}>{m.title}</div>
                <div style={{fontSize:12.5,color:t.muted,marginTop:3}}>{DROS.P(m.pid)?.name||m.pid} · {m.date} · {m.time}</div>
                <div style={{display:'flex',gap:6,marginTop:10,flexWrap:'wrap'}}>
                  {m.attendees.map((a,i)=>(<span key={i} style={{display:'inline-flex',alignItems:'center',gap:6,background:t.cardTint,border:`1px solid ${t.line}`,borderRadius:20,padding:'3px 10px 3px 4px',fontSize:11.5,fontWeight:600,color:t.ink2}}><Avatar initials={DROS.initialsOf(a)} s={20}/>{a}</span>))}
                  {m.attendees.length===0 && <span style={{fontSize:12,color:t.faint}}>No attendees listed</span>}
                </div>
              </div>
            </div>
          </Card>

          <Card title="Agenda & Minutes" meta={`${m.agenda.filter(a=>a.done).length}/${m.agenda.length} covered`}>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {m.agenda.length===0 && <div style={{fontSize:13,color:t.muted}}>No agenda items yet.</div>}
              {m.agenda.map((a,idx)=>(
                <div key={idx} style={{display:'flex',gap:11,alignItems:'flex-start',padding:'11px 12px',border:`1px solid ${t.line}`,borderRadius:11,background:a.done?t.cardTint:'#fff'}}>
                  <button onClick={()=>DROS.actions.toggleAgendaItem(m.id,idx)} title="Mark covered" style={{width:20,height:20,borderRadius:6,border:`2px solid ${a.done?t.ok:t.line}`,background:a.done?t.ok:'#fff',flex:'none',cursor:'pointer',display:'grid',placeItems:'center',padding:0,marginTop:1}}>{a.done&&<DIcon d={IC.check} s={13} style={{color:'#fff'}}/>}</button>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13.5,fontWeight:700,color:t.ink,textDecoration:a.done?'line-through':'none'}}>{a.topic}</div>
                    <input value={a.notes} onChange={e=>DROS.actions.setAgendaNotes(m.id,idx,e.target.value)} placeholder="Add minutes…" style={{width:'100%',border:0,outline:'none',fontSize:12.5,color:t.ink2,fontFamily:t.fBody,background:'transparent',marginTop:3,padding:0}}/>
                  </div>
                </div>
              ))}
              <div style={{display:'flex',gap:8}}>
                <input value={ag} onChange={e=>setAg(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addAg()} placeholder="Add agenda topic…" style={inp}/>
                <button onClick={addAg} style={{background:'#fff',color:t.blue,border:`1px solid ${t.line}`,borderRadius:9,padding:'9px 16px',fontSize:13,fontWeight:700,cursor:'pointer',flex:'none'}}>Add</button>
              </div>
            </div>
          </Card>

          <Card title="Action Items" meta={`${m.actions.filter(a=>!a.done).length} open`}>
            <div style={{display:'flex',flexDirection:'column',gap:9}}>
              {m.actions.length===0 && <div style={{fontSize:13,color:t.muted}}>No action items yet.</div>}
              {m.actions.map(a=>(
                <div key={a.id} style={{display:'flex',gap:11,alignItems:'center',padding:'10px 12px',border:`1px solid ${t.line}`,borderRadius:10,opacity:a.done?.6:1}}>
                  <button onClick={()=>DROS.actions.toggleActionItem(m.id,a.id)} style={{width:20,height:20,borderRadius:6,border:`2px solid ${a.done?t.ok:t.line}`,background:a.done?t.ok:'#fff',flex:'none',cursor:'pointer',display:'grid',placeItems:'center',padding:0}}>{a.done&&<DIcon d={IC.check} s={13} style={{color:'#fff'}}/>}</button>
                  <div style={{flex:1,fontSize:13,fontWeight:600,color:a.done?t.faint:t.ink,textDecoration:a.done?'line-through':'none'}}>{a.text}</div>
                  {a.who && <span style={{fontSize:11,fontWeight:700,color:t.blue,background:'#EAF4FC',borderRadius:20,padding:'3px 10px',whiteSpace:'nowrap'}}>{a.who}</span>}
                </div>
              ))}
              <div style={{display:'flex',gap:8}}>
                <input value={act.text} onChange={e=>setAct({...act,text:e.target.value})} onKeyDown={e=>e.key==='Enter'&&addAct()} placeholder="New action item…" style={{...inp,flex:2}}/>
                <input value={act.who} onChange={e=>setAct({...act,who:e.target.value})} placeholder="Owner" style={{...inp,flex:1}}/>
                <button onClick={addAct} style={{background:t.blue,color:'#fff',border:0,borderRadius:9,padding:'9px 16px',fontSize:13,fontWeight:700,cursor:'pointer',flex:'none'}}>Add</button>
              </div>
            </div>
          </Card>
        </div> : <Card><div style={{fontSize:13,color:t.muted,padding:'8px 0'}}>No meeting selected.</div></Card>}
      </div>
    </div>
  );
}

window.MeetingsView=MeetingsView;
