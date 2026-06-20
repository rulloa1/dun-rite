/* Enhanced Bid Management & Tracking - Integrated with Real Project Data */

function EnhancedBidsViewV2() {
  const P = window.PROJECT; // Real project data from longleaf-data.js
  const [bids, setBids] = React.useState(
    P.bids.map(b => window.BidDataModel.createEmptyBid(P.name, 'BID-' + b.id, b))
  );
  
  const [viewMode, setViewMode] = React.useState('tracker'); // tracker, form, compare
  const [selectedBidId, setSelectedBidId] = React.useState(null);
  const [showNewBidForm, setShowNewBidForm] = React.useState(false);

  const selectedBid = bids.find(b => b.id === 'BID-' + selectedBidId);

  const handleSaveBid = (updatedBid) => {
    const index = bids.findIndex(b => b.id === updatedBid.id);
    if (index >= 0) {
      const newBids = [...bids];
      newBids[index] = updatedBid;
      setBids(newBids);
    } else {
      setBids([...bids, updatedBid]);
    }
    setViewMode('tracker');
    setSelectedBidId(null);
  };

  const handleDeleteBid = (bidId) => {
    if (confirm('Are you sure you want to delete this bid?')) {
      setBids(bids.filter(b => b.id !== 'BID-' + bidId));
    }
  };

  const usd = (n) => '$' + Math.round(n).toLocaleString('en-US');

  // KPI Row Component
  const KPIRow = ({ label, value, subtext, tone = 'neutral' }) =>
    React.createElement('div', { className: 'kpi kpi--' + tone },
      React.createElement('div', { className: 'kpi__label' }, label),
      React.createElement('div', { className: 'kpi__val' }, value),
      subtext && React.createElement('div', { className: 'kpi__sub' }, subtext)
    );

  const returned = P.bids.filter(b => b.status === 'Done');
  const pending = P.bids.filter(b => b.status === 'Not Returned');

  // Tracker View
  const TrackerView = () => React.createElement('div', { className: 'view' },
    React.createElement('div', { className: 'pg-grid' },
      // KPIs
      React.createElement('div', { className: 'pg-row' },
        KPIRow('Total Bids Value', P.usd(P.total), P.bids.length + ' vendors', 'gold'),
        KPIRow('Returned', P.returned, 'of ' + P.bids.length, 'cyan'),
        KPIRow('Not Returned', P.notReturned, 'pending', 'warn'),
        KPIRow('Completion', Math.round(P.returned / P.bids.length * 100) + '%', 'bids in', 'cyan')
      ),

      // Bids Tables
      React.createElement('div', { className: 'pg-row cols-2', style: { marginTop: 20 } },
        // Returned Bids
        React.createElement('div', { className: 'card' },
          React.createElement('div', { className: 'card__h' },
            React.createElement('h3', null, 'Returned Bids'),
            React.createElement('span', { className: 'card__badge' }, P.returned + ' vendors')
          ),
          React.createElement('div', { className: 'tbl-wrap' },
            React.createElement('table', { className: 'tbl' },
              React.createElement('thead', null,
                React.createElement('tr', null,
                  React.createElement('th', { style: { width: 50 } }, 'ID'),
                  React.createElement('th', null, 'Vendor'),
                  React.createElement('th', null, 'Trade'),
                  React.createElement('th', { style: { textAlign: 'right', width: 120 } }, 'Amount')
                )
              ),
              React.createElement('tbody', null,
                returned.map(b =>
                  React.createElement('tr', { key: b.id },
                    React.createElement('td', { className: 'code' }, b.id),
                    React.createElement('td', { className: 'vendor' }, b.vendor),
                    React.createElement('td', { style: { color: 'var(--muted)', fontSize: 12 } }, b.trade),
                    React.createElement('td', { className: 'num' }, P.usd(b.amt))
                  )
                )
              )
            )
          )
        ),

        // Pending Bids
        React.createElement('div', { className: 'card' },
          React.createElement('div', { className: 'card__h' },
            React.createElement('h3', null, 'Pending Response'),
            React.createElement('span', { className: 'card__badge' }, P.notReturned + ' vendors')
          ),
          React.createElement('div', { className: 'tbl-wrap' },
            React.createElement('table', { className: 'tbl' },
              React.createElement('thead', null,
                React.createElement('tr', null,
                  React.createElement('th', { style: { width: 50 } }, 'ID'),
                  React.createElement('th', null, 'Vendor'),
                  React.createElement('th', null, 'Trade'),
                  React.createElement('th', { style: { width: 100 } }, 'Action')
                )
              ),
              React.createElement('tbody', null,
                pending.map(b =>
                  React.createElement('tr', { key: b.id },
                    React.createElement('td', { className: 'code' }, b.id),
                    React.createElement('td', { className: 'vendor' }, b.vendor),
                    React.createElement('td', { style: { color: 'var(--muted)', fontSize: 12 } }, b.trade),
                    React.createElement('td', null,
                      React.createElement('button', {
                        className: 'btn btn--sm',
                        onClick: () => {
                          setSelectedBidId(b.id);
                          setViewMode('form');
                        }
                      }, 'Edit')
                    )
                  )
                )
              )
            )
          )
        )
      )
    )
  );

  // Form View
  const FormView = () => selectedBid && React.createElement(BidFormView, {
    bid: selectedBid,
    onSave: handleSaveBid,
    onCancel: () => {
      setViewMode('tracker');
      setSelectedBidId(null);
    },
    readOnly: false
  });

  // Main Render
  return React.createElement('div', { className: 'enhanced-bids-container' },
    viewMode === 'tracker' && React.createElement(TrackerView),
    viewMode === 'form' && React.createElement(FormView)
  );
}

Object.assign(window, { EnhancedBidsViewV2 });
