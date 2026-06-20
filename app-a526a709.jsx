/* App root */
function App(){
  const user = window.AUTH.getUser();
  const [showAdmin, setShowAdmin] = React.useState(false);
  
  // Not logged in: show login screen
  if(!user) return React.createElement(LoginScreen);

  const [active,setActive]=React.useState(()=>{
    const saved = localStorage.getItem('dr_view') || 'dashboard';
    return window.AUTH.canView(saved) ? saved : 'dashboard';
  });
  const main=React.useRef(null);
  
  const go=(id)=>{
    if(!window.AUTH.canView(id)){
      alert('You do not have access to this section.');
      return;
    }
    setActive(id);
    localStorage.setItem('dr_view',id);
    window.AUTH.log('VIEW', id, id);
    if(main.current) main.current.scrollTop=0;
  };

  const View = {
    projects:window.ProjectsManager,
    dashboard:window.Dashboard, schedule:window.Schedule, gantt:window.GanttChart, budget:window.Budget,
    documents:window.DocumentManager, daily:window.DailyReports, issues:window.IssueTracker, safety:window.SafetyLog, changeorders:window.ChangeOrderTracker, invoices:window.InvoiceManager, equipment:window.EquipmentTracking, forecasting:window.CostForecasting, risks:window.RiskRegister,
    rfi:window.RfiLog, submittals:window.SubmittalLog, bids:window.BidsTracker,
    photos:window.PhotoLog, retainage:window.RetainageTracking, cashflow:window.CashFlowForecast, resources:window.ResourcePlanning, subs:window.SubcontractorPortal, logistics:window.SiteLogistics,
    notif:window.NotificationCenter, approvals:window.ApprovalWorkflows, milestones:window.MilestoneTracking, products:window.ProductivityMetrics, meetings:window.MeetingMinutes,
    reqs:window.RequisitionSystem, weather:window.WeatherIntegration, qb:window.QuickBooksIntegration, mobile:window.MobileAppPortal, calendar:window.CalendarIntegration
  }[active] || window.Dashboard;

  return React.createElement(React.Fragment,null,
    React.createElement('div',{className:'app'},
      React.createElement(Sidebar,{active,go,user}),
      React.createElement('div',{className:'main',ref:main},
        React.createElement(Topbar,{active,user,showAdmin,setShowAdmin}),
        React.createElement(View,{key:active})
      )
    ),
    showAdmin && React.createElement(AdminInvitePanel,{onClose:()=>setShowAdmin(false)})
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
