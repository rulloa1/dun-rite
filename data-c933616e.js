/* Dun Rite Construction — Empty project data (Firebase will populate) */
window.DR = (function(){
  const usd = n => '$' + Math.round(n).toLocaleString('en-US');
  const usdK = n => {
    const a=Math.abs(n);
    if(a>=1e6) return (n<0?'-$':'$')+(a/1e6).toFixed(2)+'M';
    if(a>=1e3) return (n<0?'-$':'$')+(a/1e3).toFixed(0)+'K';
    return (n<0?'-$':'$')+a;
  };

  const project = {
    name:"",
    lot:"",
    loc:"",
    workbook:"",
    months:0,
    start:"",
    target:"",
    pct:0
  };

  const budget = {
    original:0, nocis:0, current:0, committed:0, variance:0
  };
  budget.variancePct = 0;
  budget.remaining = 0;

  const kpis = [];
  const milestones = [];
  const gantt = [];
  const ganttMonths = [];
  const todayPos = 0;
  const divisions = [];
  const subDetail = {};
  const composition = [];
  const rfis = [];
  const submittals = [];
  const delays = [];
  const purchasing = [];
  const activity = [];

  return {usd, usdK, project, budget, kpis, milestones, gantt, ganttMonths, todayPos,
          divisions, subDetail, composition, rfis, submittals, delays, purchasing, activity};
})();
