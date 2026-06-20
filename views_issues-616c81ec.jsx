/* Issue Tracker — Defects, Punch List */
function IssueTracker(){
  const [issues, setIssues] = React.useState([]);
  const [showNew, setShowNew] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [priority, setPriority] = React.useState('normal');
  const [location, setLocation] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!title.trim()) return;
    const newIssue = {
      id: 'ISS-'+(5000+issues.length),
      title,
      description: desc,
      priority,
      location,
      status: 'open',
      createdAt: new Date().toISOString(),
      createdBy: 'Current User'
    };
    setIssues([newIssue, ...issues]);
    setShowNew(false);
    setTitle('');
    setDesc('');
    setPriority('normal');
    setLocation('');
  };

  const priorityColor = {high:'var(--err)',normal:'var(--warn)',low:'var(--success)'};
  const statusColor = {open:'var(--warn)',in_progress:'var(--brand-cyan)',resolved:'var(--success)'};

  return React.createElement('div',{className:'view'},
    React.createElement('div',{className:'pg-grid'},
      React.createElement('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:16,marginBottom:24}},
        React.createElement('div',{className:'card'},
          React.createElement('div',{style:{fontSize:11,color:'var(--muted)',fontWeight:600,textTransform:'uppercase'}},
            '🔴 Open Issues'
          ),
          React.createElement('div',{style:{fontSize:24,fontWeight:700,marginTop:8,color:'var(--err)'}},
            issues.filter(i=>i.status==='open').length
          )
        ),
        React.createElement('div',{className:'card'},
          React.createElement('div',{style:{fontSize:11,color:'var(--muted)',fontWeight:600,textTransform:'uppercase'}},
            '🔵 In Progress'
          ),
          React.createElement('div',{style:{fontSize:24,fontWeight:700,marginTop:8,color:'var(--brand-cyan)'}},
            issues.filter(i=>i.status==='in_progress').length
          )
        ),
        React.createElement('div',{className:'card'},
          React.createElement('div',{style:{fontSize:11,color:'var(--muted)',fontWeight:600,textTransform:'uppercase'}},
            '✓ Resolved'
          ),
          React.createElement('div',{style:{fontSize:24,fontWeight:700,marginTop:8,color:'var(--success)'}},
            issues.filter(i=>i.status==='resolved').length
          )
        )
      ),

      React.createElement('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}},
        React.createElement('h3',{style:{margin:0,fontSize:16,fontWeight:700}},issues.length+' Issues'),
        React.createElement('button',{onClick:()=>setShowNew(true),className:'btn btn--primary'},'Report Issue')
      ),

      issues.map(i=>React.createElement('div',{key:i.id,className:'card',style:{borderLeft:'4px solid '+priorityColor[i.priority],marginBottom:12}},
        React.createElement('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'start',marginBottom:8}},
          React.createElement('div',null,
            React.createElement('div',{style:{fontWeight:700,fontSize:13}},i.id+' — '+i.title),
            i.location && React.createElement('div',{style:{fontSize:11,color:'var(--muted)',marginTop:4}},i.location)
          ),
          React.createElement('span',{style:{background:statusColor[i.status],color:'white',padding:'2px 8px',borderRadius:3,fontSize:10,fontWeight:600}},
            {open:'Open',in_progress:'In Progress',resolved:'Resolved'}[i.status]
          )
        ),
        i.description && React.createElement('p',{style:{fontSize:12,color:'var(--ink)',margin:'8px 0'}},i.description),
        React.createElement('div',{style:{fontSize:10,color:'var(--muted)',marginTop:8}},
          'Reported ',new Date(i.createdAt).toLocaleDateString(),' by ',i.createdBy
        )
      )),

      showNew && React.createElement('div',{className:'modal-overlay',onClick:()=>setShowNew(false)},
        React.createElement('div',{className:'modal',onClick:(e)=>e.stopPropagation()},
          React.createElement('div',{className:'modal__head'},
            React.createElement('h2',null,'Report Issue'),
            React.createElement('button',{className:'modal__close',onClick:()=>setShowNew(false)},'✕')
          ),
          React.createElement('form',{onSubmit:handleSubmit,className:'modal__body'},
            React.createElement('div',{className:'form-group'},
              React.createElement('label',null,'Title'),
              React.createElement('input',{type:'text',placeholder:'What is the issue?',value:title,onChange:(e)=>setTitle(e.target.value),autoFocus:true})
            ),
            React.createElement('div',{className:'form-group'},
              React.createElement('label',null,'Description'),
              React.createElement('textarea',{placeholder:'Details...',value:desc,onChange:(e)=>setDesc(e.target.value),style:{minHeight:80}})
            ),
            React.createElement('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}},
              React.createElement('div',{className:'form-group'},
                React.createElement('label',null,'Priority'),
                React.createElement('select',{value:priority,onChange:(e)=>setPriority(e.target.value)},
                  React.createElement('option',{value:'high'},'High'),
                  React.createElement('option',{value:'normal'},'Normal'),
                  React.createElement('option',{value:'low'},'Low')
                )
              ),
              React.createElement('div',{className:'form-group'},
                React.createElement('label',null,'Location'),
                React.createElement('input',{type:'text',placeholder:'e.g., Building A, 2nd Floor',value:location,onChange:(e)=>setLocation(e.target.value)})
              )
            ),
            React.createElement('button',{type:'submit',className:'btn btn--primary',style:{width:'100%'}},'Report')
          )
        )
      )
    )
  );
}

Object.assign(window,{IssueTracker});
