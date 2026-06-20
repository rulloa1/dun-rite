/* Daily Reports — Construction Diary */
function DailyReports(){
  const [reports, setReports] = React.useState([]);
  const [showNew, setShowNew] = React.useState(false);
  const [date, setDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [weather, setWeather] = React.useState('clear');
  const [crew, setCrew] = React.useState('');
  const [workDone, setWorkDone] = React.useState('');
  const [delays, setDelays] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newReport = {
      id: Math.random().toString(36).slice(2,9),
      date,
      weather,
      crewCount: parseInt(crew)||0,
      workDone,
      delays,
      submittedBy:'Current User',
      submittedAt: new Date().toISOString()
    };
    setReports([newReport, ...reports]);
    setShowNew(false);
    setDate(new Date().toISOString().split('T')[0]);
    setWeather('clear');
    setCrew('');
    setWorkDone('');
    setDelays('');
  };

  return React.createElement('div',{className:'view'},
    React.createElement('div',{className:'pg-grid'},
      React.createElement('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}},
        React.createElement('h2',{style:{margin:0}},reports.length+' Daily Reports'),
        React.createElement('button',{onClick:()=>setShowNew(true),className:'btn btn--primary'},'New Report')
      ),

      reports.length === 0 ? React.createElement('div',{style:{textAlign:'center',padding:'60px 20px',color:'var(--muted)'}},
        React.createElement('p',{style:{fontSize:14,fontWeight:500}},'No daily reports yet'),
        React.createElement('p',{style:{fontSize:12,marginTop:8}},'Start logging construction progress')
      ) : React.createElement('div',{style:{display:'grid',gap:12}},
        reports.map(r=>React.createElement('div',{key:r.id,className:'card',style:{borderLeft:'4px solid var(--brand-cyan)'}},
          React.createElement('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'start',marginBottom:12}},
            React.createElement('div',null,
              React.createElement('div',{style:{fontSize:13,fontWeight:700}},new Date(r.date).toLocaleDateString('en-US',{weekday:'long',month:'short',day:'numeric'})),
              React.createElement('div',{style:{fontSize:11,color:'var(--muted)',marginTop:2}},r.submittedBy)
            ),
            React.createElement('span',{style:{background:'var(--success)',color:'white',padding:'2px 8px',borderRadius:3,fontSize:10,fontWeight:600}},
              {clear:'☀️ Clear',cloudy:'☁️ Cloudy',rainy:'🌧️ Rainy',snow:'❄️ Snow',extreme:'⚠️ Extreme'}[r.weather]
            )
          ),
          React.createElement('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:12}},
            React.createElement('div',null,
              React.createElement('div',{style:{fontSize:11,color:'var(--muted)',fontWeight:600}},r.crewCount+' Crew on Site'),
              React.createElement('div',{style:{fontSize:12,color:'var(--ink)',marginTop:4}})
            ),
            React.createElement('div',null,
              React.createElement('div',{style:{fontSize:11,color:'var(--muted)',fontWeight:600}},'Work Completed'),
              React.createElement('div',{style:{fontSize:12,color:'var(--ink)',marginTop:4}},r.workDone)
            )
          ),
          r.delays && React.createElement('div',{style:{padding:'8px 12px',background:'rgba(255,180,90,.1)',borderRadius:4,borderLeft:'2px solid var(--warn)',fontSize:12,color:'var(--ink)'}},
            React.createElement('strong',null,'Delays: '),r.delays
          )
        ))
      ),

      showNew && React.createElement('div',{className:'modal-overlay',onClick:()=>setShowNew(false)},
        React.createElement('div',{className:'modal',style:{maxWidth:600},onClick:(e)=>e.stopPropagation()},
          React.createElement('div',{className:'modal__head'},
            React.createElement('h2',null,'Daily Construction Report'),
            React.createElement('button',{className:'modal__close',onClick:()=>setShowNew(false)},'✕')
          ),
          React.createElement('form',{onSubmit:handleSubmit,className:'modal__body'},
            React.createElement('div',{className:'form-group'},
              React.createElement('label',null,'Date'),
              React.createElement('input',{type:'date',value:date,onChange:(e)=>setDate(e.target.value)})
            ),
            React.createElement('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}},
              React.createElement('div',{className:'form-group'},
                React.createElement('label',null,'Weather'),
                React.createElement('select',{value:weather,onChange:(e)=>setWeather(e.target.value)},
                  React.createElement('option',{value:'clear'},'Clear'),
                  React.createElement('option',{value:'cloudy'},'Cloudy'),
                  React.createElement('option',{value:'rainy'},'Rainy'),
                  React.createElement('option',{value:'snow'},'Snow'),
                  React.createElement('option',{value:'extreme'},'Extreme')
                )
              ),
              React.createElement('div',{className:'form-group'},
                React.createElement('label',null,'Crew on Site'),
                React.createElement('input',{type:'number',placeholder:'e.g., 15',value:crew,onChange:(e)=>setCrew(e.target.value)})
              )
            ),
            React.createElement('div',{className:'form-group'},
              React.createElement('label',null,'Work Completed'),
              React.createElement('textarea',{placeholder:'Describe work done today...',value:workDone,onChange:(e)=>setWorkDone(e.target.value),style:{minHeight:100}})
            ),
            React.createElement('div',{className:'form-group'},
              React.createElement('label',null,'Delays or Issues'),
              React.createElement('textarea',{placeholder:'Note any delays, weather impacts, material shortages...',value:delays,onChange:(e)=>setDelays(e.target.value),style:{minHeight:80}})
            ),
            React.createElement('button',{type:'submit',className:'btn btn--primary',style:{width:'100%'}},'Submit Report')
          )
        )
      )
    )
  );
}

Object.assign(window,{DailyReports});
