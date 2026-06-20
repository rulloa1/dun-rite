/* Equipment & Material Tracking */
function EquipmentTracking(){
  const [items, setItems] = React.useState([]);
  const [showNew, setShowNew] = React.useState(false);
  const [name, setName] = React.useState('');
  const [category, setCategory] = React.useState('equipment');
  const [quantity, setQuantity] = React.useState('');
  const [location, setLocation] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!name.trim() || !quantity) return;
    const newItem = {
      id: Math.random().toString(36).slice(2,9),
      name,
      category,
      quantity: parseInt(quantity),
      location,
      status: 'on-site',
      addedAt: new Date().toISOString(),
      addedBy: 'Current User'
    };
    setItems([newItem, ...items]);
    setShowNew(false);
    setName('');
    setCategory('equipment');
    setQuantity('');
    setLocation('');
  };

  const categories = {equipment:'Equipment',material:'Material',tool:'Tool',vehicle:'Vehicle'};

  return React.createElement('div',{className:'view'},
    React.createElement('div',{className:'pg-grid'},
      React.createElement('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:16,marginBottom:24}},
        React.createElement('div',{className:'card'},
          React.createElement('div',{style:{fontSize:11,color:'var(--muted)',fontWeight:600,textTransform:'uppercase'}},
            '📦 Total Items'
          ),
          React.createElement('div',{style:{fontSize:24,fontWeight:700,marginTop:8}},
            items.reduce((s,i)=>s+i.quantity,0)
          )
        ),
        React.createElement('div',{className:'card'},
          React.createElement('div',{style:{fontSize:11,color:'var(--muted)',fontWeight:600,textTransform:'uppercase'}},
            '🏗️ Equipment'
          ),
          React.createElement('div',{style:{fontSize:24,fontWeight:700,marginTop:8}},
            items.filter(i=>i.category==='equipment').length
          )
        ),
        React.createElement('div',{className:'card'},
          React.createElement('div',{style:{fontSize:11,color:'var(--muted)',fontWeight:600,textTransform:'uppercase'}},
            '🪛 Materials'
          ),
          React.createElement('div',{style:{fontSize:24,fontWeight:700,marginTop:8}},
            items.filter(i=>i.category==='material').length
          )
        )
      ),

      React.createElement('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}},
        React.createElement('h3',{style:{margin:0,fontSize:16,fontWeight:700}},items.length+' Items Tracked'),
        React.createElement('button',{onClick:()=>setShowNew(true),className:'btn btn--primary'},'Log Item')
      ),

      React.createElement('div',{className:'tbl-wrap'},
        React.createElement('table',{className:'tbl'},
          React.createElement('thead',null,
            React.createElement('tr',null,
              React.createElement('th',null,'Item'),
              React.createElement('th',null,'Category'),
              React.createElement('th',{textAlign:'center'},'Qty'),
              React.createElement('th',null,'Location'),
              React.createElement('th',null,'Added')
            )
          ),
          React.createElement('tbody',null,
            items.map(i=>React.createElement('tr',{key:i.id},
              React.createElement('td',{fontWeight:600},i.name),
              React.createElement('td',null,React.createElement('span',{style:{background:'var(--brand-cyan)',color:'white',padding:'2px 8px',borderRadius:3,fontSize:10,fontWeight:600}},categories[i.category])),
              React.createElement('td',{textAlign:'center',fontWeight:600},i.quantity),
              React.createElement('td',{color:'var(--muted)',fontSize:12},i.location),
              React.createElement('td',{color:'var(--muted)',fontSize:12},new Date(i.addedAt).toLocaleDateString())
            ))
          )
        )
      ),

      showNew && React.createElement('div',{className:'modal-overlay',onClick:()=>setShowNew(false)},
        React.createElement('div',{className:'modal',onClick:(e)=>e.stopPropagation()},
          React.createElement('div',{className:'modal__head'},
            React.createElement('h2',null,'Log Equipment/Material'),
            React.createElement('button',{className:'modal__close',onClick:()=>setShowNew(false)},'✕')
          ),
          React.createElement('form',{onSubmit:handleSubmit,className:'modal__body'},
            React.createElement('div',{className:'form-group'},
              React.createElement('label',null,'Item Name'),
              React.createElement('input',{type:'text',placeholder:'e.g., Concrete Mixer',value:name,onChange:(e)=>setName(e.target.value),autoFocus:true})
            ),
            React.createElement('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}},
              React.createElement('div',{className:'form-group'},
                React.createElement('label',null,'Category'),
                React.createElement('select',{value:category,onChange:(e)=>setCategory(e.target.value)},
                  Object.entries(categories).map(([k,v])=>React.createElement('option',{key:k,value:k},v))
                )
              ),
              React.createElement('div',{className:'form-group'},
                React.createElement('label',null,'Quantity'),
                React.createElement('input',{type:'number',placeholder:'1',value:quantity,onChange:(e)=>setQuantity(e.target.value)})
              )
            ),
            React.createElement('div',{className:'form-group'},
              React.createElement('label',null,'Location'),
              React.createElement('input',{type:'text',placeholder:'e.g., Building A Staging Area',value:location,onChange:(e)=>setLocation(e.target.value)})
            ),
            React.createElement('button',{type:'submit',className:'btn btn--primary',style:{width:'100%'}},'Log Item')
          )
        )
      )
    )
  );
}

Object.assign(window,{EquipmentTracking});
