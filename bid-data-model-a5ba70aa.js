/* Bid Data Model - Comprehensive bid structure matching DunRite template */
window.BidDataModel = (function(){
  
  const createEmptyBid = (projectId, bidId, existingData = {}) => ({
    // Metadata
    id: bidId || 'BID-' + Date.now(),
    vendor: existingData.vendor || '',
    trade: existingData.trade || '',
    projectId: projectId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1,
    status: existingData.status || 'draft', // draft, submitted, approved, rejected, revised, Done, Not Returned
    approvalStatus: 'pending', // pending, approved, rejected
    
    // Project Info
    projectInfo: {
      projectName: existingData.projectName || '',
      projectNumber: '',
      location: '',
      owner: '',
      architect: '',
      bidDate: '',
      bidDueDate: '',
      description: ''
    },
    
    // Bidder Info
    bidderInfo: {
      company: existingData.vendor || '',
      contactName: '',
      contactTitle: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      license: '',
      insurance: ''
    },
    
    // Scope of Work
    scope: {
      description: '',
      inclusions: [],
      exclusions: [],
      assumptions: []
    },
    
    // Line Items & Cost Breakdown
    lineItems: existingData.lineItems || [
      // {id, description, unit, quantity, unitPrice, total, category}
    ],
    
    // Summary
    summary: {
      subtotal: 0,
      contingency: {
        amount: 0,
        percentage: 0
      },
      allowances: {
        amount: 0,
        description: ''
      },
      tax: {
        amount: 0,
        percentage: 0
      },
      total: existingData.amt || 0
    },
    
    // Schedule
    schedule: {
      startDate: '',
      completionDate: '',
      duration: 0,
      durationUnit: 'days', // days, weeks, months
      phasing: []
    },
    
    // Terms & Conditions
    terms: {
      paymentTerms: '',
      retainagePercentage: 0,
      warrantyPeriod: '',
      warrantySummary: '',
      insurance: '',
      bonding: '',
      otherConditions: ''
    },
    
    // Attachments & References
    attachments: [],
    notes: '',
    
    // Approval Chain
    approvals: [
      // {approver, approvedAt, status, notes}
    ],
    
    // Revisions History
    revisions: []
  });

  const calculateSummary = (bid) => {
    const subtotal = bid.lineItems.reduce((sum, item) => sum + (item.total || 0), 0);
    const contingencyAmount = bid.summary.contingency.percentage > 0 
      ? (subtotal * bid.summary.contingency.percentage / 100)
      : bid.summary.contingency.amount;
    const allowancesAmount = bid.summary.allowances.amount || 0;
    const taxAmount = bid.summary.tax.percentage > 0
      ? ((subtotal + contingencyAmount + allowancesAmount) * bid.summary.tax.percentage / 100)
      : bid.summary.tax.amount;
    const total = subtotal + contingencyAmount + allowancesAmount + taxAmount;
    
    return {
      subtotal,
      contingency: { ...bid.summary.contingency, amount: contingencyAmount },
      allowances: { ...bid.summary.allowances, amount: allowancesAmount },
      tax: { ...bid.summary.tax, amount: taxAmount },
      total
    };
  };

  const addLineItem = (bid, item) => {
    const newItem = {
      id: 'LI-' + Date.now(),
      description: item.description || '',
      unit: item.unit || 'ea',
      quantity: item.quantity || 1,
      unitPrice: item.unitPrice || 0,
      category: item.category || 'General',
      ...item
    };
    newItem.total = newItem.quantity * newItem.unitPrice;
    bid.lineItems.push(newItem);
    bid.summary = calculateSummary(bid);
    return bid;
  };

  const updateLineItem = (bid, itemId, updates) => {
    const item = bid.lineItems.find(li => li.id === itemId);
    if (item) {
      Object.assign(item, updates);
      item.total = item.quantity * item.unitPrice;
      bid.summary = calculateSummary(bid);
    }
    return bid;
  };

  const removeLineItem = (bid, itemId) => {
    bid.lineItems = bid.lineItems.filter(li => li.id !== itemId);
    bid.summary = calculateSummary(bid);
    return bid;
  };

  const createRevision = (bid, reason = '') => {
    const revision = {
      version: bid.version,
      createdAt: bid.updatedAt,
      reason,
      snapshot: JSON.parse(JSON.stringify(bid))
    };
    bid.revisions.push(revision);
    bid.version += 1;
    bid.status = 'draft';
    bid.approvalStatus = 'pending';
    bid.updatedAt = new Date().toISOString();
    return bid;
  };

  return {
    createEmptyBid,
    calculateSummary,
    addLineItem,
    updateLineItem,
    removeLineItem,
    createRevision
  };
})();
