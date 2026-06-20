/* Real-time Notifications */
function NotificationCenter(){
  const [notifications, setNotifications] = React.useState([
    {id:'N001',type:'rfi',message:'RFI-003 Responded: Roof flashing detail',time:'2 min ago',read:false},
    {id:'N002',type:'change',message:'CO-005 Approved: Additional electrical panel',time:'1 hour ago',read:false},
    {id:'N003',type:'invoice',message:'INV-10245 Received from EMT Electric - $44,476',time:'3 hours ago',read:true},
    {id:'N004',type:'schedule',message:'Foundation milestone 2 days ahead of schedule',time:'Yesterday',read:true},
    {id:'N005',type:'safety',message:'SAF-001 Reported: Near miss at concrete pour',time:'2 days ago',read:true}
  ]);

  const typeColor = {rfi:'var(--brand-cyan)',change:'var(--warn)',invoice:'var(--success)',schedule:'var(--brand-cyan)',safety:'var(--err)'};
  const typeIcon = {rfi:'📋',change:'🔄',invoice:'💸',schedule:'📅',safety:'🚨'};

  const unreadCount = notifications.filter(n=>!n.read).length;

  const handleMarkRead = (id) => {
    setNotifications(notifications.map(n=>n.id===id?{...n,read:true}:n));
  };

  return React.createElement('div',{className:'view'},
    React.createElement('div',{className:'pg-grid'},
      React.createElement('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}},
        React.createElement('h2',{style:{margin:0}},
          'Notifications',
          unreadCount>0 && React.createElement('span',{style:{background:'var(--err)',color:'white',padding:'2px 8px',borderRadius:12,fontSize:11,fontWeight:600,marginLeft:8}},unreadCount+' New')
        ),
        unreadCount>0 && React.createElement('button',{onClick:()=>setNotifications(notifications.map(n=>({...n,read:true}))),className:'btn btn--ghost',style:{fontSize:12}},'Mark All Read')
      ),

      notifications.map(n=>React.createElement('div',{key:n.id,className:'card',style:{background:n.read?'white':'rgba(29,180,232,.05)',borderLeft:'4px solid '+typeColor[n.type],marginBottom:12,cursor:'pointer',opacity:n.read?0.7:1},onClick:()=>handleMarkRead(n.id)},
        React.createElement('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'start'}},
          React.createElement('div',null,
            React.createElement('div',{style:{fontSize:12,fontWeight:600,color:'var(--ink)'}},typeIcon[n.type]+' '+n.message),
            React.createElement('div',{style:{fontSize:11,color:'var(--muted)',marginTop:4}},n.time)
          ),
          !n.read && React.createElement('span',{style:{display:'inline-block',width:8,height:8,background:'var(--brand-cyan)',borderRadius:'50%'}})
        )
      ))
    )
  );
}

Object.assign(window,{NotificationCenter});
