/* Enhanced Bid Management System - Main View */

function BidFormView({ bid = null, onSave, onCancel, readOnly = false }) {
  const [currentBid, setCurrentBid] = React.useState(
    bid || window.BidDataModel.createEmptyBid('', '')
  );
  const [activeTab, setActiveTab] = React.useState('project');
  const [editingLineItem, setEditingLineItem] = React.useState(null);
  const [showLineItemForm, setShowLineItemForm] = React.useState(false);

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

  const handleAddLineItem = (item) => {
    const updated = JSON.parse(JSON.stringify(currentBid));
    window.BidDataModel.addLineItem(updated, item);
    setCurrentBid(updated);
    setShowLineItemForm(false);
  };

  const handleUpdateLineItem = (itemId, updates) => {
    const updated = JSON.parse(JSON.stringify(currentBid));
    window.BidDataModel.updateLineItem(updated, itemId, updates);
    setCurrentBid(updated);
    setEditingLineItem(null);
  };

  const handleRemoveLineItem = (itemId) => {
    const updated = JSON.parse(JSON.stringify(currentBid));
    window.BidDataModel.removeLineItem(updated, itemId);
    setCurrentBid(updated);
  };

  const handleSave = () => {
    if (onSave) onSave(currentBid);
  };

  const usd = (n) => '$' + Math.round(n).toLocaleString('en-US');

  return React.createElement('div', { className: 'bid-form-container' },
    React.createElement('div', { className: 'bid-form-header' },
      React.createElement('h2', null, currentBid.id),
      React.createElement('div', { className: 'bid-form-meta' },
        React.createElement('span', { className: 'bid-status ' + currentBid.status },
          currentBid.status.charAt(0).toUpperCase() + currentBid.status.slice(1)
        ),
        React.createElement('span', { className: 'bid-version' },
          'v' + currentBid.version
        )
      )
    ),

    React.createElement('div', { className: 'bid-tabs' },
      ['project', 'bidder', 'scope', 'lineItems', 'summary', 'schedule', 'terms'].map(tab =>
        React.createElement('button',
          {
            key: tab,
            className: 'bid-tab ' + (activeTab === tab ? 'is-active' : ''),
            onClick: () => setActiveTab(tab)
          },
          tab.charAt(0).toUpperCase() + tab.slice(1).replace(/([A-Z])/g, ' $1')
        )
      )
    ),

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
            label: 'Project Number',
            value: currentBid.projectInfo.projectNumber,
            onChange: (v) => updateBid('projectInfo.projectNumber', v),
            readOnly
          }),
          React.createElement(FormField, {
            label: 'Location',
            value: currentBid.projectInfo.location,
            onChange: (v) => updateBid('projectInfo.location', v),
            readOnly
          }),
          React.createElement(FormField, {
            label: 'Owner',
            value: currentBid.projectInfo.owner,
            onChange: (v) => updateBid('projectInfo.owner', v),
            readOnly
          }),
          React.createElement(FormField, {
            label: 'Architect',
            value: currentBid.projectInfo.architect,
            onChange: (v) => updateBid('projectInfo.architect', v),
            readOnly
          }),
          React.createElement(FormField, {
            label: 'Bid Date',
            type: 'date',
            value: currentBid.projectInfo.bidDate,
            onChange: (v) => updateBid('projectInfo.bidDate', v),
            readOnly
          }),
          React.createElement(FormField, {
            label: 'Bid Due Date',
            type: 'date',
            value: currentBid.projectInfo.bidDueDate,
            onChange: (v) => updateBid('projectInfo.bidDueDate', v),
            readOnly
          })
        ),
        React.createElement(FormField, {
          label: 'Project Description',
          value: currentBid.projectInfo.description,
          onChange: (v) => updateBid('projectInfo.description', v),
          textarea: true,
          readOnly
        })
      ),

      // Bidder Info Tab
      activeTab === 'bidder' && React.createElement('div', { className: 'form-section' },
        React.createElement('h3', null, 'Bidder Information'),
        React.createElement('div', { className: 'form-grid' },
          React.createElement(FormField, {
            label: 'Company Name',
            value: currentBid.bidderInfo.company,
            onChange: (v) => updateBid('bidderInfo.company', v),
            readOnly
          }),
          React.createElement(FormField, {
            label: 'Contact Name',
            value: currentBid.bidderInfo.contactName,
            onChange: (v) => updateBid('bidderInfo.contactName', v),
            readOnly
          }),
          React.createElement(FormField, {
            label: 'Contact Title',
            value: currentBid.bidderInfo.contactTitle,
            onChange: (v) => updateBid('bidderInfo.contactTitle', v),
            readOnly
          }),
          React.createElement(FormField, {
            label: 'Phone',
            type: 'tel',
            value: currentBid.bidderInfo.phone,
            onChange: (v) => updateBid('bidderInfo.phone', v),
            readOnly
          }),
          React.createElement(FormField, {
            label: 'Email',
            type: 'email',
            value: currentBid.bidderInfo.email,
            onChange: (v) => updateBid('bidderInfo.email', v),
            readOnly
          }),
          React.createElement(FormField, {
            label: 'License #',
            value: currentBid.bidderInfo.license,
            onChange: (v) => updateBid('bidderInfo.license', v),
            readOnly
          })
        ),
        React.createElement('div', { className: 'form-grid' },
          React.createElement(FormField, {
            label: 'Address',
            value: currentBid.bidderInfo.address,
            onChange: (v) => updateBid('bidderInfo.address', v),
            readOnly
          }),
          React.createElement(FormField, {
            label: 'City',
            value: currentBid.bidderInfo.city,
            onChange: (v) => updateBid('bidderInfo.city', v),
            readOnly
          }),
          React.createElement(FormField, {
            label: 'State',
            value: currentBid.bidderInfo.state,
            onChange: (v) => updateBid('bidderInfo.state', v),
            readOnly
          }),
          React.createElement(FormField, {
            label: 'Zip',
            value: currentBid.bidderInfo.zip,
            onChange: (v) => updateBid('bidderInfo.zip', v),
            readOnly
          })
        ),
        React.createElement(FormField, {
          label: 'Insurance',
          value: currentBid.bidderInfo.insurance,
          onChange: (v) => updateBid('bidderInfo.insurance', v),
          textarea: true,
          readOnly
        })
      ),

      // Scope Tab
      activeTab === 'scope' && React.createElement('div', { className: 'form-section' },
        React.createElement('h3', null, 'Scope of Work'),
        React.createElement(FormField, {
          label: 'Scope Description',
          value: currentBid.scope.description,
          onChange: (v) => updateBid('scope.description', v),
          textarea: true,
          readOnly
        }),
        React.createElement('h4', null, 'Inclusions'),
        React.createElement(ListEditor, {
          items: currentBid.scope.inclusions,
          onChange: (items) => updateBid('scope.inclusions', items),
          readOnly
        }),
        React.createElement('h4', null, 'Exclusions'),
        React.createElement(ListEditor, {
          items: currentBid.scope.exclusions,
          onChange: (items) => updateBid('scope.exclusions', items),
          readOnly
        }),
        React.createElement('h4', null, 'Assumptions'),
        React.createElement(ListEditor, {
          items: currentBid.scope.assumptions,
          onChange: (items) => updateBid('scope.assumptions', items),
          readOnly
        })
      ),

      // Line Items Tab
      activeTab === 'lineItems' && React.createElement('div', { className: 'form-section' },
        React.createElement('h3', null, 'Cost Breakdown'),
        !readOnly && React.createElement('button', {
          className: 'btn btn--primary',
          onClick: () => setShowLineItemForm(!showLineItemForm)
        }, showLineItemForm ? 'Cancel' : '+ Add Line Item'),

        showLineItemForm && React.createElement(LineItemForm, {
          onSubmit: handleAddLineItem,
          onCancel: () => setShowLineItemForm(false)
        }),

        currentBid.lineItems.length > 0 && React.createElement('table', { className: 'bid-line-items-table' },
          React.createElement('thead', null,
            React.createElement('tr', null,
              React.createElement('th', null, 'Description'),
              React.createElement('th', { style: { width: 80 } }, 'Unit'),
              React.createElement('th', { style: { width: 80 } }, 'Qty'),
              React.createElement('th', { style: { width: 120, textAlign: 'right' } }, 'Unit Price'),
              React.createElement('th', { style: { width: 120, textAlign: 'right' } }, 'Total'),
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
                    className: 'btn btn--sm',
                    onClick: () => setEditingLineItem(item.id)
                  }, 'Edit'),
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
            React.createElement('label', null, 'Contingency'),
            React.createElement('div', { className: 'input-group' },
              React.createElement('input', {
                type: 'number',
                placeholder: 'Amount',
                value: currentBid.summary.contingency.amount,
                onChange: (e) => updateBid('summary.contingency.amount', parseFloat(e.target.value) || 0),
                readOnly
              }),
              React.createElement('span', null, ' or '),
              React.createElement('input', {
                type: 'number',
                placeholder: '%',
                value: currentBid.summary.contingency.percentage,
                onChange: (e) => updateBid('summary.contingency.percentage', parseFloat(e.target.value) || 0),
                readOnly,
                style: { width: 80 }
              }),
              React.createElement('span', null, '%')
            )
          ),
          React.createElement('div', { className: 'summary-row' },
            React.createElement('label', null, 'Allowances'),
            React.createElement('input', {
              type: 'number',
              value: currentBid.summary.allowances.amount,
              onChange: (e) => updateBid('summary.allowances.amount', parseFloat(e.target.value) || 0),
              readOnly
            })
          ),
          React.createElement('div', { className: 'summary-row' },
            React.createElement('label', null, 'Tax'),
            React.createElement('div', { className: 'input-group' },
              React.createElement('input', {
                type: 'number',
                placeholder: 'Amount',
                value: currentBid.summary.tax.amount,
                onChange: (e) => updateBid('summary.tax.amount', parseFloat(e.target.value) || 0),
                readOnly
              }),
              React.createElement('span', null, ' or '),
              React.createElement('input', {
                type: 'number',
                placeholder: '%',
                value: currentBid.summary.tax.percentage,
                onChange: (e) => updateBid('summary.tax.percentage', parseFloat(e.target.value) || 0),
                readOnly,
                style: { width: 80 }
              }),
              React.createElement('span', null, '%')
            )
          ),
          React.createElement('div', { className: 'summary-row summary-total' },
            React.createElement('span', null, 'Total Bid Amount'),
            React.createElement('span', { className: 'amount' }, usd(currentBid.summary.total))
          )
        )
      ),

      // Schedule Tab
      activeTab === 'schedule' && React.createElement('div', { className: 'form-section' },
        React.createElement('h3', null, 'Schedule'),
        React.createElement('div', { className: 'form-grid' },
          React.createElement(FormField, {
            label: 'Start Date',
            type: 'date',
            value: currentBid.schedule.startDate,
            onChange: (v) => updateBid('schedule.startDate', v),
            readOnly
          }),
          React.createElement(FormField, {
            label: 'Completion Date',
            type: 'date',
            value: currentBid.schedule.completionDate,
            onChange: (v) => updateBid('schedule.completionDate', v),
            readOnly
          }),
          React.createElement(FormField, {
            label: 'Duration',
            type: 'number',
            value: currentBid.schedule.duration,
            onChange: (v) => updateBid('schedule.duration', parseInt(v) || 0),
            readOnly
          }),
          React.createElement('div', { className: 'form-field' },
            React.createElement('label', null, 'Duration Unit'),
            React.createElement('select', {
              value: currentBid.schedule.durationUnit,
              onChange: (e) => updateBid('schedule.durationUnit', e.target.value),
              disabled: readOnly
            },
              ['days', 'weeks', 'months'].map(unit =>
                React.createElement('option', { key: unit, value: unit }, unit)
              )
            )
          )
        )
      ),

      // Terms Tab
      activeTab === 'terms' && React.createElement('div', { className: 'form-section' },
        React.createElement('h3', null, 'Terms & Conditions'),
        React.createElement(FormField, {
          label: 'Payment Terms',
          value: currentBid.terms.paymentTerms,
          onChange: (v) => updateBid('terms.paymentTerms', v),
          readOnly
        }),
        React.createElement('div', { className: 'form-grid' },
          React.createElement(FormField, {
            label: 'Retainage %',
            type: 'number',
            value: currentBid.terms.retainagePercentage,
            onChange: (v) => updateBid('terms.retainagePercentage', parseFloat(v) || 0),
            readOnly
          }),
          React.createElement(FormField, {
            label: 'Warranty Period',
            value: currentBid.terms.warrantyPeriod,
            onChange: (v) => updateBid('terms.warrantyPeriod', v),
            readOnly
          })
        ),
        React.createElement(FormField, {
          label: 'Warranty Summary',
          value: currentBid.terms.warrantySummary,
          onChange: (v) => updateBid('terms.warrantySummary', v),
          textarea: true,
          readOnly
        }),
        React.createElement(FormField, {
          label: 'Insurance Requirements',
          value: currentBid.terms.insurance,
          onChange: (v) => updateBid('terms.insurance', v),
          textarea: true,
          readOnly
        }),
        React.createElement(FormField, {
          label: 'Bonding Requirements',
          value: currentBid.terms.bonding,
          onChange: (v) => updateBid('terms.bonding', v),
          textarea: true,
          readOnly
        }),
        React.createElement(FormField, {
          label: 'Other Conditions',
          value: currentBid.terms.otherConditions,
          onChange: (v) => updateBid('terms.otherConditions', v),
          textarea: true,
          readOnly
        })
      )
    ),

    React.createElement('div', { className: 'bid-form-footer' },
      !readOnly && React.createElement('button', {
        className: 'btn btn--primary',
        onClick: handleSave
      }, 'Save Bid'),
      React.createElement('button', {
        className: 'btn',
        onClick: onCancel
      }, 'Cancel')
    )
  );
}

