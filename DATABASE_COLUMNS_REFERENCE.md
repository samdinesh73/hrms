# Employee Dashboard - Database Columns Reference

## All Columns Displayed in Dashboard

### Personal Information Tab
These columns from `Employee` table:

| Column | Label | Format | Example |
|--------|-------|--------|---------|
| `email` | Email Address | Plain text | aarthi@sellersrocket.com |
| `phone` | Phone Number | Plain text | +91 9876543210 |
| `dateOfBirth` | Date of Birth | Full date | January 15, 1998 |
| `gender` | Gender | Plain text | Female |
| `address` | Address | Plain text | 123 Main Street |
| `city` | City | Plain text | Bangalore |
| `state` | State | Plain text | Karnataka |
| `zipCode` | ZIP Code | Plain text | 560001 |
| `country` | Country | Plain text | India |

### Employment Tab
These columns from `Employee` table + relations:

| Column | Label | Format | Example |
|--------|-------|--------|---------|
| `designation` | Designation | Plain text | Associate |
| `department.name` | Department | From relation | E-COM |
| `employmentType` | Employment Type | Plain text | Full-time |
| `employmentStatus` | Status | Badge | ACTIVE |
| `joinDate` | Join Date | Full date | January 15, 2023 |
| `reportingManager` | Reporting Manager | Full name | John Doe |

### Salary & Benefits Tab
These columns from `Employee` table:

| Column | Label | Format | Example |
|--------|-------|--------|---------|
| `baseSalary` | Base Salary | Currency | ₹ 50,000 |
| `allowances` | Allowances | Currency | ₹ 5,000 |
| `deductions` | Deductions | Currency | ₹ 2,000 |
| `(calculated)` | Net Salary | Formula | ₹ 53,000 |
| `bankAccountNumber` | Bank Account | Masked | ****3456 |
| `bankName` | Bank Name | Plain text | HDFC Bank |
| `ifscCode` | IFSC Code | Plain text | HDFC0001234 |

### Documents Tab
These columns from `Employee` table:

| Column | Label | Format | Example |
|--------|-------|--------|---------|
| `panNumber` | PAN Number | Masked | ABC****XYZ |
| `aadharNumber` | Aadhar Number | Masked | ****5678 |
| `passportNumber` | Passport Number | Plain text | G1234567 |
| `ifscCode` | IFSC Code | Plain text | HDFC0001234 |

### Leaves Tab
These columns from `Employee` table + `Leave` relation:

| Column | Label | Format | Example |
|--------|-------|--------|---------|
| `totalLeaveBalance` | Total Allocated | Number | 20 |
| `usedLeaves` | Used | Number | 4 |
| `(calculated)` | Remaining Balance | Formula | 16 |
| `leaves[]` | Leave History | Leave objects | 5 recent leaves |
| `leaves[].leaveType` | Type | Badge | SICK_LEAVE |
| `leaves[].totalDays` | Days | Number | 2 |
| `leaves[].status` | Status | Badge | APPROVED |

### Info Cards (Top Row)
Quick access cards displaying:

| Card | Data | Source |
|------|------|--------|
| Employee ID | `employeeId` | From Employee table |
| Status | `employmentStatus` | From Employee table |
| Department | `department.name` | From Department relation |
| Join Date | `joinDate` | From Employee table |

### Leave Summary Cards (Second Row)
Calculated metrics:

| Card | Calculation | Source |
|------|-------------|--------|
| Total Leaves | `totalLeaveBalance` | From Employee table |
| Used | `usedLeaves` | From Employee table |
| Pending Requests | Count of leaves where status = "PENDING" | From Leave relation |
| Remaining Balance | `totalLeaveBalance - usedLeaves` | Calculated |

---

## Database Schema Integration

### Employee Table Structure
```typescript
model Employee {
  // Primary
  id                    String   @id @default(cuid())
  userId                String   @unique  ← Used for lookup
  employeeId            String   @unique
  
  // Names
  firstName             String
  lastName              String
  
  // Contact
  email                 String   @unique
  phone                 String?
  address               String?
  city                  String?
  state                 String?
  zipCode               String?
  country               String?
  
  // Personal
  dateOfBirth           DateTime?
  gender                String?
  
  // Employment
  departmentId          String
  reportingManagerId    String?
  designation           String
  joinDate              DateTime
  employmentStatus      EmploymentStatus
  employmentType        String?
  
  // Salary
  baseSalary            Float
  allowances            Float @default(0)
  deductions            Float @default(0)
  
  // Bank
  bankAccountNumber     String?
  bankName              String?
  ifscCode              String?
  
  // Leave
  totalLeaveBalance     Float @default(20)
  usedLeaves            Float @default(0)
  
  // Documents
  panNumber             String?
  aadharNumber          String?
  passportNumber        String?
  
  // Relations
  department            Department @relation(...)
  reportingManager      Manager? @relation(...)
  leaves                Leave[]
  salaryDetails         SalaryDetail[]
  
  // Timestamps
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
}
```

