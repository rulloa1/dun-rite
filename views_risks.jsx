/* Risk Register */
function RiskRegister(){
  const [risks, setRisks] = React.useState([]);
  const [showNew, setShowNew] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [probability, setProbability] = React.useState('medium');
  const [impact, setImpact] = React.useState('medium');
  const [mitigation, setMitigation] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!title.trim()) return;
    const newRisk = {
      id: 'RISK-'+(2000+risks.length),
      title,
      description,
      probability,
      impact,
      mitigation,
      status: 'open',
      createdAt: new Date().toISOString()
    };
    setRisks([newRisk, ...risks]);
    setShowNew(false);
    setTitle('');
    setDescription('');
    setProbability('medium');
    setImpact('medium');
    setMitigation('');
  };

  const riskScore = (p, i) => {
    const scoreMap = {high:3, medium:2, low:1};
    return scoreMap[p] * scoreMap[i];
  };

  const scoreColor = (score) => {
    if(score >= 7) return 'var(--err)';
    if(score >= 4) return 'var(--warn)';
    return 'var(--success)';
  };

  return React.createElement('div',{className:'view'},
    React.createElement('div',{className:'pg-grid'},
      React.createElement('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}},
        React.createElement('h2',{style:{margin:0}},risks.length+' Identified Risks'),
        React.createElement('button',{onClick:()=>setShowNew(true),className:'btn btn--primary'},'Add Risk')
      ),

      React.createElement('div',{style:{display:'grid',gap:12}},
        risks.map(r=>{
          const score = riskScore(r.probability, r.impact);
          return React.createElement('div',{key:r.id,className:'card',style:{borderLeft:'4px solid '+scoreColor(score),marginBottom:0}},
            React.createElement('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'start',marginBottom:12}},
              React.createElement('div',null,
                React.createElement('div',{style:{fontSize:13,fontWeight:700}},r.id+' — '+r.title),
                React.createElement('div',{style:{fontSize:11,color:'var(--muted)',marginTop:4}},'Probability: '+r.probability+' · Impact: '+r.impact)
              ),
              React.createElement('span',{style:{background:scoreColor(score),color:'white',padding:'4px 10px',borderRadius:3,fontSize:10,fontWeight:600}},
                'Score: '+score
              )
            ),
            r.description && React.createElement('p',{style:{fontSize:12,color:'var(--ink)',margin:'8px 0'}},r.description),
            r.mitigation && React.createElement('div',{style:{padding:'8px 12px',background:'rgba(31,138,91,.1)',borderRadius:4,fontSize:12,color:'var(--ink)',marginTop:8}},
              React.createElement('strong',null,'Mitigation: '),r.mitigation
            )
          );
        })
      ),

      showNew && React.createElement('div',{className:'modal-overlay',onClick:()=>setShowNew(false)},
        React.createElement('div',{className:'modal',onClick:(e)=>e.stopPropagation()},
          React.createElement('div',{className:'modal__head'},
            React.createElement('h2',null,'Register Risk'),
            React.createElement('button',{className:'modal__close',onClick:()=>setShowNew(false)},'✕')
          ),
          React.createElement('form',{onSubmit:handleSubmit,className:'modal__body'},
            React.createElement('div',{className:'form-group'},
              React.createElement('label',null,'Risk Title'),
              React.createElement('input',{type:'text',placeholder:'e.g., Material Shortage',value:title,onChange:(e)=>setTitle(e.target.value),autoFocus:true})
            ),
            React.createElement('div',{className:'form-group'},
              React.createElement('label',null,'Description'),
              React.createElement('textarea',{placeholder:'Describe the risk...',value:description,onChange:(e)=>setDescription(e.target.value),style:{minHeight:80}})
            ),
            React.createElement('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}},
              React.createElement('div',{className:'form-group'},
                React.createElement('label',null,'Probability'),
                React.createElement('select',{value:probability,onChange:(e)=>setProbability(e.target.value)},
                  React.createElement('option',{value:'low'},'Low'),
                  React.createElement('option',{value:'medium'},'Medium'),
                  React.createElement('option',{value:'high'},'High')
                )
              ),
              React.createElement('div',{className:'form-group'},
                React.createElement('label',null,'Impact'),
                React.createElement('select',{value:impact,onChange:(e)=>setImpact(e.target.value)},
                  React.createElement('option',{value:'low'},'Low'),
                  React.createElement('option',{value:'medium'},'Medium'),
                  React.createElement('option',{value:'high'},'High')
                )
              )
            ),
            React.createElement('div',{className:'form-group'},
              React.createElement('label',null,'Mitigation Strategy'),
              React.createElement('textarea',{placeholder:'How will we mitigate this risk?',value:mitigation,onChange:(e)=>setMitigation(e.target.value),style:{minHeight:80}})
            ),
            React.createElement('button',{type:'submit',className:'btn btn--primary',style:{width:'100%'}},'Register Risk')
          )
        )
      )
    )
  );
}

Object.assign(window,{RiskRegister});
