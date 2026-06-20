/* Approval Workflows */
function ApprovalWorkflows(){
  const [items, setItems] = React.useState([
    {id:'APR001',type:'Change Order',desc:'CO-005: Additional electrical panel',step:2,steps:3,approvers:['PM (Approved)','Finance (Pending)','Owner']},
    {id:'APR002',type:'Invoice',desc:'INV-10245 from EMT Electric ($44K)',step:1,steps:2,approvers:['PM (Pending)','Finance']},
    {id:'APR003',type:'Requisition',desc:'Material purchase - $15K lumber',step:3,steps:3,approvers:['PM (Approved)','Finance (Approved)','Owner (Done)']},
  ]);

  return React.createElement('div',{className:'view'},
    React.createElement('div',{className:'pg-grid'},
      items.map(i=>React.createElement('div',{key:i.id,className:'card',style:{marginBottom:20}},
        React.createElement('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'start',marginBottom:12}},
          React.createElement('div',null,
            React.createElement('div',{style:{fontSize:13,fontWeight:700}},i.type+': '+i.desc),
            React.createElement('div',{style:{fontSize:11,color:'var(--muted)',marginTop:4}},i.id)
          ),
          React.createElement('span',{style:{background:i.step===i.steps?'var(--success)':'var(--brand-cyan)',color:'white',padding:'3px 8px',borderRadius:3,fontSize:10,fontWeight:600}},
            'Step '+i.step+' of '+i.steps
          )
        ),
        React.createElement('div',{style:{display:'grid',gridTemplateColumns:i.approvers.map(()=>'1fr').join(' '),gap:8,marginTop:12}},
          i.approvers.map((a,idx)=>React.createElement('div',{key:idx,style:{textAlign:'center'}},
            React.createElement('div',{style:{fontSize:11,color:'var(--muted)',marginBottom:4}},a.split(' ')[0]),
            React.createElement('div',{style:{display:'flex',alignItems:'center',justifyContent:'center',width:'100%',height:30,background:a.includes('Approved')?'var(--success)':a.includes('Done')?'var(--success)':'var(--border)',color:'white',borderRadius:4,fontSize:10,fontWeight:600}},
              a.includes('Approved')||a.includes('Done')?'✓':a.includes('Pending')?'⏳':'⭕'
            )
          ))
        )
      ))
    )
  );
}

Object.assign(window,{ApprovalWorkflows});
