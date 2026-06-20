/* Gantt Chart View */
function GanttChart(){
  const P = window.PROJECT || {bids:[]};
  
  // Sample milestone data (will be replaced with Firebase data)
  const milestones = [
    {id:'m1', name:'Site Prep & Permits',       start:'2026-06-01', end:'2026-07-15', progress:100, status:'done'},
    {id:'m2', name:'Foundation & Concrete',     start:'2026-07-01', end:'2026-09-30', progress:100, status:'done'},
    {id:'m3', name:'Framing & Rough-In',        start:'2026-09-15', end:'2026-11-30', progress:100, status:'done'},
    {id:'m4', name:'MEP Systems',               start:'2026-11-01', end:'2027-01-31', progress:85, status:'in-progress'},
    {id:'m5', name:'Drywall & Interior Finish', start:'2027-01-15', end:'2027-04-30', progress:45, status:'in-progress'},
    {id:'m6', name:'Exterior & Landscaping',    start:'2027-03-01', end:'2027-06-15', progress:10, status:'pending'},
    {id:'m7', name:'Final Inspections',         start:'2027-06-01', end:'2027-07-15', progress:0, status:'pending'},
    {id:'m8', name:'Punch List & Closeout',     start:'2027-07-01', end:'2027-08-31', progress:0, status:'pending'},
  ];

  const startDate = new Date(2026, 5, 1); // June 2026
  const endDate = new Date(2027, 8, 30);   // Sept 2027
  const totalDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
  const today = new Date();
  const daysElapsed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
  const todayPercent = Math.max(0, Math.min(100, (daysElapsed / totalDays) * 100));

  const getBarPercent = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    const mStart = Math.floor((s - startDate) / (1000 * 60 * 60 * 24));
    const mEnd = Math.floor((e - startDate) / (1000 * 60 * 60 * 24));
    const offset = (mStart / totalDays) * 100;
    const width = ((mEnd - mStart) / totalDays) * 100;
    return {offset, width};
  };

  const statusColor = {done:'var(--success)',pending:'var(--muted)',warning:'var(--warn)','in-progress':'var(--brand-cyan)'};

  return React.createElement('div',{className:'view'},
    React.createElement('div',{className:'pg-grid'},
      React.createElement('div',{className:'gantt-container'},
        React.createElement('div',{className:'gantt-head'},
          React.createElement('h2',null,'Construction Schedule — Longleaf Amenity'),
          React.createElement('p',{style:{color:'var(--muted)',fontSize:13,marginTop:4}},'Project Timeline: June 2026 — August 2027 · '+totalDays+' days')
        ),

        React.createElement('div',{className:'gantt-wrapper'},
          React.createElement('div',{className:'gantt-sidebar'},
            React.createElement('div',{className:'gantt-header-row'},
              React.createElement('div',{className:'gantt-name-col'},'Milestone')
            ),
            milestones.map(m=>
              React.createElement('div',{key:m.id,className:'gantt-row',style:{borderBottom:'1px solid var(--border)'}},
                React.createElement('div',{className:'gantt-name-col',title:m.name},
                  React.createElement('div',{style:{fontSize:12,fontWeight:600,color:'var(--ink)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}},m.name),
                  React.createElement('div',{style:{fontSize:10,color:'var(--muted)',marginTop:2}},
                    new Date(m.start).toLocaleDateString('en-US',{month:'short',day:'numeric'})+' → '+
                    new Date(m.end).toLocaleDateString('en-US',{month:'short',day:'numeric'})
                  )
                )
              )
            )
          ),

          React.createElement('div',{className:'gantt-chart'},
            React.createElement('div',{className:'gantt-header-row'},
              React.createElement('div',{className:'gantt-chart-col',style:{position:'relative',height:40}},
                React.createElement('div',{style:{display:'flex',justifyContent:'space-between',fontSize:10,fontWeight:600,color:'var(--muted)',height:'100%',alignItems:'center'}},
                  React.createElement('span',null,'Jun'),
                  React.createElement('span',null,'Sep'),
                  React.createElement('span',null,'Dec'),
                  React.createElement('span',null,'Mar'),
                  React.createElement('span',null,'Jun'),
                  React.createElement('span',null,'Aug')
                )
              )
            ),

            React.createElement('div',{style:{position:'relative'}},
              React.createElement('div',{style:{position:'absolute',left:todayPercent+'%',top:0,bottom:0,width:2,background:'var(--err)',zIndex:10}}),
              React.createElement('div',{style:{position:'absolute',left:'calc('+todayPercent+'% + 8px)',top:4,fontSize:9,color:'var(--err)',fontWeight:700,zIndex:10}},'TODAY'),

              milestones.map(m=>{
                const {offset,width} = getBarPercent(m.start, m.end);
                const isComplete = m.status === 'done';
                const isActive = m.status === 'in-progress';
                return React.createElement('div',{key:m.id,className:'gantt-row',style:{borderBottom:'1px solid var(--border)'}},
                  React.createElement('div',{className:'gantt-chart-col'},
                    React.createElement('div',{style:{position:'relative',height:32,marginTop:4}},
                      React.createElement('div',{style:{
                        position:'absolute',
                        left:offset+'%',
                        width:width+'%',
                        height:'100%',
                        background:isComplete?'var(--success)':isActive?'var(--brand-cyan)':'var(--muted)',
                        borderRadius:2,
                        opacity:isComplete?1:0.7,
                        display:'flex',
                        alignItems:'center',
                        paddingLeft:8,
                        color:'white',
                        fontSize:10,
                        fontWeight:600,
                        overflow:'hidden'
                      }},
                        m.progress > 10 && React.createElement('span',null,m.progress+'%')
                      )
                    )
                  )
                );
              })
            )
          )
        ),

        React.createElement('div',{style:{marginTop:32,display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:16}},
          React.createElement('div',{className:'card',style:{border:'1px solid var(--border)'}},
            React.createElement('h4',{style:{fontSize:12,fontWeight:700,color:'var(--muted)',textTransform:'uppercase',letterSpacing:'.05em'}},
              React.createElement('span',{style:{display:'inline-block',width:8,height:8,background:'var(--success)',borderRadius:'50%',marginRight:6}}),
              'Completed'
            ),
            React.createElement('p',{style:{fontSize:13,fontWeight:600,marginTop:8}},
              milestones.filter(m=>m.status==='done').length+' of '+milestones.length+' milestones'
            )
          ),
          React.createElement('div',{className:'card',style:{border:'1px solid var(--border)'}},
            React.createElement('h4',{style:{fontSize:12,fontWeight:700,color:'var(--muted)',textTransform:'uppercase',letterSpacing:'.05em'}},
              React.createElement('span',{style:{display:'inline-block',width:8,height:8,background:'var(--brand-cyan)',borderRadius:'50%',marginRight:6}}),
              'In Progress'
            ),
            React.createElement('p',{style:{fontSize:13,fontWeight:600,marginTop:8}},
              milestones.filter(m=>m.status==='in-progress').length+' active'
            )
          ),
          React.createElement('div',{className:'card',style:{border:'1px solid var(--border)'}},
            React.createElement('h4',{style:{fontSize:12,fontWeight:700,color:'var(--muted)',textTransform:'uppercase',letterSpacing:'.05em'}},
              React.createElement('span',{style:{display:'inline-block',width:8,height:8,background:'var(--muted)',borderRadius:'50%',marginRight:6}}),
              'Pending'
            ),
            React.createElement('p',{style:{fontSize:13,fontWeight:600,marginTop:8}},
              milestones.filter(m=>m.status==='pending').length+' upcoming'
            )
          )
        )
      )
    )
  );
}

Object.assign(window,{GanttChart});
