/* Requisition System — Payment Requests with Docs */
function RequisitionSystem(){
  const [requisitions, setRequisitions] = React.useState([
    {id:'REQ-001',vendor:'Gontry Plaster',amount:25000,period:'May 2026',submitted:'2026-06-01',documents:['Invoice','Lien Waiver','Progress Report'],status:'approved',approvedBy:'Mike Russ',approvedDate:'2026-06-02'},
    {id:'REQ-002',vendor:'EMT Electric',amount:44476,period:'May 2026',submitted:'2026-06-05',documents:['Invoice','Lien Waiver'],status:'pending-pm',approvedBy:null,approvedDate:null},
    {id:'REQ-003',vendor:'American Pools',amount:15000,period:'June 2026',submitted:'2026-06-10',documents:['Invoice','Schedule'],status:'pending-docs',approvedBy:null,approvedDate:null}
  ]);

  const totalPending = requisitions.filter(r=>r.status.includes('pending')).reduce((s,r)=>s+r.amount,0);
  const totalApproved = requisitions.filter(r=>r.status==='approved').reduce((s,r)=>s+r.amount,0);

  return React.createElement('div',{className:'view'},
    React.createElement('div',{className:'pg-grid'},
      React.createElement('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:16,marginBottom:24}},
        React.createElement('div',{className:'card'},
          React.createElement('div',{style:{fontSize:11,color:'var(--muted)',fontWeight:600,textTransform:'uppercase'}},
            '💰 Pending Approval'
          ),
          React.createElement('div',{style:{fontSize:22,fontWeight:700,marginTop:8,color:'var(--warn)'}},
            '$'+totalPending.toLocaleString()
          )
        ),
        React.createElement('div',{className:'card'},
          React.createElement('div',{style:{fontSize:11,color:'var(--muted)',fontWeight:600,textTransform:'uppercase'}},
            '✓ Approved'
          ),
          React.createElement('div',{style:{fontSize:22,fontWeight:700,marginTop:8,color:'var(--success)'}},
            '$'+totalApproved.toLocaleString()
          )
        ),
        React.createElement('div',{className:'card'},
          React.createElement('div',{style:{fontSize:11,color:'var(--muted)',fontWeight:600,textTransform:'uppercase'}},
            '📋 Total Requisitions'
          ),
          React.createElement('div',{style:{fontSize:22,fontWeight:700,marginTop:8}},
            requisitions.length
          )
        )
      ),

      React.createElement('div',{className:'tbl-wrap'},
        React.createElement('table',{className:'tbl'},
          React.createElement('thead',null,
            React.createElement('tr',null,
              React.createElement('th',null,'Requisition'),
              React.createElement('th',null,'Vendor'),
              React.createElement('th',null,'Period'),
              React.createElement('th',{textAlign:'right'},'Amount'),
              React.createElement('th',null,'Documents'),
              React.createElement('th',null,'Status'),
              React.createElement('th',null,'Action')
            )
          ),
          React.createElement('tbody',null,
            requisitions.map(r=>React.createElement('tr',{key:r.id},
              React.createElement('td',{className:'code',fontWeight:600},r.id),
              React.createElement('td',null,r.vendor),
              React.createElement('td',{fontSize:12,color:'var(--muted)'},r.period),
              React.createElement('td',{textAlign:'right',fontWeight:600},'$'+r.amount.toLocaleString()),
              React.createElement('td',null,React.createElement('span',{style:{background:'var(--bg)',padding:'2px 6px',borderRadius:3,fontSize:10}},r.documents.length+' attached')),
              React.createElement('td',null,React.createElement('span',{style:{background:r.status==='approved'?'var(--success)':r.status.includes('pending')?'var(--warn)':'var(--muted)',color:'white',padding:'3px 8px',borderRadius:3,fontSize:10,fontWeight:600}},
                r.status==='approved'?'Approved':r.status.includes('pm')?'Awaiting PM':'Missing Docs'
              )),
              React.createElement('td',null,
                r.status==='pending-pm' && React.createElement('button',{className:'btn btn--sm',style:{fontSize:10}},'Approve'),
                r.status==='pending-docs' && React.createElement('button',{className:'btn btn--sm',style:{fontSize:10}},'Request'),
                r.status==='approved' && React.createElement('button',{className:'btn btn--sm',style:{fontSize:10}},'Pay')
              )
            ))
          )
        )
      )
    )
  );
}

Object.assign(window,{RequisitionSystem});
