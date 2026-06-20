/* Enhanced Bid Form with Workflow, Approvals & Notifications */

function EnhancedBidFormView({ bid = null, onSave, onCancel, readOnly = false, currentUser = 'PM' }) {
  const [currentBid, setCurrentBid] = React.useState(
    bid || window.BidDataModel.createEmptyBid('', '')
  );
  const [activeTab, setActiveTab] = React.useState('project');
  const [editingLineItem, setEditingLineItem] = React.useState(null);
  const [showLineItemForm, setShowLineItemForm] = React.useState(false);
  const [approvals, setApprovals] = React.useState(
    bid?.approvals || window.BidWorkflow.initializeApprovalChain(bid)
  );
  const [showApprovalPanel, setShowApprovalPanel] = React.useState(false);
  const [approvalNotes, setApprovalNotes] = React.useState('');
  const [notifications, setNotifications] = React.useState([]);

  const updateBid = (path, value) => {
    const updated = JSON.parse(JSON.stringify(currentBid));
    const keys = path.split('.');
    let obj = updated;
    for (let i = 0; i < keys.length - 1; i++) {
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;
    setCurrentBid(updated);
  };

  const handleSubmitBid = () => {
    if (confirm('Submit this bid for approval?')) {
      const updated = JSON.parse(JSON.stringify(currentBid));
      updated.status = 'submitted';
      updated.submittedAt = new Date().toISOString();
      setCurrentBid(updated);
      
      // Create notification
      const notif = window.BidWorkflow.createNotification(
        window.BidWorkflow.NOTIFICATION_EVENTS.BID_SUBMITTED,
        updated.id,
        'Project Manager',
        { vendor: updated.vendor, amount: updated.summary.total }
      );
      setNotifications([notif, ...notifications]);
      
      if (onSave) onSave(updated);
    }
  };

  const handleApproveStep = (stepId) => {
    const updated = window.BidWorkflow.approveStep(approvals, stepId, currentUser, approvalNotes);
    setApprovals(updated);
    setApprovalNotes('');
    
    const status = window.BidWorkflow.getApprovalStatus(updated);
    if (status.complete) {
      const bidUpdated = JSON.parse(JSON.stringify(currentBid));
      bidUpdated.status = 'approved';
      bidUpdated.approvalStatus = 'approved';
      setCurrentBid(bidUpdated);
      
      const notif = window.BidWorkflow.createNotification(
        window.BidWorkflow.NOTIFICATION_EVENTS.BID_APPROVED,
        bidUpdated.id,
        'Owner',
        { vendor: bidUpdated.vendor }
      );
      setNotifications([notif, ...notifications]);
    }
  };

  const handleRejectStep = (stepId) => {
    const updated = window.BidWorkflow.rejectStep(approvals, stepId, currentUser, approvalNotes);
    setApprovals(updated);
    setApprovalNotes('');
    
    const bidUpdated = JSON.parse(JSON.stringify(currentBid));
    bidUpdated.status = 'rejected';
    setCurrentBid(bidUpdated);
    
    const notif = window.BidWorkflow.createNotification(
      window.BidWorkflow.NOTIFICATION_EVENTS.BID_REJECTED,
      bidUpdated.id,
      'Project Manager',
      { vendor: bidUpdated.vendor, reason: approvalNotes }
    );
    setNotifications([notif, ...notifications]);
  };

  const handleAddLineItem = (item) => {
    const updated = JSON.parse(JSON.stringify(currentBid));
    window.BidDataModel.addLineItem(updated, item);
    setCurrentBid(updated);
    setShowLineItemForm(false);
  };

  const handleRemoveLineItem = (itemId) => {
    const updated = JSON.parse(JSON.stringify(currentBid));
    window.BidDataModel.removeLineItem(updated, itemId);
    setCurrentBid(updated);
  };

  const handleExportPDF = () => {
    window.BidPDFExport.openForPrint(currentBid);
  };

  const handleExportCSV = () => {
    const csv = window.BidExcelIntegration.generateLineItemsCSV(currentBid);
    window.BidExcelIntegration.downloadCSV(`${currentBid.id}_LineItems.csv`, csv);
  };

  const usd = (n) => '$' + Math.round(n).toLocaleString('en-US');
  const approvalStatus = window.BidWorkflow.getApprovalStatus(approvals);

  return React.createElement('div', { className: 'enhanced-bid-form' },
    // Header with status and actions
    React.createElement('div', { className: 'bid-form-header' },
      React.createElement('div', { className: 'bid-form-header-left' },
        React.createElement('h2', null, currentBid.id),
        React.createElement('div', { className: 'bid-form-meta' },
          React.createElement('span', { className: 'bid-status ' + currentBid.status },
            currentBid.status.charAt(0).toUpperCase() + currentBid.status.slice(1)
          ),
          React.createElement('span', { className: 'bid-vendor' }, currentBid.vendor || 'Untitled'),
          React.createElement('span', { className: 'bid-amount' }, usd(currentBid.summary.total))
        )
      ),
      React.createElement('div', { className: 'bid-form-actions' },
        React.createElement('button', {
          className: 'btn btn--secondary',
          onClick: handleExportPDF
        }, '📄 PDF'),
        React.createElement('button', {
          className: 'btn btn--secondary',
          onClick: handleExportCSV
        }, '📊 Export'),
        !readOnly && currentBid.status === 'draft' && React.createElement('button', {
          className: 'btn btn--primary',
          onClick: handleSubmitBid
        }, '✓ Submit for Review')
      )
    ),

    // Approval Status Panel
    currentBid.status !== 'draft' && React.createElement('div', { className: 'approval-panel' },
      React.createElement('div', { className: 'approval-header' },
        React.createElement('h4', null, 'Approval Status'),
        React.createElement('span', { className: 'approval-badge ' + (approvalStatus.complete ? 'complete' : 'pending') },
          approvalStatus.approved + '/' + approvalStatus.total + ' approvals'
        )
      ),
      React.createElement('div', { className: 'approval-steps' },
        approvals.map(step =>
          React.createElement('div', { key: step.id, className: 'approval-step ' + step.status },
            React.createElement('div', { className: 'approval-step-header' },
              React.createElement('span', { className: 'approval-role' }, step.role),
              React.createElement('span', { className: 'approval-status-badge ' + step.status },
                step.status === 'pending' ? '⏱ Pending' : 
                step.status === 'approved' ? '✓ Approved' :
                '✕ Rejected'
              )
            ),
            step.status === 'pending' && currentUser === 'PM' && React.createElement('div', { className: 'approval-actions' },
              React.createElement('button', {
                className: 'btn btn--sm btn--approve',
                onClick: () => handleApproveStep(step.id)
              }, 'Approve'),
              React.createElement('button', {
                className: 'btn btn--sm btn--reject',
                onClick: () => handleRejectStep(step.id)
              }, 'Reject')
            ),
            (step.status === 'approved' || step.status === 'rejected') && React.createElement('div', { className: 'approval-notes' },
              React.createElement('small', null, step.completedBy + ' · ' + new Date(step.approvedAt).toLocaleDateString()),
              step.notes && React.createElement('p', null, step.notes)
            )
          )
        )
      )
    ),

    // Notifications
    notifications.length > 0 && React.createElement('div', { className: 'notifications-panel' },
      notifications.slice(0, 3).map(notif =>
        React.createElement('div', { key: notif.id, className: 'notification ' + notif.eventType },
          React.createElement('span', null,
            notif.eventType === 'bid_submitted' ? '📤 Bid submitted for review' :
            notif.eventType === 'bid_approved' ? '✓ Bid approved' :
            notif.eventType === 'bid_rejected' ? '✕ Bid rejected' :
            'Notification'
          )
        )
      )
    ),

    // Tabs
    React.createElement('div', { className: 'bid-tabs' },
      ['project', 'bidder', 'scope', 'lineItems', 'summary', 'schedule', 'terms'].map(tab =>
        React.createElement('button', {
          key: tab,
          className: 'bid-tab ' + (activeTab === tab ? 'is-active' : ''),
          onClick: () => setActiveTab(tab)
        }, tab.replace(/([A-Z])/g, ' $1').trim())
      )
    ),

    // Form Content
    React.createElement('div', { className: 'bid-form-content' },
      // Project Info Tab
      activeTab === 'project' && React.createElement('div', { className: 'form-section' },
        React.createElement('h3', null, 'Project Information'),
        React.createElement('div', { className: 'form-grid' },
          React.createElement(FormField, {
            label: 'Project Name',
            value: currentBid.projectInfo.projectName,
            onChange: (v) => updateBid('projectInfo.projectName', v),
            readOnly
          }),
          React.createElement(FormField, {
            label: 'Trade',
            value: currentBid.trade,
            onChange: (v) => updateBid('trade', v),
            readOnly
          })
        ),
        React.createElement(FormField, {
          label: 'Description',
          value: currentBid.scope.description,
          onChange: (v) => updateBid('scope.description', v),
          textarea: true,
          readOnly
        })
      ),

      // Line Items Tab
      activeTab === 'lineItems' && React.createElement('div', { className: 'form-section' },
        React.createElement('h3', null, 'Cost Breakdown'),
        !readOnly && React.createElement('button', {
          className: 'btn btn--primary',
          onClick: () => setShowLineItemForm(!showLineItemForm)
        }, showLineItemForm ? 'Cancel' : '+ Add Item'),

        showLineItemForm && React.createElement(LineItemForm, {
          onSubmit: handleAddLineItem,
          onCancel: () => setShowLineItemForm(false)
        }),

        currentBid.lineItems.length > 0 && React.createElement('table', { className: 'bid-line-items-table' },
          React.createElement('thead', null,
            React.createElement('tr', null,
              React.createElement('th', null, 'Description'),
              React.createElement('th', { style: { width: 80 } }, 'Unit'),
              React.createElement('th', { style: { width: 60 } }, 'Qty'),
              React.createElement('th', { style: { width: 100, textAlign: 'right' } }, 'Unit Price'),
              React.createElement('th', { style: { width: 100, textAlign: 'right' } }, 'Total'),
              !readOnly && React.createElement('th', { style: { width: 80 } }, 'Actions')
            )
          ),
          React.createElement('tbody', null,
            currentBid.lineItems.map(item =>
              React.createElement('tr', { key: item.id },
                React.createElement('td', null, item.description),
                React.createElement('td', null, item.unit),
                React.createElement('td', { style: { textAlign: 'right' } }, item.quantity),
                React.createElement('td', { style: { textAlign: 'right' } }, usd(item.unitPrice)),
                React.createElement('td', { style: { textAlign: 'right', fontWeight: 600 } }, usd(item.total)),
                !readOnly && React.createElement('td', null,
                  React.createElement('button', {
                    className: 'btn btn--sm btn--danger',
                    onClick: () => handleRemoveLineItem(item.id)
                  }, 'Remove')
                )
              )
            )
          )
        )
      ),

      // Summary Tab
      activeTab === 'summary' && React.createElement('div', { className: 'form-section' },
        React.createElement('h3', null, 'Cost Summary'),
        React.createElement('div', { className: 'summary-table' },
          React.createElement('div', { className: 'summary-row' },
            React.createElement('span', null, 'Subtotal'),
            React.createElement('span', { className: 'amount' }, usd(currentBid.summary.subtotal))
          ),
          React.createElement('div', { className: 'summary-row' },
            React.createElement('span', null, 'Contingency'),
            React.createElement('span', { className: 'amount' }, usd(currentBid.summary.contingency.amount))
          ),
          React.createElement('div', { className: 'summary-row' },
            React.createElement('span', null, 'Allowances'),
            React.createElement('span', { className: 'amount' }, usd(currentBid.summary.allowances.amount))
          ),
          React.createElement('div', { className: 'summary-row' },
            React.createElement('span', null, 'Tax'),
            React.createElement('span', { className: 'amount' }, usd(currentBid.summary.tax.amount))
          ),
          React.createElement('div', { className: 'summary-row summary-total' },
            React.createElement('span', null, 'TOTAL'),
            React.createElement('span', { className: 'amount' }, usd(currentBid.summary.total))
          )
        )
      )
    ),

    // Footer
    React.createElement('div', { className: 'bid-form-footer' },
      !readOnly && currentBid.status === 'draft' && React.createElement('button', {
        className: 'btn btn--primary',
        onClick: () => onSave && onSave(currentBid)
      }, 'Save Draft'),
      React.createElement('button', {
        className: 'btn',
        onClick: onCancel
      }, 'Close')
    )
  );
}

Object.assign(window, { EnhancedBidFormView });
