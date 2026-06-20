/* Sidebar + Topbar */

const NAV = [
  {id:'projects',  label:'Projects',      icon:'building'},
  {id:'dashboard', label:'Dashboard',     icon:'dashboard'},
  {id:'schedule',  label:'Schedule',      icon:'cal'},
  {id:'gantt',     label:'Gantt Chart',   icon:'chart'},
  {id:'budget',    label:'Budget',        icon:'wallet'},
];

const NAV_LOGS = [
  {id:'documents', label:'Documents',     icon:'file'},
  {id:'daily',     label:'Daily Reports', icon:'clipboard'},
  {id:'issues',    label:'Issues',        icon:'alert'},
  {id:'safety',    label:'Safety',        icon:'alert'},
  {id:'changeorders', label:'Change Orders', icon:'edit'},
  {id:'invoices',  label:'Invoices',      icon:'receipt'},
  {id:'equipment', label:'Equipment',     icon:'layers'},
  {id:'forecasting', label:'Cost Forecast', icon:'trend'},
  {id:'risks',     label:'Risk Register', icon:'flag'},
  {id:'rfi',       label:'RFI Log',       icon:'help',      badge:'3'},
  {id:'submittals', label:'Submittals',   icon:'inbox',     badge:'4'},
  {id:'bids',      label:'Bids Tracking', icon:'check'},
];

const NAV_ADVANCED = [
  {id:'photos',     label:'Photo Log',        icon:'image'},
  {id:'retainage',  label:'Retainage',       icon:'lock'},
  {id:'cashflow',   label:'Cash Flow',       icon:'trending'},
  {id:'resources',  label:'Crew Allocation', icon:'users'},
  {id:'subs',       label:'Subcontractors',  icon:'building'},
  {id:'logistics',  label:'Site Logistics',  icon:'truck'},
  {id:'notif',      label:'Notifications',   icon:'bell'},
  {id:'approvals',  label:'Approvals',       icon:'check'},
  {id:'milestones', label:'Milestones',      icon:'target'},
  {id:'products',   label:'Productivity',    icon:'zap'},
  {id:'meetings',   label:'Meetings',        icon:'users'},
  {id:'reqs',       label:'Requisitions',    icon:'receipt'},
  {id:'weather',    label:'Weather',         icon:'cloud'},
  {id:'qb',         label:'QuickBooks',      icon:'calculator'},
  {id:'mobile',     label:'Mobile Portal',   icon:'phone'},
  {id:'calendar',   label:'Calendar',        icon:'calendar'}
];

function Sidebar({active,go,user}){
  const handleLogout = async () => {
    if(confirm('Sign out?')) {
      await window.AUTH.logout();
      window.location.reload();
    }
  };

  return React.createElement('aside',{className:'sidebar'},
    React.createElement('div',{className:'sidebar__brand'},
      React.createElement('div',{style:{width:40,height:40,background:'#1DB4E8',borderRadius:4,display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,fontWeight:'bold',color:'white'}},'D')
    ),
    React.createElement('div',{className:'sidebar__sect'},'Project Controls'),
    React.createElement('nav',{className:'nav'}, NAV.map(n=>React.createElement('button',{
      key:n.id, className:'nav__item'+(active===n.id?' is-active':'')+(window.AUTH.canView(n.id)?'':' is-disabled'), 
      onClick:()=>go(n.id),
      disabled:!window.AUTH.canView(n.id)},
      React.createElement(Icon[n.icon]),
      React.createElement('span',null,n.label),
      n.badge && React.createElement('span',{className:'nav__badge'},n.badge)
    ))),
    React.createElement('div',{className:'sidebar__sect'},'Logs & Tracking'),
    React.createElement('nav',{className:'nav'}, NAV_LOGS.map(n=>React.createElement('button',{
      key:n.id, className:'nav__item'+(active===n.id?' is-active':'')+(window.AUTH.canView(n.id)?'':' is-disabled'), 
      onClick:()=>go(n.id),
      disabled:!window.AUTH.canView(n.id)},
      React.createElement(Icon[n.icon]),
      React.createElement('span',null,n.label),
      n.badge && React.createElement('span',{className:'nav__badge'},n.badge)
    ))),
    React.createElement('div',{className:'sidebar__sect'},'Advanced Tools'),
    React.createElement('nav',{className:'nav'}, NAV_ADVANCED.map(n=>React.createElement('button',{
      key:n.id, className:'nav__item'+(active===n.id?' is-active':'')+(window.AUTH.canView(n.id)?'':' is-disabled'), 
      onClick:()=>go(n.id),
      disabled:!window.AUTH.canView(n.id)},
      React.createElement(Icon[n.icon]),
      React.createElement('span',null,n.label),
      n.badge && React.createElement('span',{className:'nav__badge'},n.badge)
    ))),
    React.createElement('div',{className:'sidebar__foot'},
      React.createElement('div',{className:'user-pill'},
        React.createElement('div',{className:'user-pill__avatar'},user.name.split(' ').map(w=>w[0]).join('').toUpperCase()),
        React.createElement('div',null,
          React.createElement('div',{className:'user-pill__name'},user.name),
          React.createElement('div',{className:'user-pill__role'},user.title)
        ),
        React.createElement('button',{className:'user-pill__logout',onClick:handleLogout,title:'Sign out'},
          React.createElement(Icon.logout)
        )
      )
    )
  );
}

const TITLES = {
  projects:'Projects', dashboard:'Executive Summary', schedule:'Construction Schedule', gantt:'Gantt Chart', budget:'Budget & Cost Control',
  documents:'Document Management', daily:'Daily Reports', issues:'Issue Tracker', safety:'Safety Incident Log', changeorders:'Change Orders', invoices:'Invoice & Requisitions', equipment:'Equipment & Material Tracking', forecasting:'Cost Forecasting & Variance', risks:'Risk Register',
  rfi:'RFI Log', submittals:'Submittal Log', bids:'Bids Tracking — Longleaf Amenity',
  photos:'Photo Progress Log', retainage:'Retainage Tracking', cashflow:'Cash Flow Forecast', resources:'Crew Allocation',
  subs:'Subcontractor Portal', logistics:'Site Logistics', notif:'Notifications', approvals:'Approval Workflows',
  milestones:'Milestone Tracking', products:'Productivity Metrics', meetings:'Meeting Minutes', reqs:'Requisition System',
  weather:'Weather Integration', qb:'QuickBooks Sync', mobile:'Mobile App Portal', calendar:'Calendar & Integrations'
};

function Topbar({active,user}){
  return React.createElement('header',{className:'topbar'},
    React.createElement('div',{className:'crumb'},
      React.createElement(Icon.building),
      React.createElement('span',null,"Longleaf Amenity"),
      React.createElement(Icon.chevron),
      React.createElement('b',null, TITLES[active]||'Dashboard')
    ),
    React.createElement('div',{className:'topbar__spacer'}),
    React.createElement('label',{className:'search'},
      React.createElement(Icon.search),
      React.createElement('input',{placeholder:'Search RFIs, POs, cost codes…'})
    ),
    React.createElement('button',{className:'icon-btn',title:'Notifications'},
      React.createElement(Icon.bell), React.createElement('span',{className:'dot'})),
    React.createElement('button',{className:'btn btn--ghost',style:{height:40}},
      React.createElement(Icon.download),'Export'),
    React.createElement('div',{className:'avatar',title:user?.title||'User'},(user?.name||'DR').split(' ').map(w=>w[0]).join('').toUpperCase())
  );
}

Object.assign(window,{Sidebar,Topbar});
