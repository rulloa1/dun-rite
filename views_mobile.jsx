/* Mobile App Portal — Field Crew Access */
function MobileAppPortal(){
  const [crews, setCrew] = React.useState([
    {id:'C001',name:'Foundation Crew',lead:'John Smith',members:5,currentLocation:'Building A - Foundation',status:'active',tasks:8,docAccess:true},
    {id:'C002',name:'Framing Crew',lead:'Carlos Rodriguez',members:4,currentLocation:'Building B - Framing',status:'active',tasks:12,docAccess:true},
    {id:'C003',name:'MEP Crew',lead:'Mike Johnson',members:3,currentLocation:'Building A - MEP',status:'idle',tasks:0,docAccess:true}
  ]);

  return React.createElement('div',{className:'view'},
    React.createElement('div',{className:'pg-grid'},
      React.createElement('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:16,marginBottom:24}},
        React.createElement('div',{className:'card'},
          React.createElement('div',{style:{fontSize:11,color:'var(--muted)',fontWeight:600,textTransform:'uppercase'}},
            '👷 Field Crews'
          ),
          React.createElement('div',{style:{fontSize:22,fontWeight:700,marginTop:8}},
            crews.length
          )
        ),
        React.createElement('div',{className:'card'},
          React.createElement('div',{style:{fontSize:11,color:'var(--muted)',fontWeight:600,textTransform:'uppercase'}},
            '📱 Mobile Users'
          ),
          React.createElement('div',{style:{fontSize:22,fontWeight:700,marginTop:8}},
            crews.reduce((s,c)=>s+c.members,0)
          )
        ),
        React.createElement('div',{className:'card'},
          React.createElement('div',{style:{fontSize:11,color:'var(--muted)',fontWeight:600,textTransform:'uppercase'}},
            '✓ Active Tasks'
          ),
          React.createElement('div',{style:{fontSize:22,fontWeight:700,marginTop:8,color:'var(--brand-cyan)'}},
            crews.reduce((s,c)=>s+c.tasks,0)
          )
        )
      ),

      React.createElement('h3',{style:{fontSize:14,fontWeight:700,marginBottom:16}},'Crew Status'),
      crews.map(c=>React.createElement('div',{key:c.id,className:'card',style:{marginBottom:16}},
        React.createElement('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'start',marginBottom:12}},
          React.createElement('div',null,
            React.createElement('div',{style:{fontSize:13,fontWeight:700}},c.name),
            React.createElement('div',{style:{fontSize:11,color:'var(--muted)',marginTop:2}},'Lead: '+c.lead)
          ),
          React.createElement('span',{style:{background:c.status==='active'?'var(--success)':'var(--muted)',color:'white',padding:'3px 8px',borderRadius:3,fontSize:10,fontWeight:600}},
            c.status==='active'?'Active':'Idle'
          )
        ),
        React.createElement('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12}},
          React.createElement('div',null,
            React.createElement('div',{style:{fontSize:10,color:'var(--muted)',marginBottom:4}},'Team Size'),
            React.createElement('div',{style:{fontSize:13,fontWeight:600}},c.members+' workers')
          ),
          React.createElement('div',null,
            React.createElement('div',{style:{fontSize:10,color:'var(--muted)',marginBottom:4}},'Location'),
            React.createElement('div',{style:{fontSize:12,fontWeight:500}},c.currentLocation)
          ),
          React.createElement('div',null,
            React.createElement('div',{style:{fontSize:10,color:'var(--muted)',marginBottom:4}},'Assigned Tasks'),
            React.createElement('div',{style:{fontSize:13,fontWeight:600}},c.tasks+' tasks')
          )
        )
      )),

      React.createElement('div',{style:{marginTop:24,padding:16,background:'var(--bg)',borderRadius:6}},
        React.createElement('h4',{style:{fontSize:12,fontWeight:700,marginBottom:8}},
          '📱 Mobile App Features Available to Crews:'
        ),
        React.createElement('ul',{style:{margin:0,paddingLeft:16,fontSize:11,color:'var(--ink)'}},
          React.createElement('li',null,'Daily check-in & time clock'),
          React.createElement('li',null,'View assigned tasks & locations'),
          React.createElement('li',null,'Photo/video documentation'),
          React.createElement('li',null,'Safety incident reporting'),
          React.createElement('li',null,'Material requests & delivery tracking'),
          React.createElement('li',null,'Equipment check-out/check-in'),
          React.createElement('li',null,'Push notifications for schedule changes')
        )
      )
    )
  );
}

Object.assign(window,{MobileAppPortal});
