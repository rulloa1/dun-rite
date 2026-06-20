/* Budget — portfolio rollup + real Schedule of Values for Longleaf,
   loaded line-for-line from the uploaded contract budget ($1,350,000).
   Loaded AFTER views-project.jsx so this BudgetView wins. */
const {useState:useStateB} = React;

/* Longleaf Amenity Center — real CSI cost breakdown from contract */
const SOV = {
  LON: [
    {div:'02 · Site Work', items:[
      {code:'02-220', desc:'Excavate & Backfill', amt:12500},
      {code:'02-350', desc:'Piles / Caissons / Foundation', amt:43000},
      {code:'02-900', desc:'Pavers', amt:30000},
      {code:'02-900', desc:'Landscaping', amt:63000},
      {code:'02-900', desc:'Fencing', amt:36500},
    ]},
    {div:'03 · Concrete', items:[{code:'03-110', desc:'Structural Concrete', amt:30000}]},
    {div:'04 · Masonry', items:[{code:'04-220', desc:'Concrete Unit Masonry', amt:30500}]},
    {div:'05 · Metals', items:[{code:'05-120', desc:'Structural Steel', amt:20000}]},
    {div:'06 · Wood & Plastics', items:[
      {code:'06-110', desc:'Rough Framing', amt:19500},
      {code:'06-400', desc:'Exterior Architectural Woodwork', amt:18000},
      {code:'06-410', desc:'Custom Millwork, Cabinets & Mirrors', amt:7500},
      {code:'06-410', desc:'Toilet Stalls', amt:13437.50},
    ]},
    {div:'07 · Thermal & Moisture', items:[
      {code:'07-200', desc:'Spray-In Expandable Insulation', amt:8436},
      {code:'07-310', desc:'Shingles & Copper Flashing', amt:24000},
    ]},
    {div:'08 · Doors & Windows', items:[{code:'08-610', desc:'Exterior Doors & Windows', amt:21500}]},
    {div:'09 · Finishes', items:[
      {code:'09-220', desc:'Stucco', amt:15690},
      {code:'09-250', desc:'Drywall & Bat. Insulation', amt:6500},
      {code:'09-310', desc:'Floor & Wall Tile', amt:21250},
      {code:'09-370', desc:'Countertops', amt:8500},
      {code:'09-900', desc:'Painting Int / Ext', amt:12500},
    ]},
    {div:'10 · Specialties', items:[{code:'10-810', desc:'Toilet & Bath Accessories', amt:8750}]},
    {div:'13 · Special Construction', items:[
      {code:'13-155', desc:'Swimming Pool', amt:477938.75},
      {code:'13-200', desc:'Mail Boxes', amt:15000},
    ]},
    {div:'15 · Mechanical', items:[
      {code:'15-100', desc:'Plumbing', amt:17500},
      {code:'15-500', desc:'HVAC', amt:22500},
    ]},
    {div:'16 · Electrical', items:[
      {code:'16-100', desc:'Electrical Sub', amt:52992.69},
      {code:'16-105', desc:'Temporary Power', amt:10500},
    ]},
    {div:'General / Overhead', items:[
      {code:'20-592', desc:'Dumpsters', amt:15000},
      {code:'90-890', desc:'Warranty', amt:50000},
      {code:'—', desc:'GL Wrap Insurance (2%)', amt:23186.06},
      {code:'—', desc:'Contractor Fee', amt:141304},
      {code:'—', desc:'Performance Bond', amt:73015},
    ]},
  ],
};
const sovTotal = pid => (SOV[pid]||[]).reduce((s,g)=>s+g.items.reduce((a,i)=>a+i.amt,0),0);

