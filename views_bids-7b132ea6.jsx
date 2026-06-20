/* Longleaf Amenity Bids Tracker */

function BidsTracker(){
  const P = window.PROJECT;
  const returned = P.bids.filter(b=>b.status==='Done');
  const pending = P.bids.filter(b=>b.status==='Not Returned');

  const kpiRow = (label,val,sub,tone)=>React.createElement('div',{className:'kpi'+' kpi--'+tone},
    React.createElement('div',{className:'kpi__label'},label),
    React.createElement('div',{className:'kpi__val'},val),
    sub && React.createElement('div',{className:'kpi__sub'},sub)
  );

  return React.createElement('div',{className:'view'},
    React.createElement('div',{className:'pg-grid'},
      React.createElement('div',{className:'pg-row'},
        kpiRow('Total Bids Value', P.usd(P.total), P.bids.length+' vendors', 'gold'),
        kpiRow('Returned', P.returned, 'of '+P.bids.length, 'cyan'),
        kpiRow('Not Returned', P.notReturned, 'pending', 'warn'),
        kpiRow('Completion', Math.round(P.returned/P.bids.length*100)+'%', 'bids in', 'cyan')
      ),
      React.createElement('div',{className:'pg-row cols-2',style:{marginTop:20}},
        React.createElement('div',{className:'card'},
          React.createElement('div',{className:'card__h'},
            React.createElement('h3',null,'Returned Bids'),
            React.createElement('span',{className:'card__badge'},P.returned+' vendors')
          ),
          React.createElement('div',{className:'tbl-wrap'},
            React.createElement('table',{className:'tbl'},
              React.createElement('thead',null,
                React.createElement('tr',null,
                  React.createElement('th',{style:{width:50}},'ID'),
                  React.createElement('th',null,'Vendor'),
                  React.createElement('th',null,'Trade'),
                  React.createElement('th',{style:{textAlign:'right',width:120}},'Amount')
                )
              ),
              React.createElement('tbody',null,
                returned.map(b=>React.createElement('tr',{key:b.id},
                  React.createElement('td',{className:'code'},b.id),
                  React.createElement('td',{className:'vendor'},b.vendor),
                  React.createElement('td',{style:{color:'var(--ds-dim)',fontSize:12}},b.trade),
                  React.createElement('td',{className:'num'},P.usd(b.amt))
                ))
              )
            )
          )
        ),
        React.createElement('div',{className:'card'},
          React.createElement('div',{className:'card__h'},
            React.createElement('h3',null,'Pending Response'),
            React.createElement('span',{className:'card__badge'},P.notReturned+' vendors')
          ),
          React.createElement('div',{className:'tbl-wrap'},
            React.createElement('table',{className:'tbl'},
              React.createElement('thead',null,
                React.createElement('tr',null,
                  React.createElement('th',{style:{width:50}},'ID'),
                  React.createElement('th',null,'Vendor'),
                  React.createElement('th',null,'Trade'),
                  React.createElement('th',{style:{width:100}},'Action')
                )
              ),
              React.createElement('tbody',null,
                pending.map(b=>React.createElement('tr',{key:b.id},
                  React.createElement('td',{className:'code'},b.id),
                  React.createElement('td',{className:'vendor'},b.vendor),
                  React.createElement('td',{style:{color:'var(--ds-dim)',fontSize:12}},b.trade),
                  React.createElement('td',null,React.createElement('button',{className:'btn btn--sm'},'Send'))
                ))
              )
            )
          )
        )
      )
    )
  );
}

Object.assign(window,{BidsTracker});
