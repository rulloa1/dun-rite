/* Site Logistics — Parking, Staging, Delivery */
function SiteLogistics(){
  const [logistics, setLogistics] = React.useState([
    {id:'L001',type:'parking',location:'North Lot',capacity:25,available:8,status:'in-use'},
    {id:'L002',type:'staging',location:'Building A Perimeter',capacity:100,available:40,status:'in-use'},
    {id:'L003',type:'delivery',location:'Main Gate',nextDelivery:'2026-06-20 08:00 AM',items:['Electrical Panels','Wire','Conduit'],status:'scheduled'}
  ]);

  const typeIcon = {parking:'🅿️',staging:'📦',delivery:'🚚'};

  return React.createElement('div',{className:'view'},
    React.createElement('div',{className:'pg-grid'},
      logistics.map(l=>React.createElement('div',{key:l.id,className:'card',style:{marginBottom:16}},
        React.createElement('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'start',marginBottom:12}},
          React.createElement('div',null,
            React.createElement('div',{style:{fontSize:13,fontWeight:700}},typeIcon[l.type]+' '+l.location),
            React.createElement('div',{style:{fontSize:11,color:'var(--muted)',marginTop:4}},l.type.charAt(0).toUpperCase()+l.type.slice(1)+' Area')
          ),
          React.createElement('span',{style:{background:l.status==='in-use'?'var(--brand-cyan)':'var(--success)',color:'white',padding:'3px 8px',borderRadius:3,fontSize:10,fontWeight:600}},
            l.status==='in-use'?'In Use':'Scheduled'
          )
        ),
        l.type==='delivery' ? React.createElement('div',null,
          React.createElement('div',{style:{fontSize:12,color:'var(--ink)',marginBottom:8}},
            React.createElement('strong',null,'Next Delivery: '),l.nextDelivery
          ),
          React.createElement('div',{style:{fontSize:11,color:'var(--muted)'}},'Items: '+l.items.join(', '))
        ) : React.createElement('div',null,
          React.createElement('div',{style:{width:'100%',height:8,background:'var(--border)',borderRadius:4,marginBottom:8}},
            React.createElement('div',{style:{width:(1-l.available/l.capacity)*100+'%',height:'100%',background:'var(--brand-cyan)',borderRadius:4}})
          ),
          React.createElement('div',{style:{fontSize:11,color:'var(--muted)'}},
            l.available+' / '+l.capacity+' available'
          )
        )
      ))
    )
  );
}

Object.assign(window,{SiteLogistics});
