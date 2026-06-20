/* Documents module — the phase/function folder structure from the
   Dropbox Folder Guide, made live. Folder counts derive from real
   project data (COs, logs, photos) + filed docs. Adding a document
   auto-files it to the right folder. Uses window globals. */
const {useState:useStateD} = React;

function folderIcon(name){
  if(/Contract/.test(name)) return IC.doc;
  if(/Change/.test(name)) return IC.edit;
  if(/Daily/.test(name)) return IC.clipboard;
  if(/Photos/.test(name)) return IC.camera;
  if(/Drawings/.test(name)) return IC.layers;
  if(/RFI/.test(name)) return IC.help;
  if(/Budget|Cost/.test(name)) return IC.receipt;
  if(/Schedule/.test(name)) return IC.calendar;
  if(/Closeout/.test(name)) return IC.check;
  return IC.inbox;
}

function DocumentsView({user}){
  const t=DRtok; const {state}=useStore();
  const projects=state.projects.filter(p=>p.stage!=='Lead');
  const [pid,setPid]=useStateD((projects[0]||{}).id);
  const p=DROS.P(pid)||projects[0];
  const [form,setForm]=useStateD({name:'',kind:'General'});
  const [dbx,setDbx]=useStateD(window.DRDropbox?DRDropbox.status:'off');
  const [dbxInfo,setDbxInfo]=useStateD(window.DRDropbox?DRDropbox.info:{});
  React.useEffect(()=>{ if(window.DRDropbox) return DRDropbox.onStatus((st,inf)=>{setDbx(st);setDbxInfo(inf||{});}); },[]);
  const dbxOn = dbx==='connected';
  const counts=p?DROS.folderCounts(p):{};
  const kinds=['Contract','Change Order','Daily Report','Drawing','RFI','Invoice','Photo','General'];

  const add=()=>{ if(!form.name.trim()){drToast('Name the document first');return;} drToast(DROS.actions.addDoc(p.id,form,user)); setForm({name:'',kind:'General'}); };

  if(!p) return <PlaceholderView title="Documents"/>;
  return (
    <div>
      <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:18,gap:16,flexWrap:'wrap'}}>
        <div>
          <h1 style={{fontFamily:t.fHead,fontWeight:800,fontSize:26,letterSpacing:'-.025em',color:t.ink,margin:0}}>Documents</h1>
          <div style={{color:t.muted,fontSize:13.5,marginTop:4}}>Same folders on every job · new files auto-file to the right folder</div>
        </div>
        <select value={pid} onChange={e=>setPid(e.target.value)} style={{border:`1px solid ${t.line}`,borderRadius:10,padding:'10px 14px',fontSize:13.5,fontFamily:t.fBody,fontWeight:600,color:t.ink,background:'#fff',cursor:'pointer',outline:'none'}}>
          {projects.map(pr=><option key={pr.id} value={pr.id}>{pr.name}</option>)}
        </select>
      </div>

      <div style={{display:'flex',alignItems:'center',gap:13,padding:'12px 15px',borderRadius:12,marginBottom:16,border:`1px solid ${dbxOn?'rgba(0,97,255,.28)':t.line}`,background:dbxOn?'rgba(0,97,255,.05)':t.cardTint}}>
        <div style={{width:38,height:38,borderRadius:10,background:dbxOn?'rgba(0,97,255,.12)':'#EEF2F6',display:'grid',placeItems:'center',flex:'none'}}><DropboxLogo s={20} color={dbxOn?'#0061FF':'#9AA7B4'}/></div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:13.5,fontWeight:700,color:t.ink}}>{dbxOn?`Backed up to Dropbox · ${dbxInfo.folder||'Dun Rite'}`:'Dropbox not connected'}</div>
          <div style={{fontSize:12,color:t.muted,marginTop:1}}>{dbxOn?'Every filed document mirrors to your Dropbox team folder.':'Connect a Dropbox folder so every job’s files back up automatically.'}</div>
        </div>
        {dbxOn
          ? <a href={dbxInfo.url||'#'} target="_blank" rel="noopener" style={{display:'inline-flex',alignItems:'center',gap:7,background:'#0061FF',color:'#fff',padding:'9px 14px',borderRadius:9,fontSize:12.5,fontWeight:700,textDecoration:'none',flex:'none'}}><DIcon d={IC.external} s={14}/>Open in Dropbox</a>
          : <button onClick={()=>window.dispatchEvent(new Event('dr-open-dropbox'))} style={{display:'inline-flex',alignItems:'center',gap:7,background:'#0061FF',color:'#fff',border:0,padding:'9px 14px',borderRadius:9,fontSize:12.5,fontWeight:700,cursor:'pointer',flex:'none'}}><DropboxLogo s={14} color="#fff"/>Connect Dropbox</button>}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1.55fr 1fr',gap:16,alignItems:'start'}}>
        {/* folder grid */}
        <Card title={`${p.id} · Folder Structure`} meta={`${Object.values(counts).reduce((a,b)=>a+b,0)} files`}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            {DROS.FOLDERS.map(f=>(
              <div key={f} style={{display:'flex',alignItems:'center',gap:11,padding:'12px 13px',border:`1px solid ${t.line}`,borderRadius:11,background:t.cardTint}}>
                <div style={{...circ(),width:34,height:34,borderRadius:9,background:'#EAF4FC',color:t.blue,flex:'none'}}><DIcon d={folderIcon(f)} s={17}/></div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12.5,fontWeight:700,color:t.ink,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{f}</div>
                  <div style={{fontSize:11,color:t.muted,marginTop:1}}>{counts[f]||0} {counts[f]===1?'file':'files'}</div>
                </div>
                {dbxOn && <a href={dbxInfo.url||'#'} target="_blank" rel="noopener" title="Open in Dropbox" style={{display:'grid',placeItems:'center',width:28,height:28,borderRadius:8,color:'#0061FF',background:'rgba(0,97,255,.09)',flex:'none',textDecoration:'none'}}><DIcon d={IC.external} s={14}/></a>}
              </div>
            ))}
          </div>
        </Card>

        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          {/* add doc */}
          <Card title="Add a Document">
            <div style={{display:'flex',flexDirection:'column',gap:11}}>
              <div><label style={{fontSize:11.5,fontWeight:700,color:t.muted,display:'block',marginBottom:5}}>File name</label>
                <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} onKeyDown={e=>e.key==='Enter'&&add()} placeholder="e.g. 2026-06-18_ChangeOrder-03.pdf" style={{width:'100%',border:`1px solid ${t.line}`,borderRadius:9,padding:'9px 12px',fontSize:13.5,fontFamily:t.fBody,outline:'none'}}/></div>
              <div><label style={{fontSize:11.5,fontWeight:700,color:t.muted,display:'block',marginBottom:5}}>Type</label>
                <select value={form.kind} onChange={e=>setForm({...form,kind:e.target.value})} style={{width:'100%',border:`1px solid ${t.line}`,borderRadius:9,padding:'9px 12px',fontSize:13.5,fontFamily:t.fBody,fontWeight:500,color:t.ink,background:'#fff',outline:'none'}}>
                  {kinds.map(k=><option key={k}>{k}</option>)}
                </select></div>
              <div style={{fontSize:11.5,color:t.muted,background:t.cardTint,border:`1px dashed ${t.line}`,borderRadius:9,padding:'9px 11px',display:'flex',gap:7,alignItems:'center'}}>
                <span style={{color:t.ok,flex:'none'}}><DIcon d={IC.bolt} s={14}/></span>
                Files to <b style={{color:t.ink}}>&nbsp;{DROS.folderFor(form.kind, form.name)}</b>
              </div>
              <button onClick={add} style={{background:t.blue,color:'#fff',border:0,borderRadius:10,padding:'11px',fontSize:13.5,fontWeight:700,cursor:'pointer'}}>Add &amp; auto-file</button>
            </div>
          </Card>

          {/* recent docs */}
          <Card title="Recently Filed" meta={String((p.docs||[]).length)}>
            {(!p.docs||p.docs.length===0) && <div style={{fontSize:13,color:t.muted}}>Nothing filed yet. Add a document and it lands in the right folder automatically.</div>}
            <div style={{display:'flex',flexDirection:'column',gap:0}}>
              {(p.docs||[]).slice(0,6).map((d,i)=>(
                <div key={d.id} style={{display:'flex',gap:11,alignItems:'center',padding:'10px 0',borderBottom:i<Math.min(p.docs.length,6)-1?`1px solid ${t.lineSoft}`:'none'}}>
                  <div style={{...circ(),width:30,height:30,borderRadius:8,background:t.cardTint,color:t.muted,flex:'none'}}><DIcon d={folderIcon(d.folder)} s={15}/></div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:12.5,fontWeight:600,color:t.ink,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{d.name}</div>
                    <div style={{fontSize:11,color:t.muted,marginTop:1}}>{d.folder}</div>
                  </div>
                  <span style={{fontSize:11,color:t.faint,whiteSpace:'nowrap'}}>{ago(d.ts)}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
window.DocumentsView=DocumentsView;
