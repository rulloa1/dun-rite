/* Log views: RFI, Submittals, Purchasing, Delays */
function LogShell({title, chips, kpis, children}){
  return React.createElement('div',{className:'page'},
    React.createElement('div',{className:'page-head'},
      React.createElement('div',null,
        React.createElement('h1',null,title),
        React.createElement('div',{className:'sub'}, chips.map((c,i)=>
          React.createElement('span',{key:i,className:'chip'},React.createElement(Icon[c.icon]),c.t)))
      ),
      React.createElement('div',{style:{display:'flex',gap:10}},
        React.createElement('button',{className:'btn btn--ghost'},React.createElement(Icon.download),'Export'),
        React.createElement('button',{className:'btn btn--primary'},React.createElement(Icon.edit),'New Entry')
      )
    ),
    kpis && React.createElement('div',{className:'grid kpis'}, kpis.map((k,i)=>React.createElement(Kpi,{key:i,...k}))),
    children
  );
}

function TableCard({title,meta,head,rows}){
  return React.createElement('div',{className:'card tablecard'},
    React.createElement('div',{className:'card__h'},
      React.createElement('h3',null,title), meta&&React.createElement('span',{className:'meta'},meta)),
    React.createElement('table',{className:'tbl'},
      React.createElement('thead',null,React.createElement('tr',null,
        head.map((h,i)=>React.createElement('th',{key:i,style:h.w?{width:h.w,textAlign:h.r?'right':'left'}:(h.r?{textAlign:'right'}:null)},h.t||h)))),
      React.createElement('tbody',null,rows)
    )
  );
}

function RfiLog(){
  const D=window.DR;
  return React.createElement(LogShell,{title:'RFI Log',
    chips:[{icon:'help',t:'10 total · 3 open'},{icon:'clock',t:'Avg turnaround 11 days'}],
    kpis:[
      {label:'Open',val:'3',sub:'2 high priority',icon:'help',tone:'red'},
      {label:'Answered',val:'2',sub:'awaiting closeout',icon:'check',tone:'green'},
      {label:'Closed',val:'5',sub:'this project',icon:'check',tone:'navy'},
      {label:'Overdue',val:'1',sub:'RFI-016',icon:'alert',tone:'amber'},
    ]},
    React.createElement(TableCard,{title:'All Requests for Information',meta:'Sorted by date',
      head:[{t:'RFI #',w:90},'Subject','Discipline','Ball in Court','Opened','Due',{t:'Priority',w:100},{t:'Status',w:110}],
      rows:D.rfis.map(r=>React.createElement('tr',{key:r.id},
        React.createElement('td',{className:'code'},r.id),
        React.createElement('td',{className:'strong'},r.subj),
        React.createElement('td',null,r.disc),
        React.createElement('td',null,r.to),
        React.createElement('td',null,r.opened),
        React.createElement('td',null,r.due),
        React.createElement('td',null,React.createElement(PriPill,{pr:r.pr})),
        React.createElement('td',null,React.createElement(Pill,{status:r.status}))
      ))
    })
  );
}

function SubmittalLog(){
  const D=window.DR;
  return React.createElement(LogShell,{title:'Submittal Log',
    chips:[{icon:'inbox',t:'10 total · 4 in review'},{icon:'layers',t:'By spec section'}],
    kpis:[
      {label:'In Review',val:'4',sub:'with A/E team',icon:'inbox',tone:'amber'},
      {label:'Approved',val:'4',sub:'released to procure',icon:'check',tone:'green'},
      {label:'Rejected',val:'1',sub:'resubmit required',icon:'alert',tone:'red'},
      {label:'Avg Cycle',val:'9d',sub:'review turnaround',icon:'clock',tone:'navy'},
    ]},
    React.createElement(TableCard,{title:'All Submittals',meta:'Sorted by date received',
      head:[{t:'Sub #',w:90},'Item','Spec Section','Ball in Court','Received',{t:'Rev',w:60},{t:'Status',w:120}],
      rows:D.submittals.map(s=>React.createElement('tr',{key:s.id},
        React.createElement('td',{className:'code'},s.id),
        React.createElement('td',{className:'strong'},s.subj),
        React.createElement('td',null,s.spec),
        React.createElement('td',null,s.ball),
        React.createElement('td',null,s.received),
        React.createElement('td',{className:'tnum'},'R'+s.rev),
        React.createElement('td',null,React.createElement(Pill,{status:s.status}))
      ))
    })
  );
}

