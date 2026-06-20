/* Weather Integration — Real-time Alerts */
function WeatherIntegration(){
  const [weather, setWeather] = React.useState({
    current:{temp:78,condition:'Partly Cloudy',humidity:65,windSpeed:12,feelsLike:81},
    forecast:[
      {day:'Tomorrow',high:82,low:72,condition:'Sunny',icon:'☀️'},
      {day:'Wed',high:75,low:68,condition:'Rainy',icon:'🌧️'},
      {day:'Thu',high:71,low:65,condition:'Cloudy',icon:'☁️'},
      {day:'Fri',high:79,low:70,condition:'Sunny',icon:'☀️'},
      {day:'Sat',high:85,low:73,condition:'Hot & Clear',icon:'🔥'}
    ],
    alerts:['Heat Advisory 90°F+','Rain expected Wed 2-6pm']
  });

  return React.createElement('div',{className:'view'},
    React.createElement('div',{className:'pg-grid'},
      React.createElement('div',{className:'card',style:{background:'linear-gradient(135deg,#1DB4E8,#0F7FB3)',color:'white',padding:20,marginBottom:20}},
        React.createElement('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24}},
          React.createElement('div',null,
            React.createElement('div',{style:{fontSize:14,opacity:0.9}},'Current Conditions'),
            React.createElement('div',{style:{fontSize:48,fontWeight:700,marginTop:8}},weather.current.temp+'°'),
            React.createElement('div',{style:{fontSize:16,marginTop:4}},weather.current.condition),
            React.createElement('div',{style:{fontSize:12,marginTop:8,opacity:0.9}},'Feels like '+weather.current.feelsLike+'° · Humidity '+weather.current.humidity+'%')
          ),
          React.createElement('div',null,
            React.createElement('div',{style:{fontSize:14,opacity:0.9}},weather.current.windSpeed+' mph wind'),
            React.createElement('div',{style:{fontSize:48,marginTop:8}},weather.current.windSpeed+''),
            React.createElement('div',{style:{fontSize:12,marginTop:4,opacity:0.9}},'from North')
          )
        )
      ),

      weather.alerts.length > 0 && React.createElement('div',{className:'card',style:{background:'rgba(255,138,30,.1)',borderLeft:'4px solid var(--warn)',marginBottom:20}},
        React.createElement('div',{style:{fontSize:12,fontWeight:600,color:'var(--warn)'}},
          '⚠️ Active Weather Alerts'
        ),
        React.createElement('ul',{style:{margin:'8px 0 0 0',paddingLeft:16,fontSize:12,color:'var(--ink)'}},
          weather.alerts.map((a,i)=>React.createElement('li',{key:i},a))
        )
      ),

      React.createElement('h3',{style:{fontSize:14,fontWeight:700,marginBottom:12}},'5-Day Forecast'),
      React.createElement('div',{style:{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:12}},
        weather.forecast.map((d,i)=>React.createElement('div',{key:i,className:'card',style:{textAlign:'center'}},
          React.createElement('div',{style:{fontSize:12,fontWeight:600,marginBottom:8}},d.day),
          React.createElement('div',{style:{fontSize:28,marginBottom:8}},d.icon),
          React.createElement('div',{style:{fontSize:11,color:'var(--muted)',marginBottom:8}},d.condition),
          React.createElement('div',{style:{fontSize:12,fontWeight:600}},d.high+'°'),
          React.createElement('div',{style:{fontSize:11,color:'var(--muted)'}},d.low+'°')
        ))
      )
    )
  );
}

Object.assign(window,{WeatherIntegration});
