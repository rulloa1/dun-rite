/* Photo/Video Progress Log */
function PhotoLog(){
  const [photos, setPhotos] = React.useState([]);
  const [showNew, setShowNew] = React.useState(false);
  const [date, setDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = React.useState('');
  const [caption, setCaption] = React.useState('');
  const [phase, setPhase] = React.useState('framing');

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!caption.trim()) return;
    const newPhoto = {
      id: Math.random().toString(36).slice(2,9),
      date, location, caption, phase,
      uploadedBy: 'Current User',
      uploadedAt: new Date().toISOString(),
      url: 'https://via.placeholder.com/400x300?text='+encodeURIComponent(caption.slice(0,20))
    };
    setPhotos([newPhoto, ...photos]);
    setShowNew(false);
    setCaption('');
    setLocation('');
  };

  return React.createElement('div',{className:'view'},
    React.createElement('div',{className:'pg-grid'},
      React.createElement('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}},
        React.createElement('h2',{style:{margin:0}},photos.length+' Progress Photos'),
        React.createElement('button',{onClick:()=>setShowNew(true),className:'btn btn--primary'},'Upload Photo')
      ),
      React.createElement('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:16}},
        photos.map(p=>React.createElement('div',{key:p.id,className:'card',style:{overflow:'hidden'}},
          React.createElement('div',{style:{background:'var(--bg)',height:200,display:'flex',alignItems:'center',justifyContent:'center',color:'var(--muted)',fontSize:12}},'Photo: '+p.caption.slice(0,30)),
          React.createElement('div',{style:{padding:12}},
            React.createElement('div',{style:{fontSize:12,fontWeight:700,marginBottom:4}},new Date(p.date).toLocaleDateString()),
            React.createElement('div',{style:{fontSize:11,color:'var(--muted)',marginBottom:8}},p.location),
            React.createElement('div',{style:{fontSize:12,color:'var(--ink)',marginBottom:8}},p.caption),
            React.createElement('span',{style:{background:'var(--brand-cyan)',color:'white',padding:'2px 6px',borderRadius:3,fontSize:9,fontWeight:600}},p.phase)
          )
        ))
      ),
      showNew && React.createElement('div',{className:'modal-overlay',onClick:()=>setShowNew(false)},
        React.createElement('div',{className:'modal',onClick:(e)=>e.stopPropagation()},
          React.createElement('div',{className:'modal__head'},
            React.createElement('h2',null,'Upload Progress Photo'),
            React.createElement('button',{className:'modal__close',onClick:()=>setShowNew(false)},'✕')
          ),
          React.createElement('form',{onSubmit:handleSubmit,className:'modal__body'},
            React.createElement('div',{className:'form-group'},
              React.createElement('label',null,'Date'),
              React.createElement('input',{type:'date',value:date,onChange:(e)=>setDate(e.target.value)})
            ),
            React.createElement('div',{className:'form-group'},
              React.createElement('label',null,'Location'),
              React.createElement('input',{type:'text',placeholder:'Building A, 2nd Floor',value:location,onChange:(e)=>setLocation(e.target.value)})
            ),
            React.createElement('div',{className:'form-group'},
              React.createElement('label',null,'Photo/Caption'),
              React.createElement('textarea',{placeholder:'What does this photo show?',value:caption,onChange:(e)=>setCaption(e.target.value),style:{minHeight:80}})
            ),
            React.createElement('div',{className:'form-group'},
              React.createElement('label',null,'Construction Phase'),
              React.createElement('select',{value:phase,onChange:(e)=>setPhase(e.target.value)},
                React.createElement('option',{value:'site-prep'},'Site Prep'),
                React.createElement('option',{value:'foundation'},'Foundation'),
                React.createElement('option',{value:'framing'},'Framing'),
                React.createElement('option',{value:'mep'},'MEP'),
                React.createElement('option',{value:'interior'},'Interior'),
                React.createElement('option',{value:'finishing'},'Finishing'),
                React.createElement('option',{value:'closeout'},'Closeout')
              )
            ),
            React.createElement('button',{type:'submit',className:'btn btn--primary',style:{width:'100%'}},'Upload')
          )
        )
      )
    )
  );
}

Object.assign(window,{PhotoLog});
