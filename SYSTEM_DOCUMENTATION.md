<!-- DunRite Construction — System Integration Guide -->

# DunRite Construction Management System
## Complete Integration & Implementation Guide

### **System Architecture**

#### Core Modules (70+ files)
1. **Projects Manager** — Create/edit/manage multiple projects
2. **Bid Management System** — Comprehensive bid workflow with approvals, PDF export, Excel integration
3. **Gantt Chart** — Interactive schedule with drag-to-reschedule, crew assignments, critical path
4. **Project Controls Dashboard** — Master control center
5. **All Views** — 30+ specialized modules (budget, documents, daily reports, RFI, submittals, etc.)

---

### **Key Features by Module**

#### **Projects Manager** (`projects-manager-view.jsx`, `projects-manager.js`)
- Create new projects with full metadata
- Edit project details (client, location, budget, dates, PM assignment)
- Search and filter projects by status
- Color-coded project cards
- Set active project (persists across app)
- Data persisted to localStorage

**Usage:**
```javascript
const pm = window.ProjectsManager;
pm.createNewProject('Longleaf Amenity', { client: 'Client Name', budget: 1350000 });
pm.setActiveProject(projectId);
const activeProject = pm.getActiveProjectData();
```

#### **Bid Management System** (`bid-data-model.js`, `bid-workflow.js`, `bid-pdf-export.js`, `bid-excel-integration.js`)
- Full bid lifecycle: Draft → Submitted → Under Review → Approved → Awarded
- Multi-level approval chain (PM, Finance, Owner)
- Real-time notifications
- PDF generation for printing/sharing
- CSV/Excel export (bids, line items, approvals, budget summaries)
- Bid versioning & revision tracking
- Line item management with auto-calculations
- Integration with real Longleaf project data (13 vendors, $662K+ bids)

**Usage:**
```javascript
const bid = window.BidDataModel.createEmptyBid(projectId, bidId, vendorData);
bid = window.BidDataModel.addLineItem(bid, { description: 'Labor', quantity: 10, unitPrice: 100 });
const summary = window.BidDataModel.calculateSummary(bid);

// Workflow
const approvals = window.BidWorkflow.initializeApprovalChain(bid, approvers);
window.BidWorkflow.approveStep(approvals, stepId, 'John Doe', 'Approved');

// Export
window.BidPDFExport.openForPrint(bid);
window.BidExcelIntegration.downloadCSV('filename.csv', csvContent);
```

#### **Gantt Chart** (`gantt-engine.js`, `gantt-view.jsx`, `gantt-styles.css`)
- Interactive timeline visualization (Aug - Dec 2026)
- 9 tasks with real project data
- Drag-to-reschedule task bars
- Progress tracking (0-100%)
- Critical path highlighting (red borders)
- Task dependencies with auto-date-sync
- Crew/resource assignment
- Status indicators (Scheduled, In Progress, Completed, On Hold, Delayed)
- Task details side panel

**Usage:**
```javascript
const task = window.GanttEngine.createTask('Task Name', '2026-08-17', 10, {
  trade: 'Foundation',
  budget: 50000,
  crew: [{ id: 'C1', name: 'John', role: 'Foreman' }]
});

const cp = window.GanttEngine.calculateCriticalPath(tasks);
window.GanttEngine.updateTaskDates(taskId, newStartDate, tasks);
window.GanttEngine.updateProgress(taskId, 50, tasks);
```

---

### **Authentication & Permissions**

**Unlocked Roles** (all permissions granted):
- Admin
- Project Manager (PM)
- Superintendent (Super)
- Finance Manager
- Owner

**Accessible Features:**
All 31 modules unlocked for all roles:
- Dashboard, Schedule, Gantt, Budget, Documents, Daily Reports, Issues, Safety
- Change Orders, Invoices, Equipment, Forecasting, Risks, RFI, Submittals, Bids
- Photos, Retainage, Cash Flow, Resources, Subcontractors, Logistics, Notifications
- Approvals, Milestones, Productivity, Meetings, Requisitions, Weather, QuickBooks
- Mobile Portal, Calendar

---

### **Data Storage**

**Current:**
- localStorage for Projects, Bids, Schedule data
- In-memory state management via React

**Next Steps:**
- Firebase Firestore for real-time sync
- Cloud Storage for document uploads
- QuickBooks API integration for budget/invoicing

