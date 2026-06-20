/* Shared design tokens + primitives for the 3 dashboard concepts.
   Mirrors the DunRite Project Controls visual vocabulary. */

const DRtok = {
  cyan:'#1DB4E8', blue:'#1583C7', blue700:'#0F6BA8',
  navy:'#142130', navyDeep:'#0E1A28',
  ink:'#16212E', ink2:'#3C4A5A', muted:'#6A7889', faint:'#9AA7B4',
  line:'#E4E9EE', lineSoft:'#EEF2F6', paper:'#F4F7FA', card:'#FFFFFF', cardTint:'#F7FAFC',
  ok:'#1E9E6A', okBg:'#E4F5EC', warn:'#E08A1E', warnBg:'#FBEFDD', bad:'#D0494A', badBg:'#FBE7E7',
  idle:'#6A7889', idleBg:'#EDF1F5', gold:'#D09527',
  fDisp:"'Archivo Expanded','Archivo',sans-serif",
  fHead:"'Archivo',sans-serif",
  fBody:"'Public Sans',system-ui,sans-serif",
  fMono:"'DM Mono',monospace",
};

/* tiny line icon */
const DIcon = ({d, s=18, sw=1.8, style}) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw}
       strokeLinecap="round" strokeLinejoin="round"
       style={{width:s, height:s, flex:'none', ...style}}>
    {(Array.isArray(d)?d:[d]).map((p,i)=><path key={i} d={p}/>)}
  </svg>
);

/* Dropbox brand mark (filled) — shared so views + shell can both use it */
const DropboxLogo = ({s=20, color='#0061FF', style}) => (
  <svg viewBox="0 0 24 24" fill={color} aria-hidden="true" style={{width:s, height:s, flex:'none', ...style}}>
    <path d="M6 1.8L0 5.6l6 3.8 6-3.8L6 1.8zM18 1.8l-6 3.8 6 3.8 6-3.8-6-3.8zM0 13.3l6 3.8 6-3.8L6 9.5l-6 3.8zM18 9.5l-6 3.8 6 3.8 6-3.8-6-3.8zM6 16.4l6 3.8 6-3.8-6-3.8-6 3.8z"/>
  </svg>
);
const IC = {
  grid:['M4 13h7V4H4z','M13 20h7v-9h-7z','M13 4v5h7V4z','M4 20h7v-5H4z'],
  building:['M3 21h18','M5 21V5a1 1 0 011-1h7a1 1 0 011 1v16','M14 9h4a1 1 0 011 1v11'],
  dollar:['M12 2v20','M17 6.5C17 4.6 14.8 3.5 12 3.5S7 4.6 7 6.5 9.2 9.5 12 9.5s5 1.1 5 3-2.2 3-5 3-5-1.1-5-3'],
  calendar:['M7 3v3M17 3v3','M4 8h16','M4 6.5h16V20a1 1 0 01-1 1H5a1 1 0 01-1-1z'],
  alert:['M12 9v4','M12 17h.01','M10.3 4l-7.5 13A1.5 1.5 0 004 19.3h16a1.5 1.5 0 001.3-2.3l-7.5-13a1.5 1.5 0 00-2.6 0z'],
  check:['M20 6L9 17l-5-5'],
  clock:['M12 7.5V12l3 2'],
  camera:['M4 8h3l2-2.5h6L17 8h3a1 1 0 011 1v9a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1z'],
  doc:['M14 3H7a1 1 0 00-1 1v16a1 1 0 001 1h10a1 1 0 001-1V8z','M14 3v5h4'],
  user:['M12 12a4 4 0 100-8 4 4 0 000 8z','M5 21a7 7 0 0114 0'],
  arrow:['M5 12h14','M13 6l6 6-6 6'],
  up:['M7 14l5-5 5 5'],
  down:['M7 10l5 5 5-5'],
  bell:['M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9','M13.7 21a2 2 0 01-3.4 0'],
  plus:['M12 5v14M5 12h14'],
  flag:['M4 21V4','M4 4h12l-2 4 2 4H4'],
  list:['M8 6h13M8 12h13M8 18h13','M3 6h.01M3 12h.01M3 18h.01'],
  pin:['M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z','M12 11a2 2 0 100-4 2 2 0 000 4z'],
  search:['M11 19a8 8 0 100-16 8 8 0 000 16z','M21 21l-3.5-3.5'],
  wallet:['M3 7a2 2 0 012-2h12','M3 7h17a1 1 0 011 1v9a2 2 0 01-2 2H5a2 2 0 01-2-2z','M16 13h2'],
  clipboard:['M9 3h6v2H9z','M6 5h12v15H6z','M9 9h6M9 13h6M9 17h4'],
  edit:['M12 20h9','M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z'],
  receipt:['M5 3v18l2-1.3L9 21l2-1.3L13 21l2-1.3L17 21l2-1.3V3l-2 1.3L15 3l-2 1.3L11 3 9 4.3 7 3z','M9 8h6M9 12h6'],
  layers:['M12 3l9 5-9 5-9-5z','M3 13l9 5 9-5','M3 18l9 5 9-5'],
  trend:['M3 17l6-6 4 4 7-7','M17 8h4v4'],
  help:['M12 21a9 9 0 100-18 9 9 0 000 18z','M9.5 9.2a2.6 2.6 0 015 .8c0 1.7-2.5 2.2-2.5 4','M12 17.5h.01'],
  inbox:['M3 12h5l2 3h4l2-3h5','M5.5 5h13l3 7v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z'],
  chevron:['M9 6l6 6-6 6'],
  download:['M12 3v12','M7 10l5 5 5-5','M5 21h14'],
  bolt:['M13 2L4 14h7l-1 8 9-12h-7z'],
  bell2:['M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9','M13.7 21a2 2 0 01-3.4 0'],
  external:['M14 5h5v5','M19 5l-7 7','M19 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1h5'],
};

