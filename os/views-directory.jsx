/* Directory — companies & contacts (subs, vendors, architects, engineers).
   Feeds the Commitments vendor picker. Uses window globals + shared
   primitives. Fully wired to DROS.actions.addCompany / toggleCompany. */
const {useState:useStateDir} = React;

const COMPANY_TYPES = ['Subcontractor','Vendor','Architect','Engineer','Owner'];
const typeTint = {
  Subcontractor:['rgba(29,180,232,.10)', DRtok.blue,  'blue'],
  Vendor:       ['rgba(208,149,39,.12)', DRtok.gold,  'idle'],
  Architect:    ['rgba(30,158,106,.12)', DRtok.ok,    'ok'],
  Engineer:     ['rgba(208,73,74,.10)',  DRtok.bad,   'bad'],
  Owner:        ['rgba(106,120,137,.12)',DRtok.idle,  'idle'],
};
function dirInitials(name){ return String(name||'').split(' ').map(w=>w[0]).filter(Boolean).join('').slice(0,2).toUpperCase(); }

function DirectoryView({user}){
  const t=DRtok; const {state}=useStore();
  const dir=state.directory||[];
  const [filter,setFilter]=useStateDir('All');
  const [q,setQ]=useStateDir('');
  const [f,setF]=useStateDir({name:'',type:'Subcontractor',trade:'',contact:'',email:'',phone:''});

  const filtered=dir.filter(c=>{
    if(filter!=='All' && c.type!==filter) return false;
    if(q.trim()){ const s=(c.name+' '+c.trade+' '+c.contact).toLowerCase(); if(!s.includes(q.trim().toLowerCase())) return false; }
    return true;
  });
  const subs=dir.filter(c=>c.type==='Subcontractor').length;
  const partners=dir.filter(c=>['Architect','Engineer','Owner'].includes(c.type)).length;
  const active=dir.filter(c=>c.status==='active').length;

  const add=()=>{ if(!f.name.trim()){drToast('Company name first');return;} drToast(DROS.actions.addCompany(f,user)); setF({name:'',type:'Subcontractor',trade:'',contact:'',email:'',phone:''}); };
  const inp={width:'100%',border:`1px solid ${t.line}`,borderRadius:9,padding:'9px 12px',fontSize:13.5,fontFamily:t.fBody,outline:'none'};
  const lbl={fontSize:11.5,fontWeight:700,color:t.muted,display:'block',marginBottom:5};
  const tabs=['All',...COMPANY_TYPES];

  return (
    <div>
      <PageHead title="Directory" sub={`${dir.length} companies · ${subs} subcontractors · ${active} active`}
        right={<div style={{display:'flex',alignItems:'center',gap:9,background:'#fff',border:`1px solid ${t.line}`,borderRadius:10,padding:'9px 13px',width:240,color:t.muted}}><DIcon d={IC.search} s={16}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search companies…" style={{border:0,outline:'none',fontSize:13.5,fontFamily:t.fBody,background:'transparent',width:'100%',color:t.ink}}/></div>}/>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:16}}>
        <Kpi icon={IC.building} label="Companies" value={String(dir.length)} tint="cyan"/>
        <Kpi icon={IC.user} label="Subcontractors" value={String(subs)} tint="cyan" sub="trade partners"/>
        <Kpi icon={IC.flag} label="Design / Owner" value={String(partners)} tint="ok"/>
        <Kpi icon={IC.check} label="Active" value={String(active)} tint="gold"/>
      </div>

      <div style={{display:'flex',gap:7,marginBottom:14,flexWrap:'wrap'}}>
        {tabs.map(tb=>{ const on=filter===tb; return (
          <button key={tb} onClick={()=>setFilter(tb)} style={{border:`1px solid ${on?t.blue:t.line}`,background:on?'#EAF4FC':'#fff',color:on?t.blue:t.muted,borderRadius:20,padding:'7px 14px',fontSize:12.5,fontWeight:700,cursor:'pointer'}}>{tb}{tb!=='All'?` · ${dir.filter(c=>c.type===tb).length}`:''}</button>
        );})}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1.62fr 1fr',gap:16,alignItems:'start'}}>
        <Card title="Companies" meta={`${filtered.length} shown`} pad={false}>
          {filtered.length===0 && <div style={{fontSize:13,color:t.muted,padding:'16px 18px'}}>No companies match.</div>}
          {filtered.map((c,i)=>{ const [ibg,ic,pk]=typeTint[c.type]||typeTint.Vendor;
            return <div key={c.id} style={{display:'flex',alignItems:'center',gap:13,padding:'13px 18px',borderBottom:i<filtered.length-1?`1px solid ${t.lineSoft}`:'none',opacity:c.status==='inactive'?.5:1}}>
              <div style={{width:40,height:40,borderRadius:11,background:ibg,color:ic,display:'grid',placeItems:'center',fontFamily:t.fHead,fontWeight:800,fontSize:14,flex:'none'}}>{dirInitials(c.name)}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:'flex',alignItems:'center',gap:9}}><span style={{fontSize:13.5,fontWeight:700,color:t.ink}}>{c.name}</span><Pill kind={pk}>{c.type}</Pill></div>
                <div style={{fontSize:11.5,color:t.muted,marginTop:2}}>{c.trade}{c.contact?` · ${c.contact}`:''}</div>
              </div>
              <div style={{textAlign:'right',flex:'none',minWidth:0}}>
                <div style={{fontSize:12,color:t.ink2,fontWeight:600}}>{c.email}</div>
                <div style={{fontSize:11.5,color:t.faint,marginTop:1,fontFamily:t.fMono}}>{c.phone}</div>
              </div>
              <button onClick={()=>DROS.actions.toggleCompany(c.id)} title="Toggle active" style={{flex:'none',border:`1px solid ${c.status==='active'?'transparent':t.line}`,background:c.status==='active'?t.okBg:'#fff',color:c.status==='active'?t.ok:t.muted,borderRadius:20,padding:'5px 11px',fontSize:11,fontWeight:800,letterSpacing:'.03em',textTransform:'uppercase',cursor:'pointer'}}>{c.status==='active'?'Active':'Inactive'}</button>
            </div>;})}
        </Card>

        <Card title="Add a Company">
          <div style={{display:'flex',flexDirection:'column',gap:11}}>
            <div><label style={lbl}>Company name</label><input value={f.name} onChange={e=>setF({...f,name:e.target.value})} onKeyDown={e=>e.key==='Enter'&&add()} placeholder="e.g. Gulf Coast Concrete" style={inp}/></div>
            <div style={{display:'flex',gap:10}}>
              <div style={{flex:1}}><label style={lbl}>Type</label>
                <select value={f.type} onChange={e=>setF({...f,type:e.target.value})} style={{...inp,fontWeight:600,color:t.ink,background:'#fff',cursor:'pointer'}}>{COMPANY_TYPES.map(k=><option key={k}>{k}</option>)}</select></div>
              <div style={{flex:1}}><label style={lbl}>Trade</label><input value={f.trade} onChange={e=>setF({...f,trade:e.target.value})} placeholder="Electrical" style={inp}/></div>
            </div>
            <div><label style={lbl}>Primary contact</label><input value={f.contact} onChange={e=>setF({...f,contact:e.target.value})} placeholder="Name" style={inp}/></div>
            <div style={{display:'flex',gap:10}}>
              <div style={{flex:1.4}}><label style={lbl}>Email</label><input value={f.email} onChange={e=>setF({...f,email:e.target.value})} placeholder="name@company.com" style={inp}/></div>
              <div style={{flex:1}}><label style={lbl}>Phone</label><input value={f.phone} onChange={e=>setF({...f,phone:e.target.value})} placeholder="(713) 555-0000" style={inp}/></div>
            </div>
            <button onClick={add} style={{background:t.blue,color:'#fff',border:0,borderRadius:10,padding:'11px',fontSize:13.5,fontWeight:700,cursor:'pointer'}}>Add to directory</button>
            <div style={{fontSize:11.5,color:t.muted,textAlign:'center'}}>Subcontractors & vendors appear in the Commitments picker.</div>
          </div>
        </Card>
      </div>
    </div>
  );
}

window.DirectoryView=DirectoryView;
window.dirVendor = id => (DROS.state.directory||[]).find(c=>c.id===id);
