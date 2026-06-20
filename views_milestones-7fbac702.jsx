/* Milestone Tracking — On-Time/Late Analysis */
function MilestoneTracking(){
  const [milestones, setMilestones] = React.useState([
    {id:'M1',name:'Site Prep & Permits',planned:'2026-07-15',actual:'2026-07-12',status:'complete',variance:-3},
    {id:'M2',name:'Foundation & Concrete',planned:'2026-09-30',actual:'2026-10-02',status:'complete',variance:2},
    {id:'M3',name:'Framing & Rough-In',planned:'2026-11-30',actual:'2026-11-28',status:'complete',variance:-2},
    {id:'M4',name:'MEP Systems',planned:'2027-01-31',actual:null,status:'in-progress',variance:null},
    {id:'M5',name:'Drywall & Interior',planned:'2027-04-30',actual:null,status:'pending',variance:null},
  ]);

  const onTime = milestones.filter(m=>m.variance===0).length;
  const early = milestones.filter(m=>m.variance&&m.variance<0).length;
  const late = milestones.filter(m=>m.variance&&m.variance>0).length;

  return React.createElement('div',{className:'view'},
    React.createElement('div',{className:'pg-grid'},
      React.createElement('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:16,marginBottom:24}},
        React.createElement('div',{className:'card'},
          React.createElement('div',{style:{fontSize:11,color:'var(--muted)',fontWeight:600,textTransform:'uppercase'}},
            '📅 On Time'
          ),
          React.createElement('div',{style:{fontSize:24,fontWeight:700,marginTop:8,color:'var(--success)'}},
            onTime
          )
        ),
        React.createElement('div',{className:'card'},
          React.createElement('div',{style:{fontSize:11,color:'var(--muted)',fontWeight:600,textTransform:'uppercase'}},
            '⏱️ Early'
          ),
          React.createElement('div',{style:{fontSize:24,fontWeight:700,marginTop:8,color:'var(--brand-cyan)'}},
            early
          )
        ),
        React.createElement('div',{className:'card'},
          React.createElement('div',{style:{fontSize:11,color:'var(--muted)',fontWeight:600,textTransform:'uppercase'}},
            '⚠️ Late'
          ),
          React.createElement('div',{style:{fontSize:24,fontWeight:700,marginTop:8,color:'var(--err)'}},
            late
          )
        )
      ),

      React.createElement('div',{className:'tbl-wrap'},
        React.createElement('table',{className:'tbl'},
          React.createElement('thead',null,
            React.createElement('tr',null,
              React.createElement('th',null,'Milestone'),
              React.createElement('th',null,'Planned'),
              React.createElement('th',null,'Actual'),
              React.createElement('th',{textAlign:'center'},'Variance'),
              React.createElement('th',null,'Status')
            )
          ),
          React.createElement('tbody',null,
            milestones.map(m=>React.createElement('tr',{key:m.id},
              React.createElement('td',{fontWeight:600},m.name),
              React.createElement('td',{color:'var(--muted)',fontSize:12},new Date(m.planned).toLocaleDateString()),
              React.createElement('td',{color:'var(--muted)',fontSize:12},m.actual?new Date(m.actual).toLocaleDateString():'—'),
              React.createElement('td',{textAlign:'center',fontWeight:600,color:m.variance===null?'var(--muted)':m.variance<0?'var(--success)':m.variance>0?'var(--err)':'var(--ink)'},
                m.variance===null?'—':m.variance<0?m.variance+' days':'+ '+m.variance+' days'
              ),
              React.createElement('td',null,
                React.createElement('span',{style:{background:m.status==='complete'?'var(--success)':m.status==='in-progress'?'var(--brand-cyan)':'var(--muted)',color:'white',padding:'2px 8px',borderRadius:3,fontSize:10,fontWeight:600}},
                  m.status.charAt(0).toUpperCase()+m.status.slice(1)
                )
              )
            ))
          )
        )
      )
    )
  );
}

Object.assign(window,{MilestoneTracking});
