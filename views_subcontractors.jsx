/* Subcontractor Portal */
function SubcontractorPortal(){
  const [subs, setSubs] = React.useState([
    {id:'S001',name:'Gontry Plaster',contact:'gontry@email.com',trade:'Plaster',status:'active',documents:['Insurance','License','Bond'],tasksComplete:8,tasksTotal:10},
    {id:'S002',name:'EMT Electric',contact:'emt@email.com',trade:'Electrical',status:'active',documents:['Insurance','License'],tasksComplete:15,tasksTotal:18},
    {id:'S003',name:'American Pools',contact:'pools@email.com',trade:'Pool Work',status:'pending-approval',documents:[],tasksComplete:0,tasksTotal:5}
  ]);

  return React.createElement('div',{className:'view'},
    React.createElement('div',{className:'pg-grid'},
      React.createElement('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:16,marginBottom:24}},
        React.createElement('div',{className:'card'},
          React.createElement('div',{style:{fontSize:11,color:'var(--muted)',fontWeight:600,textTransform:'uppercase'}},
            '🏢 Active Subs'
          ),
          React.createElement('div',{style:{fontSize:24,fontWeight:700,marginTop:8}},
            subs.filter(s=>s.status==='active').length
          )
        ),
        React.createElement('div',{className:'card'},
          React.createElement('div',{style:{fontSize:11,color:'var(--muted)',fontWeight:600,textTransform:'uppercase'}},
            '📋 Pending Approval'
          ),
          React.createElement('div',{style:{fontSize:24,fontWeight:700,marginTop:8,color:'var(--warn)'}},
            subs.filter(s=>s.status==='pending-approval').length
          )
        ),
        React.createElement('div',{className:'card'},
          React.createElement('div',{style:{fontSize:11,color:'var(--muted)',fontWeight:600,textTransform:'uppercase'}},
            '✓ Docs Complete'
          ),
          React.createElement('div',{style:{fontSize:24,fontWeight:700,marginTop:8}},
            subs.filter(s=>s.documents.length===3).length
          )
        )
      ),

      React.createElement('div',{className:'tbl-wrap'},
        React.createElement('table',{className:'tbl'},
          React.createElement('thead',null,
            React.createElement('tr',null,
              React.createElement('th',null,'Subcontractor'),
              React.createElement('th',null,'Trade'),
              React.createElement('th',null,'Contact'),
              React.createElement('th',null,'Documentation'),
              React.createElement('th',null,'Progress'),
              React.createElement('th',null,'Status')
            )
          ),
          React.createElement('tbody',null,
            subs.map(s=>React.createElement('tr',{key:s.id},
              React.createElement('td',{fontWeight:600},s.name),
              React.createElement('td',null,s.trade),
              React.createElement('td',{color:'var(--muted)',fontSize:12},s.contact),
              React.createElement('td',null,s.documents.length+'/3'),
              React.createElement('td',null,
                React.createElement('div',{style:{width:60,height:6,background:'var(--border)',borderRadius:3}},
                  React.createElement('div',{style:{width:(s.tasksComplete/s.tasksTotal)*100+'%',height:'100%',background:'var(--success)',borderRadius:3}})
                ),
                React.createElement('div',{style:{fontSize:10,color:'var(--muted)',marginTop:2}},s.tasksComplete+'/'+s.tasksTotal)
              ),
              React.createElement('td',null,
                React.createElement('span',{style:{background:s.status==='active'?'var(--success)':s.status==='pending-approval'?'var(--warn)':'var(--muted)',color:'white',padding:'3px 8px',borderRadius:3,fontSize:10,fontWeight:600}},
                  s.status==='active'?'Active':s.status==='pending-approval'?'Pending':'Inactive'
                )
              )
            ))
          )
        )
      )
    )
  );
}

Object.assign(window,{SubcontractorPortal});
