/* Admin panel for user management */
function AdminPanel({onClose}){
  const [tab, setTab] = React.useState('users');
  const [users, setUsers] = React.useState([]);
  const [invites, setInvites] = React.useState([]);
  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');
  const [role, setRole] = React.useState('pm');
  const [msg, setMsg] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    loadUsers();
    loadInvites();
  }, []);

  const loadUsers = () => {
    const users = JSON.parse(localStorage.getItem('dr_all_users')) || [];
    setUsers(users);
  };

  const loadInvites = async () => {
    const inv = await window.AUTH.getInvites();
    setInvites(inv);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if(!email.trim() || !name.trim()) {setMsg('Fill all fields'); return;}
    
    setLoading(true);
    const newUser = {
      id: Math.random().toString(36).slice(2,11),
      email,
      name,
      role,
      title: {pm:'Project Manager',super:'Superintendent',finance:'Finance Director',owner:'Principal'}[role],
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    
    const allUsers = JSON.parse(localStorage.getItem('dr_all_users')) || [];
    if(allUsers.find(u=>u.email===email)) {setLoading(false); setMsg('User already exists'); return;}
    
    allUsers.push(newUser);
    localStorage.setItem('dr_all_users', JSON.stringify(allUsers));
    window.AUTH.log('USER_ADDED', `Added ${name} as ${role}`, 'admin');
    
    setLoading(false);
    setMsg(`✓ User ${name} added`);
    setEmail('');
    setName('');
    setRole('pm');
    loadUsers();
    setTimeout(()=>setMsg(''), 3000);
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    if(!email.trim()) {setMsg('Enter an email'); return;}
    setLoading(true);
    const res = await window.AUTH.sendInvite(email, role);
    setLoading(false);
    if(!res.ok) {setMsg('Error: '+res.err); return;}
    setMsg(`✓ Invite sent to ${email}`);
    setEmail('');
    setRole('pm');
    loadInvites();
    setTimeout(()=>setMsg(''), 3000);
  };

  const handleDeleteUser = (userId) => {
    if(!confirm('Delete this user?')) return;
    const allUsers = JSON.parse(localStorage.getItem('dr_all_users')) || [];
    const updated = allUsers.filter(u=>u.id!==userId);
    localStorage.setItem('dr_all_users', JSON.stringify(updated));
    window.AUTH.log('USER_DELETED', `Deleted user ${userId}`, 'admin');
    loadUsers();
  };

  const roles = {pm:'Project Manager',super:'Superintendent',finance:'Finance Director',owner:'Principal'};

  return React.createElement('div',{className:'modal-overlay',onClick:onClose},
    React.createElement('div',{className:'modal',style:{maxWidth:700},onClick:(e)=>e.stopPropagation()},
      React.createElement('div',{className:'modal__head'},
        React.createElement('h2',null,'User Management'),
        React.createElement('button',{className:'modal__close',onClick:onClose},'✕')
      ),

      React.createElement('div',{style:{display:'flex',gap:12,borderBottom:'1px solid var(--border)',paddingBottom:12,marginBottom:16}},
        React.createElement('button',{onClick:()=>setTab('users'),style:{background:'none',border:'none',paddingBottom:8,borderBottom:tab==='users'?'2px solid var(--brand-blue)':'none',color:tab==='users'?'var(--ink)':'var(--muted)',cursor:'pointer',fontSize:14,fontWeight:600}},'Manage Users ('+users.length+')'),
        React.createElement('button',{onClick:()=>setTab('invites'),style:{background:'none',border:'none',paddingBottom:8,borderBottom:tab==='invites'?'2px solid var(--brand-blue)':'none',color:tab==='invites'?'var(--ink)':'var(--muted)',cursor:'pointer',fontSize:14,fontWeight:600}},'Invite Users')
      ),

      React.createElement('div',{className:'modal__body'},
        tab==='users' && React.createElement('div',null,
          React.createElement('form',{onSubmit:handleAddUser},
            React.createElement('div',{className:'form-group'},
              React.createElement('label',null,'Full Name'),
              React.createElement('input',{type:'text',placeholder:'John Smith',value:name,onChange:(e)=>setName(e.target.value),disabled:loading})
            ),
            React.createElement('div',{className:'form-group'},
              React.createElement('label',null,'Email Address'),
              React.createElement('input',{type:'email',placeholder:'john@company.com',value:email,onChange:(e)=>setEmail(e.target.value),disabled:loading})
            ),
            React.createElement('div',{className:'form-group'},
              React.createElement('label',null,'Role'),
              React.createElement('select',{value:role,onChange:(e)=>setRole(e.target.value),disabled:loading},
                React.createElement('option',{value:'pm'},'Project Manager'),
                React.createElement('option',{value:'super'},'Superintendent'),
                React.createElement('option',{value:'finance'},'Finance Director'),
                React.createElement('option',{value:'owner'},'Principal')
              )
            ),
            msg && React.createElement('div',{className:'msg'},msg),
            React.createElement('button',{type:'submit',className:'btn btn--primary',style:{width:'100%'},disabled:loading},loading?'Adding...':'Add User')
          ),
          users.length > 0 && React.createElement('div',{style:{marginTop:24}},
            React.createElement('h3',{style:{fontSize:14,fontWeight:700,marginBottom:12}},'Active Users'),
            users.map(u=>React.createElement('div',{key:u.id,style:{display:'flex',justifyContent:'space-between',alignItems:'center',padding:12,borderBottom:'1px solid var(--border)'}},
              React.createElement('div',null,
                React.createElement('div',{style:{fontSize:13,fontWeight:600}},u.name),
                React.createElement('div',{style:{fontSize:11,color:'var(--muted)',marginTop:2}},u.email),
                React.createElement('div',{style:{fontSize:11,color:'var(--muted)',marginTop:2}},roles[u.role])
              ),
              React.createElement('button',{onClick:()=>handleDeleteUser(u.id),style:{background:'var(--err)',color:'white',border:'none',padding:'4px 8px',borderRadius:4,cursor:'pointer',fontSize:11,fontWeight:600}},'Remove')
            ))
          )
        ),

        tab==='invites' && React.createElement('div',null,
          React.createElement('form',{onSubmit:handleInvite},
            React.createElement('div',{className:'form-group'},
              React.createElement('label',null,'Email Address'),
              React.createElement('input',{type:'email',placeholder:'executive@company.com',value:email,onChange:(e)=>setEmail(e.target.value),disabled:loading})
            ),
            React.createElement('div',{className:'form-group'},
              React.createElement('label',null,'Role'),
              React.createElement('select',{value:role,onChange:(e)=>setRole(e.target.value),disabled:loading},
                React.createElement('option',{value:'pm'},'Project Manager'),
                React.createElement('option',{value:'super'},'Superintendent'),
                React.createElement('option',{value:'finance'},'Finance Director'),
                React.createElement('option',{value:'owner'},'Principal')
              )
            ),
            msg && React.createElement('div',{className:'msg'},msg),
            React.createElement('button',{type:'submit',className:'btn btn--primary',style:{width:'100%'},disabled:loading},loading?'Sending...':'Send Invite')
          ),
          invites.filter(i=>i.status==='pending').length > 0 && React.createElement('div',{style:{marginTop:24}},
            React.createElement('h3',{style:{fontSize:14,fontWeight:700,marginBottom:12}},'Pending Invites'),
            invites.filter(i=>i.status==='pending').map(i=>React.createElement('div',{key:i.id,style:{padding:12,borderBottom:'1px solid var(--border)'}},
              React.createElement('div',{style:{fontSize:13,fontWeight:600}},i.email),
              React.createElement('div',{style:{fontSize:11,color:'var(--muted)',marginTop:2}},roles[i.role]+' · Sent '+new Date(i.sentAt).toLocaleDateString()),
              React.createElement('code',{style:{fontSize:9,color:'var(--muted)',fontFamily:'monospace',marginTop:4,display:'block'}},i.inviteCode)
            ))
          )
        )
      )
    )
  );
}

Object.assign(window,{AdminPanel});
