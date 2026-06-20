/* Document Management */
function DocumentManager(){
  const [docs, setDocs] = React.useState([]);
  const [filter, setFilter] = React.useState('all');
  const [uploadModal, setUploadModal] = React.useState(false);
  const [docName, setDocName] = React.useState('');
  const [docType, setDocType] = React.useState('rfi');

  const types = {
    rfi:'RFI',
    submittal:'Submittal',
    spec:'Specification',
    contract:'Contract',
    permit:'Permit',
    cert:'Certification',
    plan:'Plan',
    other:'Other'
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if(!docName.trim()) return;
    const newDoc = {
      id: Math.random().toString(36).slice(2,9),
      name: docName,
      type: docType,
      uploadedBy: 'Current User',
      uploadedAt: new Date().toISOString(),
      versions: [{v:1, date: new Date().toISOString(), uploadedBy:'Current User', size:'2.4 MB'}],
      status: 'active'
    };
    setDocs([newDoc, ...docs]);
    setDocName('');
    setDocType('rfi');
    setUploadModal(false);
  };

  const filtered = filter === 'all' ? docs : docs.filter(d => d.type === filter);

  return React.createElement('div',{className:'view'},
    React.createElement('div',{className:'pg-grid'},
      React.createElement('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}},
        React.createElement('div',null,
          React.createElement('h2',{style:{margin:'0 0 6px 0'}},docs.length+' Documents'),
          React.createElement('p',{style:{color:'var(--muted)',fontSize:12,margin:0}},'Specifications, RFIs, Submittals, Permits & Plans')
        ),
        React.createElement('button',{onClick:()=>setUploadModal(true),className:'btn btn--primary'},'Upload Document')
      ),

      React.createElement('div',{style:{display:'flex',gap:12,marginBottom:24,flexWrap:'wrap'}},
        React.createElement('button',{onClick:()=>setFilter('all'),style:{padding:'6px 12px',border:filter==='all'?'2px solid var(--brand-cyan)':'1px solid var(--border)',background:filter==='all'?'rgba(29,180,232,.1)':'white',borderRadius:4,cursor:'pointer',fontSize:12,fontWeight:600,color:filter==='all'?'var(--brand-cyan)':'var(--ink)'}},'All Documents'),
        Object.entries(types).map(([k,v])=>
          React.createElement('button',{key:k,onClick:()=>setFilter(k),style:{padding:'6px 12px',border:filter===k?'2px solid var(--brand-cyan)':'1px solid var(--border)',background:filter===k?'rgba(29,180,232,.1)':'white',borderRadius:4,cursor:'pointer',fontSize:12,fontWeight:600,color:filter===k?'var(--brand-cyan)':'var(--ink)'}},v)
        )
      ),

      React.createElement('div',{className:'tbl-wrap'},
        React.createElement('table',{className:'tbl'},
          React.createElement('thead',null,
            React.createElement('tr',null,
              React.createElement('th',null,'Document'),
              React.createElement('th',null,'Type'),
              React.createElement('th',null,'Uploaded'),
              React.createElement('th',null,'Versions'),
              React.createElement('th',{style:{width:100}},'Action')
            )
          ),
          React.createElement('tbody',null,
            filtered.map(d=>React.createElement('tr',{key:d.id},
              React.createElement('td',{style:{fontWeight:600}},d.name),
              React.createElement('td',null,React.createElement('span',{style:{background:'var(--brand-cyan)',color:'white',padding:'2px 8px',borderRadius:3,fontSize:10,fontWeight:600}},types[d.type])),
              React.createElement('td',{style:{color:'var(--muted)',fontSize:12}},new Date(d.uploadedAt).toLocaleDateString()),
              React.createElement('td',{style:{color:'var(--muted)',fontSize:12}},d.versions.length+' versions'),
              React.createElement('td',null,
                React.createElement('button',{style:{background:'none',border:'none',color:'var(--brand-cyan)',cursor:'pointer',fontSize:12,fontWeight:600}},'Download'),
                React.createElement('span',{style:{margin:'0 6px',color:'var(--border)'}},'|'),
                React.createElement('button',{style:{background:'none',border:'none',color:'var(--muted)',cursor:'pointer',fontSize:12,fontWeight:600}},'More')
              )
            ))
          )
        )
      )
    ),

    uploadModal && React.createElement('div',{className:'modal-overlay',onClick:()=>setUploadModal(false)},
      React.createElement('div',{className:'modal',onClick:(e)=>e.stopPropagation()},
        React.createElement('div',{className:'modal__head'},
          React.createElement('h2',null,'Upload Document'),
          React.createElement('button',{className:'modal__close',onClick:()=>setUploadModal(false)},'✕')
        ),
        React.createElement('form',{onSubmit:handleUpload,className:'modal__body'},
          React.createElement('div',{className:'form-group'},
            React.createElement('label',null,'Document Name'),
            React.createElement('input',{type:'text',placeholder:'e.g., Structural Steel Submittal',value:docName,onChange:(e)=>setDocName(e.target.value),autoFocus:true})
          ),
          React.createElement('div',{className:'form-group'},
            React.createElement('label',null,'Document Type'),
            React.createElement('select',{value:docType,onChange:(e)=>setDocType(e.target.value)},
              Object.entries(types).map(([k,v])=>React.createElement('option',{key:k,value:k},v))
            )
          ),
          React.createElement('div',{className:'form-group'},
            React.createElement('label',null,'File'),
            React.createElement('input',{type:'file',style:{padding:'8px 0'}})
          ),
          React.createElement('button',{type:'submit',className:'btn btn--primary',style:{width:'100%'}},'Upload')
        )
      )
    )
  );
}

Object.assign(window,{DocumentManager});
