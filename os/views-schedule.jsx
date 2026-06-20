/* Schedule — editable phase Gantt. Longleaf is the real project from the
   uploaded Gantt (start 8/15/26, substantial completion 12/15/26, real
   trades + the $478K pool). Drag a bar to move it, drag its right edge to
   resize. Edits persist (and sync) via DROS.actions.setPhase.
   Loaded AFTER views-project.jsx so this ScheduleView wins. */
const {useState:useStateS, useEffect:useEffectS, useRef:useRefS} = React;

/* month units: 0 = start of months[0]. d = duration helper (days→months ≈ /30.4) */
const SCHEDULES = {
  LON: { months:['Aug','Sep','Oct','Nov','Dec'], today:0.18, real:true, phases:[
    {name:'Excavate & Backfill',        s:0.00, e:0.33, st:'active'},
    {name:'Piles / Foundation',         s:0.30, e:0.80, st:'next'},
    {name:'Structural Concrete',        s:0.75, e:1.08, st:'next'},
    {name:'Concrete Masonry (CMU)',     s:1.05, e:1.90, st:'next'},
    {name:'Structural Steel',           s:1.85, e:2.18, st:'next'},
    {name:'Rough Framing',              s:2.10, e:2.75, st:'next'},
    {name:'Swimming Pool',              s:1.45, e:4.45, st:'next'},
    {name:'Shingles & Copper Flashing', s:2.70, e:3.35, st:'next'},
    {name:'Spray Insulation',           s:3.10, e:3.45, st:'next'},
    {name:'Ext. Doors & Windows',       s:3.25, e:4.20, st:'next'},
    {name:'Plumbing / HVAC / Elec.',    s:2.30, e:4.15, st:'next'},
    {name:'Stucco',                     s:3.55, e:4.05, st:'next'},
    {name:'Drywall & Bat Insulation',   s:3.90, e:4.40, st:'next'},
    {name:'Tile / Countertops / Millwork',s:4.05,e:4.55, st:'next'},
    {name:'Painting Int / Ext',         s:4.35, e:4.75, st:'next'},
    {name:'Pavers / Landscape / Fence', s:4.20, e:4.85, st:'next'},
    {name:'Punch / Warranty / Closeout',s:4.70, e:5.00, st:'next'},
  ]},
  RVO: { months:['May','Jun','Jul','Aug','Sep'], today:1.55, phases:[
    {name:'Demo & Prep',        s:0.0,e:0.8, st:'done'},
    {name:'Framing',            s:0.7,e:1.5, st:'done'},
    {name:'MEP Rough-In',       s:1.4,e:2.4, st:'active'},
    {name:'Insulation & Drywall',s:2.3,e:3.2, st:'next'},
    {name:'Finishes',           s:3.1,e:4.2, st:'next'},
    {name:'Punch & Closeout',   s:4.1,e:5.0, st:'next'},
  ]},
  MAP: { months:['Jun','Jul','Aug'], today:0.6, phases:[
    {name:'Demo',               s:0.0,e:0.9, st:'active'},
    {name:'Foundation Drainage',s:0.7,e:1.5, st:'next'},
    {name:'Framing & Rough-In', s:1.4,e:2.3, st:'next'},
    {name:'Finishes',           s:2.2,e:3.0, st:'next'},
  ]},
  CED: { months:['Apr','May','Jun','Jul'], today:2.95, phases:[
    {name:'Finishes',           s:0.0,e:1.4, st:'done'},
    {name:'MEP Trim',           s:1.3,e:2.2, st:'done'},
    {name:'Final Inspections',  s:2.1,e:2.9, st:'done'},
    {name:'Punch List',         s:2.7,e:3.4, st:'active'},
    {name:'Closeout',           s:3.3,e:3.8, st:'next'},
  ]},
  HBR: { months:['Mar','Apr','May','Jun','Jul','Aug'], today:0.45, phases:[
    {name:'Sitework',           s:0.0,e:0.7, st:'active'},
    {name:'Foundations',        s:0.6,e:1.6, st:'next'},
    {name:'Framing',            s:1.5,e:3.0, st:'next'},
    {name:'MEP & Dry-In',       s:2.8,e:4.2, st:'next'},
    {name:'Finishes',           s:4.0,e:5.6, st:'next'},
    {name:'Closeout',           s:5.4,e:6.0, st:'next'},
  ]},
};