/* Real-app nav structure (mirrors Project Controls Standalone) */
const NAV_MAIN = [
  {id:'Dashboard', icon:IC.grid},
  {id:'Schedule',  icon:IC.calendar},
  {id:'Budget',    icon:IC.wallet},
];
const NAV_LOGS = [
  {id:'Documents',      icon:IC.doc},
  {id:'Daily Reports',  icon:IC.clipboard},
  {id:'Issues',         icon:IC.alert},
  {id:'Safety',         icon:IC.alert},
  {id:'Change Orders',  icon:IC.edit},
  {id:'Invoices',       icon:IC.receipt},
  {id:'Equipment',      icon:IC.layers},
  {id:'Cost Forecast',  icon:IC.trend},
  {id:'Risk Register',  icon:IC.flag},
  {id:'RFI Log',        icon:IC.help,  badge:'3'},
  {id:'Submittals',     icon:IC.inbox, badge:'4'},
  {id:'Bids Tracking',  icon:IC.check},
];

const circ = c => ({display:'grid',placeItems:'center',borderRadius:9});

/* Status pill */
const Pill = ({kind='ok', children}) => {
  const map = {ok:[DRtok.ok,DRtok.okBg], warn:[DRtok.warn,DRtok.warnBg], bad:[DRtok.bad,DRtok.badBg], idle:[DRtok.idle,DRtok.idleBg], blue:[DRtok.blue,'#E3F1FB']};
  const [c,bg]=map[kind];
  return <span style={{display:'inline-flex',alignItems:'center',gap:6,padding:'4px 10px',borderRadius:20,fontSize:11.5,fontWeight:700,color:c,background:bg,letterSpacing:'.01em',whiteSpace:'nowrap'}}>
    <span style={{width:7,height:7,borderRadius:'50%',background:'currentColor'}}/>{children}
  </span>;
};

/* progress bar */
const Bar = ({pct, c1=DRtok.blue, c2=DRtok.cyan, h=8, track=DRtok.line}) => (
  <div style={{height:h,borderRadius:8,background:track,overflow:'hidden',width:'100%'}}>
    <div style={{height:'100%',width:`${pct}%`,borderRadius:8,background:`linear-gradient(90deg,${c1},${c2})`}}/>
  </div>
);

/* budget bar that can show overage */
const BudgetBar = ({pct, over=false}) => (
  <div style={{height:8,borderRadius:8,background:DRtok.line,overflow:'hidden',width:'100%'}}>
    <div style={{height:'100%',width:`${Math.min(pct,100)}%`,borderRadius:8,
      background: over ? `linear-gradient(90deg,${DRtok.warn},${DRtok.bad})` : `linear-gradient(90deg,${DRtok.blue},${DRtok.cyan})`}}/>
  </div>
);

