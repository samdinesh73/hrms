# Leave Management System - Navigation Guide

## 🌐 URLs & Access

### Employee Portal
**URL:** `http://localhost:3000/employee/request-leave`

**Access:** Any logged-in employee

**What's available:**
- View personal leave balance
- Submit new leave request
- View own leave history
- Track request status
- View rejection reasons

---

### Manager Portal
**URL:** `http://localhost:3000/manager/leaves`

**Access:** Users with manager role

**What's available:**
- Dashboard with team statistics
- Pending leave requests from team
- Approve/reject team leaves
- Add comments/reasons
- View approval history
- Search and filter options

---

### Admin Portal
**URL:** `http://localhost:3000/admin/leave-management`

**Access:** Admin/HR users

**What's available:**
- Dashboard with company-wide statistics
- All employee leave requests
- Approve/reject any request
- Company-wide reporting
- Search and filter capabilities
- Complete audit trail

---

## 📊 Component Architecture

### Employee Request Page
```
/employee/request-leave/page.tsx
├── Leave Balance Card (Top)
│   └── Shows available days
├── Left Column (Responsive 1/3)
│   ├── Request Form
│   ├── Leave Type Select
│   ├── Date Inputs
│   ├── Reason Textarea
│   └── Submit Button
└── Right Column (Responsive 2/3)
    ├── Request History Table
    └── Details Dialog
```

### Manager Leaves Page
```
/manager/leaves/page.tsx
├── Header with Title
├── Statistics Cards (4 columns)
│   ├── Total Requests
│   ├── Pending
│   ├── Approved
│   └── Rejected
├── Filter Section
│   ├── Status Filter
│   ├── Search Input
│   └── Clear Button
└── Requests Table
    ├── Employee Info
    ├── Leave Details
    ├── Status Badge
    └── Review Dialog
```

### Admin Leave Management Page
```
/admin/leave-management/page.tsx
├── Header with Title
├── Statistics Cards (4 columns)
├── Filter Section
├── Requests Table (Full company data)
└── Review Dialog (Approve/Reject)
```

---

## 🔗 Navigation Flow

### From Employee Dashboard
```
/employee/dashboard
    ↓ (Click "Request Leave" link/button)
/employee/request-leave
    ├─→ Request new leave
    ├─→ View history
    └─→ Track status
```

### From Manager Dashboard
```
/manager/dashboard
    ↓ (Click "Team Leaves" or "Leave Requests")
/manager/leaves
    ├─→ View team requests
    ├─→ Approve/Reject
    └─→ Add comments
```

### From Admin Dashboard
```
/admin/dashboard
    ↓ (Click "Leave Management")
/admin/leave-management
    ├─→ View all requests
    ├─→ Approve/Reject any
    └─→ Generate reports
```

---

## 📡 API Integration Points

### Data Flow Diagram
```
Frontend Pages
    ├── Employee Page
    │   ├─→ GET /api/employees/:id (Get balance)
    │   ├─→ GET /api/leaves?employeeId (Get history)
    │   └─→ POST /api/leaves (Submit request)
    │
    ├── Manager Page
    │   ├─→ GET /api/employees?managerId (Get team)
    │   ├─→ GET /api/leaves (Get all)
    │   └─→ POST /api/leaves/:id/approve (Approve/Reject)
    │
    └── Admin Page
        ├─→ GET /api/leaves (Get all)
        └─→ POST /api/leaves/:id/approve (Approve/Reject)
         ↓
Database (PostgreSQL via Prisma)
    ├── leaves table
    ├── leave_approvals table
    ├── employees table
    └── managers table
```

---

## 🎯 State Management

### URL-Based Navigation
- Each page is a separate Next.js page component
- URL changes on navigation
- Browser history works (back/forward buttons)
- Bookmarkable URLs

### Data Fetching
- useEffect hooks trigger on component mount
- localStorage used for current user ID
- Real-time updates after actions
- Loading states during fetch

### User Identification
```typescript
// Current user retrieved from localStorage
const employeeId = localStorage.getItem("employeeId")
const managerId = localStorage.getItem("managerId")
const adminId = localStorage.getItem("adminId")
```

---

## 🔐 Role-Based Access Control

### Employee Role
- Can only see own leaves
- Can only submit leaves
- Cannot approve leaves

### Manager Role
- Can see team leaves
- Can approve/reject team leaves
- Cannot see other team leaves
- Cannot approve company-wide

### Admin Role
- Can see all leaves
- Can approve/reject any leave
- Full system access
- Can override manager decisions

---

## 🔄 Request Lifecycle

