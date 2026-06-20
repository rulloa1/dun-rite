/* Invoice & Requisition Management */
function InvoiceManager(){
  const [invoices, setInvoices] = React.useState([]);
  const [showNew, setShowNew] = React.useState(false);
  const [vendor, setVendor] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [dueDate, setDueDate] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!vendor.trim() || !amount) return;
    const newInv = {
      id: 'INV-'+(10000+invoices.length),
      vendor,
      amount: parseFloat(amount),
      dueDate,
      status: 'received',
      approvals: 0,
      requiredApprovals: 2,
      receivedAt: new Date().toISOString()
    };
    setInvoices([newInv, ...invoices]);
    setShowNew(false);
    setVendor('');
    setAmount('');
    setDueDate('');
  };

  const totalInvoiced = invoices.reduce((s,i)=>s+i.amount,0);
  const totalApproved = invoices.filter(i=>i.approvals>=i.requiredApprovals).reduce((s,i)=>s+i.amount,0);
  const totalPending = invoices.filter(i=>i.approvals<i.requiredApprovals).reduce((s,i)=>s+i.amount,0);

  return React.createElement('div',{className:'view'},
    React.createElement('div',{className:'pg-grid'},
      React.createElement('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:16,marginBottom:24}},
        React.createElement('div',{className:'card',style:{borderLeft:'4px solid var(--brand-cyan)'}},
          React.createElement('div',{style:{fontSize:11,color:'var(--muted)',fontWeight:600,textTransform:'uppercase',letterSpacing:'.05em'}},
            '📊 Total Invoiced'
          ),
          React.createElement('div',{style:{fontSize:22,fontWeight:700,marginTop:8}},
            '$'+totalInvoiced.toLocaleString('en-US',{maximumFractionDigits:0})
          )
        ),
        React.createElement('div',{className:'card',style:{borderLeft:'4px solid var(--success)'}},
          React.createElement('div',{style:{fontSize:11,color:'var(--muted)',fontWeight:600,textTransform:'uppercase',letterSpacing:'.05em'}},
            '✓ Approved & Paid'
          ),
          React.createElement('div',{style:{fontSize:22,fontWeight:700,marginTop:8}},
            '$'+totalApproved.toLocaleString('en-US',{maximumFractionDigits:0})
          )
        ),
        React.createElement('div',{className:'card',style:{borderLeft:'4px solid var(--warn)'}},
          React.createElement('div',{style:{fontSize:11,color:'var(--muted)',fontWeight:600,textTransform:'uppercase',letterSpacing:'.05em'}},
            '⏳ Pending Approval'
          ),
          React.createElement('div',{style:{fontSize:22,fontWeight:700,marginTop:8}},
            '$'+totalPending.toLocaleString('en-US',{maximumFractionDigits:0})
          )
        )
      ),

      React.createElement('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}},
        React.createElement('h3',{style:{margin:0,fontSize:16,fontWeight:700}},invoices.length+' Invoices'),
        React.createElement('button',{onClick:()=>setShowNew(true),className:'btn btn--primary'},'Receive Invoice')
      ),

      React.createElement('div',{className:'tbl-wrap'},
        React.createElement('table',{className:'tbl'},
          React.createElement('thead',null,
            React.createElement('tr',null,
              React.createElement('th',null,'Invoice #'),
              React.createElement('th',null,'Vendor'),
              React.createElement('th',{textAlign:'right'},'Amount'),
              React.createElement('th',null,'Due Date'),
              React.createElement('th',null,'Approvals'),
              React.createElement('th',null,'Status')
            )
          ),
          React.createElement('tbody',null,
            invoices.map(i=>React.createElement('tr',{key:i.id},
              React.createElement('td',{className:'code',fontWeight:600},i.id),
              React.createElement('td',null,i.vendor),
              React.createElement('td',{textAlign:'right',fontWeight:600},'$'+i.amount.toLocaleString()),
              React.createElement('td',{color:'var(--muted)',fontSize:12},new Date(i.dueDate).toLocaleDateString()),
              React.createElement('td',null,i.approvals+'/'+i.requiredApprovals),
              React.createElement('td',null,
                React.createElement('span',{style:{background:i.approvals>=i.requiredApprovals?'var(--success)':'var(--warn)',color:'white',padding:'3px 8px',borderRadius:3,fontSize:10,fontWeight:600}},
                  i.approvals>=i.requiredApprovals?'Approved':'Pending'
                )
              )
            ))
          )
        )
      ),

      showNew && React.createElement('div',{className:'modal-overlay',onClick:()=>setShowNew(false)},
        React.createElement('div',{className:'modal',onClick:(e)=>e.stopPropagation()},
          React.createElement('div',{className:'modal__head'},
            React.createElement('h2',null,'Receive Invoice'),
            React.createElement('button',{className:'modal__close',onClick:()=>setShowNew(false)},'✕')
          ),
          React.createElement('form',{onSubmit:handleSubmit,className:'modal__body'},
            React.createElement('div',{className:'form-group'},
              React.createElement('label',null,'Vendor'),
              React.createElement('input',{type:'text',placeholder:'Vendor name',value:vendor,onChange:(e)=>setVendor(e.target.value)})
            ),
            React.createElement('div',{className:'form-group'},
              React.createElement('label',null,'Amount ($)'),
              React.createElement('input',{type:'number',placeholder:'0.00',value:amount,onChange:(e)=>setAmount(e.target.value)})
            ),
            React.createElement('div',{className:'form-group'},
              React.createElement('label',null,'Due Date'),
              React.createElement('input',{type:'date',value:dueDate,onChange:(e)=>setDueDate(e.target.value)})
            ),
            React.createElement('button',{type:'submit',className:'btn btn--primary',style:{width:'100%'}},'Log Invoice')
          )
        )
      )
    )
  );
}

Object.assign(window,{InvoiceManager});
