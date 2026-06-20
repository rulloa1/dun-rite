/* Concept A — Portfolio Command Center
   Owner-first. Every project in one health table + portfolio KPIs +
   "needs your decision" queue. The owner's grip-on-everything view. */

const projectsA = [
  {code:'LON', name:'Longleaf Amenity Center', pm:'Sarah J.', health:'ok', pct:62, phase:'Drywall', budget:88, over:false, spent:'$1.42M', total:'$1.61M', due:'Aug 14', issues:2},
  {code:'RVO', name:'Riverview Office Buildout', pm:'Sarah J.', health:'warn', pct:38, phase:'MEP Rough-In', budget:71, over:false, spent:'$612K', total:'$860K', due:'Sep 02', issues:5},
  {code:'MAP', name:'Maple St. Renovation', pm:'Mike T.', health:'bad', pct:24, phase:'Demo', budget:108, over:true, spent:'$281K', total:'$260K', due:'Jul 22', issues:7},
  {code:'CED', name:'Cedar Park Clubhouse', pm:'Sarah J.', health:'ok', pct:91, phase:'Punch List', budget:96, over:false, spent:'$2.05M', total:'$2.14M', due:'Jun 30', issues:1},
  {code:'HBR', name:'Harbor View Townhomes', pm:'Mike T.', health:'ok', pct:12, phase:'Slab', budget:8, over:false, spent:'$190K', total:'$2.40M', due:'Mar 15', issues:0},
];
const healthLabel = {ok:['On Track','ok'], warn:['Watch','warn'], bad:['At Risk','bad']};

function ConceptA(){
  const t = DRtok;
  return (
    <Chrome active="Dashboard" crumb="Executive Summary" project="Portfolio · 5 active">
      <div style={{marginBottom:18}}>
        <h1 style={{fontFamily:t.fHead,fontWeight:800,fontSize:26,letterSpacing:'-.025em',color:t.ink,margin:0}}>Good morning, David</h1>
        <div style={{color:t.muted,fontSize:13.5,marginTop:4}}>5 active projects · $7.27M under contract · 15 open items</div>
      </div>

      {/* portfolio KPIs */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:16}}>
        <Kpi icon={IC.building} label="Active Projects" value="5" sub="2 closing this month" tint="cyan"/>
        <Kpi icon={IC.dollar} label="Contract Value" value="$7.27M" delta="+$1.1M" deltaKind="up" sub="vs last qtr" tint="gold"/>
        <Kpi icon={IC.dollar} label="Billed to Date" value="68%" sub="of contract" tint="ok"/>
        <Kpi icon={IC.alert} label="Needs Decision" value="4" sub="awaiting you" tint="warn"/>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1.62fr 1fr',gap:16}}>
        {/* project health table */}
        <Card title="All Projects" meta="Health · Schedule · Budget" pad={false}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:12.5}}>
            <thead>
              <tr>{['Project','Status','Progress','Budget','Due','⚠'].map((h,i)=>
                <th key={h} style={{textAlign:i>1?'left':'left',fontSize:10,letterSpacing:'.06em',textTransform:'uppercase',color:t.muted,fontWeight:700,padding:'11px 14px',background:t.cardTint,borderBottom:`1px solid ${t.line}`}}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {projectsA.map(p=>{
                const [hl,hk]=healthLabel[p.health];
                return <tr key={p.code} style={{borderBottom:`1px solid ${t.lineSoft}`}}>
                  <td style={{padding:'11px 14px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <div style={{width:30,height:30,borderRadius:8,background:`linear-gradient(135deg,${t.cyan},${t.blue})`,color:'#fff',display:'grid',placeItems:'center',fontFamily:t.fHead,fontWeight:800,fontSize:11,flex:'none'}}>{p.code}</div>
                      <div>
                        <div style={{fontWeight:600,color:t.ink,fontSize:13}}>{p.name}</div>
                        <div style={{fontSize:11,color:t.faint,marginTop:1}}>{p.phase} · {p.pm}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{padding:'11px 14px'}}><Pill kind={hk}>{hl}</Pill></td>
                  <td style={{padding:'11px 14px',minWidth:110}}>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <Bar pct={p.pct} h={7}/>
                      <span style={{fontWeight:700,color:t.ink,fontSize:12,fontVariantNumeric:'tabular-nums'}}>{p.pct}%</span>
                    </div>
                  </td>
                  <td style={{padding:'11px 14px',minWidth:96}}>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <BudgetBar pct={p.budget} over={p.over}/>
                      <span style={{fontWeight:700,fontSize:12,color:p.over?t.bad:t.ink2,fontVariantNumeric:'tabular-nums'}}>{p.budget}%</span>
                    </div>
                  </td>
                  <td style={{padding:'11px 14px',fontSize:12.5,color:t.ink2,fontWeight:600,whiteSpace:'nowrap'}}>{p.due}</td>
                  <td style={{padding:'11px 14px'}}>
                    {p.issues>0
                      ? <span style={{fontWeight:700,fontSize:12,color:p.issues>4?t.bad:t.warn}}>{p.issues}</span>
                      : <span style={{color:t.ok}}><DIcon d={IC.check} s={15}/></span>}
                  </td>
                </tr>;
              })}
            </tbody>
          </table>
        </Card>

        {/* right rail: decisions + activity */}
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <Card title="Needs Your Decision" meta="4">
            <div style={{display:'flex',flexDirection:'column',gap:0}}>
              {[
                ['CO-014 · $18,400','Maple St. — added foundation drainage','bad','approve'],
                ['CO-009 · $6,200','Riverview — electrical upgrade','warn','approve'],
                ['Schedule slip','Maple St. demo +6 days','warn','review'],
                ['Invoice #2231','Cedar Park — ready to bill $214K','blue','review'],
              ].map((r,i)=>(
                <div key={i} style={{display:'flex',gap:11,alignItems:'center',padding:'11px 0',borderBottom:i<3?`1px solid ${t.lineSoft}`:'none'}}>
                  <div style={{...circ(),width:32,height:32,background:r[2]==='bad'?t.badBg:r[2]==='warn'?t.warnBg:'#E3F1FB',color:r[2]==='bad'?t.bad:r[2]==='warn'?t.warn:t.blue,flex:'none'}}>
                    <DIcon d={r[2]==='blue'?IC.dollar:IC.alert} s={16}/>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:12.5,fontWeight:700,color:t.ink}}>{r[0]}</div>
                    <div style={{fontSize:11.5,color:t.muted,marginTop:1}}>{r[1]}</div>
                  </div>
                  <span style={{fontSize:11,fontWeight:700,color:t.blue,background:'#EAF4FC',padding:'5px 10px',borderRadius:8,textTransform:'capitalize'}}>{r[3]}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Live Activity" meta="today">
            <div style={{display:'flex',flexDirection:'column',gap:13}}>
              {[
                ['MT','Mike logged daily report','Longleaf · 12 crew on site','18m'],
                ['SJ','Sarah uploaded 8 photos','Riverview · MEP rough-in','1h'],
                ['MT','Punch item closed','Cedar Park · #41 paint touch-up','2h'],
                ['LC','Invoice drafted','Cedar Park · $214,000','3h'],
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
window.ConceptA = ConceptA;