function Purchasing(){
  const D=window.DR;
  const tot=D.purchasing.reduce((a,p)=>a+p.amt,0);
  return React.createElement(LogShell,{title:'Purchasing & Procurement',
    chips:[{icon:'cart',t:D.purchasing.length+' active POs'},{icon:'truck',t:'2 in transit to Abaco'}],
    kpis:[
      {label:'Open POs',val:'6',sub:D.usdK(tot)+' value',icon:'cart',tone:'cyan'},
      {label:'In Transit',val:'2',sub:'barge to Guana Cay',icon:'truck',tone:'amber'},
      {label:'Received',val:'1',sub:'this month',icon:'check',tone:'green'},
      {label:'Long-Lead Items',val:'3',sub:'glass · VRF · gen',icon:'clock',tone:'navy'},
    ]},
    React.createElement(TableCard,{title:'Purchase Orders',meta:'Total committed '+D.usd(tot),
      head:[{t:'PO #',w:90},'Vendor',{t:'Div',w:80},'Description',{t:'Amount',w:120,r:true},{t:'Status',w:110},'Issued'],
      rows:D.purchasing.map(p=>React.createElement('tr',{key:p.po},
        React.createElement('td',{className:'code'},p.po),
        React.createElement('td',{className:'strong'},p.vendor),
        React.createElement('td',{className:'code',style:{fontSize:11.5}},p.div),
        React.createElement('td',null,p.desc),
        React.createElement('td',{className:'num'},D.usd(p.amt)),
        React.createElement('td',null,React.createElement(Pill,{status:p.status})),
        React.createElement('td',null,p.date)
      ))
    })
  );
}

function Delays(){
  const D=window.DR;
  const tot=D.delays.reduce((a,d)=>a+d.days,0);
  const causeTone={Weather:'cyan',Procurement:'amber',Logistics:'navy',Labor:'red',Owner:'green'};
  return React.createElement(LogShell,{title:'Schedule Delays',
    chips:[{icon:'clock',t:tot+' total delay days'},{icon:'flag',t:D.delays.length+' logged events'}],
    kpis:[
      {label:'Total Delay',val:tot+'d',sub:'vs. baseline',icon:'clock',tone:'red'},
      {label:'Weather',val:'9d',sub:'1 event',icon:'alert',tone:'cyan'},
      {label:'Procurement',val:'6d',sub:'1 event',icon:'truck',tone:'amber'},
      {label:'Recoverable',val:'5d',sub:'forecast pull-back',icon:'trend',tone:'green'},
    ]},
    React.createElement(TableCard,{title:'Delay Events',meta:'Impact to critical path',
      head:['Event',{t:'Cause',w:130},{t:'Days',w:80,r:true},'Affected Milestone',{t:'Period',w:110}],
      rows:D.delays.map((d,i)=>React.createElement('tr',{key:i},
        React.createElement('td',{className:'strong'},d.evt),
        React.createElement('td',null,React.createElement('span',{className:'pill pill--'+(causeTone[d.cause]==='red'?'bad':causeTone[d.cause]==='amber'?'warn':causeTone[d.cause]==='green'?'ok':'idle')},d.cause)),
        React.createElement('td',{className:'num'},'+'+d.days),
        React.createElement('td',null,d.ms),
        React.createElement('td',null,d.date)
      ))
    })
  );
}

Object.assign(window,{RfiLog,SubmittalLog,Purchasing,Delays});
