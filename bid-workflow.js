/* Bid Workflow Engine - SOP Automation */

window.BidWorkflow = (function(){
  
  // Define workflow states and transitions
  const WORKFLOW_STATES = {
    DRAFT: 'draft',
    SUBMITTED: 'submitted',
    UNDER_REVIEW: 'under_review',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    REVISED: 'revised',
    AWARDED: 'awarded',
    ARCHIVED: 'archived'
  };

  // Approval chain template
  const APPROVAL_CHAIN = [
    { role: 'Project Manager', required: true, order: 1 },
    { role: 'Finance Manager', required: true, order: 2 },
    { role: 'Owner', required: false, order: 3 }
  ];

  // Workflow rules
  const canTransition = (currentState, targetState, userRole) => {
    const rules = {
      [WORKFLOW_STATES.DRAFT]: [WORKFLOW_STATES.SUBMITTED, WORKFLOW_STATES.ARCHIVED],
      [WORKFLOW_STATES.SUBMITTED]: [WORKFLOW_STATES.UNDER_REVIEW, WORKFLOW_STATES.REVISED],
      [WORKFLOW_STATES.UNDER_REVIEW]: [WORKFLOW_STATES.APPROVED, WORKFLOW_STATES.REJECTED, WORKFLOW_STATES.REVISED],
      [WORKFLOW_STATES.REJECTED]: [WORKFLOW_STATES.REVISED, WORKFLOW_STATES.ARCHIVED],
      [WORKFLOW_STATES.REVISED]: [WORKFLOW_STATES.SUBMITTED, WORKFLOW_STATES.ARCHIVED],
      [WORKFLOW_STATES.APPROVED]: [WORKFLOW_STATES.AWARDED, WORKFLOW_STATES.ARCHIVED],
      [WORKFLOW_STATES.AWARDED]: [WORKFLOW_STATES.ARCHIVED],
    };
    
    return (rules[currentState] || []).includes(targetState);
  };

  // Create approval record
  const createApproval = (role, approver) => ({
    id: 'APR-' + Date.now(),
    role,
    approver,
    approvedAt: null,
    status: 'pending', // pending, approved, rejected
    notes: '',
    completedBy: null
  });

  // Initialize approval chain for bid
  const initializeApprovalChain = (bid, approvers = {}) => {
    return APPROVAL_CHAIN.map(step => ({
      ...step,
      approver: approvers[step.role] || null,
      id: 'APR-' + Date.now() + '-' + step.order,
      status: 'pending',
      approvedAt: null,
      notes: ''
    }));
  };

  // Complete approval step
  const approveStep = (approvals, stepId, approvedBy, notes = '') => {
    const updated = [...approvals];
    const step = updated.find(a => a.id === stepId);
    if (step) {
      step.status = 'approved';
      step.approvedAt = new Date().toISOString();
      step.completedBy = approvedBy;
      step.notes = notes;
    }
    return updated;
  };

  // Reject approval step
  const rejectStep = (approvals, stepId, rejectedBy, reason = '') => {
    const updated = [...approvals];
    const step = updated.find(a => a.id === stepId);
    if (step) {
      step.status = 'rejected';
      step.approvedAt = new Date().toISOString();
      step.completedBy = rejectedBy;
      step.notes = reason;
    }
    return updated;
  };

  // Check if all required approvals are complete
  const allApprovalsComplete = (approvals) => {
    const required = approvals.filter(a => a.required);
    return required.length > 0 && required.every(a => a.status === 'approved');
  };

  // Get approval status summary
  const getApprovalStatus = (approvals) => {
    const total = approvals.length;
    const approved = approvals.filter(a => a.status === 'approved').length;
    const rejected = approvals.filter(a => a.status === 'rejected').length;
    const pending = approvals.filter(a => a.status === 'pending').length;
    
    return { total, approved, rejected, pending, complete: allApprovalsComplete(approvals) };
  };

  // Notification event types
  const NOTIFICATION_EVENTS = {
    BID_SUBMITTED: 'bid_submitted',
    BID_APPROVED: 'bid_approved',
    BID_REJECTED: 'bid_rejected',
    APPROVAL_REQUESTED: 'approval_requested',
    APPROVAL_COMPLETED: 'approval_completed',
    BID_AWARDED: 'bid_awarded',
    REVISION_REQUESTED: 'revision_requested'
  };

  // Create notification
  const createNotification = (eventType, bidId, recipientRole, data = {}) => ({
    id: 'NOTIF-' + Date.now(),
    eventType,
    bidId,
    recipientRole,
    createdAt: new Date().toISOString(),
    sent: false,
    sentAt: null,
    data,
    read: false
  });

  // Create revision snapshot
  const createRevision = (bid, reason, changedBy) => ({
    id: 'REV-' + Date.now(),
    version: bid.version,
    createdAt: new Date().toISOString(),
    reason,
    changedBy,
    snapshot: JSON.parse(JSON.stringify(bid)),
    changes: [] // Track what specifically changed
  });

  return {
    WORKFLOW_STATES,
    APPROVAL_CHAIN,
    NOTIFICATION_EVENTS,
    canTransition,
    initializeApprovalChain,
    approveStep,
    rejectStep,
    allApprovalsComplete,
    getApprovalStatus,
    createNotification,
    createRevision,
    createApproval
  };
})();
