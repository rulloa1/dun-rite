/* Excel Integration Module - Read/Write Bid Data */

window.BidExcelIntegration = (function(){
  
  // Parse CSV data (interim format before full xlsx support)
  const parseCSVData = (csvText) => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const bids = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const bid = {};
      headers.forEach((header, idx) => {
        bid[header] = values[idx];
      });
      bids.push(bid);
    }
    return bids;
  };

  // Generate CSV export for bids
  const generateBidsCSV = (bids) => {
    if (!bids || bids.length === 0) return '';
    
    const headers = [
      'ID', 'Vendor', 'Trade', 'Status', 'Amount', 'Project', 
      'Contact', 'Phone', 'Email', 'Version', 'Updated'
    ];
    
    const rows = bids.map(bid => [
      bid.id,
      bid.vendor || bid.bidderInfo?.company || '',
      bid.trade || bid.scope?.description?.substring(0, 30) || '',
      bid.status,
      bid.summary?.total || 0,
      bid.projectInfo?.projectName || '',
      bid.bidderInfo?.contactName || '',
      bid.bidderInfo?.phone || '',
      bid.bidderInfo?.email || '',
      bid.version,
      new Date(bid.updatedAt).toLocaleDateString()
    ]);
    
    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => 
        typeof cell === 'string' && cell.includes(',') 
          ? `"${cell}"` 
          : cell
      ).join(','))
    ].join('\n');
    
    return csv;
  };

  // Generate line items CSV
  const generateLineItemsCSV = (bid) => {
    if (!bid.lineItems || bid.lineItems.length === 0) return '';
    
    const headers = ['Description', 'Unit', 'Quantity', 'Unit Price', 'Total'];
    const rows = bid.lineItems.map(item => [
      item.description,
      item.unit,
      item.quantity,
      item.unitPrice,
      item.total
    ]);
    
    const csv = [
      `Bid ID: ${bid.id}`,
      `Vendor: ${bid.vendor || bid.bidderInfo?.company}`,
      `Trade: ${bid.trade}`,
      '',
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    return csv;
  };

  // Generate approval tracking CSV
  const generateApprovalTrackingCSV = (bids) => {
    const headers = [
      'Bid ID', 'Vendor', 'Status', 'Submitted Date', 
      'PM Approval', 'Finance Approval', 'Owner Approval', 'Overall Status'
    ];
    
    const rows = bids.map(bid => {
      const approvals = bid.approvals || [];
      return [
        bid.id,
        bid.vendor || '',
        bid.status,
        bid.createdAt ? new Date(bid.createdAt).toLocaleDateString() : '',
        approvals[0]?.status || 'pending',
        approvals[1]?.status || 'pending',
        approvals[2]?.status || 'pending',
        window.BidWorkflow?.getApprovalStatus(approvals)?.complete ? 'Approved' : 'Pending'
      ];
    });
    
    return [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
  };

  // Generate budget summary
  const generateBudgetSummaryCSV = (bids) => {
    const byTrade = {};
    
    bids.forEach(bid => {
      const trade = bid.trade || 'Unspecified';
      if (!byTrade[trade]) {
        byTrade[trade] = { count: 0, total: 0, avg: 0 };
      }
      byTrade[trade].count += 1;
      byTrade[trade].total += bid.summary?.total || 0;
    });
    
    // Calculate averages
    Object.keys(byTrade).forEach(trade => {
      byTrade[trade].avg = byTrade[trade].total / byTrade[trade].count;
    });
    
    const headers = ['Trade', 'Number of Bids', 'Total Amount', 'Average Bid'];
    const rows = Object.entries(byTrade).map(([trade, data]) => [
      trade,
      data.count,
      data.total,
      data.avg
    ]);
    
    return [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
  };

  // Download CSV file
  const downloadCSV = (filename, csvContent) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export all bid data
  const exportAllData = (bids, projectName) => {
    const timestamp = new Date().toISOString().split('T')[0];
    
    // Main bids file
    downloadCSV(
      `${projectName}_Bids_${timestamp}.csv`,
      generateBidsCSV(bids)
    );
    
    // Approval tracking
    downloadCSV(
      `${projectName}_Approvals_${timestamp}.csv`,
      generateApprovalTrackingCSV(bids)
    );
    
    // Budget summary
    downloadCSV(
      `${projectName}_BudgetSummary_${timestamp}.csv`,
      generateBudgetSummaryCSV(bids)
    );
  };

  // Import from file upload
  const importFromFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target.result;
          const bids = parseCSVData(content);
          resolve(bids);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  return {
    parseCSVData,
    generateBidsCSV,
    generateLineItemsCSV,
    generateApprovalTrackingCSV,
    generateBudgetSummaryCSV,
    downloadCSV,
    exportAllData,
    importFromFile
  };
})();
