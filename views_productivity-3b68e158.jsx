/* Productivity Metrics */
function ProductivityMetrics(){
  const metrics = [
    {code:'1000',desc:'Site Work',hours:240,units:'cu yd',unitCount:450,costPerUnit:400},
    {code:'2000',desc:'Concrete',hours:320,units:'cu yd',unitCount:800,costPerUnit:398},
    {code:'3000',desc:'Lumber & Framing',hours:520,units:'bf',unitCount:45000,costPerUnit:9.95},
    {code:'4000',desc:'Roofing',hours:180,units:'sq ft',unitCount:12500,costPerUnit:22.36},
    {code:'5000',desc:'Electrical',hours:420,units:'outlets',unitCount:280,costPerUnit:1458}
  ];

  const avgLaborHoursPerUnit = metrics.reduce((s,m)=>s+(m.hours/m.unitCount),0)/metrics.length;

  return React.createElement('div',{className:'view'},
    React.createElement('div',{className:'pg-grid'},
      React.createElement('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:16,marginBottom:24}},
        React.createElement('div',{className:'card'},
          React.createElement('div',{style:{fontSize:11,color:'var(--muted)',fontWeight:600,textTransform:'uppercase'}},
            '⏰ Avg Labor Hours/Unit'
          ),
          React.createElement('div',{style:{fontSize:22,fontWeight:700,marginTop:8}},
            avgLaborHoursPerUnit.toFixed(2)+' hrs'
          )
        ),
        React.createElement('div',{className:'card'},
          React.createElement('div',{style:{fontSize:11,color:'var(--muted)',fontWeight:600,textTransform:'uppercase'}},
            '📊 Total Units Complete'
          ),
          React.createElement('div',{style:{fontSize:22,fontWeight:700,marginTop:8}},
            metrics.reduce((s,m)=>s+m.unitCount,0).toLocaleString()
          )
        ),
        React.createElement('div',{className:'card'},
          React.createElement('div',{style:{fontSize:11,color:'var(--muted)',fontWeight:600,textTransform:'uppercase'}},
            '💰 Avg Cost/Unit'
          ),
          React.createElement('div',{style:{fontSize:22,fontWeight:700,marginTop:8}},
            '$'+(metrics.reduce((s,m)=>s+m.costPerUnit,0)/metrics.length).toFixed(0)
          )
        )
      ),

      React.createElement('div',{className:'tbl-wrap'},
        React.createElement('table',{className:'tbl'},
          React.createElement('thead',null,
            React.createElement('tr',null,
              React.createElement('th',null,'Code'),
              React.createElement('th',null,'Description'),
              React.createElement('th',{textAlign:'center'},'Labor Hours'),
              React.createElement('th',null,'Unit'),
              React.createElement('th',{textAlign:'center'},'Units'),
              React.createElement('th',{textAlign:'right'},'Cost/Unit')
            )
          ),
          React.createElement('tbody',null,
            metrics.map(m=>React.createElement('tr',{key:m.code},
              React.createElement('td',{className:'code'},m.code),
              React.createElement('td',null,m.desc),
              React.createElement('td',{textAlign:'center',fontWeight:600},m.hours),
              React.createElement('td',null,m.units),
              React.createElement('td',{textAlign:'center',fontWeight:600},m.unitCount.toLocaleString()),
              React.createElement('td',{textAlign:'right',fontWeight:600},'$'+m.costPerUnit.toFixed(2))
            ))
          )
        )
      )
    )
  );
}

Object.assign(window,{ProductivityMetrics});
