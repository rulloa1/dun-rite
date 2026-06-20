/* Subcontractor Insurance — certificate-of-insurance (COI) compliance.
   Tracks each sub's carrier + policies (GL / WC / Auto / Umbrella) and
   flags expiring/expired coverage off the soonest expiration date.
   Wired to DROS.actions.updateInsurance / renewInsurance + insuranceStatus. */
const {useState:useStateIns} = React;

const insMap = {
  active:  ['Covered',     'ok'],
  expiring:['Expiring',    'warn'],
  expired: ['Expired',     'bad'],
  missing: ['Missing COI', 'idle'],
};
const POL_TYPES = ['GL','WC','Auto','Umbrella'];
const POL_LABEL = {GL:'General Liability', WC:"Workers' Comp", Auto:'Auto', Umbrella:'Umbrella'};
function fmtDate(s){ if(!s) return '—'; const d=new Date(s+'T00:00:00'); return isNaN(d)?s:d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}); }

function InsuranceView({user}){
  const t=DRtok; const {state}=useStore();
  const subs=(state.directory||[]).filter(c=>c.type==='Subcontractor' && c.status==='active');
  const rows=subs.map(c=>({c, st:DROS.insuranceStatus(c.id), rec:(state.insurance||{})[c.id]}));
  const order={expired:0,missing:1,expiring:2,active:3};
  rows.sort((a,b)=>order[a.st.state]-order[b.st.state]);

  const count=s=>rows.filter(r=>r.st.state===s).length;
  const [vid,setVid]=useStateIns((subs[0]||{}).id||'');
  const blank={GL:{limit:'',expires:''},WC:{limit:'',expires:''},Auto:{limit:'',expires:''}};
  const loadForm=(id)=>{ const rec=(DROS.state.insurance||{})[id]||{}; const f={carrier:rec.carrier||'', pol:JSON.parse(JSON.stringify(blank))}; (rec.policies||[]).forEach(p=>{ if(f.pol[p.type]) f.pol[p.type]={limit:p.limit||'',expires:p.expires||''}; }); return f; };
  const [form,setForm]=useStateIns(()=>loadForm((subs[0]||{}).id||''));
  const pickVendor=(id)=>{ setVid(id); setForm(loadForm(id)); };

  const save=()=>{
    const policies=[];
    Object.keys(form.pol).forEach(type=>{ const p=form.pol[type]; if(p.expires) policies.push({type, limit:p.limit||'—', expires:p.expires}); });
    drToast(DROS.actions.updateInsurance(vid, {carrier:form.carrier, policies}, user));
  };

  const inp={width:'100%',border:`1px solid ${t.line}`,borderRadius:9,padding:'9px 11px',fontSize:13,fontFamily:t.fBody,outline:'none'};
  const lbl={fontSize:11.5,fontWeight:700,color:t.muted,display:'block',marginBottom:5};

  return (
    <div>
      <PageHead title="Subcontractor Insurance" sub={`${count('active')} covered · ${count('expiring')} expiring · ${count('expired')+count('missing')} need a current COI`}/>

      {(count('expired')+count('expiring'))>0 && (
        <div style={{display:'flex',alignItems:'center',gap:13,padding:'12px 15px',borderRadius:12,marginBottom:16,border:`1px solid ${count('expired')>0?'rgba(208,73,74,.3)':'rgba(224,138,30,.3)'}`,background:count('expired')>0?t.badBg:t.warnBg}}>
          <div style={{width:36,height:36,borderRadius:10,background:'#fff',display:'grid',placeItems:'center',color:count('expired')>0?t.bad:t.warn,flex:'none'}}><DIcon d={IC.bell} s={18}/></div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:13.5,fontWeight:700,color:t.ink}}>{count('expired')+count('expiring')} subcontractor{(count('expired')+count('expiring'))!==1?'s':''} need an updated COI</div>
            <div style={{fontSize:12,color:t.ink2,marginTop:1}}>Email the subs and alert your team in one click — {count('expired')} expired, {count('expiring')} expiring soon.</div>
          </div>
          <button onClick={()=>drToast(DROS.actions.alertAllExpiring(user))} style={{display:'inline-flex',alignItems:'center',gap:7,background:count('expired')>0?t.bad:t.warn,color:'#fff',border:0,padding:'9px 15px',borderRadius:9,fontSize:12.5,fontWeight:700,cursor:'pointer',flex:'none'}}><DIcon d={IC.bell} s={15}/>Notify subs &amp; team</button>
        </div>
      )}

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:16}}>
        <Kpi icon={IC.check} label="Covered" value={String(count('active'))} tint="ok"/>
        <Kpi icon={IC.clock} label="Expiring ≤30d" value={String(count('expiring'))} tint="warn"/>
        <Kpi icon={IC.alert} label="Expired" value={String(count('expired'))} tint="bad"/>
        <Kpi icon={IC.doc} label="Missing COI" value={String(count('missing'))} tint="cyan"/>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1.7fr 1fr',gap:16,alignItems:'start'}}>
        <Card title="Subcontractor Coverage" meta={`${rows.length} active subs`} pad={false}>
          {rows.map(({c,st,rec},i)=>{ const [sl,sk]=insMap[st.state];
            return <div key={c.id} style={{display:'flex',alignItems:'center',gap:12,padding:'13px 18px',borderBottom:i<rows.length-1?`1px solid ${t.lineSoft}`:'none'}}>
              <div style={{width:38,height:38,borderRadius:10,background:st.state==='expired'?t.badBg:st.state==='expiring'?t.warnBg:st.state==='missing'?t.idleBg:t.okBg,color:st.state==='expired'?t.bad:st.state==='expiring'?t.warn:st.state==='missing'?t.idle:t.ok,display:'grid',placeItems:'center',fontFamily:t.fHead,fontWeight:800,fontSize:13,flex:'none'}}>{c.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:'flex',alignItems:'center',gap:9,flexWrap:'wrap'}}><span style={{fontSize:13.5,fontWeight:700,color:t.ink}}>{c.name}</span>{(rec&&rec.policies||[]).map((p,j)=>(<span key={j} style={{fontSize:10,fontWeight:700,color:t.ink2,background:t.cardTint,border:`1px solid ${t.line}`,borderRadius:6,padding:'2px 7px'}}>{p.type} {p.limit}</span>))}</div>
                <div style={{fontSize:11.5,color:t.muted,marginTop:2}}>{st.carrier?st.carrier:'No carrier on file'}{st.soonest?` · expires ${fmtDate(st.soonest)}`:''}{st.days!=null?(st.days<0?` · ${Math.abs(st.days)}d overdue`:st.days<=30?` · ${st.days}d left`:''):''}</div>
              </div>
              <Pill kind={sk}>{sl}</Pill>
              {(st.state==='expired'||st.state==='expiring') && <button onClick={()=>drToast(DROS.actions.alertInsurance(c.id,user))} title="Email this sub & alert the team" style={{width:30,height:30,borderRadius:8,border:`1px solid ${t.line}`,background:'#fff',color:st.state==='expired'?t.bad:t.warn,cursor:'pointer',display:'grid',placeItems:'center',flex:'none',padding:0}}><DIcon d={IC.bell} s={15}/></button>}
              {rec&&rec.policies&&rec.policies.length>0
                ? <button onClick={()=>drToast(DROS.actions.renewInsurance(c.id,user))} style={{fontSize:11.5,fontWeight:700,color:'#fff',background:t.blue,border:0,padding:'6px 12px',borderRadius:8,cursor:'pointer',flex:'none'}}>Renew 1yr</button>
                : <button onClick={()=>pickVendor(c.id)} style={{fontSize:11.5,fontWeight:700,color:t.blue,background:'#EAF4FC',border:0,padding:'6px 12px',borderRadius:8,cursor:'pointer',flex:'none'}}>Add COI</button>}
            </div>;})}
        </Card>

        <Card title="Update Certificate">
          <div style={{display:'flex',flexDirection:'column',gap:11}}>
            <div><label style={lbl}>Subcontractor</label><select value={vid} onChange={e=>pickVendor(e.target.value)} style={{...inp,fontWeight:600,color:t.ink,background:'#fff',cursor:'pointer'}}>{subs.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
            <div><label style={lbl}>Carrier</label><input value={form.carrier} onChange={e=>setForm({...form,carrier:e.target.value})} placeholder="e.g. Travelers" style={inp}/></div>
            <div style={{borderTop:`1px solid ${t.lineSoft}`,paddingTop:10}}>
              <div style={{fontSize:11,fontWeight:800,letterSpacing:'.04em',textTransform:'uppercase',color:t.faint,marginBottom:8}}>Policies</div>
              {['GL','WC','Auto'].map(type=>(
                <div key={type} style={{display:'flex',gap:7,alignItems:'center',marginBottom:8}}>
                  <span style={{width:42,fontSize:11.5,fontWeight:800,color:t.ink2,flex:'none'}}>{type}</span>
                  <input value={form.pol[type].limit} onChange={e=>setForm({...form,pol:{...form.pol,[type]:{...form.pol[type],limit:e.target.value}}})} placeholder="Limit" style={{...inp,flex:1,padding:'8px 10px'}}/>
                  <input type="date" value={form.pol[type].expires} onChange={e=>setForm({...form,pol:{...form.pol,[type]:{...form.pol[type],expires:e.target.value}}})} style={{...inp,flex:1.1,padding:'8px 10px',fontFamily:t.fMono,fontSize:12}}/>
                </div>
              ))}
            </div>
            <button onClick={save} style={{background:t.blue,color:'#fff',border:0,borderRadius:10,padding:'11px',fontSize:13.5,fontWeight:700,cursor:'pointer'}}>Save certificate</button>
            <div style={{fontSize:11.5,color:t.muted,textAlign:'center'}}>Set an expiration on a policy to record it. Expiring &amp; expired COIs flag automatically.</div>
          </div>
        </Card>
      </div>
    </div>
  );
}

window.InsuranceView=InsuranceView;
window.insStatusPill=insMap;
