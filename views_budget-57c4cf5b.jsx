/* Budget & Cost Control */
function Budget(){
  const D=window.DR, [open,setOpen]=useState('02-000');
  const tot=D.divisions.reduce((a,d)=>({b:a.b+d.budget,c:a.c+d.committed}),{b:0,c:0});

  const Row=(d)=>{
    const pct=Math.round(d.committed/d.budget*100);
    const rem=d.budget-d.committed;
    const hasSub=!!D.subDetail[d.code];
    const isOpen=open===d.code;
    return React.createElement(React.Fragment,{key:d.code},
      React.createElement('tr',{onClick:hasSub?()=>setOpen(isOpen?null:d.code):null,style:{cursor:hasSub?'pointer':'default'}},
        React.createElement('td',{className:'code'},
          hasSub&&React.createElement('span',{style:{display:'inline-block',width:14,transform:isOpen?'rotate(90deg)':'none',transition:'.15s',color:'var(--brand-blue)'}},'▸'),
          ' '+d.code),
        React.createElement('td',{className:'strong'},d.name),
        React.createElement('td',{className:'num'},D.usd(d.budget)),
        React.createElement('td',{className:'num'},D.usd(d.committed)),
        React.createElement('td',{className:'num',style:{color:rem<0?'var(--bad)':'var(--ink-2)'}},D.usd(rem)),
        React.createElement('td',null,
          React.createElement('div',{style:{display:'flex',alignItems:'center',gap:10}},
            React.createElement('div',{className:'bar-mini'},React.createElement('i',{style:{width:Math.min(100,pct)+'%'}})),
            React.createElement('span',{className:'tnum',style:{fontSize:12.5,fontWeight:700,color:'var(--ink-2)',width:34,textAlign:'right'}},pct+'%')
          )
        )
      ),
      hasSub&&isOpen&&D.subDetail[d.code].map(s=>{
        const sp=Math.round(s.committed/s.budget*100);
        return React.createElement('tr',{key:s.code,style:{background:'var(--card-tint)'}},
          React.createElement('td',{className:'code',style:{paddingLeft:34,opacity:.8,fontSize:11.5}},s.code),
          React.createElement('td',{style:{color:'var(--muted)',paddingLeft:0}},s.name),
          React.createElement('td',{className:'num',style:{fontWeight:500}},D.usd(s.budget)),
          React.createElement('td',{className:'num',style:{fontWeight:500}},D.usd(s.committed)),
          React.createElement('td',{className:'num',style:{fontWeight:500}},D.usd(s.budget-s.committed)),
          React.createElement('td',null,React.createElement('span',{style:{fontSize:12,color:'var(--faint)',fontWeight:600}},sp+'% committed'))
        );
      })
    );
  };

  return React.createElement('div',{className:'page'},
    React.createElement('div',{className:'page-head'},
      React.createElement('div',null,
        React.createElement('h1',null,'Budget & Cost Control'),
        React.createElement('div',{className:'sub'},
          React.createElement('span',{className:'chip'},React.createElement(Icon.wallet),'Current budget '+D.usd(D.budget.current)),
          React.createElement('span',{className:'chip'},React.createElement(Icon.edit),'4 approved NOCIs')
        )
      ),
      React.createElement('button',{className:'btn btn--primary'},React.createElement(Icon.download),'Export Cost Report')
    ),

    React.createElement('div',{className:'grid kpis'},
      React.createElement(Kpi,{label:'Original Control Estimate',val:D.usdK(D.budget.original),sub:'Baseline',icon:'doc',tone:'navy'}),
      React.createElement(Kpi,{label:'Current Budget',val:D.usdK(D.budget.current),sub:'+'+D.usdK(D.budget.nocis)+' NOCIs',icon:'wallet',tone:'cyan'}),
      React.createElement(Kpi,{label:'Committed to Date',val:D.usdK(D.budget.committed),sub:'79.7% of budget',icon:'check',tone:'green'}),
      React.createElement(Kpi,{label:'Contingency Variance',val:D.usdK(D.budget.variance),sub:'-1.0% of budget',icon:'trend',tone:'red'})
    ),

    React.createElement('div',{className:'card tablecard'},
      React.createElement('div',{className:'card__h'},
        React.createElement('h3',null,'Cost Codes by Division'),
        React.createElement('span',{className:'meta'},'Tap a division to expand · CSI MasterFormat')
      ),
      React.createElement('table',{className:'tbl'},
        React.createElement('thead',null,React.createElement('tr',null,
          React.createElement('th',{style:{width:120}},'Code'),
          React.createElement('th',null,'Division'),
          React.createElement('th',{style:{textAlign:'right'}},'Budget'),
          React.createElement('th',{style:{textAlign:'right'}},'Committed'),
          React.createElement('th',{style:{textAlign:'right'}},'Remaining'),
          React.createElement('th',{style:{width:200}},'% Committed')
        )),
        React.createElement('tbody',null,
          D.divisions.map(Row),
          React.createElement('tr',{className:'div'},
            React.createElement('td',null,''),
            React.createElement('td',null,'Total — Hard Costs'),
            React.createElement('td',{className:'num',style:{color:'var(--navy)'}},D.usd(tot.b)),
            React.createElement('td',{className:'num',style:{color:'var(--navy)'}},D.usd(tot.c)),
            React.createElement('td',{className:'num',style:{color:'var(--navy)'}},D.usd(tot.b-tot.c)),
            React.createElement('td',null,React.createElement('span',{style:{fontSize:12.5,fontWeight:700,color:'var(--navy)'}},Math.round(tot.c/tot.b*100)+'% committed'))
          )
        )
      )
    )
  );
}
window.Budget=Budget;
