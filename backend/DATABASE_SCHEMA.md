# HRMS Database Schema Documentation

## Complete Database Schema with All Tables and Columns

### 1. **Users Table**
User authentication and base information
```
✓ id (Primary Key)
✓ email (Unique)
✓ password (Hashed)
✓ firstName
✓ lastName
✓ phone
✓ role (EMPLOYEE | MANAGER | ADMIN)
✓ isActive (Boolean)
✓ createdAt
✓ updatedAt
```

---

### 2. **Employees Table**
Complete employee information and employment details
```
✓ id (Primary Key)
✓ userId (Foreign Key - User)
✓ employeeId (Unique)
✓ firstName
✓ lastName
✓ email (Unique)
✓ phone

PERSONAL INFORMATION:
✓ dateOfBirth
✓ gender
✓ address
✓ city
✓ state
✓ zipCode
✓ country

EMPLOYMENT DETAILS:
✓ departmentId (Foreign Key - Department)
✓ reportingManagerId (Foreign Key - Manager)
✓ designation
✓ joinDate
✓ employmentStatus (ACTIVE | INACTIVE | ON_LEAVE | RESIGNED | TERMINATED)
✓ employmentType (Full-time | Part-time | Contract)

SALARY & BENEFITS:
✓ baseSalary
✓ allowances
✓ deductions
✓ bankAccountNumber
✓ bankName
✓ ifscCode

LEAVE & ATTENDANCE:
✓ totalLeaveBalance
✓ usedLeaves

COMPLIANCE:
✓ panNumber
✓ aadharNumber
✓ passportNumber

METADATA:
✓ avatar (Profile image URL)
✓ notes
✓ createdAt
✓ updatedAt
```

---

### 3. **Departments Table**
Organization structure
```
✓ id (Primary Key)
✓ name (Unique)
✓ description
✓ budget
✓ createdAt
✓ updatedAt
```

---

### 4. **Managers Table**
Manager information and team management
```
✓ id (Primary Key)
✓ userId (Foreign Key - User, Unique)
✓ firstName
✓ lastName
✓ email (Unique)
✓ phone
✓ departmentId (Foreign Key - Department)
✓ designation
✓ joinDate
✓ teamSize
✓ avatar
✓ createdAt
✓ updatedAt
```

---

### 5. **Admins Table**
Administrator accounts
```
✓ id (Primary Key)
✓ userId (Foreign Key - User, Unique)
✓ firstName
✓ lastName
✓ email (Unique)
✓ phone
✓ permissions (Array of permissions)
✓ avatar
✓ lastLoginAt
✓ createdAt
✓ updatedAt
```

---

### 6. **Tasks Table**
Task management and assignment
```
✓ id (Primary Key)
✓ title
✓ description

ASSIGNMENT:
✓ assignedToId (Foreign Key - Employee)
✓ assignedById (Foreign Key - Employee)

STATUS & PRIORITY:
✓ status (PENDING | IN_PROGRESS | COMPLETED | ON_HOLD | CANCELLED)
✓ priority (LOW | MEDIUM | HIGH | CRITICAL)

DATES:
✓ startDate
✓ dueDate
✓ completedAt

TRACKING:
✓ estimatedHours
✓ actualHours
✓ completionPercentage

METADATA:
✓ tags (Array)
✓ attachment (File URL)
✓ notes
✓ createdAt
✓ updatedAt
```

---

### 7. **Task Assignments Table**
Task assignment audit trail
```
✓ id (Primary Key)
✓ taskId (Foreign Key - Task)
✓ managerId (Foreign Key - Manager)
✓ assignedDate
```

---

### 8. **Leaves Table**
Leave request management
```
✓ id (Primary Key)
✓ employeeId (Foreign Key - Employee)

LEAVE TYPE & DURATION:
✓ leaveType (EARNED_LEAVE | CASUAL_LEAVE | SICK_LEAVE | MATERNITY_LEAVE | 
             PATERNITY_LEAVE | UNPAID_LEAVE | SPECIAL_LEAVE)
✓ startDate
✓ endDate
✓ totalDays

STATUS & APPROVALS:
✓ status (PENDING | APPROVED | REJECTED | CANCELLED)
✓ reason
✓ approvedBy (Manager ID)
✓ approvalDate
✓ rejectionReason

METADATA:
✓ appliedOn
✓ createdAt
✓ updatedAt
```

---

### 9. **Leave Approvals Table**
Leave approval workflow tracking
```
✓ id (Primary Key)
✓ leaveId (Foreign Key - Leave)
✓ managerId (Foreign Key - Manager)
✓ status (PENDING | APPROVED | REJECTED | CANCELLED)
✓ approvalDate
✓ comments
```

---

