/* Reusable UI atoms */
const {useState} = React;

function Donut({size=132, stroke=20, segments}){
  const r=(size-stroke)/2, C=2*Math.PI*r, total=segments.reduce((a,s)=>a+s.v,0);
  let off=0;
  return (
    React.createElement('svg',{width:size,height:size,viewBox:`0 0 ${size} ${size}`,style:{transform:'rotate(-90deg)'}},
      React.createElement('circle',{cx:size/2,cy:size/2,r,fill:'none',stroke:'#EEF2F6',strokeWidth:stroke}),
      segments.map((s,i)=>{
        const len=s.v/total*C, el=React.createElement('circle',{key:i,cx:size/2,cy:size/2,r,fill:'none',
          stroke:s.c,strokeWidth:stroke,strokeDasharray:`${len} ${C-len}`,strokeDashoffset:-off,
          strokeLinecap:'butt'});
        off+=len; return el;
      })
    )
  );
}

const toneBg = {
  navy:{bg:'rgba(20,33,48,.08)', fg:'#142130'},
  blue:{bg:'rgba(21,131,199,.12)', fg:'#1583C7'},
  cyan:{bg:'rgba(29,180,232,.14)', fg:'#0F8Fc4'},
  green:{bg:'#E6F6EE', fg:'#1E9E6A'},
  amber:{bg:'#FCF3E2', fg:'#E08A1E'},
  red:{bg:'#FBEAE9', fg:'#E0524B'},
};

function Kpi({label,val,sub,icon,tone,delta}){
  const t=toneBg[tone]||toneBg.blue;
  const I=Icon[icon]||Icon.doc;
  return React.createElement('div',{className:'card kpi'},
    React.createElement('div',{className:'kpi__top'},
      React.createElement('div',{className:'kpi__ico',style:{background:t.bg,color:t.fg}}, React.createElement(I)),
      React.createElement('div',{className:'kpi__label'},label)
    ),
    React.createElement('div',{className:'kpi__val tnum'},val),
    React.createElement('div',{className:'kpi__sub'},
      delta && React.createElement('span',{className:'delta delta--'+(delta.dir==='up'?'up':delta.dir==='down'?'down':'flat')},
        React.createElement(delta.dir==='down'?Icon.trend:Icon.trend), delta.v),
      React.createElement('span',null,sub)
    )
  );
}

function Pill({status}){
  const map={
    done:['ok','Complete'], complete:['ok','Complete'], approved:['ok','Approved'], closed:['idle','Closed'],
    active:['warn','In Progress'], 'in progress':['warn','In Progress'], review:['warn','In Review'], partial:['warn','Partial'],
    open:['bad','Open'], rejected:['bad','Rejected'], next:['idle','Upcoming'], upcoming:['idle','Upcoming'],
    answered:['ok','Answered'], issued:['ok','Issued'], received:['ok','Received']
  };
  const [tone,label]=map[status]||['idle',status];
  return React.createElement('span',{className:'pill pill--'+tone},label);
}

function PriPill({pr}){
  const m={high:['bad','High'],med:['warn','Medium'],low:['idle','Low']};
  const [tone,label]=m[pr]||['idle',pr];
  return React.createElement('span',{className:'pill pill--'+tone},label);
}

Object.assign(window,{Donut,Kpi,Pill,PriPill,toneBg});
