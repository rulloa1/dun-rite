/* Dashboard / Executive Summary */
function Dashboard(){
  const D=window.DR;
  const total=D.budget.current;
  const committedPct=Math.round(D.budget.committed/total*100);

  const miniStats=[
    {label:'Open RFIs', val:'3', of:'of 10', tone:'red', icon:'help'},
    {label:'Open Submittals', val:'4', of:'of 10', tone:'amber', icon:'inbox'},
    {label:'Schedule Delay', val:'25d', of:'5 events', tone:'amber', icon:'clock'},
    {label:'Contingency Var.', val:D.usdK(D.budget.variance), of:'-1.0% budget', tone:'red', icon:'trend'},
  ];

  return React.createElement('div',{className:'page'},
    /* head */
    React.createElement('div',{className:'page-head'},
      React.createElement('div',null,
        React.createElement('h1',null,'Executive Summary'),
        React.createElement('div',{className:'sub'},
          React.createElement('span',{className:'chip'},React.createElement(Icon.pin),D.project.name+' · '+D.project.lot),
          React.createElement('span',{className:'chip'},React.createElement(Icon.cal),D.project.months+'-month schedule'),
          React.createElement('span',{className:'chip'},React.createElement(Icon.flag),'Started '+D.project.start+' · Target '+D.project.target)
        )
      ),
      React.createElement('div',{style:{display:'flex',gap:10}},
        React.createElement('button',{className:'btn btn--ghost'},React.createElement(Icon.mail),'Open / Email'),
        React.createElement('button',{className:'btn btn--primary'},React.createElement(Icon.download),'Download Workbook')
      )
    ),

    /* KPI row */
    React.createElement('div',{className:'grid kpis'}, D.kpis.map(k=>React.createElement(Kpi,{key:k.key,...k}))),

    /* budget health + project health */
    React.createElement('div',{className:'grid cols-2-1'},
      React.createElement('div',{className:'card'},
        React.createElement('div',{className:'card__h'},
          React.createElement('h3',null,'Budget Health'),
          React.createElement('span',{className:'meta'},'Current budget '+D.usd(D.budget.current))
        ),
        React.createElement('div',{className:'donut-wrap'},
          React.createElement('div',{className:'donut'},
            React.createElement(Donut,{size:150,stroke:22,segments:D.composition}),
            React.createElement('div',{className:'donut__center'},
              React.createElement('div',{className:'n tnum'},committedPct+'%'),
              React.createElement('div',{className:'l'},'Committed')
            )
          ),
          React.createElement('div',{className:'legend'},
            D.composition.map((s,i)=>React.createElement('div',{key:i,className:'legend__row'},
              React.createElement('span',{className:'legend__sw',style:{background:s.c}}),
              React.createElement('span',{className:'k'},s.k),
              React.createElement('span',{className:'v tnum'},D.usd(s.v))
            )),
            React.createElement('div',{style:{height:1,background:'var(--line-soft)',margin:'4px 0'}}),
            React.createElement('div',{className:'legend__row'},
              React.createElement('span',{style:{width:11}}),
              React.createElement('span',{className:'k',style:{fontWeight:700,color:'var(--ink)'}},'Contingency variance'),
              React.createElement('span',{className:'v tnum',style:{color:'var(--bad)'}},D.usdK(D.budget.variance))
            )
          )
        )
      ),
      React.createElement('div',{className:'card'},
        React.createElement('div',{className:'card__h'},React.createElement('h3',null,'Project Health')),
        React.createElement('div',{style:{padding:'14px 18px 18px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}},
          miniStats.map((m,i)=>{
            const t=toneBg[m.tone];
            return React.createElement('div',{key:i,style:{background:'var(--card-tint)',border:'1px solid var(--line-soft)',borderRadius:12,padding:'13px 14px'}},
              React.createElement('div',{style:{display:'flex',alignItems:'center',gap:8,marginBottom:8}},
                React.createElement('span',{style:{width:28,height:28,borderRadius:8,display:'grid',placeItems:'center',background:t.bg,color:t.fg}},React.createElement(Icon[m.icon])),
                React.createElement('span',{style:{fontSize:12,color:'var(--muted)',fontWeight:600}},m.label)
              ),
              React.createElement('div',{style:{display:'flex',alignItems:'baseline',gap:6}},
                React.createElement('span',{className:'tnum',style:{fontFamily:'Archivo',fontWeight:800,fontSize:22,color:'var(--ink)'}},m.val),
                React.createElement('span',{style:{fontSize:12,color:'var(--faint)',fontWeight:600}},m.of)
              )
            );
          })
        )
      )
    ),

    /* milestones + activity */
    React.createElement('div',{className:'grid cols-2-1'},
      React.createElement('div',{className:'card'},
        React.createElement('div',{className:'card__h'},
          React.createElement('h3',null,'Schedule Milestones'),
          React.createElement('span',{className:'meta'},'3 of 9 complete · '+D.project.pct+'%')
        ),
        React.createElement('div',{style:{padding:'14px 20px 0'}},
          React.createElement('div',{className:'prog'},React.createElement('i',{style:{width:D.project.pct+'%'}}))
        ),
        React.createElement('div',{className:'mstones'},
          D.milestones.map(m=>React.createElement('div',{key:m.n,className:'mrow '+m.status},
            React.createElement('div',{className:'mnum'}, m.status==='done'?'✓':m.n),
            React.createElement('div',null,
              React.createElement('div',{className:'mtitle'},m.t),
              React.createElement('div',{className:'mdates'},
                React.createElement('span',null,'Sched ',React.createElement('b',null,m.sched)),
                React.createElement('span',null,'Actual ',React.createElement('b',null,m.actual))
              )
            ),
            React.createElement(Pill,{status:m.status})
          ))
        )
      ),
      React.createElement('div',{className:'card'},
        React.createElement('div',{className:'card__h'},React.createElement('h3',null,'Recent Activity')),
        React.createElement('div',{className:'alist'},
          D.activity.map((a,i)=>{
            const t=toneBg[a.tone==='ok'?'green':a.tone==='bad'?'red':'amber'];
            return React.createElement('div',{key:i,className:'aitem'},
              React.createElement('span',{className:'aico',style:{background:t.bg,color:t.fg}},React.createElement(Icon[a.icon])),
              React.createElement('div',{style:{flex:1}},
                React.createElement('div',{className:'t'},a.t),
                React.createElement('div',{className:'d'},a.d)
              ),
              React.createElement('span',{className:'when'},a.when)
            );
          })
        )
      )
    )
  );
}
window.Dashboard=Dashboard;
