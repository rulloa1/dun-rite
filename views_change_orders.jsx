/* Change Order Tracker */
function ChangeOrderTracker(){
  const [orders, setOrders] = React.useState([]);
  const [showNew, setShowNew] = React.useState(false);
  const [desc, setDesc] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [reason, setReason] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!desc.trim() || !amount) return;
    const newOrder = {
      id: 'CO-'+(1000+orders.length),
      description: desc,
      originalAmount: parseFloat(amount),
      costImpact: parseFloat(amount),
      reason,
      status: 'pending-approval',
      submittedBy: 'Current User',
      submittedAt: new Date().toISOString(),
      approvals: []
    };
    setOrders([newOrder, ...orders]);
    setShowNew(false);
    setDesc('');
    setAmount('');
    setReason('');
  };

  const statusColor = {
    'pending-approval': 'var(--warn)',
    'approved': 'var(--success)',
    'rejected': 'var(--err)',
    'implemented': 'var(--brand-cyan)'
  };

  const statusLabel = {
    'pending-approval': 'Pending Approval',
    'approved': 'Approved',
    'rejected': 'Rejected',
    'implemented': 'Implemented'
  };

  return React.createElement('div',{className:'view'},
    React.createElement('div',{className:'pg-grid'},
      React.createElement('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:16,marginBottom:24}},
        React.createElement('div',{className:'card'},
          React.createElement('div',{style:{fontSize:12,color:'var(--muted)',fontWeight:600,textTransform:'uppercase',letterSpacing:'.05em'}},
            '💰 Total CO Value'
          ),
          React.createElement('div',{style:{fontSize:24,fontWeight:700,marginTop:8}},
            '$'+orders.reduce((s,o)=>s+o.costImpact,0).toLocaleString()
          )
        ),
        React.createElement('div',{className:'card'},
          React.createElement('div',{style:{fontSize:12,color:'var(--muted)',fontWeight:600,textTransform:'uppercase',letterSpacing:'.05em'}},
            '✓ Approved'
          ),
          React.createElement('div',{style:{fontSize:24,fontWeight:700,marginTop:8}},
            orders.filter(o=>o.status==='approved'||o.status==='implemented').length
          )
        ),
        React.createElement('div',{className:'card'},
          React.createElement('div',{style:{fontSize:12,color:'var(--muted)',fontWeight:600,textTransform:'uppercase',letterSpacing:'.05em'}},
            '⏳ Pending'
          ),
          React.createElement('div',{style:{fontSize:24,fontWeight:700,marginTop:8}},
            orders.filter(o=>o.status==='pending-approval').length
          )
        )
      ),

      React.createElement('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}},
        React.createElement('h3',{style:{margin:0,fontSize:16,fontWeight:700}},'Change Orders'),
        React.createElement('button',{onClick:()=>setShowNew(true),className:'btn btn--primary'},'New Change Order')
      ),

      orders.length === 0 ? React.createElement('div',{style:{textAlign:'center',padding:'40px 20px',color:'var(--muted)'}},
        React.createElement('p',null,'No change orders yet')
      ) : React.createElement('div',{className:'tbl-wrap'},
        React.createElement('table',{className:'tbl'},
          React.createElement('thead',null,
            React.createElement('tr',null,
              React.createElement('th',null,'ID'),
              React.createElement('th',null,'Description'),
              React.createElement('th',{textAlign:'right'},'Cost Impact'),
              React.createElement('th',null,'Reason'),
              React.createElement('th',null,'Status')
            )
          ),
          React.createElement('tbody',null,
            orders.map(o=>React.createElement('tr',{key:o.id},
              React.createElement('td',{className:'code'},o.id),
              React.createElement('td',null,o.description),
              React.createElement('td',{style:{textAlign:'right',fontWeight:600}},'$'+o.costImpact.toLocaleString()),
              React.createElement('td',{style:{fontSize:12,color:'var(--muted)',maxWidth:200}}),
              React.createElement('td',null,
                React.createElement('span',{style:{background:statusColor[o.status],color:'white',padding:'3px 8px',borderRadius:3,fontSize:10,fontWeight:600}},statusLabel[o.status])
              )
            ))
          )
        )
      ),

      showNew && React.createElement('div',{className:'modal-overlay',onClick:()=>setShowNew(false)},
        React.createElement('div',{className:'modal',onClick:(e)=>e.stopPropagation()},
          React.createElement('div',{className:'modal__head'},
            React.createElement('h2',null,'New Change Order'),
            React.createElement('button',{className:'modal__close',onClick:()=>setShowNew(false)},'✕')
          ),
          React.createElement('form',{onSubmit:handleSubmit,className:'modal__body'},
            React.createElement('div',{className:'form-group'},
              React.createElement('label',null,'Description'),
              React.createElement('textarea',{placeholder:'What is changing?',value:desc,onChange:(e)=>setDesc(e.target.value),style:{minHeight:80}})
            ),
            React.createElement('div',{className:'form-group'},
              React.createElement('label',null,'Cost Impact ($)'),
              React.createElement('input',{type:'number',placeholder:'0.00',value:amount,onChange:(e)=>setAmount(e.target.value)})
            ),
            React.createElement('div',{className:'form-group'},
              React.createElement('label',null,'Reason'),
              React.createElement('textarea',{placeholder:'Why this change?',value:reason,onChange:(e)=>setReason(e.target.value),style:{minHeight:60}})
            ),
            React.createElement('button',{type:'submit',className:'btn btn--primary',style:{width:'100%'}},'Submit for Approval')
          )
        )
      )
    )
  );
}

Object.assign(window,{ChangeOrderTracker});
