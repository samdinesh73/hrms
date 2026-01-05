# Leave Management System - Complete Implementation

## Overview
A comprehensive leave management system with role-based approval workflow for employees, managers, and administrators.

## Features Implemented

### 1. Employee Leave Request Page (`/employee/request-leave`)
**Location:** `app/employee/request-leave/page.tsx`

**Features:**
- Submit new leave requests with:
  - Leave type selection (7 types: Earned, Casual, Sick, Maternity, Paternity, Unpaid, Special)
  - Start and end date selection
  - Reason/description
  - Automatic day calculation
- Real-time leave balance display
- Leave history table showing all requests
- Status tracking (Pending, Approved, Rejected)
- Detailed view of each request with rejection reasons

**Key Functions:**
- `fetchEmployeeData()` - Get current employee's leave balance
- `fetchLeaveRequests()` - Load all leave requests for employee
- `handleSubmit()` - Submit new leave request with validation
- `calculateTotalDays()` - Calculate leave duration

**Data Flow:**
```
Employee fills form → Validation → POST /api/leaves 
→ Database stores with PENDING status → Success message
```

---

### 2. Admin Leave Management Page (`/admin/leave-management`)
**Location:** `app/admin/leave-management/page.tsx`

**Features:**
- Dashboard with statistics:
  - Total requests count
  - Pending requests
  - Approved requests
  - Rejected requests
- Comprehensive filter system:
  - Filter by status (All, Pending, Approved, Rejected)
  - Search by employee name or email
- Leave requests table showing:
  - Employee name and email
  - Department
  - Leave type
  - Duration (dates and days)
  - Applied date
  - Current status
- Dialog-based approval interface:
  - View full employee and leave details
  - Decision dropdown (Approve/Reject)
  - Comments field (required for rejection)
  - Real-time UI update

**Key Functions:**
- `fetchLeaveRequests()` - Get all leave requests
- `filterLeaveRequests()` - Apply status and search filters
- `handleApproveReject()` - Submit approval/rejection to backend

**Workflow:**
```
Admin views pending requests → Clicks Review → 
Selects Approve/Reject → Adds comments → 
POST /api/leaves/{id}/approve → 
Database updates → Table refreshes
```

---

### 3. Manager Leave Approval Page (`/manager/leaves`)
**Location:** `app/manager/leaves/page.tsx`

**Features:**
- Team-specific leave requests display
- Only shows leave requests from reporting team members
- Same functionality as admin page but filtered to team
- Statistics specific to team requests:
  - Pending requests from team
  - Approved requests
  - Rejected requests
- Approve/reject interface identical to admin page
- Team member details in request display

**Key Functions:**
- `fetchManagerTeam()` - Get list of reporting employees
- `fetchTeamLeaveRequests()` - Get leaves only from team members
- `handleApproveReject()` - Process team member leaves

**Workflow:**
```
Manager logs in → Fetches team members → 
Loads leaves from team only → 
Reviews and approves/rejects → 
Database updates → Updates propagated
```

---

## Database Schema

### Leave Model
```typescript
model Leave {
  id              String   @id @default(cuid())
  employeeId      String   // FK to Employee
  leaveType       LeaveType // ENUM: 7 types
  startDate       DateTime
  endDate         DateTime
  totalDays       Float
  status          LeaveStatus @default(PENDING)
  reason          String?
  approvedBy      String?  // Manager/Admin ID
  approvalDate    DateTime?
  rejectionReason String?
  appliedOn       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  // Relations
  employee        Employee @relation(...)
  leaveApprovals  LeaveApproval[]
}

model LeaveApproval {
  id              String   @id @default(cuid())
  leaveId         String   // FK to Leave
  managerId       String   // FK to Manager
  status          LeaveStatus
  approvalDate    DateTime @default(now())
  comments        String?
  
  // Relations
  leave           Leave    @relation(...)
  approvedBy      Manager  @relation(...)
}
```

### Leave Status & Types
```typescript
enum LeaveStatus {
  PENDING    // Awaiting approval
  APPROVED   // Approved by manager/admin
  REJECTED   // Rejected with reason
  CANCELLED  // Cancelled by employee
}

enum LeaveType {
  EARNED_LEAVE       // Annual leave
  CASUAL_LEAVE       // Casual/personal days
  SICK_LEAVE         // Medical/illness
  MATERNITY_LEAVE    // Maternity benefit
  PATERNITY_LEAVE    // Paternity benefit
  UNPAID_LEAVE       // Unpaid time off
  SPECIAL_LEAVE      // Special circumstances
}
```