/* KPI card */
const Kpi = ({icon, label, value, sub, delta, deltaKind='up', tint}) => {
  const tints = {
    cyan:['rgba(29,180,232,.10)',DRtok.blue],
    gold:['rgba(208,149,39,.12)',DRtok.gold],
    ok:['rgba(30,158,106,.12)',DRtok.ok],
    warn:['rgba(224,138,30,.12)',DRtok.warn],
    bad:['rgba(208,73,74,.12)',DRtok.bad],
  };
  const [ibg,ic]=tints[tint||'cyan'];
  const dmap={up:[DRtok.ok,DRtok.okBg],down:[DRtok.bad,DRtok.badBg],flat:[DRtok.idle,DRtok.idleBg]};
  const [dc,dbg]=dmap[deltaKind];
  return (
    <div className="dr-kpi" style={{background:DRtok.card,border:`1px solid ${DRtok.line}`,borderRadius:16,padding:'16px 16px 14px',boxShadow:'0 1px 2px rgba(20,33,48,.04)'}}>
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
        <div style={{...circ(),width:32,height:32,background:ibg,color:ic}}><DIcon d={icon} s={17}/></div>
        <span style={{fontSize:12,color:DRtok.muted,fontWeight:600}}>{label}</span>
      </div>
      <div style={{fontFamily:DRtok.fDisp,fontWeight:800,fontSize:27,letterSpacing:'-.02em',color:DRtok.ink,lineHeight:1}}>{value}</div>
      <div style={{display:'flex',alignItems:'center',gap:7,marginTop:9,fontSize:12,fontWeight:600,color:DRtok.muted}}>
        {delta && <span style={{display:'inline-flex',alignItems:'center',gap:3,padding:'2px 7px',borderRadius:20,fontSize:11,fontWeight:700,color:dc,background:dbg}}>
          <DIcon d={deltaKind==='down'?IC.down:IC.up} s={11}/>{delta}</span>}
        {sub}
      </div>
    </div>
  );
};

/* card shell */
const Card = ({title, meta, children, pad=true, action}) => (
  <div style={{background:DRtok.card,border:`1px solid ${DRtok.line}`,borderRadius:16,boxShadow:'0 1px 2px rgba(20,33,48,.04)',overflow:'hidden'}}>
    {title && <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,padding:'15px 18px 0'}}>
      <h3 style={{fontFamily:DRtok.fHead,fontWeight:700,fontSize:15,color:DRtok.ink,letterSpacing:'-.01em',margin:0}}>{title}</h3>
      {meta && <span style={{fontSize:12,color:DRtok.muted,fontWeight:600}}>{meta}</span>}
      {action}
    </div>}
    <div style={{padding:pad?'14px 18px 18px':0}}>{children}</div>
  </div>
);

/* avatar chip */
const Avatar = ({initials, c1=DRtok.navy, c2='#26425f', s=30}) => (
  <div style={{width:s,height:s,borderRadius:Math.round(s*0.28),background:`linear-gradient(135deg,${c1},${c2})`,color:'#fff',display:'grid',placeItems:'center',fontFamily:DRtok.fHead,fontWeight:700,fontSize:s*0.42,flex:'none'}}>{initials}</div>
);

/* nav item row */
const NavRow = ({label, icon, on, badge, disabled}) => (
  <div style={{display:'flex',alignItems:'center',gap:12,padding:'10px 12px',borderRadius:10,fontSize:14,fontWeight:on?600:500,
    color:on?'#fff':(disabled?'#5C6E80':'#A9B8C6'),background:on?'rgba(29,180,232,.14)':'transparent',position:'relative',opacity:disabled?0.55:1}}>
    {on && <span style={{position:'absolute',left:-14,top:8,bottom:8,width:3,borderRadius:'0 3px 3px 0',background:DRtok.cyan,boxShadow:`0 0 12px ${DRtok.cyan}`}}/>}
    <DIcon d={icon} s={18} style={{color:on?DRtok.cyan:'currentColor'}}/>
    <span style={{flex:1}}>{label}</span>
    {badge && <span style={{fontSize:11,fontWeight:700,background:on?DRtok.cyan:'rgba(255,255,255,.1)',color:on?DRtok.navyDeep:'#cfe',padding:'2px 7px',borderRadius:20}}>{badge}</span>}
  </div>
);

const SectLabel = ({children}) => (
  <div style={{fontSize:11,letterSpacing:'.14em',textTransform:'uppercase',color:'#5C6E80',fontWeight:700,padding:'18px 10px 8px'}}>{children}</div>
);