// Helper Components
function FormField({ label, value, onChange, type = 'text', textarea = false, readOnly = false }) {
  return React.createElement('div', { className: 'form-field' },
    React.createElement('label', null, label),
    textarea
      ? React.createElement('textarea', {
          value: value || '',
          onChange: (e) => onChange(e.target.value),
          readOnly,
          rows: 4
        })
      : React.createElement('input', {
          type,
          value: value || '',
          onChange: (e) => onChange(e.target.value),
          readOnly
        })
  );
}

function ListEditor({ items = [], onChange, readOnly = false }) {
  const [newItem, setNewItem] = React.useState('');

  const handleAddItem = () => {
    if (newItem.trim()) {
      onChange([...items, newItem.trim()]);
      setNewItem('');
    }
  };

  const handleRemoveItem = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return React.createElement('div', { className: 'list-editor' },
    !readOnly && React.createElement('div', { className: 'list-editor-input' },
      React.createElement('input', {
        type: 'text',
        placeholder: 'Add item...',
        value: newItem,
        onChange: (e) => setNewItem(e.target.value),
        onKeyPress: (e) => e.key === 'Enter' && handleAddItem()
      }),
      React.createElement('button', {
        className: 'btn btn--sm',
        onClick: handleAddItem
      }, 'Add')
    ),
    React.createElement('ul', null,
      items.map((item, idx) =>
        React.createElement('li', { key: idx },
          item,
          !readOnly && React.createElement('button', {
            className: 'btn btn--sm btn--danger',
            onClick: () => handleRemoveItem(idx)
          }, '×')
        )
      )
    )
  );
}

