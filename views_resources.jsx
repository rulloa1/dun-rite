/* Resource Planning — Crew Allocation */
function ResourcePlanning(){
  const [resources, setResources] = React.useState([
    {id:'R001',name:'John Smith',role:'Foreman',trade:'General',allocated:32,available:8,projects:['Longleaf - Site Prep','Longleaf - Foundation']},
    {id:'R002',name:'Carlos Rodriguez',role:'Carpenter',trade:'Framing',allocated:40,available:0,projects:['Longleaf - Framing']},
    {id:'R003',name:'Mike Johnson',role:'Electrician',trade:'Electrical',allocated:30,available:10,projects:['Longleaf - MEP']},
    {id:'R004',name:'David Lee',role:'Laborer',trade:'General',allocated:35,available:5,projects:['Longleaf - Foundation','Longleaf - Site Prep']},
  ]);

  const totalAllocated = resources.reduce((s,r)=>s+r.allocated,0);
  const totalAvailable = resources.reduce((s,r)=>s+r.available,0);
  const utilizationPercent = Math.round((totalAllocated/(totalAllocated+totalAvailable))*100);

  return React.createElement('div',{className:'view'},
    React.createElement('div',{className:'pg-grid'},
      React.createElement('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:16,marginBottom:24}},
        React.createElement('div',{className:'card'},
          React.createElement('div',{style:{fontSize:11,color:'var(--muted)',fontWeight:600,textTransform:'uppercase'}},
            '👷 Total Crew'
          ),
          React.createElement('div',{style:{fontSize:24,fontWeight:700,marginTop:8}},
            resources.length
          )
        ),
        React.createElement('div',{className:'card'},
          React.createElement('div',{style:{fontSize:11,color:'var(--muted)',fontWeight:600,textTransform:'uppercase'}},
            '📊 Utilization'
          ),
          React.createElement('div',{style:{fontSize:24,fontWeight:700,marginTop:8,color:'var(--brand-cyan)'}},
            utilizationPercent+'%'
          ),
          React.createElement('div',{style:{width:'100%',height:6,background:'var(--border)',borderRadius:3,marginTop:8}},
            React.createElement('div',{style:{width:utilizationPercent+'%',height:'100%',background:'var(--brand-cyan)',borderRadius:3}})
          )
        ),
        React.createElement('div',{className:'card'},
          React.createElement('div',{style:{fontSize:11,color:'var(--muted)',fontWeight:600,textTransform:'uppercase'}},
            '⏳ Available Hours'
          ),
          React.createElement('div',{style:{fontSize:24,fontWeight:700,marginTop:8}},
            totalAvailable
          )
        )
      ),

      React.createElement('h3',{style:{fontSize:14,fontWeight:700,marginBottom:16}},'Crew Schedule'),
      React.createElement('div',{className:'tbl-wrap'},
        React.createElement('table',{className:'tbl'},
          React.createElement('thead',null,
            React.createElement('tr',null,
              React.createElement('th',null,'Name'),
              React.createElement('th',null,'Role'),
              React.createElement('th',null,'Trade'),
              React.createElement('th',{textAlign:'center'},'Allocated'),
              React.createElement('th',{textAlign:'center'},'Available'),
              React.createElement('th',null,'Projects')
            )
          ),
          React.createElement('tbody',null,
            resources.map(r=>{
              const util = Math.round((r.allocated/(r.allocated+r.available))*100);
              return React.createElement('tr',{key:r.id},
                React.createElement('td',{fontWeight:600},r.name),
                React.createElement('td',null,r.role),
                React.createElement('td',null,React.createElement('span',{style:{background:'var(--brand-cyan)',color:'white',padding:'2px 6px',borderRadius:3,fontSize:10,fontWeight:600}},r.trade)),
                React.createElement('td',{textAlign:'center',fontWeight:600},r.allocated+'h'),
                React.createElement('td',{textAlign:'center',color:r.available>0?'var(--success)':'var(--err)',fontWeight:600},r.available+'h'),
                React.createElement('td',{fontSize:12,color:'var(--muted)'},r.projects.join(', ').slice(0,40)+'...')
              );
            })
          )
        )
      )
    )
  );
}

Object.assign(window,{ResourcePlanning});