/* App chrome wrapper — mirrors the real Project Controls app exactly */
const Chrome = ({active='Dashboard', user='David Wilson', role='Principal', initials='DW', crumb='Executive Summary', project='Longleaf Amenity', children, extraMain=[]}) => {
  const mainItems = [...extraMain, ...NAV_MAIN];
  return (
    <div style={{display:'grid',gridTemplateColumns:'264px 1fr',height:'100%',fontFamily:DRtok.fBody,color:DRtok.ink,background:DRtok.paper}}>
      {/* sidebar */}
      <aside style={{background:`linear-gradient(180deg,${DRtok.navyDeep},#0A1420)`,display:'flex',flexDirection:'column',borderRight:'1px solid rgba(255,255,255,.05)',overflow:'hidden'}}>
        <div style={{display:'flex',alignItems:'center',gap:12,padding:'22px 22px 14px',flex:'none'}}>
          <img src="assets/dunrite-white.png" alt="DunRite Construction Group" style={{height:46,width:'auto',display:'block'}}/>
        </div>
        <div style={{flex:1,overflow:'hidden',padding:'0 14px',minHeight:0}}>
          <SectLabel>Project Controls</SectLabel>
          <nav style={{display:'flex',flexDirection:'column',gap:2}}>
            {mainItems.map(n=><NavRow key={n.id} label={n.id} icon={n.icon} badge={n.badge} on={n.id===active}/>)}
          </nav>
          <SectLabel>Logs &amp; Tracking</SectLabel>
          <nav style={{display:'flex',flexDirection:'column',gap:2}}>
            {NAV_LOGS.map(n=><NavRow key={n.id} label={n.id} icon={n.icon} badge={n.badge} on={n.id===active} disabled/>)}
          </nav>
        </div>
        <div style={{padding:'14px 18px',borderTop:'1px solid rgba(255,255,255,.06)',flex:'none'}}>
          <div style={{display:'flex',gap:12,alignItems:'center',background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.07)',padding:'10px 12px',borderRadius:12}}>
            <Avatar initials={initials} c1={DRtok.cyan} c2={DRtok.blue} s={36}/>
            <div style={{lineHeight:1.2,flex:1}}>
              <div style={{fontSize:12.5,color:'#EAF1F7',fontWeight:600}}>{user}</div>
              <div style={{fontSize:11,color:'#7E8EA0'}}>{role}</div>
            </div>
            <DIcon d={IC.user} s={1} style={{display:'none'}}/>
            <svg viewBox="0 0 24 24" fill="none" stroke="#A9B8C6" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{width:16,height:16}}>
              <path d="M10 8V5a1 1 0 011-1h9a1 1 0 011 1v14a1 1 0 01-1 1h-9a1 1 0 01-1-1v-3"/><path d="M3 12h11"/><path d="M8 9l-3 3 3 3"/>
            </svg>
          </div>
        </div>
      </aside>
      {/* main */}
      <div style={{display:'flex',flexDirection:'column',overflow:'hidden'}}>
        <div style={{height:68,display:'flex',alignItems:'center',gap:18,padding:'0 32px',background:'rgba(244,247,250,.92)',borderBottom:`1px solid ${DRtok.line}`,flex:'none'}}>
          <div style={{display:'flex',alignItems:'center',gap:9,color:DRtok.muted,fontSize:13.5,fontWeight:500}}>
            <DIcon d={IC.building} s={15} style={{color:DRtok.faint}}/>
            <span>{project}</span>
            <DIcon d={IC.chevron} s={15} style={{color:DRtok.faint}}/>
            <b style={{color:DRtok.ink,fontWeight:700}}>{crumb}</b>
          </div>
          <div style={{flex:1}}/>
          <div style={{display:'flex',alignItems:'center',gap:9,background:'#fff',border:`1px solid ${DRtok.line}`,borderRadius:10,padding:'9px 13px',width:300,color:DRtok.muted}}>
            <DIcon d={IC.search} s={16}/><span style={{fontSize:13.5}}>Search RFIs, POs, cost codes…</span>
          </div>
          <div style={{width:40,height:40,borderRadius:10,border:`1px solid ${DRtok.line}`,background:'#fff',display:'grid',placeItems:'center',color:DRtok.ink2,position:'relative',flex:'none'}}>
            <DIcon d={IC.bell} s={18}/><span style={{position:'absolute',top:9,right:10,width:7,height:7,borderRadius:'50%',background:DRtok.bad,border:'2px solid #fff'}}/>
          </div>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,height:40,padding:'0 16px',borderRadius:10,background:'#fff',border:`1px solid ${DRtok.line}`,color:DRtok.ink2,fontSize:13.5,fontWeight:600,flex:'none'}}>
            <DIcon d={IC.download} s={16}/>Export
          </div>
          <div style={{width:40,height:40,borderRadius:11,background:`linear-gradient(135deg,${DRtok.navy},#26425f)`,color:'#fff',display:'grid',placeItems:'center',fontFamily:DRtok.fHead,fontWeight:700,fontSize:14,flex:'none'}}>{initials}</div>
        </div>
        <div style={{padding:'24px 32px',overflow:'hidden',flex:1}}>{children}</div>
      </div>
    </div>
  );
};

Object.assign(window, {DRtok, DIcon, IC, Pill, Bar, BudgetBar, Kpi, Card, Avatar, Chrome, circ});
