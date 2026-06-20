/* QuickBooks Integration */
function QuickBooksIntegration(){
  const [syncStatus, setSyncStatus] = React.useState('connected');
  const [lastSync, setLastSync] = React.useState('2026-06-15 14:30');
  const [accounts, setAccounts] = React.useState([
    {id:'1000',name:'Cash - Operating',balance:125430.50,lastSync:'2026-06-15'},
    {id:'1200',name:'Accounts Receivable',balance:184500.00,lastSync:'2026-06-15'},
    {id:'2000',name:'Accounts Payable',balance:-89240.25,lastSync:'2026-06-15'},
    {id:'3000',name:'Equity',balance:-220690.25,lastSync:'2026-06-15'}
  ]);

  const handleSync = () => {
    setSyncStatus('syncing');
    setTimeout(()=>{
      setSyncStatus('connected');
      setLastSync(new Date().toLocaleString());
    },2000);
  };

  const totalAssets = accounts.filter(a=>a.balance>0).reduce((s,a)=>s+a.balance,0);
  const totalLiabilities = Math.abs(accounts.filter(a=>a.balance<0).reduce((s,a)=>s+a.balance,0));

  return React.createElement('div',{className:'view'},
    React.createElement('div',{className:'pg-grid'},
      React.createElement('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}},
        React.createElement('div',null,
          React.createElement('h2',{style:{margin:0}},
            syncStatus==='connected'?'✓ QuickBooks Connected':'Syncing...'
          ),
          React.createElement('div',{style:{fontSize:12,color:'var(--muted)',marginTop:4}},
            'Last sync: '+lastSync
          )
        ),
        React.createElement('button',{onClick:handleSync,disabled:syncStatus==='syncing',className:'btn btn--primary'},
          syncStatus==='syncing'?'Syncing...':'Sync Now'
        )
      ),

      React.createElement('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:16,marginBottom:24}},
        React.createElement('div',{className:'card'},
          React.createElement('div',{style:{fontSize:11,color:'var(--muted)',fontWeight:600,textTransform:'uppercase'}},
            '💰 Total Assets'
          ),
          React.createElement('div',{style:{fontSize:22,fontWeight:700,marginTop:8,color:'var(--success)'}},
            '$'+totalAssets.toLocaleString(undefined,{maximumFractionDigits:0})
          )
        ),
        React.createElement('div',{className:'card'},
          React.createElement('div',{style:{fontSize:11,color:'var(--muted)',fontWeight:600,textTransform:'uppercase'}},
            '📊 Total Liabilities'
          ),
          React.createElement('div',{style:{fontSize:22,fontWeight:700,marginTop:8,color:'var(--err)'}},
            '$'+totalLiabilities.toLocaleString(undefined,{maximumFractionDigits:0})
          )
        ),
        React.createElement('div',{className:'card'},
          React.createElement('div',{style:{fontSize:11,color:'var(--muted)',fontWeight:600,textTransform:'uppercase'}},
            '📈 Net Worth'
          ),
          React.createElement('div',{style:{fontSize:22,fontWeight:700,marginTop:8}},
            '$'+(totalAssets-totalLiabilities).toLocaleString(undefined,{maximumFractionDigits:0})
          )
        )
      ),

      React.createElement('h3',{style:{fontSize:14,fontWeight:700,marginBottom:12}},'Chart of Accounts'),
      React.createElement('div',{className:'tbl-wrap'},
        React.createElement('table',{className:'tbl'},
          React.createElement('thead',null,
            React.createElement('tr',null,
              React.createElement('th',null,'Account #'),
              React.createElement('th',null,'Account Name'),
              React.createElement('th',{textAlign:'right'},'Balance'),
              React.createElement('th',null,'Last Sync')
            )
          ),
          React.createElement('tbody',null,
            accounts.map(a=>React.createElement('tr',{key:a.id},
              React.createElement('td',{className:'code'},a.id),
              React.createElement('td',null,a.name),
              React.createElement('td',{textAlign:'right',fontWeight:600,color:a.balance>0?'var(--success)':'var(--err)'},'$'+a.balance.toLocaleString(undefined,{maximumFractionDigits:2})),
              React.createElement('td',{fontSize:12,color:'var(--muted)'},a.lastSync)
            ))
          )
        )
      ),

      React.createElement('div',{style:{marginTop:24}},
        React.createElement('p',{style:{fontSize:12,color:'var(--muted)',marginBottom:0}},
          '🔗 Two-way sync enabled · Invoices & payments sync automatically · Company name: Dun Rite Construction'
        )
      )
    )
  );
}

Object.assign(window,{QuickBooksIntegration});