function BudgetView(){
  const t=DRtok; const {state}=useStore();
  const rows=state.projects.filter(p=>['Active','Punch'].includes(p.stage));
  const contract=rows.reduce((s,p)=>s+p.contract,0), spent=rows.reduce((s,p)=>s+p.spent,0);
  const withSOV=state.projects.filter(p=>SOV[p.id]);
  const [pid,setPid]=useStateB((withSOV[0]||{}).id);
  const groups=SOV[pid]||[]; const total=sovTotal(pid);

  return (
    <div>
      <h1 style={{fontFamily:t.fHead,fontWeight:800,fontSize:26,letterSpacing:'-.025em',color:t.ink,margin:'0 0 4px'}}>Budget &amp; Cost</h1>
      <div style={{color:t.muted,fontSize:13.5,marginBottom:18}}>Portfolio rollup + contract schedule of values · updates as invoices &amp; COs post</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:16}}>
        <Kpi icon={IC.dollar} label="Total Contract" value={fmtM(contract)} tint="cyan"/>
        <Kpi icon={IC.dollar} label="Total Spent" value={fmtM(spent)} tint="gold" sub={Math.round(spent/contract*100)+'% of contract'}/>
        <Kpi icon={IC.dollar} label="Remaining" value={fmtM(contract-spent)} tint="ok"/>
      </div>

      <Card title="By Project" pad={false}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
          <thead><tr>{['Project','Contract','Spent','Variance','Used'].map(h=>
            <th key={h} style={{textAlign:h==='Project'?'left':'right',fontSize:10,letterSpacing:'.06em',textTransform:'uppercase',color:t.muted,fontWeight:700,padding:'11px 16px',background:t.cardTint,borderBottom:`1px solid ${t.line}`}}>{h}</th>)}</tr></thead>
          <tbody>
            {rows.map(p=>{ const bud=Math.round(p.spent/p.contract*100); const over=p.spent>p.contract; const v=p.contract-p.spent;
              return <tr key={p.id} style={{borderBottom:`1px solid ${t.lineSoft}`}}>
                <td style={{padding:'12px 16px'}}><div style={{display:'flex',alignItems:'center',gap:10}}><CodeTile code={p.id} s={28} r={7} fs={10}/><span style={{fontWeight:600,color:t.ink}}>{p.name}</span></div></td>
                <td style={{padding:'12px 16px',textAlign:'right',fontVariantNumeric:'tabular-nums',color:t.ink2}}>{fmt$(p.contract)}</td>
                <td style={{padding:'12px 16px',textAlign:'right',fontVariantNumeric:'tabular-nums',color:t.ink2}}>{fmt$(p.spent)}</td>
                <td style={{padding:'12px 16px',textAlign:'right',fontVariantNumeric:'tabular-nums',fontWeight:700,color:over?t.bad:t.ok}}>{over?'-':''}{fmt$(Math.abs(v))}</td>
                <td style={{padding:'12px 16px',minWidth:130}}><div style={{display:'flex',alignItems:'center',gap:8}}><BudgetBar pct={bud} over={over}/><span style={{fontWeight:700,fontSize:12,color:over?t.bad:t.ink2}}>{bud}%</span></div></td>
              </tr>;})}
          </tbody>
        </table>
      </Card>

      {/* Schedule of Values — real contract breakdown */}
      <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',margin:'26px 0 14px',gap:16,flexWrap:'wrap'}}>
        <div>
          <h2 style={{fontFamily:t.fHead,fontWeight:800,fontSize:18,color:t.ink,margin:0}}>Schedule of Values</h2>
          <div style={{color:t.muted,fontSize:12.5,marginTop:3}}>Contract cost breakdown · {fmt$(total)} total</div>
        </div>
        <select value={pid} onChange={e=>setPid(e.target.value)} style={{border:`1px solid ${t.line}`,borderRadius:10,padding:'10px 14px',fontSize:13.5,fontFamily:t.fBody,fontWeight:600,color:t.ink,background:'#fff',cursor:'pointer',outline:'none'}}>
          {withSOV.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      <Card pad={false}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
          <thead><tr>{['Code','Description','Amount','% of Contract'].map((h,i)=>
            <th key={h} style={{textAlign:i>=2?'right':'left',fontSize:10,letterSpacing:'.06em',textTransform:'uppercase',color:t.muted,fontWeight:700,padding:'11px 16px',background:t.cardTint,borderBottom:`1px solid ${t.line}`}}>{h}</th>)}</tr></thead>
          <tbody>
            {groups.map(g=>{ const sub=g.items.reduce((a,i)=>a+i.amt,0);
              return <React.Fragment key={g.div}>
                <tr><td colSpan={4} style={{padding:'9px 16px',background:'#F0F5FA',fontFamily:t.fHead,fontWeight:800,color:t.navy,fontSize:11.5,letterSpacing:'.02em',textTransform:'uppercase',borderBottom:`1px solid ${t.line}`}}>
                  <div style={{display:'flex',justifyContent:'space-between'}}><span>{g.div}</span><span style={{fontVariantNumeric:'tabular-nums'}}>{fmt$(sub)}</span></div>
                </td></tr>
                {g.items.map((it,j)=>{ const pctc=it.amt/total*100;
                  return <tr key={j} style={{borderBottom:`1px solid ${t.lineSoft}`}}>
                    <td style={{padding:'10px 16px',fontFamily:t.fMono,fontSize:11.5,color:t.muted,whiteSpace:'nowrap'}}>{it.code}</td>
                    <td style={{padding:'10px 16px',color:t.ink2}}>{it.desc}</td>
                    <td style={{padding:'10px 16px',textAlign:'right',fontVariantNumeric:'tabular-nums',fontWeight:600,color:t.ink}}>{fmt$(it.amt)}</td>
                    <td style={{padding:'10px 16px',minWidth:150}}><div style={{display:'flex',alignItems:'center',gap:8}}><Bar pct={Math.min(pctc*2.4,100)} h={6}/><span style={{fontSize:11.5,color:t.muted,fontWeight:600,minWidth:38,textAlign:'right'}}>{pctc<1?pctc.toFixed(1):Math.round(pctc)}%</span></div></td>
                  </tr>;})}
              </React.Fragment>;})}
            <tr><td colSpan={2} style={{padding:'13px 16px',fontFamily:t.fHead,fontWeight:800,color:t.ink,fontSize:13.5,borderTop:`2px solid ${t.line}`}}>TOTAL CONTRACT</td>
              <td style={{padding:'13px 16px',textAlign:'right',fontFamily:t.fHead,fontWeight:800,color:t.ink,fontSize:14,fontVariantNumeric:'tabular-nums',borderTop:`2px solid ${t.line}`}}>{fmt$(total)}</td>
              <td style={{borderTop:`2px solid ${t.line}`}}></td></tr>
          </tbody>
        </table>
      </Card>
      <div style={{fontSize:12,color:t.muted,marginTop:14,display:'flex',alignItems:'center',gap:7}}>
        <span style={{color:t.blue}}><DIcon d={IC.doc} s={14}/></span>
        Loaded from the Longleaf contract. Approved change orders add new lines and roll into the total automatically.
      </div>
    </div>
  );
}
window.BudgetView = BudgetView;
