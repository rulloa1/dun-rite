/* Firebase + SSO Auth */
// Firebase config (replace with your actual config)
const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyDunRiteDemo',
  authDomain: 'dunrite-demo.firebaseapp.com',
  projectId: 'dunrite-demo',
  storageBucket: 'dunrite-demo.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:abc123def456'
};

window.AUTH = (function(){
  const USERS = {
    'pm@dunrite.com': {name:'Sarah Johnson', role:'pm', title:'Project Manager'},
    'super@dunrite.com': {name:'Mike Torres', role:'super', title:'Superintendent'},
    'finance@dunrite.com': {name:'Lisa Chen', role:'finance', title:'Finance Director'},
    'owner@dunrite.com': {name:'David Wilson', role:'owner', title:'Principal'},
    'admin@dunrite.com': {name:'Admin User', role:'admin', title:'Administrator'},
    'roryulloa@gmail.com': {name:'Rory Ulloa', role:'admin', title:'Administrator'},
    'mike.rcccon@yahoo.com': {name:'Michael Chandler', role:'admin', title:'Administrator'},
  };

  const PERMS = {
    admin: ['projects','dashboard','schedule','gantt','budget','documents','daily','issues','safety','changeorders','invoices','equipment','forecasting','risks','rfi','submittals','bids','photos','retainage','cashflow','resources','subs','logistics','notif','approvals','milestones','products','meetings','reqs','weather','qb','mobile','calendar'],
    pm: ['projects','dashboard','schedule','gantt','budget','documents','daily','issues','safety','changeorders','invoices','equipment','forecasting','risks','rfi','submittals','bids','photos','retainage','cashflow','resources','subs','logistics','notif','approvals','milestones','products','meetings','reqs','weather','qb','mobile','calendar'],
    super: ['projects','dashboard','schedule','gantt','budget','documents','daily','issues','safety','changeorders','invoices','equipment','forecasting','risks','rfi','submittals','bids','photos','retainage','cashflow','resources','subs','logistics','notif','approvals','milestones','products','meetings','reqs','weather','qb','mobile','calendar'],
    finance: ['projects','dashboard','schedule','gantt','budget','documents','daily','issues','safety','changeorders','invoices','equipment','forecasting','risks','rfi','submittals','bids','photos','retainage','cashflow','resources','subs','logistics','notif','approvals','milestones','products','meetings','reqs','weather','qb','mobile','calendar'],
    owner: ['projects','dashboard','schedule','gantt','budget','documents','daily','issues','safety','changeorders','invoices','equipment','forecasting','risks','rfi','submittals','bids','photos','retainage','cashflow','resources','subs','logistics','notif','approvals','milestones','products','meetings','reqs','weather','qb','mobile','calendar'],
  };

  let currentUser = JSON.parse(localStorage.getItem('dr_user')) || null;
  let auditLog = JSON.parse(localStorage.getItem('dr_audit')) || [];
  let invites = JSON.parse(localStorage.getItem('dr_invites')) || [];

  const log = (action, detail, view) => {
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
  };

  const login = (email) => {
    const u = USERS[email];
    if(!u) return {ok:false, err:'User not found'};
    currentUser = {email, ...u};
    localStorage.setItem('dr_user', JSON.stringify(currentUser));
    log('LOGIN', `Logged in as ${u.role}`, 'auth');
    return {ok:true, user:currentUser};
  };

  const logout = () => {
    if(currentUser) log('LOGOUT', '', 'auth');
    currentUser = null;
    localStorage.removeItem('dr_user');
    auditLog = [];
    localStorage.removeItem('dr_audit');
  };

  const canView = (viewId) => {
    if(!currentUser) return false;
    const perms = PERMS[currentUser.role] || [];
    return perms.includes(viewId);
  };

  const isAdmin = () => currentUser?.role === 'admin';

  const sendInvite = (email, role) => {
    if(!isAdmin()) return {ok:false, err:'Only admins can invite'};
    if(!['pm','super','finance','owner'].includes(role)) return {ok:false, err:'Invalid role'};
    
    const inv = {
      id: Math.random().toString(36).slice(2,11),
      email,
      role,
      sentBy: currentUser.email,
      sentAt: new Date().toISOString(),
      status: 'pending'
    };
    invites.push(inv);
    localStorage.setItem('dr_invites', JSON.stringify(invites));
    log('INVITE_SENT', `Invited ${email} as ${role}`, 'admin');
    return {ok:true, invite:inv};
  };

  const acceptInvite = (inviteId, email) => {
    const inv = invites.find(i=>i.id===inviteId);
    if(!inv) return {ok:false, err:'Invite not found'};
    if(inv.email !== email) return {ok:false, err:'Email mismatch'};
    if(inv.status !== 'pending') return {ok:false, err:'Invite already used'};
    
    const roleMap = {pm:'Project Manager',super:'Superintendent',finance:'Finance Director',owner:'Principal'};
    USERS[email] = {name:email.split('@')[0], role:inv.role, title:roleMap[inv.role]};
    inv.status = 'accepted';
    invites = invites.map(i=>i.id===inviteId?inv:i);
    localStorage.setItem('dr_invites', JSON.stringify(invites));
    localStorage.setItem('dr_users', JSON.stringify(USERS));
    log('INVITE_ACCEPTED', `${email} accepted invite`, 'admin');
    return {ok:true, user:USERS[email]};
  };

  const getInvites = () => isAdmin() ? invites : [];
  const getUser = () => currentUser;
  const getAudit = () => auditLog;

  return {login, logout, canView, isAdmin, sendInvite, acceptInvite, getInvites, getUser, getAudit, log, USERS};
})();
