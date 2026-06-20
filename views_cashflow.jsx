/* Cash Flow Forecast */
function CashFlowForecast(){
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct'];
  const forecast = [
    {month:'Jan',budget:180000,actual:85000,forecast:180000},
    {month:'Feb',budget:220000,actual:185000,forecast:220000},
    {month:'Mar',budget:320000,actual:310000,forecast:320000},
    {month:'Apr',budget:350000,actual:340000,forecast:350000},
    {month:'May',budget:280000,actual:275000,forecast:280000},
    {month:'Jun',budget:240000,actual:null,forecast:240000},
    {month:'Jul',budget:210000,actual:null,forecast:210000},
    {month:'Aug',budget:180000,actual:null,forecast:185000},
    {month:'Sep',budget:120000,actual:null,forecast:120000},
    {month:'Oct',budget:80000,actual:null,forecast:82000}
  ];

  const maxValue = Math.max(...forecast.map(f=>Math.max(f.budget,f.forecast,f.actual||0)));
  const totalBudgeted = forecast.reduce((s,f)=>s+f.budget,0);
  const totalSpent = forecast.reduce((s,f)=>s+(f.actual||0),0);
  const totalForecast = forecast.reduce((s,f)=>s+f.forecast,0);

  return React.createElement('div',{className:'view'},
    React.createElement('div',{className:'pg-grid'},
      React.createElement('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:16,marginBottom:24}},
        React.createElement('div',{className:'card'},
          React.createElement('div',{style:{fontSize:11,color:'var(--muted)',fontWeight:600,textTransform:'uppercase'}},
            '📊 Total Budgeted'
          ),
          React.createElement('div',{style:{fontSize:22,fontWeight:700,marginTop:8}},
            '$'+totalBudgeted.toLocaleString()
          )
        ),
        React.createElement('div',{className:'card'},
          React.createElement('div',{style:{fontSize:11,color:'var(--muted)',fontWeight:600,textTransform:'uppercase'}},
            '💰 Spent to Date'
          ),
          React.createElement('div',{style:{fontSize:22,fontWeight:700,marginTop:8}},
            '$'+totalSpent.toLocaleString()
          ),
          React.createElement('div',{style:{fontSize:11,color:'var(--muted)',marginTop:4}},
            ((totalSpent/totalBudgeted)*100).toFixed(0)+'% of budget'
          )
        ),
        React.createElement('div',{className:'card'},
          React.createElement('div',{style:{fontSize:11,color:'var(--muted)',fontWeight:600,textTransform:'uppercase'}},
            '🔮 Final Forecast'
          ),
          React.createElement('div',{style:{fontSize:22,fontWeight:700,marginTop:8}},
            '$'+totalForecast.toLocaleString()
          )
        )
      ),

      React.createElement('h3',{style:{fontSize:14,fontWeight:700,marginBottom:20}},'Monthly Cash Flow Timeline'),
      React.createElement('div',{style:{overflowX:'auto',marginBottom:24}},
        React.createElement('svg',{viewBox:'0 0 1200 300',style:{width:'100%',minHeight:300,background:'white',border:'1px solid var(--border)',borderRadius:6}},
          React.createElement('defs',null,
            React.createElement('linearGradient',{id:'budgetGrad',x1:'0%',y1:'0%',x2:'0%',y2:'100%'},
              React.createElement('stop',{offset:'0%',stopColor:'#1DB4E8',stopOpacity:'0.3'}),
              React.createElement('stop',{offset:'100%',stopColor:'#1DB4E8',stopOpacity:'0.05'})
            )
          ),
          forecast.map((f,i)=>{
            const x = 50 + (i * 100);
            const y = 250;
            const budgetHeight = (f.budget / maxValue) * 180;
            const actualHeight = f.actual ? (f.actual / maxValue) * 180 : 0;
            const forecastHeight = (f.forecast / maxValue) * 180;
            return React.createElement('g',{key:i},
              React.createElement('rect',{x:x-15,y:y-budgetHeight,width:30,height:budgetHeight,fill:'#1DB4E8',opacity:0.3}),
              f.actual && React.createElement('rect',{x:x-8,y:y-actualHeight,width:16,height:actualHeight,fill:'#1F8A5B',opacity:0.8}),
              React.createElement('text',{x:x,y:y+20,textAnchor:'middle',fontSize:10,fill:'var(--muted)'},f.month)
            );
          }),
          React.createElement('text',{x:50,y:30,fontSize:12,fontWeight:600,fill:'var(--ink)'},'Cash Flow Forecast (Oct 2026 - Sept 2027)'),
          React.createElement('text',{x:50,y:275,fontSize:11,fill:'var(--muted)'},React.createElement('tspan',{fontWeight:600},'■ Budgeted  '),React.createElement('tspan',{fill:'#1F8A5B',fontWeight:600},'■ Actual'))
        )
      ),

      React.createElement('div',{className:'tbl-wrap'},
        React.createElement('table',{className:'tbl'},
          React.createElement('thead',null,
            React.createElement('tr',null,
              React.createElement('th',null,'Month'),
              React.createElement('th',{textAlign:'right'},'Budget'),
              React.createElement('th',{textAlign:'right'},'Actual'),
              React.createElement('th',{textAlign:'right'},'Forecast'),
              React.createElement('th',{textAlign:'right'},'Variance')
            )
          ),
          React.createElement('tbody',null,
            forecast.map(f=>{
              const variance = (f.actual||f.forecast) - f.budget;
              return React.createElement('tr',{key:f.month},
                React.createElement('td',{fontWeight:600},f.month),
                React.createElement('td',{textAlign:'right'},'$'+f.budget.toLocaleString()),
                React.createElement('td',{textAlign:'right'},f.actual?'$'+f.actual.toLocaleString():'—'),
                React.createElement('td',{textAlign:'right',fontWeight:600},'$'+f.forecast.toLocaleString()),
                React.createElement('td',{textAlign:'right',color:variance>0?'var(--err)':'var(--success)',fontWeight:600},(variance>0?'+':'')+'$'+Math.abs(variance).toLocaleString())
              );
            })
          )
        )
      )
    )
  );
}

Object.assign(window,{CashFlowForecast});