### 10. **Salary Details Table**
Monthly salary calculation and processing
```
✓ id (Primary Key)
✓ employeeId (Foreign Key - Employee)

PERIOD:
✓ month (1-12)
✓ year (e.g., 2024, 2025)

SALARY COMPONENTS:
✓ baseSalary
✓ allowances
✓ bonuses
✓ deductions
✓ taxes

CALCULATIONS:
✓ grossSalary (Auto-calculated)
✓ netSalary (Auto-calculated)

STATUS & PAYMENT:
✓ status (PENDING | APPROVED | PAID)
✓ paymentDate

METADATA:
✓ notes
✓ createdAt
✓ updatedAt
```

---

### 11. **Attendance Table**
Daily attendance and work hour tracking
```
✓ id (Primary Key)
✓ employeeId (Foreign Key - Employee)
✓ attendanceDate
✓ status (PRESENT | ABSENT | HALF_DAY | WORK_FROM_HOME | ON_LEAVE)

TIMING:
✓ checkInTime
✓ checkOutTime
✓ workHours

METADATA:
✓ notes
✓ createdAt
✓ updatedAt
```

---

### 12. **Performance Reviews Table**
Employee performance evaluation
```
✓ id (Primary Key)
✓ employeeId (Foreign Key - Employee)
✓ reviewedById (Foreign Key - Manager)

REVIEW PERIOD:
✓ reviewPeriodStart
✓ reviewPeriodEnd

RATINGS:
✓ overallRating (1-5)
✓ technicalSkills (1-5)
✓ communicationSkills (1-5)
✓ teamwork (1-5)
✓ productivity (1-5)
✓ reliability (1-5)

FEEDBACK:
✓ strengths
✓ areasForImprovement
✓ goals
✓ generalComments

METADATA:
✓ createdAt
✓ updatedAt
```

---

### 13. **Leave Balance Table**
Annual leave balance tracking per year
```
✓ id (Primary Key)
✓ employeeId (Foreign Key - Employee)
✓ year

LEAVE TYPES & ALLOCATIONS:
✓ earnedLeave (Default: 20)
✓ casualLeave (Default: 12)
✓ sickLeave (Default: 10)
✓ maternityLeave (Default: 180 days)
✓ paternityLeave (Default: 15)
✓ unpaidLeave (Default: 0)

USAGE TRACKING:
✓ earnedLeaveUsed
✓ casualLeaveUsed
✓ sickLeaveUsed

METADATA:
✓ updatedAt
```

---

### 14. **Payroll History Table**
Payroll processing audit trail
```
✓ id (Primary Key)
✓ employeeId (Foreign Key - Employee)
✓ month (1-12)
✓ year

PROCESSING:
✓ processedOn (DateTime)
✓ processedBy (User ID)
✓ status (PROCESSED | PAID | PENDING)

METADATA:
✓ createdAt
```

---

## 📊 Enums Defined

```
UserRole:
  - EMPLOYEE
  - MANAGER
  - ADMIN

EmploymentStatus:
  - ACTIVE
  - INACTIVE
  - ON_LEAVE
  - RESIGNED
  - TERMINATED

LeaveStatus:
  - PENDING
  - APPROVED
  - REJECTED
  - CANCELLED

LeaveType:
  - EARNED_LEAVE
  - CASUAL_LEAVE
  - SICK_LEAVE
  - MATERNITY_LEAVE
  - PATERNITY_LEAVE
  - UNPAID_LEAVE
  - SPECIAL_LEAVE

TaskStatus:
  - PENDING
  - IN_PROGRESS
  - COMPLETED
  - ON_HOLD
  - CANCELLED

TaskPriority:
  - LOW
  - MEDIUM
  - HIGH
  - CRITICAL

AttendanceStatus:
  - PRESENT
  - ABSENT
  - HALF_DAY
  - WORK_FROM_HOME
  - ON_LEAVE
```

---

## 🔗 Key Relationships

```
User (1) ──→ (1) Employee
User (1) ──→ (1) Manager
User (1) ──→ (1) Admin

Department (1) ──→ (Many) Employee
Department (1) ──→ (Many) Manager

Manager (1) ──→ (Many) Employee (as reportingManager)
Manager (1) ──→ (Many) TaskAssignment
Manager (1) ──→ (Many) LeaveApproval
Manager (1) ──→ (Many) PerformanceReview

Employee (1) ──→ (Many) Task
Employee (1) ──→ (Many) Leave
Employee (1) ──→ (Many) Attendance
Employee (1) ──→ (Many) SalaryDetail
Employee (1) ──→ (Many) PerformanceReview
Employee (1) ──→ (1) LeaveBalance

Task (1) ──→ (Many) TaskAssignment

Leave (1) ──→ (Many) LeaveApproval
```

---

## 📈 Database Statistics

- **Total Tables**: 14
- **Total Columns**: 150+
- **Relationships**: 20+
- **Indexes**: 15+
- **Enums**: 7
- **Unique Constraints**: 12+

---

## 💾 Sample Data Included

After seeding:
- 5 Departments
- 3 Users (Admin, Manager, Employee)
- 1 Employee record
- 1 Manager record
- 1 Admin record
- 1 Task
- 1 Leave Balance record

---

**Schema is production-ready and optimized for HRMS operations!** ✅
