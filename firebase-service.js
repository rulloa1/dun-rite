/* Firebase Service Layer — Handles all data/auth operations */

window.FirebaseService = (function() {
  const db = window.db;
  const auth = window.auth;

  // ============ AUTH ============
  const login = async (email, password) => {
    try {
      const result = await auth.signInWithEmailAndPassword(email, password);
      const user = await getUserRole(result.user.uid);
      logAction('LOGIN', `User ${email} logged in`, user.role);
      return {ok: true, user: {...result.user, role: user.role}};
    } catch(err) {
      return {ok: false, err: err.message};
    }
  };

  const logout = async () => {
    try {
      const user = auth.currentUser;
      logAction('LOGOUT', `User logged out`, 'user');
      await auth.signOut();
      return {ok: true};
    } catch(err) {
      return {ok: false, err: err.message};
    }
  };

  const getCurrentUser = () => {
    return new Promise((resolve) => {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          const role = await getUserRole(user.uid);
          resolve({...user.toJSON(), role: role.role});
        } else {
          resolve(null);
        }
      });
    });
  };

  const getUserRole = async (uid) => {
    try {
      const doc = await db.collection('users').doc(uid).get();
      return doc.exists ? doc.data() : {role: 'viewer'};
    } catch(err) {
      console.error('Error fetching user role:', err);
      return {role: 'viewer'};
    }
  };

  // ============ USERS (Admin) ============
  const addUser = async (email, name, role) => {
    try {
      const usersRef = db.collection('users');
      const existing = await usersRef.where('email', '==', email).get();
      if (!existing.empty) return {ok: false, err: 'User already exists'};

      const user = {
        email,
        name,
        role,
        createdAt: new Date().toISOString(),
        status: 'active'
      };

      await usersRef.add(user);
      logAction('USER_CREATED', `Added ${name} as ${role}`, 'admin');
      return {ok: true, user};
    } catch(err) {
      return {ok: false, err: err.message};
    }
  };

  const getUsers = async () => {
    try {
      const snap = await db.collection('users').get();
      return snap.docs.map(d => ({...d.data(), id: d.id}));
    } catch(err) {
      console.error('Error fetching users:', err);
      return [];
    }
  };

  const deleteUser = async (userId) => {
    try {
      await db.collection('users').doc(userId).delete();
      logAction('USER_DELETED', `Deleted user ${userId}`, 'admin');
      return {ok: true};
    } catch(err) {
      return {ok: false, err: err.message};
    }
  };

  // ============ BIDS ============
  const getBids = async (projectId = 'longleaf') => {
    try {
      const snap = await db.collection('projects').doc(projectId).collection('bids').get();
      return snap.docs.map(d => ({...d.data(), id: d.id}));
    } catch(err) {
      console.error('Error fetching bids:', err);
      return [];
    }
  };

  const updateBidStatus = async (projectId, bidId, status) => {
    try {
      await db.collection('projects').doc(projectId).collection('bids').doc(bidId).update({
        status,
        updatedAt: new Date().toISOString()
      });
      logAction('BID_UPDATED', `Bid ${bidId} status → ${status}`, 'pm');
      return {ok: true};
    } catch(err) {
      return {ok: false, err: err.message};
    }
  };

  const addBid = async (projectId, vendor, trade, amount) => {
    try {
      const bid = {
        vendor,
        trade,
        amount,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      const ref = await db.collection('projects').doc(projectId).collection('bids').add(bid);
      logAction('BID_CREATED', `New bid from ${vendor}`, 'pm');
      return {ok: true, id: ref.id};
    } catch(err) {
      return {ok: false, err: err.message};
    }
  };

  // ============ SCHEDULE ============
  const getSchedule = async (projectId = 'longleaf') => {
    try {
      const snap = await db.collection('projects').doc(projectId).collection('schedule').get();
      return snap.docs.map(d => ({...d.data(), id: d.id}));
    } catch(err) {
      console.error('Error fetching schedule:', err);
      return [];
    }
  };

  const updateMilestone = async (projectId, milestoneId, updates) => {
    try {
      await db.collection('projects').doc(projectId).collection('schedule').doc(milestoneId).update({
        ...updates,
        updatedAt: new Date().toISOString()
      });
      logAction('MILESTONE_UPDATED', `Milestone ${milestoneId} updated`, 'pm');
      return {ok: true};
    } catch(err) {
      return {ok: false, err: err.message};
    }
  };

  // ============ BUDGET ============
  const getBudget = async (projectId = 'longleaf') => {
    try {
      const snap = await db.collection('projects').doc(projectId).collection('budget').get();
      return snap.docs.map(d => ({...d.data(), id: d.id}));
    } catch(err) {
      console.error('Error fetching budget:', err);
      return [];
    }
  };

  // ============ AUDIT LOG ============
  const logAction = async (action, description, actor) => {
    try {
      await db.collection('auditLog').add({
        action,
        description,
        actor,
        timestamp: new Date().toISOString()
      });
    } catch(err) {
      console.error('Error logging action:', err);
    }
  };

  const getAuditLog = async (limit = 100) => {
    try {
      const snap = await db.collection('auditLog')
        .orderBy('timestamp', 'desc')
        .limit(limit)
        .get();
      return snap.docs.map(d => d.data());
    } catch(err) {
      console.error('Error fetching audit log:', err);
      return [];
    }
  };

  // ============ INVITES ============
  const sendInvite = async (email, role) => {
    try {
      const inviteCode = Math.random().toString(36).slice(2, 10).toUpperCase();
      await db.collection('invites').add({
        email,
        role,
        code: inviteCode,
        status: 'pending',
        sentAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      });
      // TODO: Send email with invite code
      logAction('INVITE_SENT', `Invite sent to ${email}`, 'admin');
      return {ok: true, code: inviteCode};
    } catch(err) {
      return {ok: false, err: err.message};
    }
  };

  const getInvites = async () => {
    try {
      const snap = await db.collection('invites').get();
      return snap.docs.map(d => ({...d.data(), id: d.id}));
    } catch(err) {
      console.error('Error fetching invites:', err);
      return [];
    }
  };

  // ============ Real-time Listeners ============
  const onBidsChange = (projectId = 'longleaf', callback) => {
    return db.collection('projects').doc(projectId).collection('bids')
      .onSnapshot(snap => {
        callback(snap.docs.map(d => ({...d.data(), id: d.id})));
      });
  };

  const onScheduleChange = (projectId = 'longleaf', callback) => {
    return db.collection('projects').doc(projectId).collection('schedule')
      .onSnapshot(snap => {
        callback(snap.docs.map(d => ({...d.data(), id: d.id})));
      });
  };

  return {
    // Auth
    login,
    logout,
    getCurrentUser,
    getUserRole,
    // Users
    addUser,
    getUsers,
    deleteUser,
    // Bids
    getBids,
    updateBidStatus,
    addBid,
    onBidsChange,
    // Schedule
    getSchedule,
    updateMilestone,
    onScheduleChange,
    // Budget
    getBudget,
    // Audit
    logAction,
    getAuditLog,
    // Invites
    sendInvite,
    getInvites
  };
})();
