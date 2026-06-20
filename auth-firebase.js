/* Hybrid auth — Firebase-ready but works without it */
window.AUTH = (function(){
  const firebaseAvailable = typeof firebase !== 'undefined';
  let auth, db;
  
  if(firebaseAvailable) {
    auth = window.FIREBASE.auth;
    db = window.FIREBASE.db;
  }
  
  let currentUser = JSON.parse(localStorage.getItem('dr_user')) || null;
  let auditLog = JSON.parse(localStorage.getItem('dr_audit')) || [];

  const PERMS = {
    admin: ['projects','dashboard','schedule','gantt','budget','documents','daily','issues','safety','changeorders','invoices','equipment','forecasting','risks','rfi','submittals','bids','photos','retainage','cashflow','resources','subs','logistics','notif','approvals','milestones','products','meetings','reqs','weather','qb','mobile','calendar'],
    pm: ['projects','dashboard','schedule','gantt','budget','documents','daily','issues','safety','changeorders','invoices','equipment','forecasting','risks','rfi','submittals','bids','photos','retainage','cashflow','resources','subs','logistics','notif','approvals','milestones','products','meetings','reqs','weather','qb','mobile','calendar'],
    super: ['projects','dashboard','schedule','gantt','budget','documents','daily','issues','safety','changeorders','invoices','equipment','forecasting','risks','rfi','submittals','bids','photos','retainage','cashflow','resources','subs','logistics','notif','approvals','milestones','products','meetings','reqs','weather','qb','mobile','calendar'],
    finance: ['projects','dashboard','schedule','gantt','budget','documents','daily','issues','safety','changeorders','invoices','equipment','forecasting','risks','rfi','submittals','bids','photos','retainage','cashflow','resources','subs','logistics','notif','approvals','milestones','products','meetings','reqs','weather','qb','mobile','calendar'],
    owner: ['projects','dashboard','schedule','gantt','budget','documents','daily','issues','safety','changeorders','invoices','equipment','forecasting','risks','rfi','submittals','bids','photos','retainage','cashflow','resources','subs','logistics','notif','approvals','milestones','products','meetings','reqs','weather','qb','mobile','calendar'],
  };

  const log = async (action, detail, view) => {
    const entry = {
      ts: new Date().toISOString(),
      user: currentUser?.email,
      action,
      detail,
      view
    };
    auditLog.push(entry);
    if(auditLog.length > 500) auditLog = auditLog.slice(-500);
    localStorage.setItem('dr_audit', JSON.stringify(auditLog));
    
    if(firebaseAvailable && db) {
      try {
        await db.collection('audit_log').add(entry);
      } catch(e) {
        console.error('Audit log error:', e);
      }
    }
  };

  const login = async (email, password) => {
    if(firebaseAvailable && auth) {
      try {
        const result = await auth.signInWithEmailAndPassword(email, password);
        const userDoc = await db.collection('users').doc(result.user.uid).get();
        if(userDoc.exists) {
          currentUser = {uid: result.user.uid, email, ...userDoc.data()};
          localStorage.setItem('dr_user', JSON.stringify(currentUser));
          log('LOGIN', `Logged in as ${userDoc.data().role}`, 'auth');
          return {ok:true, user:currentUser};
        }
        return {ok:false, err:'User profile not found'};
      } catch(e) {
        return {ok:false, err:e.message};
      }
    } else {
      // Fallback: demo mode
      const demoUsers = {
        'pm@dunrite.com': {name:'Sarah Johnson', role:'pm', title:'Project Manager'},
        'super@dunrite.com': {name:'Mike Torres', role:'super', title:'Superintendent'},
        'finance@dunrite.com': {name:'Lisa Chen', role:'finance', title:'Finance Director'},
        'owner@dunrite.com': {name:'David Wilson', role:'owner', title:'Principal'},
        'roryulloa@gmail.com': {name:'Rory Ulloa', role:'admin', title:'Administrator'},
      };
      const u = demoUsers[email];
      if(!u) return {ok:false, err:'User not found (demo mode). Try pm@dunrite.com'};
      currentUser = {email, ...u};
      localStorage.setItem('dr_user', JSON.stringify(currentUser));
      log('LOGIN', `Logged in as ${u.role}`, 'auth');
      return {ok:true, user:currentUser};
    }
  };

  const logout = async () => {
    try {
      log('LOGOUT', '', 'auth');
      if(firebaseAvailable && auth) await auth.signOut();
      currentUser = null;
      localStorage.removeItem('dr_user');
      auditLog = [];
      localStorage.removeItem('dr_audit');
      return {ok:true};
    } catch(e) {
      return {ok:false, err:e.message};
    }
  };

  const canView = (viewId) => {
    if(!currentUser) return false;
    const perms = PERMS[currentUser.role] || [];
    return perms.includes(viewId);
  };

  const isAdmin = () => currentUser?.role === 'admin';

  const sendInvite = async (email, role) => {
    if(!isAdmin()) return {ok:false, err:'Only admins can invite'};
    if(!['pm','super','finance','owner'].includes(role)) return {ok:false, err:'Invalid role'};
    
    const inv = {
      id: Math.random().toString(36).slice(2,11),
      email,
      role,
      sentBy: currentUser.email,
      sentAt: new Date().toISOString(),
      status: 'pending',
      inviteCode: Math.random().toString(36).slice(2,11)
    };
    
    if(firebaseAvailable && db) {
      try {
        const doc = await db.collection('invites').add(inv);
        log('INVITE_SENT', `Invited ${email} as ${role}`, 'admin');
        return {ok:true, invite:{id:doc.id, ...inv}};
      } catch(e) {
        return {ok:false, err:e.message};
      }
    } else {
      localStorage.setItem('dr_invites', JSON.stringify([
        ...(JSON.parse(localStorage.getItem('dr_invites')) || []),
        inv
      ]));
      log('INVITE_SENT', `Invited ${email} as ${role}`, 'admin');
      return {ok:true, invite:inv};
    }
  };

  const getInvites = async () => {
    if(!isAdmin()) return [];
    if(firebaseAvailable && db) {
      try {
        const snap = await db.collection('invites').where('status','==','pending').get();
        return snap.docs.map(d=>({id:d.id, ...d.data()}));
      } catch(e) {
        console.error('Error fetching invites:', e);
        return [];
      }
    } else {
      return (JSON.parse(localStorage.getItem('dr_invites')) || []).filter(i=>i.status==='pending');
    }
  };

  const getUser = () => currentUser;
  const getAudit = async () => {
    if(firebaseAvailable && db) {
      try {
        const snap = await db.collection('audit_log').orderBy('ts','desc').limit(100).get();
        return snap.docs.map(d=>d.data());
      } catch(e) {
        return auditLog;
      }
    } else {
      return auditLog;
    }
  };

  return {login, logout, canView, isAdmin, sendInvite, getInvites, getUser, getAudit, log};
})();