function ScheduleView(){
  const t=DRtok; const {state}=useStore();
  const sched=state.projects.filter(p=>SCHEDULES[p.id]);
  const [pid,setPid]=useStateS((sched[0]||{}).id);
  const p=DROS.P(pid)||sched[0];
  const tmpl=SCHEDULES[pid]||SCHEDULES[sched[0]?.id];
  const ov=(state.scheduleOverrides||{})[pid]||{};
  const phases=tmpl.phases.map((ph,i)=>({...ph, ...(ov[i]||{})}));

  const colW=132, labW=210, n=tmpl.months.length, trackW=colW*n;
  const stClr={done:[t.ok,'#2ab47c'],active:[t.warn,'#f0ad4e']};

  const wrapRef=useRefS(null);
  const [drag,setDrag]=useStateS(null); // {idx,mode,startX,origS,origE}
  const [preview,setPreview]=useStateS(null); // {idx,s,e}

  useEffectS(()=>{
    if(!drag) return;
    const m2px=colW/1; // 1 month = colW px
    const onMove=(ev)=>{
      const dx=ev.clientX-drag.startX; const dM=dx/m2px;
      let s=drag.origS, e=drag.origE;
      if(drag.mode==='move'){ const span=drag.origE-drag.origS; s=drag.origS+dM; e=s+span; if(s<0){s=0;e=span;} if(e>n){e=n;s=n-span;} }
      else { e=drag.origE+dM; if(e<drag.origS+0.2) e=drag.origS+0.2; if(e>n) e=n; }
      setPreview({idx:drag.idx, s, e});
    };
    const snap=v=>Math.round(v/0.083)*0.083; // ~2.5-day grid
    const onUp=()=>{
      if(preview){ DROS.actions.setPhase(pid, preview.idx, {s:+snap(preview.s).toFixed(3), e:+snap(preview.e).toFixed(3)}); drToast('Schedule updated'); }
      setDrag(null); setPreview(null);
      window.removeEventListener('pointermove',onMove); window.removeEventListener('pointerup',onUp);
    };
    window.addEventListener('pointermove',onMove); window.addEventListener('pointerup',onUp);
    return ()=>{ window.removeEventListener('pointermove',onMove); window.removeEventListener('pointerup',onUp); };
  },[drag,preview,pid,n]);

  const start=(idx,mode,ev)=>{ ev.preventDefault(); ev.stopPropagation(); const ph=phases[idx]; setDrag({idx,mode,startX:ev.clientX,origS:ph.s,origE:ph.e}); };
  const view=(ph,i)=>{ if(preview&&preview.idx===i) return {...ph,s:preview.s,e:preview.e}; return ph; };

  /* month-fraction → real calendar date (index 0 = 1st of months[0], 2026) */
  const MONTHN={Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11};
  const baseM=MONTHN[tmpl.months[0]]||0;
  const fracToDate=v=>{ const d=new Date(2026,baseM,1); d.setDate(d.getDate()+Math.round(v*30.44)); return d; };
  const fmtD=d=>d.toLocaleDateString('en-US',{month:'short',day:'numeric'});
  const rangeStr=ph=>`${fmtD(fracToDate(ph.s))} \u2013 ${fmtD(fracToDate(ph.e))}`;

  return (
    <div>
      <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:18,gap:16,flexWrap:'wrap'}}>
        <div>
          <h1 style={{fontFamily:t.fHead,fontWeight:800,fontSize:26,letterSpacing:'-.025em',color:t.ink,margin:0}}>Schedule</h1>
          <div style={{color:t.muted,fontSize:13.5,marginTop:4}}>Phase Gantt · drag a bar to move it, drag its right edge to resize</div>
        </div>
        <select value={pid} onChange={e=>setPid(e.target.value)} style={{border:`1px solid ${t.line}`,borderRadius:10,padding:'10px 14px',fontSize:13.5,fontFamily:t.fBody,fontWeight:600,color:t.ink,background:'#fff',cursor:'pointer',outline:'none'}}>
          {sched.map(pr=><option key={pr.id} value={pr.id}>{pr.name}</option>)}
        </select>
      </div>

      <Card pad={false}>
        <div style={{display:'flex',alignItems:'center',gap:12,padding:'15px 18px',borderBottom:`1px solid ${t.line}`}}>
          <CodeTile code={p.id} s={36} r={9} fs={12}/>
          <div style={{flex:1}}>
            <div style={{fontSize:14.5,fontWeight:700,color:t.ink,display:'flex',alignItems:'center',gap:9}}>{p.name}{tmpl.real&&<span style={{fontSize:10,fontWeight:800,letterSpacing:'.04em',textTransform:'uppercase',color:t.blue,background:'#EAF4FC',padding:'2px 8px',borderRadius:20}}>From contract</span>}</div>
            <div style={{fontSize:12,color:t.muted,marginTop:1}}>{tmpl.real?'Start Aug 15, 2026 · Substantial completion Dec 15, 2026':`Current phase: ${p.phase} · ${p.pct}% · due ${p.due}`}</div>
          </div>
          <div style={{display:'flex',gap:14}}>
            {[['done',t.ok,'Done'],['active',t.warn,'In progress'],['next',null,'Upcoming']].map(([k,c,l])=>(
              <span key={k} style={{display:'inline-flex',alignItems:'center',gap:6,fontSize:11.5,fontWeight:700,color:t.muted}}>
                <span style={{width:13,height:13,borderRadius:4,background:c||'transparent',backgroundImage:c?`linear-gradient(90deg,${c},${c})`:'repeating-linear-gradient(45deg,#cdd8e2,#cdd8e2 4px,#e6edf3 4px,#e6edf3 8px)'}}/>{l}
              </span>
            ))}
          </div>
        </div>

        <div style={{overflowX:'auto'}} ref={wrapRef}>
          <div style={{minWidth:labW+trackW}}>
            <div style={{display:'grid',gridTemplateColumns:`${labW}px ${trackW}px`,borderBottom:`1px solid ${t.line}`,background:t.cardTint}}>
              <div style={{padding:'11px 16px',fontSize:11,fontWeight:800,color:t.muted,textTransform:'uppercase',letterSpacing:'.07em',borderRight:`1px solid ${t.line}`}}>Trade / Phase</div>
              <div style={{display:'flex'}}>
                {tmpl.months.map(m=><div key={m} style={{width:colW,padding:'11px 0',textAlign:'center',fontSize:11.5,fontWeight:800,color:t.muted,textTransform:'uppercase',letterSpacing:'.05em',borderRight:`1px solid ${t.lineSoft}`}}>{m} '26</div>)}
              </div>
            </div>
            <div style={{position:'relative'}}>
              <div style={{position:'absolute',top:0,bottom:0,left:labW+(tmpl.today/n)*trackW,width:2,background:t.cyan,zIndex:4,pointerEvents:'none'}}>
                <span style={{position:'absolute',top:-1,left:5,fontSize:9,fontWeight:800,color:t.blue,letterSpacing:'.05em',whiteSpace:'nowrap'}}>TODAY</span>
              </div>
              {phases.map((ph0,i)=>{ const ph=view(ph0,i); const clr=stClr[ph.st]; const left=(ph.s/n)*trackW, w=Math.max(((ph.e-ph.s)/n)*trackW,10); const dragging=drag&&drag.idx===i;
                return <div key={i} style={{display:'grid',gridTemplateColumns:`${labW}px ${trackW}px`,alignItems:'center',borderBottom:i<phases.length-1?`1px solid ${t.lineSoft}`:'none',minHeight:42,background:dragging?t.cardTint:'transparent'}}>
                  <div style={{display:'flex',alignItems:'center',gap:9,padding:'7px 16px',borderRight:`1px solid ${t.line}`,minHeight:42}}>
                    <span style={{width:8,height:8,borderRadius:'50%',flex:'none',background:ph.st==='done'?t.ok:ph.st==='active'?t.warn:t.faint}}/>
                    <div style={{minWidth:0}}>
                      <div style={{fontSize:12.5,fontWeight:600,color:t.ink,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{ph.name}</div>
                      <div style={{fontSize:10.5,fontWeight:600,color:dragging?t.blue:t.faint,fontVariantNumeric:'tabular-nums',marginTop:1}}>{rangeStr(ph)}</div>
                    </div>
                  </div>
                  <div style={{position:'relative',height:42}}>
                    {tmpl.months.map((m,mi)=><div key={mi} style={{position:'absolute',top:0,bottom:0,left:mi*colW,width:1,background:t.lineSoft}}/>)}
                    <div onPointerDown={e=>start(i,'move',e)} title={`${ph.name}: ${rangeStr(ph)}`}
                      style={{position:'absolute',top:'50%',transform:'translateY(-50%)',left,width:w,height:22,borderRadius:6,display:'flex',alignItems:'center',padding:'0 9px',cursor:'grab',touchAction:'none',userSelect:'none',
                        background:clr?`linear-gradient(90deg,${clr[0]},${clr[1]})`:'repeating-linear-gradient(45deg,#c4d0db,#c4d0db 5px,#d6e0ea 5px,#d6e0ea 10px)',
                        boxShadow:dragging?'0 4px 12px rgba(20,33,48,.3)':clr?'0 1px 3px rgba(20,33,48,.18)':'none',border:dragging?`1px solid ${t.blue}`:'none'}}>
                      {clr&&ph.st==='active'&&<span style={{fontSize:10,fontWeight:800,color:'#fff',whiteSpace:'nowrap',pointerEvents:'none'}}>{p.pct}%</span>}
                      <span onPointerDown={e=>start(i,'resize',e)} title="Drag to resize" style={{position:'absolute',right:-3,top:0,bottom:0,width:12,cursor:'ew-resize',touchAction:'none'}}/>
                    </div>
                  </div>
                </div>;})}
            </div>
          </div>
        </div>
      </Card>

      <div style={{fontSize:12,color:t.muted,marginTop:14,display:'flex',alignItems:'center',gap:7}}>
        <span style={{color:t.ok}}><DIcon d={IC.bolt} s={14}/></span>
        Edits save instantly and sync to everyone. The in-progress bar also tracks the project's live % as daily logs come in.
      </div>
    </div>
  );
}
window.ScheduleView = ScheduleView;
