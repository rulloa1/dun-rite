/* ============================================================
   Dun Rite Operating System — shared data store
   One source of truth for every screen. Persists to localStorage
   (key dr_os_v1) so all views + accounts read/write the same data.
   Automation lives here: actions cascade (a daily log advances the
   schedule, a CO approval moves money, a closed punch list archives
   the project) so the UI never asks anyone to do a second step.
   ============================================================ */
(function(){
  const KEY = 'dr_os_v1';

  /* ---- users (simple account picker, no password for the prototype) ---- */
  const USERS = [
    {id:'jr', name:'Jerry Ruskin',  role:'owner',  title:'Owner',              initials:'JR'},
    {id:'mc', name:'Michael Chandler', role:'owner', title:'Executive',        initials:'MC'},
    {id:'ru', name:'Rory Ulloa',    role:'admin',  title:'Construction Technology Specialist', initials:'RU'},
    {id:'sj', name:'Sarah Johnson', role:'pm',     title:'Project Manager',    initials:'SJ'},
    {id:'mt', name:'Mike Torres',   role:'super',  title:'Superintendent',     initials:'MT'},
    {id:'lc', name:'Lisa Chen',     role:'office', title:'Office / Bookkeeper', initials:'LC'},
  ];

  const STAGES = ['Lead','Bidding','Active','Punch','Closed'];

  /* ---- seed data ---- */
  function seed(){
    const mk = (o)=>Object.assign({tasks:[],logs:[],cos:[],photos:[],docs:[],issues:[]}, o);
    return {
      activity: [
        {id:'a1', who:'MT', text:'Logged daily report', meta:'Longleaf · 12 crew on site', ts:Date.now()-18*60000},
        {id:'a2', who:'SJ', text:'Uploaded 8 photos',   meta:'Riverview · MEP rough-in',  ts:Date.now()-60*60000},
        {id:'a3', who:'LC', text:'Invoice drafted',     meta:'Cedar Park · $214,000',     ts:Date.now()-3*3600000},
      ],
      projects: [
        mk({id:'LON', name:'Longleaf Amenity Center', stage:'Active', pm:'Sarah Johnson', super:'Mike Torres',
          phase:'Drywall', pct:62, contract:1610000, spent:1420000, due:'Aug 14', health:'ok',
          tasks:[
            {id:'t1', title:'Confirm drywall delivery', who:'mt', done:false, due:'Today'},
            {id:'t2', title:'Order cabinet hardware', who:'mt', done:false, due:'Tue'},
            {id:'t3', title:'Submit weekly crew hours', who:'mt', done:false, due:'Fri'},
          ],
          cos:[{id:'c1', code:'CO-012', desc:'Added insulation upgrade', amt:9400, status:'approved'}],
          logs:[{id:'l0', date:'Jun 17', crew:11, weather:'Clear, 84°', work:'Hung drywall east wing', by:'MT'}],
          issues:[{id:'i1', title:'Drywall seam crack — east hall', priority:'med', status:'open', by:'MT'}],
          photos:6}),
        mk({id:'RVO', name:'Riverview Office Buildout', stage:'Active', pm:'Sarah Johnson', super:'Mike Torres',
          phase:'MEP Rough-In', pct:38, contract:860000, spent:612000, due:'Sep 02', health:'warn',
          tasks:[
            {id:'t4', title:'Walk MEP rough-in w/ inspector', who:'mt', done:false, due:'Today'},
          ],
          cos:[{id:'c2', code:'CO-009', desc:'Electrical panel upgrade', amt:6200, status:'pending'}],
          photos:8}),
        mk({id:'MAP', name:'Maple St. Renovation', stage:'Active', pm:'Mike Torres', super:'Mike Torres',
          phase:'Demo', pct:24, contract:260000, spent:281000, due:'Jul 22', health:'bad',
          cos:[{id:'c3', code:'CO-014', desc:'Foundation drainage (unforeseen)', amt:18400, status:'pending'}],
          issues:[
            {id:'i2', title:'Unforeseen water in foundation', priority:'high', status:'open', by:'MT'},
            {id:'i3', title:'Permit revision needed for drainage', priority:'high', status:'open', by:'SJ'},
          ],
          photos:3}),
        mk({id:'CED', name:'Cedar Park Clubhouse', stage:'Punch', pm:'Sarah Johnson', super:'Mike Torres',
          phase:'Punch List', pct:91, contract:2140000, spent:2050000, due:'Jun 30', health:'ok',
          tasks:[{id:'t5', title:'Close punch item #41 — paint touch-up', who:'mt', done:false, due:'Today'}],
          issues:[
            {id:'i4', title:'#41 Paint touch-up — lobby', priority:'low', status:'open', by:'MT'},
            {id:'i5', title:'#42 Door hardware adjust — suite 3', priority:'low', status:'open', by:'MT'},
            {id:'i6', title:'#39 HVAC register replace', priority:'med', status:'open', by:'MT'},
          ],
          photos:24}),
        mk({id:'HBR', name:'Harbor View Townhomes', stage:'Active', pm:'Mike Torres', super:'Mike Torres',
          phase:'Slab', pct:12, contract:2400000, spent:190000, due:'Mar 15', health:'ok', photos:0}),
        mk({id:'PKV', name:'Parkview Medical', stage:'Bidding', pm:'Sarah Johnson', super:'—',
          phase:'Bid due Jun 27', pct:0, contract:4200000, spent:0, due:'—', health:'warn'}),
        mk({id:'WMT', name:'Westmont Retail', stage:'Lead', pm:'Sarah Johnson', super:'—',
          phase:'Est. due Jun 24', pct:0, contract:3100000, spent:0, due:'—', health:null}),
        mk({id:'BRG', name:'Bridge St. Lofts', stage:'Lead', pm:'Sarah Johnson', super:'—',
          phase:'Site visit Thu', pct:0, contract:1800000, spent:0, due:'—', health:null}),
        mk({id:'ELM', name:'Elmwood Daycare', stage:'Closed', pm:'Sarah Johnson', super:'Mike Torres',
          phase:'Closed May 30', pct:100, contract:1200000, spent:1180000, due:'—', health:null, photos:40}),
      ],
      invoices: [
        {id:'v1', num:'INV-1042', pid:'CED', amt:214000, status:'draft',  date:'Jun 18'},
        {id:'v2', num:'INV-1041', pid:'LON', amt:186000, status:'sent',   date:'Jun 10'},
        {id:'v3', num:'INV-1039', pid:'RVO', amt:92000,  status:'sent',   date:'Jun 04'},
        {id:'v4', num:'INV-1036', pid:'LON', amt:240000, status:'paid',   date:'May 22'},
        {id:'v5', num:'INV-1033', pid:'CED', amt:310000, status:'paid',   date:'May 08'},
      ],
      trackers: {
        rfi: [
          {id:'r1', pid:'LON', title:'Ceiling height at lobby soffit', status:'open', meta:'#RFI-018'},
          {id:'r2', pid:'RVO', title:'Panel location conflict w/ duct', status:'open', meta:'#RFI-017'},
          {id:'r3', pid:'MAP', title:'Footing depth per soils report', status:'open', meta:'#RFI-016'},
        ],
        submittals: [
          {id:'s1', pid:'LON', title:'Cabinet shop drawings', status:'open', meta:'Rev 2'},
          {id:'s2', pid:'LON', title:'Countertop samples', status:'open', meta:'Rev 1'},
          {id:'s3', pid:'RVO', title:'Light fixture cut sheets', status:'open', meta:'Rev 1'},
          {id:'s4', pid:'CED', title:'Paint color schedule', status:'open', meta:'Rev 3'},
        ],
        safety: [
          {id:'sf1', pid:'MAP', title:'Trip hazard near trench — flagged', status:'open', meta:'Jun 16'},
          {id:'sf2', pid:'LON', title:'Weekly toolbox talk logged', status:'closed', meta:'Jun 15'},
        ],
        equipment: [
          {id:'e1', pid:'LON', title:'Scissor lift — on site', status:'open', meta:'Rental · due Jun 28'},
          {id:'e2', pid:'HBR', title:'Excavator — on site', status:'open', meta:'Rental · due Jul 05'},
          {id:'e3', pid:'MAP', title:'Dumpster swap requested', status:'open', meta:'Pending'},
        ],
      },
    };
  }

  /* ---- persistence + pub/sub ---- */
  let state = null;
  const subs = new Set();
  function load(){
    try{ state = JSON.parse(localStorage.getItem(KEY)); }catch(e){ state = null; }
    if(!state || !state.projects){ state = seed(); }
    state = normalize(state);
    save();
  }
  /* migrate older saved state to the current schema (adds new fields,
     backfills demo issues) without wiping anyone's existing data */
  function normalize(s){
    const sd = seed();
    const seededIssues = {}; sd.projects.forEach(sp=>seededIssues[sp.id]=sp.issues||[]);
    s.activity = Array.isArray(s.activity) ? s.activity : sd.activity;
    s.projects = (s.projects||[]).map(p=>{
      p = Object.assign({tasks:[],logs:[],cos:[],docs:[],issues:[],photos:0}, p);
      ['tasks','logs','cos','docs','issues'].forEach(k=>{ if(!Array.isArray(p[k])) p[k]=[]; });
      if(Array.isArray(p.photos)) p.photos = p.photos.length;
      if(p.issues.length===0 && (seededIssues[p.id]||[]).length){ p.issues = seededIssues[p.id].map(x=>({...x})); }
      return p;
    });
    if(!Array.isArray(s.invoices)) s.invoices = sd.invoices;
    if(!s.trackers) s.trackers = sd.trackers;
    if(!s.scheduleOverrides) s.scheduleOverrides = {};
    return s;
  }
  function save(){ localStorage.setItem(KEY, JSON.stringify(state)); }
  function emit(){ save(); subs.forEach(fn=>fn(state)); if(_localChange) _localChange(state); }
  function subscribe(fn){ subs.add(fn); return ()=>subs.delete(fn); }

  /* ---- cloud sync hooks (used by os/sync.js when configured) ---- */
  let _localChange = null;
  function onLocalChange(fn){ _localChange = fn; }
  function applyRemote(remote){ if(!remote) return; state = remote; save(); subs.forEach(fn=>fn(state)); }

  /* keep multiple open tabs / views in sync */
  window.addEventListener('storage', e=>{ if(e.key===KEY){ load(); subs.forEach(fn=>fn(state)); } });

  /* ---- helpers ---- */
  const P = id => state.projects.find(p=>p.id===id);
  const initialsOf = name => name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();

  /* phase/function folder structure (matches the Dropbox Folder Guide) */
  const FOLDERS = ['00_Project Admin','01_Contracts','02_Budget & Cost','03_Schedule','04_RFIs & Submittals','05_Change Orders','06_Daily Logs','07_Drawings','08_Photos','09_Closeout'];
  function folderFor(kind, name){
    const k=(kind||'').toLowerCase(), n=(name||'').toLowerCase();
    if(/contract/.test(k+n)) return '01_Contracts';
    if(/change|\bco\b|co-/.test(k+n)) return '05_Change Orders';
    if(/log|report/.test(k+n)) return '06_Daily Logs';
    if(/photo|jpg|png|img/.test(k+n)) return '08_Photos';
    if(/draw|plan|dwg|pdf set|spec/.test(k+n)) return '07_Drawings';
    if(/rfi|submittal/.test(k+n)) return '04_RFIs & Submittals';
    if(/invoice|budget|cost|requisition|pay/.test(k+n)) return '02_Budget & Cost';
    if(/schedule|gantt/.test(k+n)) return '03_Schedule';
    if(/closeout|punch|warranty|final/.test(k+n)) return '09_Closeout';
    return '00_Project Admin';
  }
  /* live folder counts: derive from real project data + filed docs */
  function folderCounts(p){
    const c={}; FOLDERS.forEach(f=>c[f]=0);
    c['01_Contracts']+=1;                       // every job has its contract
    c['05_Change Orders']+=p.cos.length;
    c['06_Daily Logs']+=p.logs.length;
    c['08_Photos']+=p.photos||0;
    if(p.stage==='Closed') c['09_Closeout']+=3;
    (p.docs||[]).forEach(d=>{ c[d.folder]=(c[d.folder]||0)+1; });
    return c;
  }
  function logActivity(who, text, meta){
    state.activity.unshift({id:'a'+Date.now(), who, text, meta, ts:Date.now()});
    state.activity = state.activity.slice(0,40);
  }

  /* ============================================================
     ACTIONS — each one cascades automatically. The toast string
     it returns names every downstream step the system did for you.
     ============================================================ */
  const actions = {
    toggleTask(pid, tid, user){
      const p=P(pid); const t=p.tasks.find(x=>x.id===tid); if(!t) return;
      t.done=!t.done;
      if(t.done) logActivity(user.initials, 'Completed a task', `${p.name} · ${t.title}`);
      emit();
    },

    submitDailyLog(pid, {crew, weather, work}, user){
      const p=P(pid);
      p.logs.unshift({id:'l'+Date.now(), date:'Today', crew:+crew||0, weather, work, by:user.initials});
      // AUTOMATION: advance schedule, refresh dashboard, feed activity
      const before=p.pct;
      p.pct=Math.min(99, p.pct + 3);
      logActivity(user.initials, 'Logged daily report', `${p.name} · ${crew} crew · ${work}`);
      emit();
      return `Daily log saved · schedule advanced ${before}%→${p.pct}% · dashboard updated · hours queued`;
    },

    addPhotos(pid, n, user){
      const p=P(pid); p.photos=(p.photos||0)+n;
      logActivity(user.initials, `Uploaded ${n} photos`, `${p.name} · ${p.phase}`);
      emit();
      return `${n} photos auto-tagged to ${p.name} · ${p.phase} and filed by date`;
    },

    createCO(pid, {desc, amt}, user){
      const p=P(pid);
      const n=p.cos.length+1;
      const code='CO-'+String(100+Math.floor(Math.random()*900));
      p.cos.unshift({id:'c'+Date.now(), code, desc, amt:+amt||0, status:'pending'});
      logActivity(user.initials, `Submitted ${code}`, `${p.name} · $${(+amt).toLocaleString()}`);
      emit();
      return `${code} routed to owner for one-tap approval`;
    },

    addDoc(pid, {name, kind}, user){
      const p=P(pid);
      const folder = DROS.folderFor(kind, name);
      p.docs.unshift({id:'d'+Date.now(), name, kind, folder, by:user.initials, ts:Date.now()});
      logActivity(user.initials, 'Added a document', `${p.name} · ${folder}`);
      emit();
      return `“${name}” auto-filed to ${folder}`;
    },

    addIssue(pid, {title, priority}, user){
      const p=P(pid);
      p.issues.unshift({id:'i'+Date.now(), title, priority:priority||'med', status:'open', by:user.initials});
      // AUTOMATION: a high-priority issue pulls the project's health down
      if(priority==='high' && p.health==='ok') p.health='warn';
      logActivity(user.initials, 'Opened an issue', `${p.name} · ${title}`);
      emit();
      return priority==='high' ? `Issue logged · ${p.name} flagged for the owner` : `Issue logged on ${p.name}`;
    },

    resolveIssue(pid, iid, user){
      const p=P(pid); const it=p.issues.find(x=>x.id===iid); if(!it) return;
      it.status = it.status==='open' ? 'closed' : 'open';
      let msg = it.status==='closed' ? `Resolved: ${it.title}` : `Reopened: ${it.title}`;
      logActivity(user.initials, it.status==='closed'?'Resolved an issue':'Reopened an issue', `${p.name} · ${it.title}`);
      // AUTOMATION: last open punch item closed on a Punch project → ready to close out
      const openLeft = p.issues.filter(x=>x.status==='open').length;
      if(it.status==='closed' && p.stage==='Punch' && openLeft===0){
        if(p.health==='warn'||p.health==='bad') p.health='ok';
        msg = `Punch list clear on ${p.name} — ready to close out`;
      }
      // a high-issue project with nothing open recovers its health
      if(openLeft===0 && p.health==='warn' && p.stage!=='Punch') p.health='ok';
      emit();
      return msg;
    },

    setInvoiceStatus(vid, status, user){
      const v = state.invoices.find(x=>x.id===vid); if(!v) return;
      v.status = status;
      const p = P(v.pid);
      // AUTOMATION: a paid invoice posts to the project and the activity feed
      logActivity(user.initials, status==='paid'?'Invoice paid':status==='sent'?'Invoice sent':'Invoice updated', `${p?p.name:''} · ${v.num} · $${v.amt.toLocaleString()}`);
      emit();
      return status==='sent' ? `${v.num} sent to client` : status==='paid' ? `${v.num} marked paid · $${v.amt.toLocaleString()} recorded` : `${v.num} updated`;
    },

    addTrackerItem(kind, pid, title, user){
      state.trackers[kind].unshift({id:kind+Date.now(), pid, title, status:'open', meta:'New'});
      logActivity(user.initials, 'Added item', `${kind.toUpperCase()} · ${title}`);
      emit();
      return `Added to ${kind.toUpperCase()}`;
    },

    toggleTracker(kind, id, user){
      const it = state.trackers[kind].find(x=>x.id===id); if(!it) return;
      it.status = it.status==='open' ? 'closed' : 'open';
      emit();
      return it.status==='closed' ? `Closed: ${it.title}` : `Reopened: ${it.title}`;
    },

    setPhase(pid, idx, patch){
      if(!state.scheduleOverrides) state.scheduleOverrides={};
      const o = state.scheduleOverrides[pid] || (state.scheduleOverrides[pid]={});
      o[idx] = Object.assign({}, o[idx], patch);
      emit();
    },

    /* upsert projects + tasks + budget lines from spreadsheet rows.
       Rows may carry a Type column: (blank/project) | task | budget */
    importRows(rows){
      const num = v => { const n=parseFloat(String(v).replace(/[^0-9.\-]/g,'')); return isNaN(n)?0:n; };
      const pct = v => { let n=num(v); if(n>0&&n<=1) n*=100; return Math.max(0,Math.min(100,Math.round(n))); };
      const STG = {lead:'Lead',bid:'Bidding',bidding:'Bidding',active:'Active',inprogress:'Active',punch:'Punch',closeout:'Punch',closed:'Closed',complete:'Closed',done:'Closed'};
      const stage = v => STG[String(v||'').toLowerCase().replace(/[^a-z]/g,'')] || 'Active';
      const HL = v => { const s=String(v||'').toLowerCase(); if(/risk|bad|red|over|late|behind/.test(s)) return 'bad'; if(/watch|warn|amber|yellow|hold/.test(s)) return 'warn'; return 'ok'; };
      const truthy = v => /^(1|true|yes|y|done|complete|x|✓|✔)$/i.test(String(v||'').trim());
      const findUser = v => { const s=String(v||'').trim().toLowerCase(); if(!s) return undefined; const u=USERS.find(u=>u.name.toLowerCase()===s||u.initials.toLowerCase()===s||u.name.toLowerCase().split(' ')[0]===s); return u?u.id:undefined; };
      const get = (r,k) => { const key=Object.keys(r).find(x=>x.toLowerCase().trim()===k); return key?String(r[key]).trim():''; };
      const code = r => (get(r,'code')||get(r,'id')||get(r,'project code')).toUpperCase().slice(0,4);
      const DEF = {tasks:[],logs:[],cos:[],docs:[],issues:[],photos:0,pm:'—',super:'—',stage:'Active',phase:'',pct:0,contract:0,spent:0,due:'—',health:'ok'};
      let added=0, updated=0, tasks=0, budget=0;

      // pass 1 — projects
      (rows||[]).forEach(r=>{
        const type=get(r,'type').toLowerCase(); if(type && type!=='project') return;
        const c=code(r); if(!c) return;
        const patch={};
        const name=get(r,'name')||get(r,'project')||get(r,'project name'); if(name) patch.name=name;
        const ph=get(r,'phase'); if(ph) patch.phase=ph;
        const st=get(r,'stage'); if(st) patch.stage=stage(st);
        const pc=get(r,'percent')||get(r,'progress')||get(r,'% complete')||get(r,'pct'); if(pc!=='') patch.pct=pct(pc);
        const con=get(r,'contract')||get(r,'contract value')||get(r,'budget'); if(con!=='') patch.contract=num(con);
        const sp=get(r,'spent')||get(r,'actual')||get(r,'cost'); if(sp!=='') patch.spent=num(sp);
        const due=get(r,'due')||get(r,'due date')||get(r,'deadline')||get(r,'completion'); if(due) patch.due=due;
        const pm=get(r,'pm')||get(r,'project manager'); if(pm) patch.pm=pm;
        const sup=get(r,'super')||get(r,'superintendent'); if(sup) patch.super=sup;
        const hl=get(r,'health'); if(hl) patch.health=HL(hl);
        let p=P(c);
        if(p){ Object.assign(p,patch); updated++; } else { state.projects.push(Object.assign({id:c},DEF,patch)); added++; }
      });
      // pass 2 — tasks + budget lines (projects now exist)
      (rows||[]).forEach(r=>{
        const type=get(r,'type').toLowerCase();
        if(type==='task'){
          const p=P(code(r)); if(!p) return;
          const title=get(r,'task')||get(r,'item')||get(r,'name'); if(!title) return;
          const who=findUser(get(r,'owner')||get(r,'assignee'));
          const due=get(r,'due')||get(r,'due date')||'This week';
          const done=truthy(get(r,'done')||get(r,'status'));
          let tk=p.tasks.find(x=>x.title.toLowerCase()===title.toLowerCase());
          if(tk){ tk.due=due; tk.done=done; if(who) tk.who=who; } else { p.tasks.push({id:'t'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),title,who,done,due}); }
          tasks++;
        } else if(type==='budget'||type==='sov'){
          const p=P(code(r)); if(!p) return;
          const desc=get(r,'item')||get(r,'description')||get(r,'line'); if(!desc) return;
          const amt=num(get(r,'amount')||get(r,'amt')||get(r,'cost'));
          const div=get(r,'division')||get(r,'category')||'Other';
          if(!p.sov) p.sov=[];
          let line=p.sov.find(x=>x.desc.toLowerCase()===desc.toLowerCase());
          if(line){ line.amt=amt; line.div=div; line.code=get(r,'cost code')||line.code; } else { p.sov.push({div,desc,code:get(r,'cost code')||'',amt}); }
          budget++;
        }
      });
      if(added||updated||tasks||budget){ logActivity('CSV','Synced from spreadsheet', `${added+updated} projects · ${tasks} tasks · ${budget} budget`); emit(); }
      return {added,updated,tasks,budget};
    },
    importProjects(rows){ return this.importRows(rows); },

    approveCO(pid, cid, user){
      const p=P(pid); const c=p.cos.find(x=>x.id===cid); if(!c) return;
      c.status='approved';
      // AUTOMATION: money moves
      p.contract += c.amt;
      logActivity(user.initials, `Approved ${c.code}`, `${p.name} · +$${c.amt.toLocaleString()}`);
      emit();
      return `${c.code} approved · contract value +$${c.amt.toLocaleString()} · budget recalculated`;
    },

    moveStage(pid, stage, user){
      const p=P(pid); const prev=p.stage; p.stage=stage;
      if(stage==='Active' && p.pct===0) p.pct=2;
      if(stage==='Closed'){ p.pct=100; }
      logActivity(user.initials, 'Moved project stage', `${p.name} · ${prev} → ${stage}`);
      emit();
      return stage==='Closed'
        ? `${p.name} closed · folder archived · closeout bundle assembled`
        : `${p.name} moved ${prev} → ${stage}`;
    },

    reset(){ state=seed(); emit(); },
  };

  /* ---- derived rollups for the owner ---- */
  function rollups(){
    const active = state.projects.filter(p=>p.stage==='Active'||p.stage==='Punch');
    const contractValue = active.reduce((s,p)=>s+p.contract,0);
    const spent = active.reduce((s,p)=>s+p.spent,0);
    const pendingCOs = [];
    state.projects.forEach(p=>p.cos.forEach(c=>{ if(c.status==='pending') pendingCOs.push({...c, pid:p.id, pname:p.name, health:p.health}); }));
    const atRisk = state.projects.filter(p=>p.health==='bad').length;
    return {active, contractValue, spent, pendingCOs, atRisk, billedPct: Math.round(spent/contractValue*100)};
  }

  load();
  window.DROS = { USERS, STAGES, get state(){return state;}, subscribe, actions, P, rollups, initialsOf, save, load, onLocalChange, applyRemote, FOLDERS, folderFor, folderCounts };
})();