---

## API Endpoints

### GET Endpoints

**1. Get All Leaves**
```
GET /api/leaves
Response: { data: [LeaveRequest[], ...] }
```

**2. Get Pending Leaves**
```
GET /api/leaves/status/pending
Response: { data: [PendingLeaves[], ...] }
```

**3. Get Leave by ID**
```
GET /api/leaves/:id
Response: { data: LeaveRequest }
```

### POST Endpoints

**1. Submit New Leave Request**
```
POST /api/leaves
Body: {
  employeeId: string,
  leaveType: LeaveType,
  startDate: ISO date,
  endDate: ISO date,
  totalDays: number,
  reason: string
}
Response: { data: CreatedLeave }
```

**2. Approve/Reject Leave**
```
POST /api/leaves/:id/approve
Body: {
  managerId: string,
  status: "APPROVED" | "REJECTED",
  approvalDate: ISO date,
  comments: string
}
Response: { data: UpdatedLeave }
```

---

## Approval Workflow

### Step 1: Employee Submission
- Employee navigates to `/employee/request-leave`
- Fills form with leave details
- System validates:
  - All required fields filled
  - End date >= Start date
  - Requested days <= Available balance
- Submits POST to `/api/leaves`
- Backend creates Leave record with status: PENDING
- Employee sees success message

### Step 2: Manager Review
- Manager navigates to `/manager/leaves`
- System fetches team members
- Filters and displays only team's pending requests
- Manager clicks "Review" on specific leave
- Dialog shows full details
- Manager selects Approve or Reject
- If Reject: Must add reason (required)
- Clicks Approve/Reject button
- System sends POST to `/api/leaves/{id}/approve`

### Step 3: Admin Override (if needed)
- Admin navigates to `/admin/leave-management`
- Views all company leave requests
- Can approve/reject any pending request
- System treats same as manager approval

### Step 4: Status Update
- Backend updates Leave.status to APPROVED/REJECTED
- Creates LeaveApproval record for audit trail
- Frontend detects change and updates table
- Request moves from "Pending" to resolved status

---

## State Management

### Employee Page
```typescript
const [formData, setFormData] = useState({...})        // Form inputs
const [leaveRequests, setLeaveRequests] = useState([]) // History
const [leaveBalance, setLeaveBalance] = useState(0)    // Available days
const [loading, setLoading] = useState(false)          // Fetch state
const [error, setError] = useState("")                 // Error handling
const [success, setSuccess] = useState("")             // Success feedback
```

### Manager/Admin Pages
```typescript
const [leaveRequests, setLeaveRequests] = useState([])      // All requests
const [filteredRequests, setFilteredRequests] = useState([])// After filtering
const [selectedLeave, setSelectedLeave] = useState(null)    // Dialog state
const [approvalStatus, setApprovalStatus] = useState(...)   // Approve/Reject
const [approvalComments, setApprovalComments] = useState([])// Reason
const [stats, setStats] = useState({...})                   // Dashboard stats
```

---

## Validation Rules

### Leave Request Validation
1. **All fields required:** Leave type, start date, end date, reason
2. **Date logic:** End date must be >= start date
3. **Balance check:** Requested days <= available balance
4. **Reason length:** Optional but recommended

### Approval Validation
1. **Decision required:** Must select Approve or Reject
2. **Rejection reason required:** Comments mandatory when rejecting
3. **Status check:** Can only approve/reject PENDING requests
4. **Manager authorization:** Only requesting manager can approve

---

## UI Components Used

### shadcn/ui Components
- `Card` - Container for sections
- `Button` - All interactive buttons
- `Badge` - Status indicators (Pending/Approved/Rejected)
- `Dialog` - Leave detail view and approval form
- `Table` - Leave requests list
- `Input` - Text inputs and date pickers
- `Label` - Form labels
- `Select` - Dropdown selectors (Leave type, Status)
- `Textarea` - Reason and comments input

