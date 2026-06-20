/* Retainage Tracking */
function RetainageTracking(){
  const [contracts, setContracts] = React.useState([
    {id:'CT-001',vendor:'Gontry',total:50000,retainagePercent:10,retainageAmount:5000,released:0,status:'in-progress'},
    {id:'CT-002',vendor:'EMT Electric',total:80000,retainagePercent:10,retainageAmount:8000,released:4000,status:'in-progress'},
    {id:'CT-003',vendor:'American Pools',total:250000,retainagePercent:5,retainageAmount:12500,released:12500,status:'complete'}
  ]);

  const handleRelease = (id) => {
    const c = contracts.find(x=>x.id===id);
    if(!c||c.released>=c.retainageAmount) return;
    setContracts(contracts.map(x=>x.id===id?{...x,released:x.retainageAmount}:x));
  };

  const totalRetainage = contracts.reduce((s,c)=>s+c.retainageAmount,0);
  const totalReleased = contracts.reduce((s,c)=>s+c.released,0);
  const totalHeld = totalRetainage - totalReleased;

  return React.createElement('div',{className:'view'},
    React.createElement('div',{className:'pg-grid'},
      React.createElement('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:16,marginBottom:24}},
        React.createElement('div',{className:'card',style:{borderLeft:'4px solid var(--warn)'}},
          React.createElement('div',{style:{fontSize:11,color:'var(--muted)',fontWeight:600,textTransform:'uppercase'}},
            '💰 Total Retainage'
          ),
          React.createElement('div',{style:{fontSize:22,fontWeight:700,marginTop:8}},
            '$'+totalRetainage.toLocaleString()
          )
        ),
        React.createElement('div',{className:'card',style:{borderLeft:'4px solid var(--brand-cyan)'}},
          React.createElement('div',{style:{fontSize:11,color:'var(--muted)',fontWeight:600,textTransform:'uppercase'}},
            '✓ Released'
          ),
          React.createElement('div',{style:{fontSize:22,fontWeight:700,marginTop:8,color:'var(--success)'}},
            '$'+totalReleased.toLocaleString()
          )
        ),
        React.createElement('div',{className:'card',style:{borderLeft:'4px solid var(--err)'}},
          React.createElement('div',{style:{fontSize:11,color:'var(--muted)',fontWeight:600,textTransform:'uppercase'}},
            '🔒 Currently Held'
          ),
          React.createElement('div',{style:{fontSize:22,fontWeight:700,marginTop:8,color:'var(--err)'}},
            '$'+totalHeld.toLocaleString()
          )
        )
      ),

      React.createElement('div',{className:'tbl-wrap'},
        React.createElement('table',{className:'tbl'},
          React.createElement('thead',null,
            React.createElement('tr',null,
              React.createElement('th',null,'Contract'),
              React.createElement('th',null,'Vendor'),
              React.createElement('th',{textAlign:'right'},'Contract Value'),
              React.createElement('th',{textAlign:'right'},'Retainage %'),
              React.createElement('th',{textAlign:'right'},'Held'),
              React.createElement('th',{textAlign:'right'},'Released'),
              React.createElement('th',null,'Action')
            )
          ),
          React.createElement('tbody',null,
            contracts.map(c=>React.createElement('tr',{key:c.id},
              React.createElement('td',{className:'code'},c.id),
              React.createElement('td',null,c.vendor),
              React.createElement('td',{textAlign:'right'},'$'+c.total.toLocaleString()),
              React.createElement('td',{textAlign:'right'},c.retainagePercent+'%'),
              React.createElement('td',{textAlign:'right',fontWeight:600,color:'var(--err)'},'$'+(c.retainageAmount-c.released).toLocaleString()),
              React.createElement('td',{textAlign:'right',fontWeight:600,color:'var(--success)'},'$'+c.released.toLocaleString()),
              React.createElement('td',null,
                c.released<c.retainageAmount && React.createElement('button',{onClick:()=>handleRelease(c.id),className:'btn btn--sm',style:{fontSize:11,padding:'4px 8px'}},'Release'),
                c.released>=c.retainageAmount && React.createElement('span',{style:{fontSize:11,color:'var(--success)',fontWeight:600}},'Released')
              )
            ))
          )
        )
      )
    )
  );
}

Object.assign(window,{RetainageTracking});
