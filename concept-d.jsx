/* Concept D — Automations
   The system's answer to "make it easier, don't add steps."
   Each card: a trigger the team already does → what the system does
   automatically → the manual step it ELIMINATES. No new work. */

function ConceptD(){
  const t = DRtok;
  const flows = [
    {
      icon:IC.doc, when:'Super submits the daily log',
      auto:['Schedule % auto-advances','Owner dashboard refreshes live','Crew hours start the timesheet'],
      kills:'No separate status update or weekly report',
    },
    {
      icon:IC.camera, when:'Crew uploads site photos from phone',
      auto:['Auto-tagged to project + current phase','Filed to the right folder by date','Attached to today\u2019s log'],
      kills:'No renaming, sorting, or manual filing',
    },
    {
      icon:IC.edit, when:'PM writes a change order',
      auto:['Routes to owner for one-tap approval','On approval, budget + contract value adjust','Pipeline value recalculates'],
      kills:'No email chain or re-keying numbers',
    },
    {
      icon:IC.receipt, when:'An invoice comes in',
      auto:['Matched to approved COs & logged costs','Budget vs. actual updates itself','Flags any overage to the owner'],
      kills:'No manual spreadsheet reconciliation',
    },
    {
      icon:IC.calendar, when:'A task slips past its date',
      auto:['Project auto-flags \u201cAt Risk\u201d','PM gets notified instantly','Owner sees it on the dashboard'],
      kills:'No status meeting to surface problems',
    },
    {
      icon:IC.check, when:'Punch list hits zero & final invoice paid',
      auto:['Project moves to \u201cClosed\u201d','Folder archives automatically','Closeout docs bundle for the owner'],
      kills:'No manual archiving or handoff packet',
    },
  ];

  return (
    <Chrome active="Dashboard" crumb="Automations" project="System">
      {/* intro band */}
      <div style={{background:`linear-gradient(135deg,${t.navyDeep},${t.navy})`,borderRadius:16,padding:'20px 24px',color:'#fff',display:'flex',alignItems:'center',gap:16,marginBottom:18}}>
        <div style={{width:48,height:48,borderRadius:13,background:'rgba(29,180,232,.18)',display:'grid',placeItems:'center',color:t.cyan,flex:'none'}}><DIcon d={IC.bolt} s={26}/></div>
        <div style={{flex:1}}>
          <h1 style={{fontFamily:t.fHead,fontWeight:800,fontSize:21,letterSpacing:'-.02em',margin:0}}>Runs automatically — no extra steps</h1>
          <div style={{fontSize:13,color:'#9FB3C6',marginTop:4}}>Your team only does the work. Every handoff below happens on its own — nothing new to remember.</div>
        </div>
        <div style={{textAlign:'right',flex:'none'}}>
          <div style={{fontFamily:t.fDisp,fontWeight:800,fontSize:26,color:t.cyan,lineHeight:1}}>6</div>
          <div style={{fontSize:11,color:'#9FB3C6',fontWeight:600,marginTop:3}}>manual steps removed</div>
        </div>
      </div>

      {/* flow cards */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
        {flows.map((f,i)=>(
          <div key={i} style={{background:t.card,border:`1px solid ${t.line}`,borderRadius:14,padding:'15px 16px',boxShadow:'0 1px 2px rgba(20,33,48,.04)',display:'flex',flexDirection:'column'}}>
            {/* trigger */}
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
              <div style={{...circ(),width:32,height:32,background:'#EAF4FC',color:t.blue,flex:'none'}}><DIcon d={f.icon} s={17}/></div>
              <div>
                <div style={{fontSize:9.5,fontWeight:800,letterSpacing:'.09em',textTransform:'uppercase',color:t.faint}}>When</div>
                <div style={{fontSize:13,fontWeight:700,color:t.ink,lineHeight:1.2,marginTop:1}}>{f.when}</div>
              </div>
            </div>
            {/* auto chip */}
            <div style={{display:'flex',alignItems:'center',gap:7,margin:'2px 0 10px'}}>
              <span style={{display:'inline-flex',alignItems:'center',gap:5,background:t.okBg,color:t.ok,fontSize:10.5,fontWeight:800,letterSpacing:'.04em',textTransform:'uppercase',padding:'3px 9px',borderRadius:20}}>
                <DIcon d={IC.bolt} s={12}/>Automatic
              </span>
              <span style={{flex:1,height:1,background:t.lineSoft}}/>
            </div>
            {/* auto actions */}
            <div style={{display:'flex',flexDirection:'column',gap:7,flex:1}}>
              {f.auto.map((a,j)=>(
                <div key={j} style={{display:'flex',gap:8,alignItems:'flex-start',fontSize:12.5,color:t.ink2,lineHeight:1.35}}>
                  <span style={{color:t.ok,marginTop:2,flex:'none'}}><DIcon d={IC.check} s={14}/></span>{a}
                </div>
              ))}
            </div>
            {/* eliminates */}
            <div style={{marginTop:12,paddingTop:11,borderTop:`1px dashed ${t.line}`,display:'flex',gap:7,alignItems:'center'}}>
              <span style={{color:t.faint,flex:'none',fontSize:13,fontWeight:800}}>✗</span>
              <span style={{fontSize:11.5,color:t.muted,fontWeight:600}}>{f.kills}</span>
            </div>
          </div>
        ))}
      </div>
    </Chrome>
  );
}
window.ConceptD = ConceptD;