### Icons (lucide-react)
- `Calendar` - Dates
- `CheckCircle` - Approved status
- `XCircle` - Rejected status
- `Clock` - Pending status
- `AlertCircle` - Errors
- `Users` - Team context

---

## Color Scheme

### Status Colors
- **Pending:** Yellow (Yellow-100 bg, Yellow-800 text)
- **Approved:** Green (Green-100 bg, Green-800 text)
- **Rejected:** Red (Red-100 bg, Red-800 text)

### Background
- Gradient: Blue-50 → Indigo-100
- Cards: White with subtle shadows

---

## Error Handling

### Frontend Validation
```typescript
if (!formData.leaveType || !formData.startDate || 
    !formData.endDate || !formData.reason) {
  setError("Please fill all required fields")
  return
}

if (totalDays > leaveBalance) {
  setError(`Insufficient balance. Have ${leaveBalance}, 
           requesting ${totalDays}`)
  return
}
```

### API Error Handling
```typescript
try {
  const response = await fetch(...)
  if (!response.ok) {
    setError("Failed to submit request")
  }
} catch (err) {
  setError("Error processing request")
  console.error(err)
}
```

### User Feedback
- Success messages appear for 3-5 seconds
- Error messages displayed until dismissed
- Loading states show spinner
- Disabled buttons prevent double submission

---

## Testing Checklist

### Employee Page
- [ ] Can view leave balance
- [ ] Form validation works (missing fields)
- [ ] Date validation works (end < start)
- [ ] Balance validation works (requesting > available)
- [ ] Successful submission shows message
- [ ] Leave history displays all requests
- [ ] Status badges show correct colors
- [ ] Can view details of each request

### Manager Page
- [ ] Loads only team member leaves
- [ ] Statistics calculated correctly
- [ ] Filters work (status, search)
- [ ] Can open leave details
- [ ] Can approve with optional comments
- [ ] Can reject with required comments
- [ ] Status updates in table immediately
- [ ] Invalid states blocked

### Admin Page
- [ ] Loads all company leaves
- [ ] Statistics show correct counts
- [ ] Filters work across all leaves
- [ ] Can approve/reject any pending request
- [ ] Comments tracked for rejections
- [ ] Can see all rejected leaves with reasons

---

## File Structure

```
app/
├── employee/
│   └── request-leave/
│       └── page.tsx          # Employee page
├── admin/
│   └── leave-management/
│       └── page.tsx          # Admin page
└── manager/
    └── leaves/
        └── page.tsx          # Manager page

backend/
└── src/
    └── routes/
        └── leaves.ts         # Leave API endpoints
```

---

## Future Enhancements

1. **Email Notifications**
   - Notify employee when leave approved/rejected
   - Notify manager/admin when new request submitted

2. **Bulk Operations**
   - Bulk approve multiple requests
   - Bulk reject with template reasons

3. **Calendar View**
   - Visual calendar showing leave dates
   - Team capacity planning

4. **Leave Balance Management**
   - Auto-deduct approved leaves from balance
   - Carry-forward rules
   - Leave reset on new year

5. **Audit Trail**
   - Track all approval history
   - Who approved/rejected and when
   - Change history for each request

6. **Reporting**
   - Leave usage reports by department
   - Employee leave summary
   - Approval rate statistics

---

## Known Limitations

1. **No email integration** - Comments not sent via email
2. **No calendar conflict check** - Can approve overlapping leaves
3. **No auto-deduction** - Balance not automatically updated
4. **No recurring leaves** - Only one-time requests supported
5. **No delegation** - Managers can't delegate approval to others

---

## Deployment Notes

1. Ensure backend is running on port 5000
2. Frontend connects to `http://localhost:5000/api/leaves`
3. Database must have Leave and LeaveApproval tables
4. Employee IDs must exist in database for FK relationships
5. Manager IDs must be valid for approval tracking

---

## Support & Troubleshooting

**Issue:** Leave not appearing after submission
- **Solution:** Check database connection, verify Leave table exists

**Issue:** Can't see team leaves in manager view
- **Solution:** Verify reportingManagerId relationship in Employee table

**Issue:** Approval not updating
- **Solution:** Check browser console for API errors, verify managerId is valid

**Issue:** Balance calculation wrong
- **Solution:** Verify totalLeaveBalance and usedLeaves fields in Employee table
