/* Meeting Minutes with Auto-Generated Action Items */
function MeetingMinutes(){
  const [meetings, setMeetings] = React.useState([
    {id:'M001',date:'2026-06-15',title:'Weekly Coordination',attendees:['Rory Ulloa','Michael Chandler','John Smith'],duration:45,topics:['Foundation progress','Schedule review','Safety briefing'],actions:[{text:'Follow up on concrete delivery',owner:'John Smith',due:'2026-06-17',status:'open'}]},
    {id:'M002',date:'2026-06-08',title:'Budget Review',attendees:['Rory Ulloa','Finance Director'],duration:60,topics:['Cost codes review','Change order pipeline','Cash flow projection'],actions:[{text:'Prepare cost forecast update',owner:'Finance',due:'2026-06-10',status:'complete'}]},
  ]);

  return React.createElement('div',{className:'view'},
    React.createElement('div',{className:'pg-grid'},
      meetings.map(m=>React.createElement('div',{key:m.id,className:'card',style:{marginBottom:20}},
        React.createElement('div',{style:{marginBottom:12}},
          React.createElement('div',{style:{fontSize:13,fontWeight:700}},m.title),
          React.createElement('div',{style:{fontSize:11,color:'var(--muted)',marginTop:2}},new Date(m.date).toLocaleDateString()+' · '+m.duration+' min')
        ),
        React.createElement('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:12}},
          React.createElement('div',null,
            React.createElement('div',{style:{fontSize:11,color:'var(--muted)',fontWeight:600,marginBottom:6}},'Attendees'),
            React.createElement('ul',{style:{margin:0,paddingLeft:16,fontSize:12,color:'var(--ink)'}},
              m.attendees.map((a,i)=>React.createElement('li',{key:i},a))
            )
          ),
          React.createElement('div',null,
            React.createElement('div',{style:{fontSize:11,color:'var(--muted)',fontWeight:600,marginBottom:6}},'Topics'),
            React.createElement('ul',{style:{margin:0,paddingLeft:16,fontSize:12,color:'var(--ink)'}},
              m.topics.map((t,i)=>React.createElement('li',{key:i},t))
            )
          )
        ),
        React.createElement('div',null,
          React.createElement('div',{style:{fontSize:11,color:'var(--muted)',fontWeight:600,marginBottom:8}},'Action Items'),
          m.actions.map(a=>React.createElement('div',{key:a.text,style:{padding:8,background:'var(--bg)',borderRadius:4,marginBottom:6}},
            React.createElement('div',{style:{fontSize:11,fontWeight:600,color:'var(--ink)'}},a.text),
            React.createElement('div',{style:{fontSize:10,color:'var(--muted)',marginTop:4}},'Owner: '+a.owner+' · Due: '+new Date(a.due).toLocaleDateString()),
            React.createElement('span',{style:{background:a.status==='complete'?'var(--success)':'var(--warn)',color:'white',padding:'2px 6px',borderRadius:2,fontSize:9,fontWeight:600,marginTop:4,display:'inline-block'}},
              a.status==='complete'?'✓ Done':'Pending'
            )
          ))
        )
      ))
    )
  );
}

Object.assign(window,{MeetingMinutes});
