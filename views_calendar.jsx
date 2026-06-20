/* Calendar & Integration Sync */
function CalendarIntegration(){
  const [events, setEvents] = React.useState([
    {id:'E1',title:'Weekly Site Meeting',date:'2026-06-17',time:'10:00 AM',duration:60,location:'Site Office',attendees:8,type:'meeting'},
    {id:'E2',title:'Concrete Pour — Foundation Phase 2',date:'2026-06-18',time:'08:00 AM',duration:480,location:'Building A',attendees:15,type:'work'},
    {id:'E3',title:'Framing Inspection — 3rd Floor',date:'2026-06-19',time:'02:00 PM',duration:120,location:'Building B',attendees:4,type:'inspection'},
    {id:'E4',title:'Safety Briefing',date:'2026-06-20',time:'07:30 AM',duration:30,location:'Site Office',attendees:20,type:'safety'},
    {id:'E5',title:'Project Review Meeting',date:'2026-06-20',time:'03:00 PM',duration:90,location:'Conference Room',attendees:6,type:'meeting'}
  ]);

  const sortedEvents = [...events].sort((a,b)=>new Date(a.date+' '+a.time)-new Date(b.date+' '+b.time));
  const typeColor = {meeting:'var(--brand-cyan)',work:'var(--success)',inspection:'var(--warn)',safety:'var(--err)'};
  const typeIcon = {meeting:'📋',work:'🏗️',inspection:'🔍',safety:'🚨'};

  return React.createElement('div',{className:'view'},
    React.createElement('div',{className:'pg-grid'},
      React.createElement('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:16,marginBottom:24}},
        React.createElement('div',{className:'card'},
          React.createElement('div',{style:{fontSize:11,color:'var(--muted)',fontWeight:600,textTransform:'uppercase'}},
            '📅 Upcoming Events'
          ),
          React.createElement('div',{style:{fontSize:22,fontWeight:700,marginTop:8}},
            events.length
          )
        ),
        React.createElement('div',{className:'card'},
          React.createElement('div',{style:{fontSize:11,color:'var(--muted)',fontWeight:600,textTransform:'uppercase'}},
            '👥 This Week'
          ),
          React.createElement('div',{style:{fontSize:22,fontWeight:700,marginTop:8}},
            events.filter(e=>{
              const d = new Date(e.date);
              const now = new Date();
              return d-now < 7*24*60*60*1000 && d >= now;
            }).length
          )
        ),
        React.createElement('div',{className:'card'},
          React.createElement('div',{style:{fontSize:11,color:'var(--muted)',fontWeight:600,textTransform:'uppercase'}},
            '🔗 Synced Calendars'
          ),
          React.createElement('div',{style:{fontSize:22,fontWeight:700,marginTop:8}},
            '3'
          ),
          React.createElement('div',{style:{fontSize:10,color:'var(--muted)',marginTop:4}},'Google, Outlook, iCal')
        )
      ),

      React.createElement('h3',{style:{fontSize:14,fontWeight:700,marginBottom:16}},'Next 7 Days'),
      React.createElement('div',{className:'tbl-wrap'},
        React.createElement('table',{className:'tbl'},
          React.createElement('thead',null,
            React.createElement('tr',null,
              React.createElement('th',null,'Event'),
              React.createElement('th',null,'Date & Time'),
              React.createElement('th',null,'Location'),
              React.createElement('th',{textAlign:'center'},'Attendees'),
              React.createElement('th',null,'Type')
            )
          ),
          React.createElement('tbody',null,
            sortedEvents.map(e=>React.createElement('tr',{key:e.id},
              React.createElement('td',{fontWeight:600},e.title),
              React.createElement('td',{fontSize:12,color:'var(--muted)'},new Date(e.date).toLocaleDateString()+' · '+e.time),
              React.createElement('td',{fontSize:12},e.location),
              React.createElement('td',{textAlign:'center',fontWeight:600},e.attendees),
              React.createElement('td',null,
                React.createElement('span',{style:{background:typeColor[e.type],color:'white',padding:'2px 8px',borderRadius:3,fontSize:10,fontWeight:600}},
                  typeIcon[e.type]+' '+e.type.charAt(0).toUpperCase()+e.type.slice(1)
                )
              )
            ))
          )
        )
      ),

      React.createElement('div',{style:{marginTop:24,padding:16,background:'var(--bg)',borderRadius:6}},
        React.createElement('h4',{style:{fontSize:12,fontWeight:700,marginBottom:8}},
          '🔄 Connected Integrations:'
        ),
        React.createElement('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:12,fontSize:11,color:'var(--ink)'}},
          React.createElement('div',null,'✓ Google Calendar'),
          React.createElement('div',null,'✓ Microsoft Outlook'),
          React.createElement('div',null,'✓ iCal / Apple Calendar'),
          React.createElement('div',null,'✓ Slack reminders'),
          React.createElement('div',null,'✓ Email notifications'),
          React.createElement('div',null,'✓ Mobile push alerts')
        )
      )
    )
  );
}

Object.assign(window,{CalendarIntegration});
