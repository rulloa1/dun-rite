/* Bid PDF Export Module */

window.BidPDFExport = (function(){
  
  // Generate PDF-ready HTML
  const generatePDFHTML = (bid) => {
    const P = window.PROJECT;
    const usd = (n) => '$' + Math.round(n).toLocaleString('en-US');
    
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Bid - ${bid.id}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Arial', sans-serif; color: #333; line-height: 1.6; }
    .page { page-break-after: always; padding: 40px; max-width: 8.5in; margin: 0 auto; }
    
    .header { 
      display: flex; 
      justify-content: space-between; 
      align-items: flex-start;
      margin-bottom: 40px;
      border-bottom: 3px solid #1DB4E8;
      padding-bottom: 20px;
    }
    
    .logo { font-size: 24px; font-weight: bold; color: #0F6BA8; }
    .logo-subtitle { font-size: 12px; color: #666; margin-top: 4px; }
    
    .bid-title {
      text-align: right;
    }
    
    .bid-title h1 { 
      font-size: 32px; 
      color: #0F6BA8;
      margin-bottom: 4px;
    }
    
    .bid-id {
      font-size: 12px;
      color: #999;
      font-family: monospace;
    }
    
    .section {
      margin-bottom: 30px;
    }
    
    .section-title {
      font-size: 14px;
      font-weight: bold;
      text-transform: uppercase;
      color: #0F6BA8;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #E4E9EE;
    }
    
    .two-col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 16px;
    }
    
    .field {
      margin-bottom: 12px;
    }
    
    .field-label {
      font-size: 11px;
      font-weight: bold;
      text-transform: uppercase;
      color: #999;
      margin-bottom: 4px;
    }
    
    .field-value {
      font-size: 13px;
      color: #333;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    
    th {
      background: #F4F7FA;
      padding: 10px;
      text-align: left;
      font-size: 11px;
      font-weight: bold;
      color: #666;
      border-bottom: 1px solid #E4E9EE;
    }
    
    td {
      padding: 10px;
      border-bottom: 1px solid #EEF2F6;
      font-size: 12px;
    }
    
    .amount { text-align: right; font-family: monospace; }
    
    .summary-table {
      max-width: 400px;
      margin-left: auto;
    }
    
    .summary-table td {
      padding: 8px 12px;
      border: none;
      border-bottom: 1px solid #E4E9EE;
    }
    
    .summary-label { font-weight: bold; color: #333; }
    .summary-amount { text-align: right; font-family: monospace; }
    
    .summary-total {
      border-top: 2px solid #0F6BA8;
      border-bottom: 2px solid #0F6BA8;
      background: #F4F7FA;
      font-weight: bold;
      font-size: 14px;
    }
    
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #E4E9EE;
      font-size: 10px;
      color: #999;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div>
        <div class="logo">DUNRITE</div>
        <div class="logo-subtitle">Construction Group LLC</div>
      </div>
      <div class="bid-title">
        <h1>BID</h1>
        <div class="bid-id">${bid.id}</div>
      </div>
    </div>
    
    <!-- Project Information -->
    <div class="section">
      <div class="section-title">Project Information</div>
      <div class="two-col">
        <div class="field">
          <div class="field-label">Project Name</div>
          <div class="field-value">${bid.projectInfo.projectName || P.name || 'N/A'}</div>
        </div>
        <div class="field">
          <div class="field-label">Project Number</div>
          <div class="field-value">${bid.projectInfo.projectNumber || 'N/A'}</div>
        </div>
        <div class="field">
          <div class="field-label">Location</div>
          <div class="field-value">${bid.projectInfo.location || P.location || 'N/A'}</div>
        </div>
        <div class="field">
          <div class="field-label">Owner</div>
          <div class="field-value">${bid.projectInfo.owner || P.client || 'N/A'}</div>
        </div>
      </div>
    </div>
    
    <!-- Bidder Information -->
    <div class="section">
      <div class="section-title">Bidder Information</div>
      <div class="two-col">
        <div class="field">
          <div class="field-label">Company</div>
          <div class="field-value">${bid.bidderInfo.company || bid.vendor || 'N/A'}</div>
        </div>
        <div class="field">
          <div class="field-label">Contact</div>
          <div class="field-value">${bid.bidderInfo.contactName || 'N/A'}</div>
        </div>
        <div class="field">
          <div class="field-label">Phone</div>
          <div class="field-value">${bid.bidderInfo.phone || 'N/A'}</div>
        </div>
        <div class="field">
          <div class="field-label">Email</div>
          <div class="field-value">${bid.bidderInfo.email || 'N/A'}</div>
        </div>
      </div>
    </div>
    
    <!-- Trade/Scope -->
    <div class="section">
      <div class="section-title">Trade / Scope of Work</div>
      <div class="field">
        <div class="field-label">Trade</div>
        <div class="field-value">${bid.trade || 'N/A'}</div>
      </div>
      <div class="field">
        <div class="field-label">Description</div>
        <div class="field-value">${bid.scope?.description || 'N/A'}</div>
      </div>
    </div>
    
    <!-- Cost Breakdown -->
    ${bid.lineItems && bid.lineItems.length > 0 ? `
    <div class="section">
      <div class="section-title">Cost Breakdown</div>
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th style="width: 80px;">Unit</th>
            <th style="width: 60px; text-align: center;">Qty</th>
            <th style="width: 100px; text-align: right;">Unit Price</th>
            <th style="width: 100px; text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${bid.lineItems.map(item => `
            <tr>
              <td>${item.description}</td>
              <td>${item.unit}</td>
              <td style="text-align: center;">${item.quantity}</td>
              <td class="amount">${usd(item.unitPrice)}</td>
              <td class="amount">${usd(item.total)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    ` : ''}
    
    <!-- Summary -->
    <div class="section">
      <div class="section-title">Cost Summary</div>
      <table class="summary-table">
        <tr>
          <td class="summary-label">Subtotal</td>
          <td class="summary-amount">${usd(bid.summary.subtotal)}</td>
        </tr>
        ${bid.summary.contingency.amount > 0 ? `
        <tr>
          <td class="summary-label">Contingency ${bid.summary.contingency.percentage > 0 ? '(' + bid.summary.contingency.percentage + '%)' : ''}</td>
          <td class="summary-amount">${usd(bid.summary.contingency.amount)}</td>
        </tr>
        ` : ''}
        ${bid.summary.allowances.amount > 0 ? `
        <tr>
          <td class="summary-label">Allowances</td>
          <td class="summary-amount">${usd(bid.summary.allowances.amount)}</td>
        </tr>
        ` : ''}
        ${bid.summary.tax.amount > 0 ? `
        <tr>
          <td class="summary-label">Tax ${bid.summary.tax.percentage > 0 ? '(' + bid.summary.tax.percentage + '%)' : ''}</td>
          <td class="summary-amount">${usd(bid.summary.tax.amount)}</td>
        </tr>
        ` : ''}
        <tr class="summary-total">
          <td class="summary-label">TOTAL BID AMOUNT</td>
          <td class="summary-amount">${usd(bid.summary.total)}</td>
        </tr>
      </table>
    </div>
    
    <!-- Schedule -->
    ${bid.schedule?.startDate ? `
    <div class="section">
      <div class="section-title">Schedule</div>
      <div class="two-col">
        <div class="field">
          <div class="field-label">Start Date</div>
          <div class="field-value">${bid.schedule.startDate || 'N/A'}</div>
        </div>
        <div class="field">
          <div class="field-label">Completion Date</div>
          <div class="field-value">${bid.schedule.completionDate || 'N/A'}</div>
        </div>
      </div>
    </div>
    ` : ''}
    
    <!-- Terms -->
    ${bid.terms?.paymentTerms ? `
    <div class="section">
      <div class="section-title">Terms & Conditions</div>
      <div class="field">
        <div class="field-label">Payment Terms</div>
        <div class="field-value">${bid.terms.paymentTerms || 'N/A'}</div>
      </div>
      ${bid.terms.retainagePercentage > 0 ? `
      <div class="field">
        <div class="field-label">Retainage</div>
        <div class="field-value">${bid.terms.retainagePercentage}%</div>
      </div>
      ` : ''}
    </div>
    ` : ''}
    
    <div class="footer">
      Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
      <br>Bid ID: ${bid.id} | Version: ${bid.version}
    </div>
  </div>
</body>
</html>
    `;
  };

  // Open PDF for printing
  const openForPrint = (bid) => {
    const html = generatePDFHTML(bid);
    const printWindow = window.open('', '', 'height=800,width=900');
    printWindow.document.write(html);
    printWindow.document.close();
    return printWindow;
  };

  // Download as PDF (requires external library like pdfkit or html2pdf)
  const downloadPDF = async (bid) => {
    const html = generatePDFHTML(bid);
    // Would use html2pdf library:
    // html2pdf().set(options).fromString(html).download(`${bid.id}.pdf`);
    alert('PDF download requires html2pdf library integration');
    return openForPrint(bid); // Fallback to print
  };

  return {
    generatePDFHTML,
    openForPrint,
    downloadPDF
  };
})();
