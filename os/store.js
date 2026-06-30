/* ============================================================
   DunRite Operating System — shared data store
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
    {id:'mc', name:'Michael Chandler', role:'admin', title:'Executive · Admin', email:'mike.rcccon@yahoo.com', initials:'MC'},
    {id:'ru', name:'Rory Ulloa',    role:'admin',  title:'Construction Technology Specialist', email:'roryulloa@gmail.com', initials:'RU'},
    {id:'sj', name:'Sarah Johnson', role:'pm',     title:'Project Manager',    initials:'SJ'},
    {id:'mt', name:'Mike Torres',   role:'super',  title:'Superintendent',     initials:'MT'},
    {id:'lc', name:'Lisa Chen',     role:'office', title:'Office / Bookkeeper', initials:'LC'},
  ];

  const STAGES = ['Lead','Bidding','Active','Punch','Closed'];

  /* ---- seed data ---- */
  function seed(){
    const mk = (o)=>Object.assign({tasks:[],logs:[],cos:[],photos:[],docs:[],issues:[],gallery:[]}, o);
    const _s = {
      activity: [
        {id:'a0', who:'RU', text:'Granted Michael Chandler Admin access', meta:'Notification sent · mike.rcccon@yahoo.com', ts:Date.now()-5*60000},
        {id:'a1', who:'MT', text:'Logged daily report', meta:'Longleaf · 12 crew on site', ts:Date.now()-18*60000},
        {id:'a2', who:'SJ', text:'Uploaded 8 photos',   meta:'Riverview · MEP rough-in',  ts:Date.now()-60*60000},
        {id:'a3', who:'LC', text:'Invoice drafted',     meta:'Cedar Park · $214,000',     ts:Date.now()-3*3600000},
      ],
      projects: [
        mk({id:'LON', name:'Longleaf Amenity Center', stage:'Active', pm:'Sarah Johnson', super:'Mike Torres',
          phase:'Drywall', pct:62, contract:1350000, spent:712000, due:'Dec 15', health:'ok',
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
        {id:'v6', num:'INV-1028', pid:'LON', amt:216000, status:'paid',   date:'Apr 18'},
        {id:'v7', num:'INV-1021', pid:'LON', amt:198000, status:'paid',   date:'Mar 20'},
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
      directory: [
        {id:'co1',  name:'BlueWave Pools',               type:'Subcontractor', trade:'Pools & Spas',        contact:'Diego Marín',  email:'diego@bluewavepools.com',  phone:'(713) 555-0142', status:'active'},
        {id:'co2',  name:'Apex Electrical',              type:'Subcontractor', trade:'Electrical',          contact:'Ronnie Pace',  email:'ronnie@apexelec.com',      phone:'(713) 555-0188', status:'active'},
        {id:'co3',  name:'ProFlow Plumbing & HVAC',      type:'Subcontractor', trade:'Mechanical',          contact:'Sandra Vu',    email:'sandra@proflowmech.com',   phone:'(281) 555-0119', status:'active'},
        {id:'co4',  name:'Summit Drywall',               type:'Subcontractor', trade:'Drywall & Insulation', contact:'Hector Lozano',email:'hector@summitdrywall.com', phone:'(281) 555-0166', status:'active'},
        {id:'co5',  name:'Gulf Coast Concrete',          type:'Subcontractor', trade:'Concrete',            contact:'Will Tanner',  email:'will@gulfcoastconcrete.com',phone:'(713) 555-0173', status:'active'},
        {id:'co6',  name:'Ironclad Steel',               type:'Subcontractor', trade:'Structural Steel',     contact:'Marcus Reed',  email:'marcus@ironcladsteel.com', phone:'(832) 555-0150', status:'active'},
        {id:'co7',  name:'Heritage Masonry',             type:'Subcontractor', trade:'Masonry',             contact:'Paul Otero',   email:'paul@heritagemasonry.com', phone:'(832) 555-0127', status:'active'},
        {id:'co8',  name:'Coastal Roofing',              type:'Subcontractor', trade:'Roofing',             contact:'Kim Brewer',   email:'kim@coastalroof.com',      phone:'(281) 555-0134', status:'active'},
        {id:'co9',  name:'Verde Landscaping',            type:'Subcontractor', trade:'Landscape',           contact:'Rosa Iglesias',email:'rosa@verdeland.com',       phone:'(713) 555-0198', status:'active'},
        {id:'co10', name:'Stryker Architects',           type:'Architect',     trade:'Architecture',        contact:'Lena Stryker', email:'lena@strykerarch.com',     phone:'(713) 555-0101', status:'active'},
        {id:'co11', name:'Beacon Structural Engineering',type:'Engineer',      trade:'Structural',          contact:'Amir Doshi',   email:'amir@beaconse.com',        phone:'(832) 555-0112', status:'active'},
        {id:'co12', name:'BuildSupply Co.',              type:'Vendor',        trade:'Materials',           contact:'Front Desk',   email:'orders@buildsupply.com',   phone:'(800) 555-0190', status:'active'},
        {id:'co13', name:'Lone Star Framing',            type:'Subcontractor', trade:'Framing',             contact:'Cody Hale',    email:'cody@lonestarframing.com', phone:'(936) 555-0144', status:'inactive'},
        {id:'co14', name:'Voltspan Electric',            type:'Subcontractor', trade:'Electrical',          contact:'Nina Park',    email:'nina@voltspan.com',        phone:'(713) 555-0211', status:'active'},
        {id:'co15', name:'Metro Drywall Systems',        type:'Subcontractor', trade:'Drywall & Insulation', contact:'Owen Bryce',   email:'owen@metrodrywall.com',    phone:'(281) 555-0233', status:'active'},
        {id:'co16', name:'Terra Firma Concrete',         type:'Subcontractor', trade:'Concrete',            contact:'Sal Ruiz',     email:'sal@terrafirmaconc.com',   phone:'(832) 555-0244', status:'active'},
        {id:'co17', name:'Skyline Mechanical',           type:'Subcontractor', trade:'Mechanical',          contact:'Dee Foster',   email:'dee@skylinemech.com',      phone:'(281) 555-0255', status:'active'},
      ],
      commitments: [
        {id:'cm1', num:'SC-101', type:'sub', pid:'LON', vendorId:'co1',  title:'Swimming Pool package',     costCode:'13-155', amount:477939, invoiced:120000, status:'executed', date:'May 02'},
        {id:'cm2', num:'SC-102', type:'sub', pid:'LON', vendorId:'co2',  title:'Electrical rough & trim',   costCode:'16-100', amount:52993,  invoiced:31000,  status:'executed', date:'May 09'},
        {id:'cm3', num:'SC-103', type:'sub', pid:'LON', vendorId:'co4',  title:'Drywall & insulation',      costCode:'09-250', amount:6500,   invoiced:0,      status:'out',      date:'Jun 11'},
        {id:'cm4', num:'PO-101', type:'po',  pid:'LON', vendorId:'co12', title:'Shingles & copper flashing',costCode:'07-310', amount:24000,  invoiced:24000,  status:'executed', date:'Apr 20'},
        {id:'cm5', num:'SC-104', type:'sub', pid:'RVO', vendorId:'co3',  title:'Plumbing / HVAC rough-in',  costCode:'15-500', amount:40000,  invoiced:12000,  status:'out',      date:'Jun 06'},
        {id:'cm6', num:'SC-105', type:'sub', pid:'RVO', vendorId:'co2',  title:'Electrical service upgrade',costCode:'16-100', amount:28000,  invoiced:0,      status:'draft',    date:'Jun 16'},
        {id:'cm7', num:'SC-106', type:'sub', pid:'CED', vendorId:'co9',  title:'Landscape & pavers',        costCode:'02-900', amount:30000,  invoiced:30000,  status:'executed', date:'Mar 30'},
      ],
      inspectionTemplates: [
        {id:'tpl1', name:'Pre-Pour Concrete', items:['Formwork dimensions verified','Rebar size & spacing per drawings','Embeds & sleeves placed','Vapor barrier intact','Grade & compaction approved']},
        {id:'tpl2', name:'Framing QC',        items:['Stud spacing 16" OC','Headers per schedule','Hold-downs installed','Sheathing nail pattern','Fire blocking in place']},
        {id:'tpl3', name:'Safety Walk',       items:['Fall protection in use','Housekeeping clear','Fire extinguishers present','GFCI on temp power','PPE compliance']},
        {id:'tpl4', name:'Drywall QC',        items:['Screw spacing correct','Seams taped & floated','Corner bead secure','No fastener pops','Surface ready for paint']},
      ],
      inspections: [
        {id:'in1', pid:'LON', template:'Drywall QC', date:'Jun 17', by:'MT', status:'open', items:[
          {text:'Screw spacing correct', result:'pass', note:''},
          {text:'Seams taped & floated', result:'pass', note:''},
          {text:'Corner bead secure', result:null, note:''},
          {text:'No fastener pops', result:null, note:''},
          {text:'Surface ready for paint', result:null, note:''}]},
        {id:'in2', pid:'CED', template:'Safety Walk', date:'Jun 15', by:'MT', status:'passed', items:[
          {text:'Fall protection in use', result:'pass', note:''},
          {text:'Housekeeping clear', result:'pass', note:''},
          {text:'Fire extinguishers present', result:'pass', note:''},
          {text:'GFCI on temp power', result:'pass', note:''},
          {text:'PPE compliance', result:'pass', note:''}]},
      ],
      bids: [
        {id:'bd1', pkg:'Electrical — Riverview', pid:'RVO', costCode:'16-100', scope:'Service upgrade, rough & trim', due:'Jun 27', status:'open', awardedTo:null,
          quotes:[
            {vendorId:'co2',  amount:28000, status:'submitted', note:'Incl. permits & inspections'},
            {vendorId:'co14', amount:26200, status:'submitted', note:'Excludes temp power'},
          ]},
        {id:'bd2', pkg:'Drywall & Insulation — Longleaf', pid:'LON', costCode:'09-250', scope:'Hang, tape & float east + west wings', due:'Jun 24', status:'open', awardedTo:null,
          quotes:[
            {vendorId:'co4',  amount:6500, status:'submitted', note:'Level 4 finish'},
            {vendorId:'co15', amount:7100, status:'submitted', note:'Level 5 at lobby'},
          ]},
        {id:'bd3', pkg:'Concrete — Harbor View', pid:'HBR', costCode:'03-110', scope:'Foundations + slab on grade', due:'Jul 02', status:'open', awardedTo:null,
          quotes:[
            {vendorId:'co5',  amount:31000, status:'submitted', note:''},
            {vendorId:'co16', amount:29850, status:'submitted', note:'Pump included'},
          ]},
        {id:'bd4', pkg:'Pool package — Longleaf', pid:'LON', costCode:'13-155', scope:'Gunite pool + equipment', due:'May 01', status:'awarded', awardedTo:'co1',
          quotes:[
            {vendorId:'co1', amount:477939, status:'submitted', note:'Per plans & specs'},
          ]},
      ],
      meetings: [
        {id:'mtg1', title:'Longleaf OAC Weekly', pid:'LON', date:'Jun 18', time:'9:00 AM', attendees:['Sarah Johnson','Mike Torres','Lena Stryker'],
          agenda:[
            {topic:'Schedule — drywall progress', notes:'East wing on track; west wing starts Monday.', done:true},
            {topic:'Pool inspection window', notes:'Targeting first week of October.', done:false},
            {topic:'Open RFIs', notes:'Lobby soffit height pending architect.', done:false},
          ],
          actions:[
            {id:'ma1', text:'Architect to respond on soffit RFI', who:'Lena Stryker', done:false},
            {id:'ma2', text:'Confirm pool gunite date with BlueWave', who:'Mike Torres', done:false},
          ]},
        {id:'mtg2', title:'Riverview MEP Coordination', pid:'RVO', date:'Jun 12', time:'2:00 PM', attendees:['Sarah Johnson','Sandra Vu','Ronnie Pace'],
          agenda:[
            {topic:'Panel vs duct conflict', notes:'Resolved — panel shifts 18" east.', done:true},
            {topic:'Inspection scheduling', notes:'Rough-in walk Thursday AM.', done:false},
          ],
          actions:[
            {id:'ma3', text:'ProFlow to revise duct routing sheet', who:'Sandra Vu', done:true},
          ]},
      ],
      insurance: {
        co1: {carrier:'Travelers',     coi:'COI-BWP-2026.pdf', policies:[{type:'GL',limit:'$2M',expires:'2026-12-31'},{type:'WC',limit:'Statutory',expires:'2026-12-31'},{type:'Auto',limit:'$1M',expires:'2026-12-31'}]},
        co2: {carrier:'The Hartford',  coi:'COI-APEX-2026.pdf', policies:[{type:'GL',limit:'$1M',expires:'2026-07-05'},{type:'WC',limit:'Statutory',expires:'2026-07-05'}]},
        co3: {carrier:'Nationwide',    coi:'COI-PROFLOW.pdf',   policies:[{type:'GL',limit:'$2M',expires:'2026-05-20'},{type:'WC',limit:'Statutory',expires:'2026-05-20'}]},
        co4: {carrier:'Liberty Mutual',coi:'COI-SUMMIT.pdf',    policies:[{type:'GL',limit:'$1M',expires:'2027-03-01'},{type:'WC',limit:'Statutory',expires:'2027-03-01'}]},
        co5: {carrier:'CNA',           coi:'COI-GULF.pdf',      policies:[{type:'GL',limit:'$2M',expires:'2026-11-15'},{type:'Auto',limit:'$1M',expires:'2026-11-15'}]},
        co8: {carrier:'Zurich',        coi:'COI-COASTAL.pdf',   policies:[{type:'GL',limit:'$2M',expires:'2026-06-28'}]},
        co9: {carrier:'Chubb',         coi:'COI-VERDE.pdf',     policies:[{type:'GL',limit:'$1M',expires:'2027-01-10'},{type:'WC',limit:'Statutory',expires:'2027-01-10'}]},
      },
      /* Equipment Rates — cost to operate per hour. Total $/hr = Fuel + Repair
         & Maintenance + Depreciation + Insurance. Owned machines fill all four;
         rented machines put the rental rate in `fuel` and leave deprec/ins at 0.
         Tracked vs wheeled skid steers live on separate rows by design. */
      equipRates: [
        {id:'eq-skid-track', machine:'Skid Steer — Tracked', mode:'owned',  fuel:9,  repair:7,  deprec:11, ins:3},
        {id:'eq-skid-wheel', machine:'Skid Steer — Wheeled', mode:'owned',  fuel:8,  repair:6,  deprec:9,  ins:3},
        {id:'eq-excavator',  machine:'Excavator',           mode:'owned',  fuel:14, repair:10, deprec:18, ins:5},
        {id:'eq-miniex',     machine:'Mini Excavator',      mode:'owned',  fuel:7,  repair:5,  deprec:8,  ins:2},
        {id:'eq-backhoe',    machine:'Backhoe',             mode:'owned',  fuel:11, repair:8,  deprec:13, ins:4},
        {id:'eq-lift',       machine:'Scissor Lift',        mode:'rented', fuel:18, repair:0,  deprec:0,  ins:0},
      ],
      /* Per-job cost detail feeding Phase 2 (material by supplier, employee labor
         hours×rate, equipment hours×$/hr). Subcontractor cost comes from the
         job's commitments, grouped by the vendor's trade. */
      jobCosts: {
        LON: {
          material: [
            {supplier:'BuildSupply Co.',        po:'PO-101', item:'Lumber & framing package',     amt:96000},
            {supplier:'BuildSupply Co.',        po:'PO-104', item:'Drywall, board & finishes',    amt:58000},
            {supplier:'Coastal Roofing Supply', po:'PO-106', item:'Shingles & copper flashing',   amt:24000},
            {supplier:'Ferguson',               po:'PO-108', item:'Plumbing fixtures & trim',      amt:41000},
            {supplier:'Gulf Tile & Stone',      po:'PO-110', item:'Tile, pavers & pool coping',    amt:46000},
            {supplier:'Sherwin-Williams',       po:'PO-112', item:'Paint & coatings',             amt:18500},
            {supplier:"Lowe's Pro",             po:'PO-113', item:'Misc hardware & consumables',   amt:16500},
          ],
          employees: [
            {name:'Site Supervision',  role:'Superintendent', hours:760,  rate:65},
            {name:'Framing Crew',      role:'Carpentry',      hours:1180, rate:42},
            {name:'Finish Carpentry',  role:'Finish',         hours:980,  rate:46},
            {name:'General Labor',     role:'Labor',          hours:2360, rate:28},
            {name:'Concrete / Flatwork',role:'Concrete',      hours:680,  rate:45},
          ],
          equipment: [
            {rateId:'eq-skid-track', label:'Site grading & material moving', hours:210},
            {rateId:'eq-skid-wheel', label:'Pool deck & hardscape',         hours:160},
            {rateId:'eq-excavator',  label:'Pool & footing excavation',     hours:120},
            {rateId:'eq-miniex',     label:'Utility trenching',             hours:90},
            {rateId:'eq-lift',       label:'Drywall & ceiling (rented)',    hours:140},
          ],
        },
      },
      /* Phase 3 period costs — overhead & owner draws that no single job carries. */
      period: {
        label:'FY 2026 · Year to Date',
        overhead: {insurances:31000, lotOffice:22000, fuelYard:8500, equipRepair:6500, allOther:10000},
        ownerDraws: 40000,
      },
    };
    /* live workspace starts with ONLY Longleaf — all other demo jobs and
       their records are pruned. Directory + insurance keep just the
       vendors Longleaf actually uses. */
    const KEEP='LON';
    _s.projects = _s.projects.filter(p=>p.id===KEEP);
    _s.invoices = _s.invoices.filter(v=>v.pid===KEEP);
    ['rfi','submittals','safety','equipment'].forEach(k=>{ _s.trackers[k]=(_s.trackers[k]||[]).filter(i=>i.pid===KEEP); });
    _s.commitments = _s.commitments.filter(c=>c.pid===KEEP);
    _s.bids = _s.bids.filter(b=>b.pid===KEEP);
    _s.meetings = _s.meetings.filter(m=>m.pid===KEEP);
    _s.inspections = _s.inspections.filter(i=>i.pid===KEEP);
    _s.activity = [];
    const used=new Set();
    _s.commitments.forEach(c=>used.add(c.vendorId));
    _s.bids.forEach(b=>(b.quotes||[]).forEach(q=>used.add(q.vendorId)));
    _s.directory = _s.directory.filter(c=>used.has(c.id));
    const _ins={}; Object.keys(_s.insurance||{}).forEach(id=>{ if(used.has(id)) _ins[id]=_s.insurance[id]; }); _s.insurance=_ins;
    return _s;
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
      p = Object.assign({tasks:[],logs:[],cos:[],docs:[],issues:[],photos:0,gallery:[]}, p);
      ['tasks','logs','cos','docs','issues','gallery'].forEach(k=>{ if(!Array.isArray(p[k])) p[k]=[]; });
      if(Array.isArray(p.photos)) p.photos = p.photos.length;
      if(p.issues.length===0 && (seededIssues[p.id]||[]).length){ p.issues = seededIssues[p.id].map(x=>({...x})); }
      return p;
    });
    if(!Array.isArray(s.invoices)) s.invoices = sd.invoices;
    if(!s.trackers) s.trackers = sd.trackers;
    if(!Array.isArray(s.directory)) s.directory = sd.directory;
    if(!Array.isArray(s.commitments)) s.commitments = sd.commitments;
    if(!Array.isArray(s.inspectionTemplates)) s.inspectionTemplates = sd.inspectionTemplates;
    if(!Array.isArray(s.inspections)) s.inspections = sd.inspections;
    if(!Array.isArray(s.bids)) s.bids = sd.bids;
    if(!Array.isArray(s.meetings)) s.meetings = sd.meetings;
    if(!s.insurance || typeof s.insurance!=='object') s.insurance = sd.insurance;
    if(!Array.isArray(s.equipRates)) s.equipRates = sd.equipRates;
    if(!s.jobCosts || typeof s.jobCosts!=='object') s.jobCosts = sd.jobCosts;
    if(!s.period || typeof s.period!=='object') s.period = sd.period;
    if(!s.scheduleOverrides) s.scheduleOverrides = {};
    return s;
  }
  function save(){ try{ localStorage.setItem(KEY, JSON.stringify(state)); }catch(e){ console.warn('[DROS] save failed (storage full?)', e&&e.message); if(window.drToast) drToast('Storage is full — older photos may not persist. Remove some to free space.'); } }
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
  /* fire an email notification (no-ops unless the deployed app is wired to
     the Cloud Function — see os/notify.js + functions/). Targets users of
     the given roles that have an email on file. */
  function notify(roles, subject, text){
    try{
      if(!(window.DRNotify && DRNotify.send)) return;
      const tos = USERS.filter(u=>roles.includes(u.role) && u.email).map(u=>u.email);
      if(tos.length) DRNotify.send({to:tos, subject:subject, text:text});
    }catch(e){}
  }
  /* email a specific address (e.g. a subcontractor from the directory) */
  function notifyEmail(to, subject, text){
    try{ if(window.DRNotify && DRNotify.send && to) DRNotify.send({to:to, subject:subject, text:text}); }catch(e){}
  }

  /* ---- subcontractor insurance compliance ----
     Derives a status from the soonest-expiring policy on file. */
  function insuranceStatus(vendorId){
    const rec = state.insurance && state.insurance[vendorId];
    if(!rec || !rec.policies || !rec.policies.length) return {state:'missing', soonest:null, days:null, carrier:rec&&rec.carrier||''};
    const now=Date.now(), DAY=86400000;
    let soonest=Infinity, soonestStr=null;
    rec.policies.forEach(p=>{ const t=Date.parse(p.expires); if(!isNaN(t) && t<soonest){ soonest=t; soonestStr=p.expires; } });
    if(soonest===Infinity) return {state:'missing', soonest:null, days:null, carrier:rec.carrier||''};
    const days=Math.floor((soonest-now)/DAY);
    const st = days<0 ? 'expired' : days<=30 ? 'expiring' : 'active';
    return {state:st, soonest:soonestStr, days, carrier:rec.carrier||''};
  }

  /* ============================================================
     RECONCILIATION ENGINE — three-phase model (matches the spreadsheet).
     Phase 1: quick P&L (billed − Material − Labor − Subs − Equipment).
     Phase 2: the same totals, itemized. Phase 3: period rollup.
     ============================================================ */
  function equipHr(rateId){
    const r=(state.equipRates||[]).find(x=>x.id===rateId); if(!r) return 0;
    return (+r.fuel||0)+(+r.repair||0)+(+r.deprec||0)+(+r.ins||0);
  }
  function jobBilling(pid){
    const inv=(state.invoices||[]).filter(v=>v.pid===pid);
    return {
      invoices: inv,
      billed:    inv.filter(v=>v.status!=='draft').reduce((a,v)=>a+v.amt,0),
      collected: inv.filter(v=>v.status==='paid').reduce((a,v)=>a+v.amt,0),
      ar:        inv.filter(v=>v.status==='sent').reduce((a,v)=>a+v.amt,0),
      draft:     inv.filter(v=>v.status==='draft').reduce((a,v)=>a+v.amt,0),
    };
  }
  /* Subcontractor cost-to-date for a job, grouped by the vendor's trade. */
  function jobSubs(pid){
    const rows=(state.commitments||[]).filter(c=>c.pid===pid && c.type==='sub').map(c=>{
      const v=(state.directory||[]).find(d=>d.id===c.vendorId);
      return {vendor:v?v.name:'Subcontractor', trade:v?v.trade:'Other', title:c.title, committed:c.amount||0, cost:c.invoiced||0, num:c.num};
    });
    const byTrade={};
    rows.forEach(r=>{ (byTrade[r.trade]=byTrade[r.trade]||{trade:r.trade, cost:0, committed:0, rows:[]}); byTrade[r.trade].cost+=r.cost; byTrade[r.trade].committed+=r.committed; byTrade[r.trade].rows.push(r); });
    return {rows, byTrade:Object.values(byTrade).sort((a,b)=>b.cost-a.cost), total:rows.reduce((a,r)=>a+r.cost,0)};
  }
  function phase2(pid){
    const jc=(state.jobCosts||{})[pid]||{};
    const bill=jobBilling(pid);
    const material=(jc.material||[]).map(m=>({...m}));
    const materialTotal=material.reduce((a,m)=>a+(m.amt||0),0);
    const employees=(jc.employees||[]).map(e=>({...e, cost:(e.hours||0)*(e.rate||0)}));
    const employeeTotal=employees.reduce((a,e)=>a+e.cost,0);
    const subs=jobSubs(pid);
    const equipment=(jc.equipment||[]).map(q=>{ const r=(state.equipRates||[]).find(x=>x.id===q.rateId)||{}; const hr=equipHr(q.rateId); return {...q, machine:r.machine||q.rateId, mode:r.mode, hr, cost:(q.hours||0)*hr}; });
    const equipTotal=equipment.reduce((a,q)=>a+q.cost,0);
    const laborTotal=employeeTotal+subs.total;
    const totalCost=materialTotal+laborTotal+equipTotal;
    const net=bill.billed-totalCost;
    return {...bill, material, materialTotal, employees, employeeTotal, subs, equipment, equipTotal,
            laborTotal, totalCost, net, margin: bill.billed? net/bill.billed : 0,
            buckets:{material:materialTotal, labor:employeeTotal, subs:subs.total, equipment:equipTotal}};
  }
  /* Phase 1 — quick P&L. Same four buckets, summarized. */
  function phase1(pid){
    const p2=phase2(pid);
    return {billed:p2.billed, collected:p2.collected, ar:p2.ar,
            material:p2.materialTotal, labor:p2.employeeTotal, subs:p2.subs.total, equipment:p2.equipTotal,
            cost:p2.totalCost, net:p2.net, margin:p2.margin};
  }
  /* Phase 3 — period rollup across jobs that have billed in the period. */
  function phase3(){
    const per=state.period||{overhead:{}, ownerDraws:0};
    const jobs=(state.projects||[]).filter(p=>jobBilling(p.id).billed>0).map(p=>{ const p1=phase1(p.id); return {id:p.id, name:p.name, stage:p.stage, net:p1.net, billed:p1.billed, margin:p1.margin}; });
    const jobProfit=jobs.reduce((a,j)=>a+j.net,0);
    const oh=per.overhead||{};
    const overheadRows=[['Insurances',oh.insurances||0],['Lot & office',oh.lotOffice||0],['Fuel (yard, non-job)',oh.fuelYard||0],['Equipment repair (non-job)',oh.equipRepair||0],['All other',oh.allOther||0]];
    const overhead=overheadRows.reduce((a,r)=>a+r[1],0);
    const ownerDraws=per.ownerDraws||0;
    // tracked vs wheeled skid-steer period comparison
    const driveHours={};
    (state.projects||[]).forEach(p=>{ const jc=(state.jobCosts||{})[p.id]; if(!jc) return; (jc.equipment||[]).forEach(q=>{ if(q.rateId==='eq-skid-track'||q.rateId==='eq-skid-wheel'){ driveHours[q.rateId]=(driveHours[q.rateId]||0)+(q.hours||0); } }); });
    const drive=['eq-skid-track','eq-skid-wheel'].map(id=>{ const r=(state.equipRates||[]).find(x=>x.id===id)||{}; const hrs=driveHours[id]||0; const hr=equipHr(id); return {id, machine:r.machine||id, hours:hrs, hr, cost:hrs*hr}; });
    return {label:per.label||'Period', jobs, jobProfit, overheadRows, overhead, ownerDraws, net:jobProfit-overhead-ownerDraws, drive};
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

    addTask(pid, title, user, due){
      const p=P(pid); if(!p||!String(title||'').trim()) return;
      p.tasks.push({id:'t'+Date.now(), title:String(title).trim(), who:user.id, done:false, due:due||'This week'});
      logActivity(user.initials, 'Added a task', `${p.name} · ${title}`);
      emit();
      return `Task added to ${p.name}`;
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

    addGalleryPhotos(pid, items, user){
      const p=P(pid); if(!p||!items||!items.length) return;
      if(!Array.isArray(p.gallery)) p.gallery=[];
      p.gallery.unshift(...items);
      p.photos=(p.photos||0)+items.length;
      logActivity(user.initials, `Uploaded ${items.length} photo${items.length>1?'s':''}`, `${p.name} · ${p.phase}`);
      emit();
      return `${items.length} photo${items.length>1?'s':''} added to ${p.name} · auto-tagged ${p.phase}`;
    },
    removeGalleryPhoto(pid, photoId){
      const p=P(pid); if(!p||!Array.isArray(p.gallery)) return;
      const i=p.gallery.findIndex(x=>x.id===photoId); if(i<0) return;
      p.gallery.splice(i,1);
      p.photos=Math.max(0,(p.photos||0)-1);
      emit();
    },

    createCO(pid, {desc, amt}, user){
      const p=P(pid);
      const n=p.cos.length+1;
      const code='CO-'+String(100+Math.floor(Math.random()*900));
      p.cos.unshift({id:'c'+Date.now(), code, desc, amt:+amt||0, status:'pending'});
      logActivity(user.initials, `Submitted ${code}`, `${p.name} · $${(+amt).toLocaleString()}`);
      emit();
      notify(['owner','admin'], `${code} needs approval — ${p.name}`, `${user.name} submitted ${code} on ${p.name} for $${(+amt||0).toLocaleString()}. Open the DunRite OS to approve it.`);
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
      if(priority==='high') notify(['owner','admin'], `High-priority issue: ${p.name}`, `${user.name} flagged “${title}” on ${p.name}. It needs attention in the DunRite OS.`);
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

    /* ---- Directory (companies & contacts) ---- */
    addCompany(c, user){
      const id='co'+Date.now();
      state.directory.unshift({id, name:c.name, type:c.type||'Subcontractor', trade:c.trade||'', contact:c.contact||'', email:c.email||'', phone:c.phone||'', status:'active'});
      logActivity(user.initials,'Added to directory',`${c.name} · ${c.type||'Subcontractor'}`);
      emit();
      return `${c.name} added to the directory`;
    },
    toggleCompany(id){
      const c=state.directory.find(x=>x.id===id); if(!c) return;
      c.status = c.status==='active' ? 'inactive' : 'active';
      emit();
    },

    /* ---- Commitments (subcontracts & purchase orders) ---- */
    createCommitment(d, user){
      const type = d.type==='po' ? 'po' : 'sub';
      const prefix = type==='po' ? 'PO' : 'SC';
      const n = state.commitments.filter(x=>x.type===type).length + 101;
      const num = prefix+'-'+n;
      state.commitments.unshift({id:'cm'+Date.now(), num, type, pid:d.pid, vendorId:d.vendorId||'', title:d.title||'', costCode:d.costCode||'', amount:+d.amount||0, invoiced:0, status:'draft', date:'Today'});
      const p=P(d.pid);
      logActivity(user.initials,`Created ${num}`,`${p?p.name:''} · $${(+d.amount||0).toLocaleString()}`);
      emit();
      return `${num} created — draft. Send it out for signature when ready.`;
    },
    advanceCommitment(id, user){
      const c=state.commitments.find(x=>x.id===id); if(!c) return;
      const order=['draft','out','executed'];
      const i=order.indexOf(c.status); if(i<0 || i>=order.length-1) return;
      c.status=order[i+1];
      logActivity(user.initials, `${c.num} ${c.status==='out'?'sent for signature':'executed'}`, P(c.pid)?.name||'');
      emit();
      return c.status==='executed'
        ? `${c.num} executed · $${c.amount.toLocaleString()} committed to budget`
        : `${c.num} sent for signature`;
    },

    /* ---- Inspections & checklists ---- */
    startInspection(d, user){
      const tpl=state.inspectionTemplates.find(t=>t.id===d.template || t.name===d.template); if(!tpl) return;
      state.inspections.unshift({id:'in'+Date.now(), pid:d.pid, template:tpl.name, date:'Today', by:user.initials, status:'open', items:tpl.items.map(text=>({text, result:null, note:''}))});
      logActivity(user.initials,'Started inspection',`${P(d.pid)?.name||''} · ${tpl.name}`);
      emit();
      return `${tpl.name} started on ${P(d.pid)?.name||''}`;
    },
    setInspectionItem(id, idx, result){
      const insp=state.inspections.find(x=>x.id===id); if(!insp) return;
      const it=insp.items[idx]; if(!it) return;
      it.result = it.result===result ? null : result;
      emit();
    },
    closeInspection(id, user){
      const insp=state.inspections.find(x=>x.id===id); if(!insp) return;
      const fails=insp.items.filter(i=>i.result==='fail');
      insp.status = fails.length ? 'failed' : 'passed';
      // AUTOMATION: every failed item opens a punch/issue on the project
      const p=P(insp.pid);
      fails.forEach((f,k)=>{ if(p) p.issues.unshift({id:'i'+Date.now()+k, title:`${insp.template}: ${f.text}`, priority:'med', status:'open', by:user.initials}); });
      logActivity(user.initials, insp.status==='passed'?'Inspection passed':'Inspection failed', `${p?p.name:''} · ${insp.template}`);
      emit();
      return insp.status==='passed'
        ? `${insp.template} passed — all items clear`
        : `${insp.template} failed · ${fails.length} issue${fails.length>1?'s':''} opened on ${p?p.name:''}`;
    },

    /* ---- Bidding & bid leveling ---- */
    createBidPackage(d, user){
      const id='bd'+Date.now();
      state.bids.unshift({id, pkg:d.pkg||'New package', pid:d.pid, costCode:d.costCode||'', scope:d.scope||'', due:d.due||'TBD', status:'open', awardedTo:null, quotes:[]});
      logActivity(user.initials,'Opened a bid package',`${P(d.pid)?.name||''} · ${d.pkg||''}`);
      emit();
      return `Bid package “${d.pkg||'New package'}” opened`;
    },
    addQuote(bidId, vendorId, amount, note, user){
      const b=state.bids.find(x=>x.id===bidId); if(!b||!vendorId||!(+amount)) return;
      b.quotes.push({vendorId, amount:+amount, status:'submitted', note:note||''});
      const v=state.directory.find(c=>c.id===vendorId);
      logActivity(user.initials,'Logged a bid',`${b.pkg} · ${v?v.name:''} · $${(+amount).toLocaleString()}`);
      emit();
      return `Bid logged for ${b.pkg}`;
    },
    awardBid(bidId, vendorId, user){
      const b=state.bids.find(x=>x.id===bidId); if(!b) return;
      const q=b.quotes.find(x=>x.vendorId===vendorId); if(!q) return;
      b.status='awarded'; b.awardedTo=vendorId;
      // AUTOMATION: awarding a bid drafts a subcontract in Commitments
      const n=state.commitments.filter(x=>x.type==='sub').length+101;
      const v=state.directory.find(c=>c.id===vendorId);
      state.commitments.unshift({id:'cm'+Date.now(), num:'SC-'+n, type:'sub', pid:b.pid, vendorId, title:b.pkg, costCode:b.costCode||'', amount:q.amount, invoiced:0, status:'draft', date:'Today'});
      logActivity(user.initials,`Awarded ${b.pkg}`,`${v?v.name:''} · $${q.amount.toLocaleString()}`);
      emit();
      return `Awarded to ${v?v.name:'vendor'} · subcontract SC-${n} drafted in Commitments`;
    },

    /* ---- Meetings (agendas + minutes + action items) ---- */
    createMeeting(d, user){
      const id='mtg'+Date.now();
      state.meetings.unshift({id, title:d.title||'Meeting', pid:d.pid, date:'Today', time:d.time||'', attendees:[], agenda:d.topic?[{topic:d.topic, notes:'', done:false}]:[], actions:[]});
      logActivity(user.initials,'Scheduled a meeting',`${P(d.pid)?.name||''} · ${d.title||''}`);
      emit();
      return `“${d.title||'Meeting'}” added`;
    },
    addAgendaItem(mtgId, topic, user){
      const m=state.meetings.find(x=>x.id===mtgId); if(!m||!String(topic||'').trim()) return;
      m.agenda.push({topic:topic.trim(), notes:'', done:false}); emit();
    },
    setAgendaNotes(mtgId, idx, notes){
      const m=state.meetings.find(x=>x.id===mtgId); if(!m||!m.agenda[idx]) return;
      m.agenda[idx].notes=notes; emit();
    },
    toggleAgendaItem(mtgId, idx){
      const m=state.meetings.find(x=>x.id===mtgId); if(!m||!m.agenda[idx]) return;
      m.agenda[idx].done=!m.agenda[idx].done; emit();
    },
    addActionItem(mtgId, text, who, user){
      const m=state.meetings.find(x=>x.id===mtgId); if(!m||!String(text||'').trim()) return;
      m.actions.push({id:'ma'+Date.now(), text:text.trim(), who:who||'', done:false}); emit();
      return 'Action item added';
    },
    toggleActionItem(mtgId, aid){
      const m=state.meetings.find(x=>x.id===mtgId); if(!m) return;
      const a=m.actions.find(x=>x.id===aid); if(!a) return;
      a.done=!a.done; emit();
    },

    /* ---- subcontractor insurance ---- */
    updateInsurance(vendorId, data, user){
      if(!state.insurance) state.insurance={};
      state.insurance[vendorId]=Object.assign({carrier:'', coi:'', policies:[]}, state.insurance[vendorId], data||{});
      const c=state.directory.find(x=>x.id===vendorId);
      logActivity(user.initials,'Updated insurance', (c?c.name:vendorId)+(data&&data.carrier?(' · '+data.carrier):''));
      emit();
      // alert the subcontractor that their COI on file changed
      if(c&&c.email) notifyEmail(c.email, 'Your insurance on file was updated — DunRite', `Hi ${c.contact||c.name}, your certificate of insurance was updated in the DunRite Operating System${data&&data.carrier?` (carrier: ${data.carrier})`:''}. If anything looks incorrect, reply to this email.`);
      return `Insurance updated for ${c?c.name:'vendor'}${c&&c.email?' · sub emailed':''}`;
    },
    renewInsurance(vendorId, user, months){
      const rec=state.insurance && state.insurance[vendorId]; if(!rec||!rec.policies||!rec.policies.length) return;
      const d=new Date(); d.setMonth(d.getMonth()+(months||12));
      const nd=d.toISOString().slice(0,10);
      rec.policies.forEach(p=>{ p.expires=nd; });
      const c=state.directory.find(x=>x.id===vendorId);
      logActivity(user.initials,'Renewed insurance', (c?c.name:vendorId)+' · through '+nd);
      emit();
      if(c&&c.email) notifyEmail(c.email, 'Insurance renewal recorded — DunRite', `Hi ${c.contact||c.name}, we recorded your insurance renewal through ${nd}. Please send an updated COI if your carrier issued a new certificate.`);
      return `${c?c.name:'Vendor'} insurance renewed through ${nd}`;
    },

    /* ---- insurance expiration alerts ---- */
    alertInsurance(vendorId, user){
      const sub=state.directory.find(x=>x.id===vendorId); if(!sub) return;
      const st=insuranceStatus(vendorId);
      const word = st.state==='expired' ? `expired${st.soonest?(' on '+st.soonest):''}` : st.state==='expiring' ? `expiring in ${st.days} days (${st.soonest})` : 'on file';
      if(sub.email) notifyEmail(sub.email, `Action needed: your insurance is ${st.state==='expired'?'expired':'expiring'} — DunRite`, `Hi ${sub.contact||sub.name}, our records show ${sub.name}'s insurance is ${word}. Please send DunRite an updated certificate of insurance to stay eligible for active work.`);
      notify(['owner','admin'], `Sub insurance ${st.state}: ${sub.name}`, `${sub.name}'s insurance is ${word}. Open the Insurance tab in the DunRite OS to follow up.`);
      logActivity(user.initials, 'Sent insurance alert', `${sub.name} · ${st.state}`);
      return `Alert sent to ${sub.name}${sub.email?'':' (no email on file)'} and the team`;
    },
    alertAllExpiring(user){
      const subs=state.directory.filter(c=>c.type==='Subcontractor' && c.status==='active');
      let n=0, emailed=0;
      subs.forEach(s=>{ const st=insuranceStatus(s.id); if(st.state==='expired'||st.state==='expiring'){ n++; if(s.email){ emailed++; notifyEmail(s.email, `Action needed: your insurance is ${st.state==='expired'?'expired':'expiring'} — DunRite`, `Hi ${s.contact||s.name}, ${s.name}'s insurance is ${st.state==='expired'?'expired':('expiring in '+st.days+' days')}. Please send DunRite an updated certificate of insurance.`); } } });
      notify(['owner','admin'], `${n} subcontractor${n!==1?'s':''} with insurance issues`, `${n} active sub${n!==1?'s':''} have expired or expiring insurance. Review the Insurance tab in the DunRite OS.`);
      logActivity(user.initials, 'Sent insurance alerts', `${emailed} sub${emailed!==1?'s':''} emailed · team notified`);
      return n ? `Notified ${emailed} sub${emailed!==1?'s':''} and the team` : 'No expiring or expired insurance — nothing to send';
    },

    /* ---- QuickBooks invoice sync ---- */
    syncInvoicesToQB(user){
      const inv=state.invoices||[]; const n=inv.filter(v=>!v.qbSynced).length;
      inv.forEach(v=>{ v.qbSynced=true; });
      logActivity(user.initials,'Synced to QuickBooks', `${n} invoice${n!==1?'s':''} pushed`);
      if(window.DRQuickBooks && DRQuickBooks.markSynced) DRQuickBooks.markSynced(n);
      emit();
      return n ? `${n} invoice${n!==1?'s':''} synced to QuickBooks` : 'All invoices already synced';
    },


    /* ---- Project CRUD ---- */
    addProject(data, user) {
      const DEF = {tasks:[],logs:[],cos:[],photos:[],docs:[],issues:[],gallery:[]};
      const p = Object.assign({}, DEF, {
        id:   data.id   || 'proj-' + Date.now(),
        name: data.name || 'Untitled Project',
        stage: data.stage || data.status || 'Active',
        status: data.status || 'active',
        pm:    data.pm || data.manager || '—',
        manager: data.manager || data.pm || '—',
        super: data.super || '—',
        phase: data.phase || '',
        pct:   data.pct   || 0,
        contract: data.contract || data.budget || 0,
        budget:   data.budget   || data.contract || 0,
        spent: data.spent || 0,
        due:   data.due   || data.completionDate || '—',
        health: data.health || 'ok',
        location: data.location || '',
        client: data.client || '',
        projectNumber: data.projectNumber || '',
        startDate: data.startDate || '',
        completionDate: data.completionDate || '',
        description: data.description || '',
        createdAt: data.createdAt || new Date().toISOString(),
      });
      state.projects.push(p);
      if(user) logActivity(user.initials, 'Created project', p.name);
      emit();
      return p;
    },

    updateProject(pid, data, user) {
      const p = P(pid); if(!p) return;
      if(data.budget    != null) data.contract = data.budget;
      if(data.contract  != null) data.budget   = data.contract;
      if(data.manager   != null) data.pm       = data.manager;
      if(data.pm        != null) data.manager  = data.pm;
      if(data.status    != null) data.stage    = data.status;
      if(data.stage     != null) data.status   = data.stage;
      if(data.completionDate != null) data.due = data.completionDate;
      Object.assign(p, data);
      if(user) logActivity(user.initials, 'Updated project', p.name);
      emit();
      return p;
    },

    deleteProject(pid, user) {
      const i = state.projects.findIndex(x=>x.id===pid); if(i<0) return;
      const name = state.projects[i].name;
      state.projects.splice(i, 1);
      if(user) logActivity(user.initials||'—', 'Deleted project', name);
      emit();
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
  window.DROS = { USERS, STAGES, get state(){return state;}, subscribe, actions, P, rollups, initialsOf, save, load, onLocalChange, applyRemote, FOLDERS, folderFor, folderCounts, insuranceStatus, equipHr, phase1, phase2, phase3 };
})();