### Relations Included
The API includes these relations:
```typescript
include: {
  department: true,           ← For department.name
  reportingManager: true,     ← For manager name/email
  leaves: true,               ← For leave history
  salaryDetails: true,        ← For salary information
}
```

---

## API Response Format

When you call `GET /api/employees/:userId`, you get:

```json
{
  "success": true,
  "message": "Employee fetched successfully",
  "data": {
    "id": "employee-uuid",
    "userId": "user-uuid",
    "employeeId": "SR0162",
    "firstName": "Aarthi",
    "lastName": "Saranya",
    "email": "aarthi@sellersrocket.com",
    "phone": "+91 9876543210",
    "dateOfBirth": "1998-01-15T00:00:00.000Z",
    "gender": "Female",
    "address": "123 Main Street",
    "city": "Bangalore",
    "state": "Karnataka",
    "zipCode": "560001",
    "country": "India",
    "departmentId": "dept-uuid",
    "reportingManagerId": "manager-uuid",
    "designation": "Associate",
    "joinDate": "2023-01-15T00:00:00.000Z",
    "employmentStatus": "ACTIVE",
    "employmentType": "Full-time",
    "baseSalary": 50000,
    "allowances": 5000,
    "deductions": 2000,
    "bankAccountNumber": "123456789",
    "bankName": "HDFC Bank",
    "ifscCode": "HDFC0001234",
    "totalLeaveBalance": 20,
    "usedLeaves": 4,
    "panNumber": "ABCDE1234F",
    "aadharNumber": "1234-5678-9012",
    "passportNumber": "G1234567",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-05T15:45:00.000Z",
    "department": {
      "id": "dept-uuid",
      "name": "E-COM"
    },
    "reportingManager": {
      "id": "manager-uuid",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@company.com"
    },
    "leaves": [
      {
        "id": "leave-uuid",
        "leaveType": "SICK_LEAVE",
        "startDate": "2024-12-01",
        "endDate": "2024-12-02",
        "totalDays": 2,
        "status": "APPROVED"
      }
    ]
  }
}
```

---

## Missing Optional Fields Handling

Some fields are optional (marked with `?` in schema). If not provided:
- **Dashboard shows**: "Not provided"
- **This is normal**: Most seeded employees don't have all optional fields
- **To populate**: Update via Prisma Studio or through update API

Optional fields that might show "Not provided":
- `phone`
- `dateOfBirth`
- `gender`
- `address`
- `city`
- `state`
- `country`
- `reportingManagerId`
- `employmentType`
- `bankAccountNumber`
- `bankName`
- `panNumber`
- `aadharNumber`
- `passportNumber`

---

## Calculation Formulas Used

### Net Salary
```
Net Salary = baseSalary + allowances - deductions
```

### Remaining Leave Balance
```
Remaining = totalLeaveBalance - usedLeaves
```

### Years of Service
```
Years = floor((Current Date - joinDate) / 365.25)
```

---

## Data Validation

### Required Fields (Always Present)
✅ employeeId
✅ firstName
✅ lastName
✅ email
✅ departmentId
✅ designation
✅ joinDate
✅ baseSalary
✅ totalLeaveBalance
✅ employmentStatus

### Optional Fields (May Be Missing)
⚠️ phone
⚠️ dateOfBirth
⚠️ gender
⚠️ address
⚠️ city
⚠️ state
⚠️ country
⚠️ bankAccountNumber
⚠️ bankName
⚠️ panNumber
⚠️ aadharNumber
⚠️ passportNumber

---

## Frontend Display Logic

```typescript
// Personal Info
{employee?.phone || "Not provided"}
{employee?.dateOfBirth ? formatDate(employee.dateOfBirth) : "Not provided"}

// Salary
{employee?.baseSalary?.toLocaleString()}  // Format as currency
{(baseSalary + allowances - deductions).toLocaleString()}  // Net

// Documents (Masked)
{employee?.panNumber ? `${employee.panNumber.slice(0, 3)}****${employee.panNumber.slice(-3)}` : "Not provided"}
{employee?.aadharNumber ? `****${employee.aadharNumber.slice(-4)}` : "Not provided"}

// Relations
{employee?.department?.name || "Unknown"}
{employee?.reportingManager ? `${employee.reportingManager.firstName} ${employee.reportingManager.lastName}` : "Not assigned"}
```

---

## Testing Data

Default test employee data includes:
- 43 employees with full details
- All from Sellers Rocket organization
- Fields populated: ID, name, email, department, designation, salary, join date
- Fields NOT populated: DOB, address, documents (optional fields)

---

## Column Visibility Priority

**Always Shown (Required Fields)**
1. Employee ID & Name
2. Email & Phone
3. Designation & Department
4. Status & Join Date

**Often Shown (Common Fields)**
5. Base Salary
6. Leave Balance
7. Reporting Manager

**Conditionally Shown (Optional Fields)**
8. Address, City, State, Country
9. Date of Birth, Gender
10. Bank Details
11. Documents (PAN, Aadhar, Passport)
12. Employment Type

---

**Last Updated**: January 5, 2026
**Version**: 1.0
