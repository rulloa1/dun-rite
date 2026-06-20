/* Concept C — Pipeline Board
   The whole business as one board: every job moves left→right through
   stages (Lead → Bid → Active → Punch → Closed). "From the very
   beginning to the very end" made literal. Owner sees the whole
   pipeline; cards carry health, value, owner. */

function ConceptC(){
  const t = DRtok;
  const cols = [
    {name:'Lead', accent:t.idle, cards:[
      {code:'WMT',name:'Westmont Retail',val:'$3.1M',meta:'Est. due Jun 24',health:null,who:'SJ'},
      {code:'BRG',name:'Bridge St. Lofts',val:'$1.8M',meta:'Site visit Thu',health:null,who:'SJ'},
    ]},
    {name:'Bidding', accent:t.gold, cards:[
      {code:'PKV',name:'Parkview Medical',val:'$4.2M',meta:'Bid due Jun 27',health:'warn',who:'SJ'},
    ]},
    {name:'Active', accent:t.blue, cards:[
      {code:'LON',name:'Longleaf Amenity',val:'$1.61M',meta:'Drywall · 62%',health:'ok',who:'MT',pct:62},
      {code:'RVO',name:'Riverview Office',val:'$860K',meta:'MEP · 38%',health:'warn',who:'MT',pct:38},
      {code:'MAP',name:'Maple St. Reno',val:'$260K',meta:'Demo · 24%',health:'bad',who:'MT',pct:24},
      {code:'HBR',name:'Harbor View',val:'$2.4M',meta:'Slab · 12%',health:'ok',who:'MT',pct:12},
    ]},
    {name:'Punch / Closeout', accent:t.cyan, cards:[
      {code:'CED',name:'Cedar Park Clubhouse',val:'$2.14M',meta:'Punch · 91%',health:'ok',who:'MT',pct:91},
    ]},
    {name:'Closed', accent:t.ok, cards:[
      {code:'ELM',name:'Elmwood Daycare',val:'$1.2M',meta:'Closed May 30',health:null,who:'SJ'},
      {code:'GRV',name:'Grove Plaza',val:'$3.4M',meta:'Closed Apr 18',health:null,who:'SJ'},
    ]},
  ];
  const dotFor = h => h==='ok'?t.ok:h==='warn'?t.warn:h==='bad'?t.bad:t.faint;

  return (
    <Chrome active="Pipeline" crumb="Pipeline" project="All Projects" extraMain={[{id:'Pipeline', icon:IC.flag}]}>
      <div style={{marginBottom:16,display:'flex',alignItems:'flex-end',justifyContent:'space-between'}}>
        <div>
          <h1 style={{fontFamily:t.fHead,fontWeight:800,fontSize:26,letterSpacing:'-.025em',color:t.ink,margin:0}}>Pipeline</h1>
          <div style={{color:t.muted,fontSize:13.5,marginTop:4}}>Every job, lead to closeout · drag to advance a stage</div>
        </div>
        <div style={{display:'flex',gap:16}}>
          {[['Pipeline value','$9.0M'],['Active value','$5.1M'],['Win rate','58%']].map((s,i)=>(
            <div key={i} style={{textAlign:'right'}}>
              <div style={{fontFamily:t.fDisp,fontWeight:800,fontSize:19,color:t.ink,lineHeight:1}}>{s[1]}</div>
              <div style={{fontSize:11,color:t.muted,fontWeight:600,marginTop:3}}>{s[0]}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:12,alignItems:'start'}}>
        {cols.map(col=>(
          <div key={col.name} style={{background:t.cardTint,border:`1px solid ${t.line}`,borderRadius:14,padding:10,minHeight:340}}>
            <div style={{display:'flex',alignItems:'center',gap:8,padding:'4px 6px 12px'}}>
              <span style={{width:8,height:8,borderRadius:'50%',background:col.accent}}/>
              <span style={{fontFamily:t.fHead,fontWeight:700,fontSize:12.5,color:t.ink,letterSpacing:'.01em'}}>{col.name}</span>
              <span style={{marginLeft:'auto',fontSize:11,fontWeight:700,color:t.muted,background:'#fff',border:`1px solid ${t.line}`,borderRadius:20,padding:'1px 8px'}}>{col.cards.length}</span>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:9}}>
              {col.cards.map(c=>(
                <div key={c.code} style={{background:'#fff',border:`1px solid ${t.line}`,borderRadius:11,padding:'11px 12px',boxShadow:'0 1px 2px rgba(20,33,48,.04)'}}>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                    <div style={{width:26,height:26,borderRadius:7,background:`linear-gradient(135deg,${t.cyan},${t.blue})`,color:'#fff',display:'grid',placeItems:'center',fontFamily:t.fHead,fontWeight:800,fontSize:9.5,flex:'none'}}>{c.code}</div>
                    {c.health && <span style={{width:8,height:8,borderRadius:'50%',background:dotFor(c.health),marginLeft:'auto'}}/>}
                  </div>
                  <div style={{fontSize:12.5,fontWeight:700,color:t.ink,lineHeight:1.25}}>{c.name}</div>
                  <div style={{fontSize:11,color:t.muted,margin:'3px 0 8px'}}>{c.meta}</div>
                  {typeof c.pct==='number' && <div style={{marginBottom:8}}><Bar pct={c.pct} h={5}/></div>}
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                    <span style={{fontFamily:t.fHead,fontWeight:800,fontSize:12.5,color:t.ink2}}>{c.val}</span>
                    <Avatar initials={c.who} s={22}/>
                  </div>
                </div>
              ))}
              <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:'8px',border:`1.5px dashed ${t.line}`,borderRadius:10,color:t.faint,fontSize:11.5,fontWeight:600}}>
                <DIcon d={IC.plus} s={14}/>Add
              </div>
            </div>
          </div>
        ))}
      </div>
    </Chrome>
  );
}
window.ConceptC = ConceptC;