function LineItemForm({ onSubmit, onCancel }) {
  const [item, setItem] = React.useState({
    description: '',
    unit: 'ea',
    quantity: 1,
    unitPrice: 0,
    category: 'General'
  });

  const handleSubmit = () => {
    if (item.description && item.quantity > 0 && item.unitPrice >= 0) {
      onSubmit(item);
      setItem({ description: '', unit: 'ea', quantity: 1, unitPrice: 0, category: 'General' });
    }
  };

  return React.createElement('div', { className: 'line-item-form' },
    React.createElement('div', { className: 'form-grid' },
      React.createElement(FormField, {
        label: 'Description',
        value: item.description,
        onChange: (v) => setItem({ ...item, description: v })
      }),
      React.createElement(FormField, {
        label: 'Unit',
        value: item.unit,
        onChange: (v) => setItem({ ...item, unit: v })
      }),
      React.createElement(FormField, {
        label: 'Quantity',
        type: 'number',
        value: item.quantity,
        onChange: (v) => setItem({ ...item, quantity: parseFloat(v) || 0 })
      }),
      React.createElement(FormField, {
        label: 'Unit Price',
        type: 'number',
        value: item.unitPrice,
        onChange: (v) => setItem({ ...item, unitPrice: parseFloat(v) || 0 })
      })
    ),
    React.createElement('div', { className: 'form-actions' },
      React.createElement('button', {
        className: 'btn btn--primary',
        onClick: handleSubmit
      }, 'Add Item'),
      React.createElement('button', {
        className: 'btn',
        onClick: onCancel
      }, 'Cancel')
    )
  );
}

Object.assign(window, { BidFormView, FormField, ListEditor, LineItemForm });