### State Transitions
```
1. SUBMITTED
   ↓
2. PENDING (Awaiting approval)
   ├→ APPROVED (By manager/admin)
   │   └→ Employee notified (future feature)
   │
   ├→ REJECTED (With reason)
   │   └→ Employee notified (future feature)
   │
   └→ CANCELLED (By employee)
```

### Workflow Timeline
```
Day 1: Employee submits request
  → Status: PENDING
  → Available in Manager view
  → Manager notified (future)

Day 2-7: Manager reviews
  → Clicks Review
  → Sees details
  → Makes decision
  → Approves/Rejects

Day 8: Request resolved
  → Status updated
  → Employee sees result
  → History shows approval
  → Admin can still override
```

---

## 📋 Required Setup

### Minimum Requirements
1. ✅ Backend server running on port 5000
2. ✅ PostgreSQL database connected
3. ✅ Prisma migrations run
4. ✅ Leave and LeaveApproval tables created
5. ✅ Employee records in database
6. ✅ Manager relationships defined
7. ✅ localStorage configured for user IDs

### Optional Setup
- Email service (for notifications)
- Audit logging system
- Slack integration
- Calendar sync

---

## 🚨 Error Handling

### Frontend Validation
```
Employee submits form
    ↓
Missing fields? → Show error: "Fill all required fields"
    ↓
End date < Start date? → Show error: "Invalid date range"
    ↓
Requesting > Balance? → Show error: "Insufficient balance"
    ↓
All valid? → Submit to API
```

### API Response Handling
```
API success? → Refresh list, show success message
API error? → Show error: "Failed to process request"
Network error? → Show error: "Connection error"
Timeout? → Show error: "Request timeout"
```

---

## 📊 Dashboard Statistics

### Statistics Calculated
```typescript
stats = {
  total: allLeaves.length,
  pending: allLeaves.filter(l => l.status === "PENDING").length,
  approved: allLeaves.filter(l => l.status === "APPROVED").length,
  rejected: allLeaves.filter(l => l.status === "REJECTED").length
}
```

### Updated When
- Page first loads
- After submitting new request
- After approving/rejecting
- When manually refreshing

---

## 🎨 Visual Status Indicators

### Status Badges
```
PENDING   → Yellow badge with clock icon
APPROVED  → Green badge with checkmark icon
REJECTED  → Red badge with X icon
```

### Color Scheme
```
Background: Gradient blue-50 to indigo-100
Cards: White with subtle shadows
Text: Dark gray (900) on white
Links: Blue (600)
Success: Green (600)
Error: Red (600)
Warning: Yellow (600)
```

---

## 📱 Responsive Breakpoints

### Desktop (1024px+)
- Multi-column layouts
- Side-by-side forms and tables
- Full statistics card grid
- All features visible

### Tablet (768px - 1023px)
- 2-3 column layouts
- Responsive tables
- Forms stack vertically
- Adjusted spacing

### Mobile (< 768px)
- Single column layout
- Stacked forms
- Scrollable tables
- Touch-friendly buttons
- Simplified dialogs

---

## 🔍 Troubleshooting Guide

### Issue: Page shows "Loading..."
**Solution:** Check backend connection, verify database is running

### Issue: Can't see team leaves on manager page
**Solution:** Verify reportingManagerId in Employee table

### Issue: Approval button disabled
**Solution:** May be already approved/rejected or session expired

### Issue: Leave balance shows 0
**Solution:** Check Employee record totalLeaveBalance field

### Issue: Search not finding employees
**Solution:** Check spelling, try searching by email

---

## 📞 Support Resources

### Files for Reference
- `LEAVE_MANAGEMENT_COMPLETE.md` - Full technical docs
- `LEAVE_SYSTEM_READY.md` - Quick summary
- `app/employee/request-leave/page.tsx` - Employee code
- `app/admin/leave-management/page.tsx` - Admin code
- `app/manager/leaves/page.tsx` - Manager code
- `backend/src/routes/leaves.ts` - API endpoints

### Testing URLs
- Employee: `http://localhost:3000/employee/request-leave`
- Manager: `http://localhost:3000/manager/leaves`
- Admin: `http://localhost:3000/admin/leave-management`

---

## ✅ Deployment Checklist

- [ ] Backend running
- [ ] Database migrations complete
- [ ] Leave tables created
- [ ] Employee data populated
- [ ] Manager relationships set
- [ ] CORS configured
- [ ] API endpoints accessible
- [ ] Frontend connected
- [ ] localStorage initialized with user IDs
- [ ] All three pages tested
- [ ] Approval workflow verified
- [ ] Error messages display correctly
- [ ] Status updates reflect properly
- [ ] Performance acceptable
- [ ] Security rules applied
