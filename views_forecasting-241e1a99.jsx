/* Cost Forecasting & Variance Analysis */
function CostForecasting(){
  const budget = [
    {code:'1000', desc:'Site Work',            budget:180000, spent:182340, forecast:185000},
    {code:'2000', desc:'Concrete',             budget:320000, spent:318920, forecast:320000},
    {code:'3000', desc:'Lumber & Framing',     budget:450000, spent:448120, forecast:449000},
    {code:'4000', desc:'Roofing',              budget:280000, spent:279450, forecast:280000},
    {code:'5000', desc:'Electrical',           budget:420000, spent:408760, forecast:415000},
    {code:'6000', desc:'Plumbing & HVAC',      budget:380000, spent:375200, forecast:378000},
    {code:'7000', desc:'Windows & Doors',      budget:210000, spent:205320, forecast:208000},
    {code:'8000', desc:'Drywall & Interior',   budget:240000, spent:187640, forecast:195000},
    {code:'9000', desc:'Flooring',             budget:180000, spent:135680, forecast:142000},
    {code:'9500', desc:'Paint & Finish',       budget:110000, spent:52550, forecast:65000},
  ];

  const totalBudget = budget.reduce((s,b)=>s+b.budget,0);
  const totalSpent = budget.reduce((s,b)=>s+b.spent,0);
  const totalForecast = budget.reduce((s,b)=>s+b.forecast,0);
  const variance = totalForecast - totalBudget;
  const varPercent = ((variance/totalBudget)*100).toFixed(1);

  return React.createElement('div',{className:'view'},
    React.createElement('div',{className:'pg-grid'},
      React.createElement('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:16,marginBottom:24}},
        React.createElement('div',{className:'card',style:{borderLeft:'4px solid var(--brand-cyan)'}},
          React.createElement('div',{style:{fontSize:11,color:'var(--muted)',fontWeight:600,textTransform:'uppercase'}},
            '📊 Original Budget'
          ),
          React.createElement('div',{style:{fontSize:22,fontWeight:700,marginTop:8}},
            '$'+totalBudget.toLocaleString('en-US',{maximumFractionDigits:0})
          )
        ),
        React.createElement('div',{className:'card',style:{borderLeft:'4px solid var(--warn)'}},
          React.createElement('div',{style:{fontSize:11,color:'var(--muted)',fontWeight:600,textTransform:'uppercase'}},
            '💰 Forecast Final Cost'
          ),
          React.createElement('div',{style:{fontSize:22,fontWeight:700,marginTop:8}},
            '$'+totalForecast.toLocaleString('en-US',{maximumFractionDigits:0})
          ),
          React.createElement('div',{style:{fontSize:11,color:variance>0?'var(--err)':'var(--success)',fontWeight:600,marginTop:4}},
            (variance>0?'+':'')+'$'+Math.abs(variance).toLocaleString()+' ('+varPercent+'%)'
          )
        ),
        React.createElement('div',{className:'card',style:{borderLeft:'4px solid var(--success)'}},
          React.createElement('div',{style:{fontSize:11,color:'var(--muted)',fontWeight:600,textTransform:'uppercase'}},
            '✓ Currently Spent'
          ),
          React.createElement('div',{style:{fontSize:22,fontWeight:700,marginTop:8}},
            '$'+totalSpent.toLocaleString('en-US',{maximumFractionDigits:0})
          ),
          React.createElement('div',{style:{fontSize:11,color:'var(--muted)',fontWeight:600,marginTop:4}},
            ((totalSpent/totalBudget)*100).toFixed(1)+'% of budget'
          )
        )
      ),

      React.createElement('h3',{style:{fontSize:16,fontWeight:700,marginBottom:16}},'Variance by Cost Code'),
      React.createElement('div',{className:'tbl-wrap'},
        React.createElement('table',{className:'tbl'},
          React.createElement('thead',null,
            React.createElement('tr',null,
              React.createElement('th',null,'Code'),
              React.createElement('th',null,'Description'),
              React.createElement('th',{textAlign:'right'},'Budget'),
              React.createElement('th',{textAlign:'right'},'Spent'),
              React.createElement('th',{textAlign:'right'},'Forecast'),
              React.createElement('th',{textAlign:'right'},'Variance'),
              React.createElement('th',null,'Status')
            )
          ),
          React.createElement('tbody',null,
            budget.map(b=>{
              const v = b.forecast - b.budget;
              const vPct = ((v/b.budget)*100).toFixed(0);
              return React.createElement('tr',{key:b.code},
                React.createElement('td',{className:'code'},b.code),
                React.createElement('td',null,b.desc),
                React.createElement('td',{textAlign:'right'},'$'+b.budget.toLocaleString()),
                React.createElement('td',{textAlign:'right'},'$'+b.spent.toLocaleString()),
                React.createElement('td',{textAlign:'right',fontWeight:600},'$'+b.forecast.toLocaleString()),
                React.createElement('td',{textAlign:'right',fontWeight:600,color:v>0?'var(--err)':'var(--success)'},(v>0?'+':'')+'$'+Math.abs(v).toLocaleString()),
                React.createElement('td',null,
                  React.createElement('span',{style:{background:v>0?'var(--err)':'var(--success)',color:'white',padding:'2px 8px',borderRadius:3,fontSize:10,fontWeight:600}},
                    v>0?'Over':'Under'
                  )
                )
              );
            })
          )
        )
      )
    )
  );
}

Object.assign(window,{CostForecasting});
