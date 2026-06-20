/* Concept B — "My Work" personal home
   Role-based. Every person lands on their own work: tasks due, today's
   daily-log prompt, their projects, recent updates. Shown as the
   Superintendent (Mike) — the field/operational view. Owner gets the
   same shell but with a "Portfolio" tab. Phone-friendly card stream. */

function ConceptB(){
  const t = DRtok;
  const tasks = [
    ['Confirm drywall delivery','Longleaf · today','bad','Today'],
    ['Walk MEP rough-in w/ inspector','Riverview · today 2pm','warn','Today'],
    ['Close punch item #41','Cedar Park','warn','Today'],
    ['Order cabinet hardware','Longleaf','idle','Tue'],
    ['Submit weekly crew hours','All projects','idle','Fri'],
  ];
  return (
    <Chrome active="My Work" crumb="My Work" user="Mike Torres" role="Superintendent" initials="MT"
      project="3 projects assigned" extraMain={[{id:'My Work', icon:IC.list}]}>
      <div style={{marginBottom:16,display:'flex',alignItems:'flex-end',justifyContent:'space-between'}}>
        <div>
          <h1 style={{fontFamily:t.fHead,fontWeight:800,fontSize:26,letterSpacing:'-.025em',color:t.ink,margin:0}}>My Work</h1>
          <div style={{color:t.muted,fontSize:13.5,marginTop:4}}>Tuesday, June 18 · 3 projects assigned · 5 tasks today</div>
        </div>
        <div style={{display:'flex',gap:9}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:7,background:t.blue,color:'#fff',padding:'9px 15px',borderRadius:10,fontSize:13,fontWeight:600,boxShadow:'0 1px 2px rgba(21,131,199,.4)'}}>
            <DIcon d={IC.plus} s={16}/>Log Today
          </div>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1.5fr 1fr',gap:16}}>
        {/* left: tasks + daily log prompt */}
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          {/* daily log call-to-action */}
          <div style={{background:`linear-gradient(135deg,${t.navyDeep},${t.navy})`,borderRadius:16,padding:'18px 20px',color:'#fff',display:'flex',alignItems:'center',gap:16}}>
            <div style={{width:46,height:46,borderRadius:12,background:'rgba(29,180,232,.18)',display:'grid',placeItems:'center',color:t.cyan,flex:'none'}}><DIcon d={IC.doc} s={24}/></div>
            <div style={{flex:1}}>
              <div style={{fontFamily:t.fHead,fontWeight:700,fontSize:15}}>Daily log not started for Longleaf</div>
              <div style={{fontSize:12.5,color:'#9FB3C6',marginTop:2}}>Weather, crew count, work completed, photos — 2 minutes</div>
            </div>
            <div style={{background:t.cyan,color:t.navyDeep,padding:'9px 14px',borderRadius:9,fontSize:12.5,fontWeight:700,whiteSpace:'nowrap'}}>Start log</div>
          </div>

          <Card title="My Tasks" meta="5 open" pad={false}>
            <div>
              {tasks.map((tk,i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 18px',borderBottom:i<tasks.length-1?`1px solid ${t.lineSoft}`:'none'}}>
                  <div style={{width:19,height:19,borderRadius:6,border:`2px solid ${t.line}`,flex:'none'}}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13.5,fontWeight:600,color:t.ink}}>{tk[0]}</div>
                    <div style={{fontSize:11.5,color:t.muted,marginTop:1}}>{tk[1]}</div>
                  </div>
                  <span style={{fontSize:11,fontWeight:700,padding:'4px 10px',borderRadius:20,
                    color:tk[2]==='bad'?t.bad:tk[2]==='warn'?t.warn:t.idle,
                    background:tk[2]==='bad'?t.badBg:tk[2]==='warn'?t.warnBg:t.idleBg}}>{tk[3]}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* right: my projects + recent */}
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <Card title="My Projects" meta="3">
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              {[
                ['LON','Longleaf Amenity','Drywall',62,'ok'],
                ['RVO','Riverview Office','MEP Rough-In',38,'warn'],
                ['CED','Cedar Park Clubhouse','Punch List',91,'ok'],
              ].map((p,i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',gap:12}}>
                  <div style={{width:34,height:34,borderRadius:9,background:`linear-gradient(135deg,${t.cyan},${t.blue})`,color:'#fff',display:'grid',placeItems:'center',fontFamily:t.fHead,fontWeight:800,fontSize:11.5,flex:'none'}}>{p[0]}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <span style={{fontSize:13,fontWeight:600,color:t.ink}}>{p[1]}</span>
                      <span style={{fontSize:11.5,fontWeight:700,color:t.ink2}}>{p[3]}%</span>
                    </div>
                    <div style={{margin:'5px 0 4px'}}><Bar pct={p[3]} h={6}/></div>
                    <div style={{fontSize:11,color:t.faint}}>{p[2]}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Recent on My Projects">
            <div style={{display:'flex',flexDirection:'column',gap:13}}>
              {[
                ['SJ','Sarah approved your RFI','Longleaf · drywall spec','25m'],
                ['LC','Hours approved','Week of Jun 9','2h'],
                ['DW','David approved CO-012','Riverview · $9,400','Yesterday'],
              ].map((a,i)=>(
                <div key={i} style={{display:'flex',gap:11,alignItems:'flex-start'}}>
                  <Avatar initials={a[0]} s={28}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12.5,color:t.ink,fontWeight:600}}>{a[1]}</div>
                    <div style={{fontSize:11.5,color:t.muted,marginTop:1}}>{a[2]}</div>
                  </div>
                  <span style={{fontSize:11,color:t.faint,whiteSpace:'nowrap'}}>{a[3]}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Chrome>
  );
}
window.ConceptB = ConceptB;
