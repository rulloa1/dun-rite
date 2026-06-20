/* Schedule — gantt timeline */
function Schedule(){
  const D=window.DR, SPAN=20;
  const pos=v=>v/SPAN*100;
  return React.createElement('div',{className:'page'},
    React.createElement('div',{className:'page-head'},
      React.createElement('div',null,
        React.createElement('h1',null,'Construction Schedule'),
        React.createElement('div',{className:'sub'},
          React.createElement('span',{className:'chip'},React.createElement(Icon.cal),'18 months · Mar 3, 2025 → Oct 2, 2026'),
          React.createElement('span',{className:'chip'},React.createElement(Icon.clock),'25 delay days logged')
        )
      ),
      React.createElement('div',{style:{display:'flex',gap:10}},
        React.createElement('button',{className:'btn btn--ghost'},React.createElement(Icon.download),'Export'),
        React.createElement('button',{className:'btn btn--primary'},React.createElement(Icon.edit),'Update Status')
      )
    ),

    React.createElement('div',{className:'grid kpis',style:{gridTemplateColumns:'repeat(4,1fr)'}},
      React.createElement(Kpi,{label:'Overall Progress',val:'33%',sub:'3 of 9 milestones',icon:'trend',tone:'cyan'}),
      React.createElement(Kpi,{label:'Current Phase',val:'Drywall',sub:'In progress',icon:'layers',tone:'amber'}),
      React.createElement(Kpi,{label:'Schedule Variance',val:'+25d',sub:'Behind baseline',icon:'clock',tone:'red'}),
      React.createElement(Kpi,{label:'Days to Completion',val:'112',sub:'to Oct 2, 2026',icon:'flag',tone:'navy'})
    ),

    React.createElement('div',{className:'card tablecard'},
      React.createElement('div',{className:'card__h'},
        React.createElement('h3',null,'Milestone Timeline'),
        React.createElement('div',{style:{display:'flex',gap:16,fontSize:12,fontWeight:600,color:'var(--muted)'}},
          React.createElement('span',null,'■ Complete'),React.createElement('span',null,'■ In progress'),React.createElement('span',null,'▨ Upcoming')
        )
      ),
      React.createElement('div',{className:'gantt'},
        React.createElement('div',{className:'gantt__head'},
          React.createElement('div',{style:{padding:'10px 16px',fontSize:11,fontWeight:700,color:'var(--muted)',textTransform:'uppercase',letterSpacing:'.06em'}},'Milestone'),
          React.createElement('div',{className:'gantt__months'},
            D.ganttMonths.map((m,i)=>React.createElement('div',{key:i,className:'gantt__month'},m+(i>=5?" '26":" '25")))
          )
        ),
        D.gantt.map((g,i)=>React.createElement('div',{key:i,className:'gantt__row'},
          React.createElement('div',{className:'gantt__label'},
            React.createElement('span',{className:'mnum',style:{width:24,height:24,fontSize:11,
              background:g.status==='done'?'var(--ok)':g.status==='active'?'var(--warn)':'#fff',
              color:g.status==='next'?'var(--faint)':'#fff',
              borderColor:g.status==='done'?'var(--ok)':g.status==='active'?'var(--warn)':'var(--line)'}}, g.status==='done'?'✓':i+1),
            g.t
          ),
          React.createElement('div',{className:'gantt__track'},
            [1,2,3,4,5,6,7,8,9].map(n=>React.createElement('div',{key:n,style:{position:'absolute',left:pos(n*2)+'%',top:0,bottom:0,width:1,background:'var(--line-soft)'}})),
            React.createElement('div',{className:'gantt__today',style:{left:pos(D.todayPos)+'%'}}, i===0?undefined:null),
            React.createElement('div',{className:'gantt__bar '+g.status,style:{left:pos(g.s)+'%',width:pos(g.e-g.s)+'%'}})
          )
        ))
      )
    ),

    React.createElement('div',{className:'card tablecard',style:{marginTop:18}},
      React.createElement('div',{className:'card__h'},React.createElement('h3',null,'Milestone Detail')),
      React.createElement('table',{className:'tbl'},
        React.createElement('thead',null,React.createElement('tr',null,
          ['#','Milestone','Scheduled','Actual / Forecast','Status'].map((h,i)=>React.createElement('th',{key:i,style:i===0?{width:50}:null},h)))),
        React.createElement('tbody',null, D.milestones.map(m=>React.createElement('tr',{key:m.n},
          React.createElement('td',{className:'code'},m.n),
          React.createElement('td',{className:'strong'},m.t),
          React.createElement('td',null,m.sched),
          React.createElement('td',null,m.actual),
          React.createElement('td',null,React.createElement(Pill,{status:m.status}))
        )))
      )
    )
  );
}
window.Schedule=Schedule;
