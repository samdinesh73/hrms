# 🚀 Login & Dashboard Setup Guide

## Overview
This guide will help you properly set up the login system and verify that the employee dashboard loads correctly with user-specific data.

---

## ✅ Prerequisites

1. **Backend Server Running** on `http://localhost:5000`
2. **Database Setup** - PostgreSQL running with proper connection
3. **Environment Variables** - `.env` file configured with:
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/hrms
   JWT_SECRET=your-secret-key-change-in-production
   ```

---

## 🔧 Step 1: Seed the Database

### Option A: Using Real Employee Data (Recommended)

Run the seeding script with real employee data including 43 employees + 2 admin accounts:

```bash
cd backend
npm run seed-auth
```

This creates:
- **Admin User**: `admin@sellerrocket.in` / `Sellerrocket@2025`
- **Manager User**: `manager@sellerrocket.in` / `Sellerrocket@2025`
- **43 Employees**: All with Sellers Rocket employee data and individual passwords

### Option B: Using Default Demo Data

If the seeding script fails, use the basic seed script:

```bash
cd backend
npm run seed
```

---

## 📝 Login Credentials

### For Testing Employee Dashboard:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@sellerrocket.in | Sellerrocket@2025 |
| **Manager** | manager@sellerrocket.in | Sellerrocket@2025 |
| **Employee (Examples)** | aarthi@sellersrocket.com | Sellerrocket#162@aarthi |
| **Employee** | abdul@sellersrocket.com | Sellerrocket#231@abdul |
| **Employee** | abharna@sellersrocket.com | Sellerrocket#237@abharna |

---

## 🔐 How Login Works

### 1. **Login Form** (`components/login-form.tsx`)
- User enters email and password
- Form submits to `http://localhost:5000/api/auth/login`
- Backend validates credentials and returns user data + JWT token

### 2. **Data Storage** (localStorage)
Upon successful login, the following data is stored:
```javascript
{
  "authToken": "jwt-token-here",      // JWT token for API auth
  "userId": "user-uuid",               // User ID from database
  "userRole": "EMPLOYEE",              // Role: EMPLOYEE, MANAGER, or ADMIN
  "userEmail": "user@company.com",     // User email
  "userName": "First Last"             // Full name
}
```

### 3. **Role-Based Redirect**
```
EMPLOYEE    → /employee/dashboard
MANAGER     → /manager/dashboard
ADMIN       → /admin/dashboard
```

---

## 📊 Dashboard Data Flow

### Employee Dashboard (`/employee/dashboard`)

**Step 1: Check Authorization**
- Verify `userRole` from localStorage is `EMPLOYEE`
- If not, show "Access Denied" message

**Step 2: Fetch Employee Details**
- Get `userId` from localStorage
- Call `GET /api/employees/:userId`
- Backend returns:
  ```json
  {
    "id": "user-uuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@company.com",
    "designation": "Associate",
    "department": { "name": "E-COM" },
    "employeeId": "SR0162",
    "joinDate": "2024-01-15",
    "status": "ACTIVE"
  }
  ```

**Step 3: Display Dashboard**
- Profile cards show employee information
- Summary metrics show leave balance
- Tabs display overview, leaves, and requests

---

## 🐛 Troubleshooting

### Problem: "User not authenticated" Error
**Solution:**
- Clear localStorage and login again
- Ensure backend is running on port 5000
- Check that the JWT token is valid

### Problem: "Employee profile not found"
**Solution:**
- Verify the employee exists in database
- Run seeding script: `npm run seed-auth`
- Check that `userId` matches between User and Employee tables

### Problem: Dashboard shows generic data
**Solution:**
- This is the fallback when API call fails
- Check browser console for detailed error messages
- Verify backend is responding to `/api/employees/:userId` endpoint

### Problem: Login redirects to wrong dashboard
**Solution:**
- Check the role returned from login API
- Verify database has correct role assignment
- Clear cache and try again

---

## ✨ Testing Checklist

- [ ] Backend server running on `http://localhost:5000`
- [ ] Database seeded with employee data
- [ ] Can login with admin account
- [ ] Redirects to admin dashboard
- [ ] Admin dashboard displays correctly
- [ ] Can login with manager account
- [ ] Redirects to manager dashboard
- [ ] Can login with employee account
- [ ] Redirects to employee dashboard
- [ ] Employee dashboard shows correct profile data
- [ ] Leave balance data displays
- [ ] Can navigate between tabs
- [ ] Logout button works

---

## 🔑 Key API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| GET | `/api/employees/:userId` | Get employee by user ID |
| GET | `/api/employees` | Get all employees |

---

## 📚 Database Schema

### User Table
```
- id (UUID)
- email (unique)
- password (hashed with bcrypt)
- firstName
- lastName
- role (EMPLOYEE, MANAGER, ADMIN)
- isActive
- createdAt
- updatedAt
```

### Employee Table
```
- id (UUID)
- userId (FK to User)
- employeeId (e.g., SR0162)
- firstName
- lastName
- email
- departmentId (FK to Department)
- designation
- baseSalary
- joinDate
- employmentStatus
- totalLeaveBalance
- reportingManagerId (FK to Manager)
```

---

## 🎯 Next Steps

1. **Run the database seeding script**
2. **Start the backend server**
3. **Login with your credentials**
4. **Verify employee dashboard loads**
5. **Check that profile data is correct**

---

## 💡 Notes

- All passwords are securely hashed using bcrypt (10 salt rounds)
- JWT tokens expire after 24 hours
- Role-based access control is enforced on both frontend and backend
- Each employee's data is isolated to their own dashboard
- Managers can see their team members' data
- Admins can see all employee data

---

**For more details, see:**
- Authentication Architecture: `AUTHENTICATION_ARCHITECTURE.md`
- Login Quick Start: `LOGIN_QUICK_START.md`
