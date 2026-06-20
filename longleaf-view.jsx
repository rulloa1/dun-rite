/* Icon set */
const Icon = {
  home:()=><svg viewBox="0 0 24 24"><path d="M3 12l9-9 9 9v9h-6v-6h-6v6H3z"/></svg>,
  list:()=><svg viewBox="0 0 24 24"><path d="M8 6h8M8 12h8M8 18h8M4 6h.01M4 12h.01M4 18h.01"/></svg>,
  undo:()=><svg viewBox="0 0 24 24"><path d="M3 7v6h6M21 17a8 8 0 01-8 8 8 8 0 01-8-8"/></svg>,
};

function Sidebar({active, go}){
  const nav = [
    {id:'bids', label:'All Bids', icon:'list'},
    {id:'summary', label:'Summary', icon:'home'},
  ];
  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <img src="assets/dunrite-white.png" alt="DunRite" style={{height:40}}/>
      </div>
      <div className="sidebar__sect">Controls</div>
      <nav className="nav">
        {nav.map(n=>{
          const I = Icon[n.icon];
          return (
          <button key={n.id} className={'nav__item'+(active===n.id?' is-active':'')} onClick={()=>go(n.id)}>
            <I/>
            {n.label}
          </button>
        );})}
      </nav>
      <div className="sidebar__foot">
        <div className="proj-pill">
          <div className="proj-pill__t">Longleaf</div>
          <div className="proj-pill__s">San Antonio, TX</div>
        </div>
      </div>
    </aside>
  );
}

function ViewBids(){
  const P = window.PROJECT;
  const returned = P.bids.filter(b=>b.status==='Done');
  const pending = P.bids.filter(b=>b.status==='Not Returned');
  
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Bids Tracking</h1>
          <div className="sub">{P.name} · {P.location}</div>
        </div>
        <button className="btn btn--primary">Export</button>
      </div>
      
      <div className="grid kpis">
        <div className="kpi">
          <div className="kpi__label">Total Bids Value</div>
          <div className="kpi__val gold">{P.usd(P.total)}</div>
          <div className="kpi__sub">{P.bids.length} vendors</div>
        </div>
        <div className="kpi">
          <div className="kpi__label">Returned</div>
          <div className="kpi__val">{P.returned}</div>
          <div className="kpi__sub">of {P.bids.length}</div>
        </div>
        <div className="kpi">
          <div className="kpi__label">Not Returned</div>
          <div className="kpi__val">{P.notReturned}</div>
          <div className="kpi__sub">pending follow-up</div>
        </div>
        <div className="kpi">
          <div className="kpi__label">Completion</div>
          <div className="kpi__val">{Math.round(P.returned/P.bids.length*100)}%</div>
          <div className="kpi__sub">bids in</div>
        </div>
      </div>

      <div className="grid cols-2" style={{marginTop:24}}>
        <div className="card tablecard">
          <div className="card__h">
            <h3>Returned Bids</h3>
            <span className="meta">{P.returned} vendors</span>
          </div>
          <table className="tbl">
            <thead><tr>
              <th style={{width:50}}>ID</th>
              <th>Vendor</th>
              <th>Trade</th>
              <th style={{textAlign:'right',width:120}}>Amount</th>
            </tr></thead>
            <tbody>
              {returned.map(b=>(
                <tr key={b.id}>
                  <td className="code">{b.id}</td>
                  <td className="vendor">{b.vendor}</td>
                  <td style={{color:'var(--ds-dim)',fontSize:12}}>{b.trade}</td>
                  <td className="num">{P.usd(b.amt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card tablecard">
          <div className="card__h">
            <h3>Pending Response</h3>
            <span className="meta">{P.notReturned} vendors</span>
          </div>
          <table className="tbl">
            <thead><tr>
              <th style={{width:50}}>ID</th>
              <th>Vendor</th>
              <th>Trade</th>
              <th style={{width:100}}>Follow Up</th>
            </tr></thead>
            <tbody>
              {pending.map(b=>(
                <tr key={b.id}>
                  <td className="code">{b.id}</td>
                  <td className="vendor">{b.vendor}</td>
                  <td style={{color:'var(--ds-dim)',fontSize:12}}>{b.trade}</td>
                  <td><button className="btn" style={{padding:'6px 10px',fontSize:9}}>Send</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ViewSummary(){
  const P = window.PROJECT;
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Summary</h1>
          <div className="sub">Project overview · All bids</div>
        </div>
      </div>

      <div className="grid kpis">
        <div className="kpi">
          <div className="kpi__label">Project</div>
          <div className="kpi__val" style={{fontSize:24}}>{P.name}</div>
          <div className="kpi__sub">{P.location}</div>
        </div>
        <div className="kpi">
          <div className="kpi__label">Total Value</div>
          <div className="kpi__val gold">{P.usd(P.total)}</div>
        </div>
        <div className="kpi">
          <div className="kpi__label">Returned</div>
          <div className="kpi__val">{P.returned}/{P.bids.length}</div>
          <div className="kpi__sub">{Math.round(P.returned/P.bids.length*100)}% complete</div>
        </div>
        <div className="kpi">
          <div className="kpi__label">Status</div>
          <div className="kpi__val" style={{fontSize:20,color:'var(--ds-warn)'}}>In Progress</div>
        </div>
      </div>

      <div style={{marginTop:24}}>
        <div className="card">
          <div className="card__h"><h3>All Bids</h3></div>
          <div style={{maxHeight:500,overflow:'auto'}}>
            {P.bids.map(b=>(
              <div key={b.id} className="brow">
                <span className="id">{b.id}</span>
                <span className="vendor">{b.vendor}</span>
                <span className="trade">{b.trade}</span>
                <span className="amt">{b.amt>0?P.usd(b.amt):'-'}</span>
                <span className={'status '+b.status.toLowerCase().replace(' ','')}>{b.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window,{Sidebar,ViewBids,ViewSummary,Icon});
