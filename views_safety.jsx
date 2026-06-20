/* Safety Incident Log — OSHA Compliance */
function SafetyLog(){
  const [incidents, setIncidents] = React.useState([]);
  const [showNew, setShowNew] = React.useState(false);
  const [type, setType] = React.useState('near-miss');
  const [desc, setDesc] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [injuries, setInjuries] = React.useState('no');

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!desc.trim()) return;
    const newInc = {
      id: 'SAF-'+(3000+incidents.length),
      type,
      description: desc,
      location,
      injuries: injuries==='yes',
      reportedAt: new Date().toISOString(),
      reportedBy: 'Current User',
      status: 'open',
      investigationNotes: ''
    };
    setIncidents([newInc, ...incidents]);
    setShowNew(false);
    setType('near-miss');
    setDesc('');
    setLocation('');
    setInjuries('no');
  };

  const typeColor = {'accident':'var(--err)','injury':'var(--err)','near-miss':'var(--warn)','hazard':'var(--warn)'};
  const typeIcon = {'accident':'⚠️','injury':'🚑','near-miss':'⚡','hazard':'🔴'};

  return React.createElement('div',{className:'view'},
    React.createElement('div',{className:'pg-grid'},
      React.createElement('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:16,marginBottom:24}},
        React.createElement('div',{className:'card'},
          React.createElement('div',{style:{fontSize:11,color:'var(--muted)',fontWeight:600,textTransform:'uppercase'}},
            '🚑 Injury Incidents'
          ),
          React.createElement('div',{style:{fontSize:24,fontWeight:700,marginTop:8,color:'var(--err)'}},
            incidents.filter(i=>i.injuries).length
          )
        ),
        React.createElement('div',{className:'card'},
          React.createElement('div',{style:{fontSize:11,color:'var(--muted)',fontWeight:600,textTransform:'uppercase'}},
            '⚡ Near Misses'
          ),
          React.createElement('div',{style:{fontSize:24,fontWeight:700,marginTop:8,color:'var(--warn)'}},
            incidents.filter(i=>i.type==='near-miss').length
          )
        ),
        React.createElement('div',{className:'card'},
          React.createElement('div',{style:{fontSize:11,color:'var(--muted)',fontWeight:600,textTransform:'uppercase'}},
            '📋 Total Reports'
          ),
          React.createElement('div',{style:{fontSize:24,fontWeight:700,marginTop:8}},
            incidents.length
          )
        )
      ),

      React.createElement('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}},
        React.createElement('h3',{style:{margin:0,fontSize:16,fontWeight:700}},'Incident Reports'),
        React.createElement('button',{onClick:()=>setShowNew(true),className:'btn btn--primary'},'Report Incident')
      ),

      incidents.map(i=>React.createElement('div',{key:i.id,className:'card',style:{borderLeft:'4px solid '+typeColor[i.type],marginBottom:12}},
        React.createElement('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'start',marginBottom:8}},
          React.createElement('div',null,
            React.createElement('div',{style:{fontWeight:700,fontSize:13}},typeIcon[i.type]+' '+i.id),
            i.location && React.createElement('div',{style:{fontSize:11,color:'var(--muted)',marginTop:4}},i.location)
          ),
          React.createElement('span',{style:{background:i.injuries?'var(--err)':'var(--warn)',color:'white',padding:'2px 8px',borderRadius:3,fontSize:10,fontWeight:600}},
            i.injuries?'Injury':'Near Miss'
          )
        ),
        React.createElement('p',{style:{fontSize:12,color:'var(--ink)',margin:'8px 0'}},i.description),
        React.createElement('div',{style:{fontSize:10,color:'var(--muted)',marginTop:8}},
          'Reported ',new Date(i.reportedAt).toLocaleDateString(),' by ',i.reportedBy
        )
      )),

      showNew && React.createElement('div',{className:'modal-overlay',onClick:()=>setShowNew(false)},
        React.createElement('div',{className:'modal',onClick:(e)=>e.stopPropagation()},
          React.createElement('div',{className:'modal__head'},
            React.createElement('h2',null,'Report Safety Incident'),
            React.createElement('button',{className:'modal__close',onClick:()=>setShowNew(false)},'✕')
          ),
          React.createElement('form',{onSubmit:handleSubmit,className:'modal__body'},
            React.createElement('div',{className:'form-group'},
              React.createElement('label',null,'Incident Type'),
              React.createElement('select',{value:type,onChange:(e)=>setType(e.target.value)},
                React.createElement('option',{value:'near-miss'},'Near Miss'),
                React.createElement('option',{value:'hazard'},'Hazard Identified'),
                React.createElement('option',{value:'accident'},'Accident'),
                React.createElement('option',{value:'injury'},'Injury Incident')
              )
            ),
            React.createElement('div',{className:'form-group'},
              React.createElement('label',null,'Location'),
              React.createElement('input',{type:'text',placeholder:'Where did this occur?',value:location,onChange:(e)=>setLocation(e.target.value)})
            ),
            React.createElement('div',{className:'form-group'},
              React.createElement('label',null,'Description'),
              React.createElement('textarea',{placeholder:'What happened? Any injuries?',value:desc,onChange:(e)=>setDesc(e.target.value),style:{minHeight:100}})
            ),
            React.createElement('div',{className:'form-group'},
              React.createElement('label',null,'Any Injuries?'),
              React.createElement('select',{value:injuries,onChange:(e)=>setInjuries(e.target.value)},
                React.createElement('option',{value:'no'},'No'),
                React.createElement('option',{value:'yes'},'Yes')
              )
            ),
            React.createElement('button',{type:'submit',className:'btn btn--primary',style:{width:'100%'}},'Report Incident')
          )
        )
      )
    )
  );
}

Object.assign(window,{SafetyLog});
