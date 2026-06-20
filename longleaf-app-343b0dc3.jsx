function App(){
  const [active,setActive] = React.useState(()=>localStorage.getItem('ll_view')||'bids');
  const go = (id)=>{setActive(id);localStorage.setItem('ll_view',id)};
  const views = {bids:<ViewBids/>,summary:<ViewSummary/>}[active];
  
  return (
    <div className="app">
      <Sidebar active={active} go={go}/>
      <main className="main">{views}</main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
