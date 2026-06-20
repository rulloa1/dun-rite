/* Enhanced Bid Management & Tracking */

function EnhancedBidsView() {
  const [bids, setBids] = React.useState([
    // Sample bids for demo
    window.BidDataModel.createEmptyBid('proj-001', 'BID-001'),
    window.BidDataModel.createEmptyBid('proj-001', 'BID-002'),
  ]);
  
  const [viewMode, setViewMode] = React.useState('tracker'); // tracker, form, compare
  const [selectedBidId, setSelectedBidId] = React.useState(null);
  const [selectedBidsForCompare, setSelectedBidsForCompare] = React.useState([]);
  const [showNewBidForm, setShowNewBidForm] = React.useState(false);

  const selectedBid = bids.find(b => b.id === selectedBidId);

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

  const handleCreateNewBid = () => {
    const newBid = window.BidDataModel.createEmptyBid('proj-001', 'BID-' + Date.now());
    setSelectedBidId(newBid.id);
    setBids([...bids, newBid]);
    setViewMode('form');
  };

  const handleDeleteBid = (bidId) => {
    if (confirm('Are you sure you want to delete this bid?')) {
      setBids(bids.filter(b => b.id !== bidId));
    }
  };

  const handleExportPDF = (bidId) => {
    alert('PDF export functionality would be integrated with a PDF library like pdfkit or jsPDF');
  };

  const getDraftBids = () => bids.filter(b => b.status === 'draft');
  const getSubmittedBids = () => bids.filter(b => b.status === 'submitted');
  const getApprovedBids = () => bids.filter(b => b.status === 'approved');

  const usd = (n) => '$' + Math.round(n).toLocaleString('en-US');

  // KPI Row Component
  const KPIRow = ({ label, value, subtext, tone = 'neutral' }) =>
    React.createElement('div', { className: 'kpi kpi--' + tone },
      React.createElement('div', { className: 'kpi__label' }, label),
      React.createElement('div', { className: 'kpi__val' }, value),
      subtext && React.createElement('div', { className: 'kpi__sub' }, subtext)
    );

  // Tracker View
  const TrackerView = () => React.createElement('div', { className: 'view' },
    React.createElement('div', { className: 'pg-grid' },
      // KPIs
      React.createElement('div', { className: 'pg-row' },
        KPIRow('Total Bids', bids.length, 'across all projects', 'cyan'),
        KPIRow('Total Value', usd(bids.reduce((sum, b) => sum + b.summary.total, 0)), 'all bids combined', 'gold'),
        KPIRow('Pending Review', getDraftBids().length, 'not yet submitted', 'warn'),
        KPIRow('Approved', getApprovedBids().length, 'ready to submit', 'ok')
      ),

      // Bids by Status
      React.createElement('div', { className: 'pg-row cols-3' },
        // Draft Bids
        React.createElement('div', { className: 'card' },
          React.createElement('div', { className: 'card__h' },
            React.createElement('h3', null, 'Draft Bids'),
            React.createElement('span', { className: 'card__badge' }, getDraftBids().length)
          ),
          getDraftBids().length === 0
            ? React.createElement('p', { style: { color: 'var(--muted)', padding: '20px', textAlign: 'center' } }, 'No draft bids')
            : React.createElement('div', { className: 'bid-list' },
                getDraftBids().map(bid =>
                  React.createElement('div', { key: bid.id, className: 'bid-item' },
                    React.createElement('div', { className: 'bid-item__header' },
                      React.createElement('span', { className: 'bid-item__id' }, bid.id),
                      React.createElement('span', { className: 'bid-item__amount' }, usd(bid.summary.total))
                    ),
                    React.createElement('div', { className: 'bid-item__meta' },
                      React.createElement('span', null, bid.projectInfo.projectName || 'Untitled Project'),
                      React.createElement('span', null, bid.bidderInfo.company || 'No bidder info')
                    ),
                    React.createElement('div', { className: 'bid-item__actions' },
                      React.createElement('button', {
                        className: 'btn btn--sm',
                        onClick: () => {
                          setSelectedBidId(bid.id);
                          setViewMode('form');
                        }
                      }, 'Edit'),
                      React.createElement('button', {
                        className: 'btn btn--sm',
                        onClick: () => handleDeleteBid(bid.id)
                      }, 'Delete')
                    )
                  )
                )
              )
        ),

        // Submitted Bids
        React.createElement('div', { className: 'card' },
          React.createElement('div', { className: 'card__h' },
            React.createElement('h3', null, 'Submitted'),
            React.createElement('span', { className: 'card__badge' }, getSubmittedBids().length)
          ),
          getSubmittedBids().length === 0
            ? React.createElement('p', { style: { color: 'var(--muted)', padding: '20px', textAlign: 'center' } }, 'No submitted bids')
            : React.createElement('div', { className: 'bid-list' },
                getSubmittedBids().map(bid =>
                  React.createElement('div', { key: bid.id, className: 'bid-item' },
                    React.createElement('div', { className: 'bid-item__header' },
                      React.createElement('span', { className: 'bid-item__id' }, bid.id),
                      React.createElement('span', { className: 'bid-item__amount' }, usd(bid.summary.total))
                    ),
                    React.createElement('div', { className: 'bid-item__meta' },
                      React.createElement('span', null, bid.projectInfo.projectName || 'Untitled Project')
                    ),
                    React.createElement('div', { className: 'bid-item__actions' },
                      React.createElement('button', {
                        className: 'btn btn--sm',
                        onClick: () => {
                          setSelectedBidId(bid.id);
                          setViewMode('form');
                        }
                      }, 'View')
                    )
                  )
                )
              )
        ),

        // Approved Bids
        React.createElement('div', { className: 'card' },
          React.createElement('div', { className: 'card__h' },
            React.createElement('h3', null, 'Approved'),
            React.createElement('span', { className: 'card__badge' }, getApprovedBids().length)
          ),
          getApprovedBids().length === 0
            ? React.createElement('p', { style: { color: 'var(--muted)', padding: '20px', textAlign: 'center' } }, 'No approved bids')
            : React.createElement('div', { className: 'bid-list' },
                getApprovedBids().map(bid =>
                  React.createElement('div', { key: bid.id, className: 'bid-item' },
                    React.createElement('div', { className: 'bid-item__header' },
                      React.createElement('span', { className: 'bid-item__id' }, bid.id),
                      React.createElement('span', { className: 'bid-item__amount' }, usd(bid.summary.total))
                    ),
                    React.createElement('div', { className: 'bid-item__meta' },
                      React.createElement('span', null, bid.projectInfo.projectName || 'Untitled Project')
                    ),
                    React.createElement('div', { className: 'bid-item__actions' },
                      React.createElement('button', {
                        className: 'btn btn--sm',
                        onClick: () => {
                          setSelectedBidId(bid.id);
                          setViewMode('form');
                        }
                      }, 'View'),
                      React.createElement('button', {
                        className: 'btn btn--sm',
                        onClick: () => handleExportPDF(bid.id)
                      }, 'PDF')
                    )
                  )
                )
              )
        )
      ),

      // Action Button
      React.createElement('div', { style: { marginTop: 20, textAlign: 'center' } },
        React.createElement('button', {
          className: 'btn btn--primary',
          onClick: handleCreateNewBid,
          style: { padding: '12px 24px', fontSize: 14 }
        }, '+ Create New Bid')
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

// Styles for KPI cards
const kpiStyles = `
  .kpi {
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: var(--r-lg);
    padding: 20px;
    text-align: center;
    box-shadow: var(--sh-1);
  }

  .kpi__label {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--muted);
    margin-bottom: 8px;
  }

  .kpi__val {
    font-size: 28px;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 6px;
  }

  .kpi__sub {
    font-size: 12px;
    color: var(--muted);
  }

  .kpi--cyan {
    border-color: rgba(29, 180, 232, 0.2);
    background: rgba(29, 180, 232, 0.04);
  }

  .kpi--cyan .kpi__val {
    color: var(--brand-cyan);
  }

  .kpi--gold {
    border-color: rgba(224, 138, 30, 0.2);
    background: rgba(224, 138, 30, 0.04);
  }

  .kpi--gold .kpi__val {
    color: var(--warn);
  }

  .kpi--warn {
    border-color: rgba(224, 82, 75, 0.2);
    background: rgba(224, 82, 75, 0.04);
  }

  .kpi--warn .kpi__val {
    color: var(--bad);
  }

  .kpi--ok {
    border-color: rgba(30, 158, 106, 0.2);
    background: rgba(30, 158, 106, 0.04);
  }

  .kpi--ok .kpi__val {
    color: var(--ok);
  }

  .pg-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .pg-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
  }

  .pg-row.cols-2 {
    grid-template-columns: repeat(2, 1fr);
  }

  .pg-row.cols-3 {
    grid-template-columns: repeat(3, 1fr);
  }

  .card {
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: var(--r-lg);
    padding: 20px;
    box-shadow: var(--sh-1);
  }

  .card__h {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--line);
  }

  .card h3 {
    font-size: 16px;
    font-weight: 600;
    color: var(--ink);
    margin: 0;
  }

  .card__badge {
    background: var(--paper);
    color: var(--muted);
    padding: 4px 8px;
    border-radius: var(--r-sm);
    font-size: 12px;
    font-weight: 600;
  }

  .bid-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .bid-item {
    border: 1px solid var(--line-soft);
    border-radius: var(--r);
    padding: 12px;
    background: var(--card-tint);
    transition: all 0.15s;
  }

  .bid-item:hover {
    background: var(--paper);
    border-color: var(--line);
  }

  .bid-item__header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 8px;
  }

  .bid-item__id {
    font-size: 12px;
    font-weight: 600;
    color: var(--ink);
    font-family: 'Menlo', monospace;
  }

  .bid-item__amount {
    font-size: 14px;
    font-weight: 700;
    color: var(--brand-blue);
    font-variant-numeric: tabular-nums;
  }

  .bid-item__meta {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 12px;
    color: var(--muted);
    margin-bottom: 8px;
  }

  .bid-item__actions {
    display: flex;
    gap: 6px;
  }

  .bid-item__actions .btn {
    flex: 1;
    padding: 6px 8px;
    font-size: 11px;
  }

  .enhanced-bids-container {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
`;

// Inject styles
if (!document.querySelector('#bid-kpi-styles')) {
  const style = document.createElement('style');
  style.id = 'bid-kpi-styles';
  style.textContent = kpiStyles;
  document.head.appendChild(style);
}

Object.assign(window, { EnhancedBidsView });