---

### **File Structure**

```
dunrite-app/
├── Projects System
│   ├── projects-manager.js
│   ├── projects-manager-view.jsx
│   ├── projects-styles.css
│   └── Projects Manager.html
│
├── Bid Management
│   ├── bid-data-model.js
│   ├── bid-workflow.js
│   ├── bid-pdf-export.js
│   ├── bid-excel-integration.js
│   ├── bid-form-view.jsx
│   ├── bid-form-enhanced.jsx
│   ├── views_bids_enhanced_v2.jsx
│   ├── bid-styles.css
│   └── Bid Management System.html
│
├── Gantt Chart
│   ├── gantt-engine.js
│   ├── gantt-view.jsx
│   ├── gantt-styles.css
│   └── Gantt Chart.html
│
├── Core App
│   ├── app.jsx
│   ├── shell.jsx
│   ├── ui.jsx
│   ├── icons.jsx
│   ├── styles.css
│   ├── design-system-colors.css
│   ├── Dun Rite - Project Controls.html
│   │
│   ├── Auth
│   │   ├── auth.js (UNLOCKED ALL ROLES)
│   │   ├── auth-firebase.js (UNLOCKED ALL ROLES)
│   │   ├── login.jsx
│   │   └── firebase-init.js
│   │
│   ├── Data
│   │   ├── data.js
│   │   ├── longleaf-data.js (13 real bids)
│   │   └── firebase-service.js
│   │
│   └── Views (30+ modules)
│       ├── views_dashboard.jsx
│       ├── views_schedule.jsx
│       ├── views_budget.jsx
│       ├── views_gantt.jsx
│       ├── views_documents.jsx
│       ├── views_daily_reports.jsx
│       ├── views_issues.jsx
│       ├── views_safety.jsx
│       ├── views_change_orders.jsx
│       ├── views_invoices.jsx
│       ├── views_equipment.jsx
│       ├── views_forecasting.jsx
│       ├── views_risks.jsx
│       ├── views_bids.jsx
│       ├── views_approvals.jsx
│       ├── views_photos.jsx
│       ├── views_retainage.jsx
│       ├── views_cashflow.jsx
│       ├── views_resources.jsx
│       ├── views_subcontractors.jsx
│       ├── views_logistics.jsx
│       ├── views_notifications.jsx
│       ├── views_milestones.jsx
│       ├── views_productivity.jsx
│       ├── views_meetings.jsx
│       ├── views_requisitions.jsx
│       ├── views_weather.jsx
│       ├── views_quickbooks.jsx
│       ├── views_mobile.jsx
│       ├── views_calendar.jsx
│       └── views_projects.jsx
│
├── Mobile
│   ├── dunrite-mobile/
│   ├── app.jsx
│   ├── screens.jsx
│   ├── mobile.css
│   └── Dun Rite - Mobile Dashboard.html
│
└── Assets
    ├── dunrite-dark.png
    ├── dunrite-white.png
    └── dc-mark-white.png
```

---

### **Integration Checklist**

- [x] Projects Manager built & standalone
- [x] Bid Management System complete with workflows
- [x] Gantt Chart with all features
- [x] Auth unlocked for all roles
- [x] Real data integrated (Longleaf project)
- [x] PDF & Excel export working
- [ ] Connect to Firebase for persistence
- [ ] Add Projects to main navigation
- [ ] Link active project across all dashboards
- [ ] Setup QuickBooks integration
- [ ] Deploy to production
- [ ] Team training & onboarding

---

### **Live Deployment**

**Current:**
https://dun-rite-construction-group-828236994189.us-west1.run.app

**To Update:**
1. Push code to GitHub
2. Cloud Run auto-deploys from main branch
3. Firebase config auto-loads

---

### **Next Steps**

1. **Firebase Integration** — Replace localStorage with Firestore for real-time sync
2. **Navigation Updates** — Add Projects, Bid Management, Gantt to main sidebar
3. **Cross-Module Linking** — Load active project data across all views
4. **API Integrations** — Connect QuickBooks, Slack, email notifications
5. **Mobile Optimization** — Responsive design for field teams
6. **Team Training** — Create user guides & video tutorials

---

**Built with:** React 18, Babel, CSS Grid, HTML5  
**Browser Support:** Chrome, Safari, Firefox, Edge (2024+)  
**Last Updated:** June 16, 2026

