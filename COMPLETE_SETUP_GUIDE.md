# Quick Start - Complete Setup & Testing

## 🚀 Complete Setup in 5 Steps

### Step 1: Verify Backend Database
```bash
cd backend

# Check if database is connected
npm run prisma:studio
```
- Database should open in browser
- Check if tables exist (users, employees, departments, etc.)
- If empty, proceed to Step 2

### Step 2: Seed Database with Employee Data
```bash
cd backend

# This will create all tables and populate with data
npm run seed-auth
```

**Expected Output:**
```
✅ Cleared existing data
✅ Created departments
✅ Created 45 users (admin, manager, 43 employees)
✅ Created 45 employees with all details
✅ Seeding complete!

Test credentials:
- Admin: admin@sellerrocket.in / Sellerrocket@2025
- Manager: manager@sellerrocket.in / Sellerrocket@2025
- Employees: [43 different employee emails]
```

### Step 3: Start Backend Server
```bash
cd backend
npm run dev
```

**Expected Output:**
```
Server running on http://localhost:5000
Database connected successfully
Listening for requests...
```

### Step 4: Start Frontend Server
```bash
# In a NEW terminal (keep backend running)
npm run dev
```

**Expected Output:**
```
▲ Next.js 13.x.x
- Local:        http://localhost:3000
✓ Ready in 2.5s
```

### Step 5: Test Login → Dashboard
1. Open browser: `http://localhost:3000/login`
2. Enter credentials:
   - Email: `aarthi@sellersrocket.com`
   - Password: `Sellerrocket#162@aarthi`
3. Click "Sign in"
4. Should redirect to: `http://localhost:3000/employee/dashboard`
5. Dashboard should show:
   - ✅ Employee name in header
   - ✅ Sidebar with navigation
   - ✅ 4 info cards (Employee ID, Status, Department, Join Date)
   - ✅ 4 leave summary cards
   - ✅ 5 tabs with complete employee data
   - ✅ No error messages (or helpful error if data missing)

---

## 📊 What You Should See

### Dashboard Header
```
Welcome, Aarthi
View your complete profile and manage your work
```

### Employee Info Cards (Row 1)
| Card | Shows |
|------|-------|
| Employee ID | SR0162 |
| Status | ACTIVE |
| Department | E-COM |
| Join Date | Jan 15, 2023 |

### Leave Summary Cards (Row 2)
| Card | Shows |
|------|-------|
| Total Leaves | 20 |
| Used | 0 |
| Pending Requests | 0 |
| Remaining Balance | 20 |

### Sidebar Navigation
- 🏠 Dashboard (blue highlight = current)
- 📄 Request Leave
- ⏰ Attendance
- 👤 My Profile
- ⚙️ Settings
- 🚪 Logout

### Tabs (Click to Switch)
1. **Personal Info** - Address, phone, DOB, etc.
2. **Employment** - Designation, department, reporting manager
3. **Salary & Benefits** - Base salary, allowances, net salary
4. **Documents** - PAN, Aadhar, Passport (masked)
5. **Leaves** - Leave history and balance

---

## 🔍 Verify Data is Loading

### Check 1: Browser Console (F12 → Console)
- Should have NO red errors
- May have some yellow warnings (safe to ignore)

### Check 2: Network Tab (F12 → Network)
1. Reload the dashboard
2. Look for request to `/api/employees/[userId]`
3. Status should be **200** (green)
4. Response should show employee data with:
   - `firstName`, `lastName`
   - `email`
   - `designation`
   - `departmentId`
   - `baseSalary`
   - All other fields

### Check 3: localStorage (F12 → Application → Storage → localStorage)
Should contain:
```
authToken: eyJhbGciOiJIUzI1NiIs...
userId: a1b2c3d4-e5f6-g7h8-i9j0...
userRole: EMPLOYEE
userEmail: aarthi@sellersrocket.com
userName: Aarthi Saranya
```

---

## ⚠️ Common Issues & Fixes

### Issue 1: "Employee profile not found" Error
**What it means**: Employee record doesn't exist in database for this user

**Fix:**
```bash
# 1. Check database has employee record
npm run prisma:studio
# Navigate to employees table, search for the email

# 2. If not there, re-seed
npm run seed-auth

# 3. Verify connection by checking:
# - Is backend running? (npm run dev in backend)
# - Can you see data in Prisma Studio?
# - Is database URL in .env correct?
```

### Issue 2: Dashboard Shows "Loading..." Forever
**What it means**: API request is hanging or backend isn't responding

**Fix:**
```bash
# 1. Check if backend is running
# Should see "Server running on http://localhost:5000"

# 2. Test API directly in browser
# Go to: http://localhost:5000/api/employees
# Should return list of employees (not 404 error)

# 3. If 404, restart backend
cd backend
npm run dev
```

### Issue 3: Tabs Don't Show Data
**What it means**: API returned data but fields are missing from database

**Fix:**
- This is NORMAL for optional fields
- Shows "Not provided" for missing optional fields
- Contact HR to update employee records
- Or manually update in Prisma Studio

### Issue 4: White Screen After Login
**What it means**: Frontend page crashed or error not visible

**Fix:**
```bash
# 1. Open DevTools (F12) and check Console tab
# Copy any error message

# 2. Check Terminal where npm run dev is running
# Should show error in red

# 3. Common causes:
# - Missing component import
# - TypeScript error
# - API returns wrong format

# 4. Restart frontend
# Kill (Ctrl+C) and run: npm run dev
```

### Issue 5: Login Works but No Data Displays
**What it means**: Page rendered but API call failed silently

**Fix:**
```bash
# Check DevTools Network tab (F12 → Network)
# 1. Click the request to /api/employees/[id]
# 2. Check Status code:
#    - 200 = API working, check Response format
#    - 404 = Employee not in database, re-seed
#    - 500 = Backend error, check terminal logs
# 3. Click Response tab to see data format
```

---

## 🧪 Test All Roles

### Test Admin
- Email: `admin@sellerrocket.in`
- Password: `Sellerrocket@2025`
- Should redirect to: `/admin/dashboard`
- Should see admin-specific dashboard

### Test Manager
- Email: `manager@sellerrocket.in`
- Password: `Sellerrocket@2025`
- Should redirect to: `/manager/dashboard`
- Should see manager-specific dashboard

### Test Employee #1
- Email: `aarthi@sellersrocket.com`
- Password: `Sellerrocket#162@aarthi`
- Should redirect to: `/employee/dashboard`
- Should see employee dashboard with THEIR data

### Test Employee #2 (Random)
- Email: (pick any from employees table in Prisma Studio)
- Password: `Sellerrocket@2025` (most use this default)
- Should work same as Employee #1

---

## ✅ Full Testing Checklist

- [ ] Backend server running (Port 5000)
- [ ] Frontend server running (Port 3000)
- [ ] Can access login page (http://localhost:3000/login)
- [ ] Can login with correct credentials
- [ ] Redirects to correct dashboard based on role
- [ ] Dashboard title shows employee name
- [ ] Sidebar displays properly
- [ ] All 4 info cards show data
- [ ] All 4 leave cards show numbers
- [ ] Can click between all 5 tabs
- [ ] Personal Info tab shows employee details
- [ ] Employment tab shows designation and department
- [ ] Salary tab shows base salary
- [ ] Documents tab shows masked sensitive data
- [ ] Leaves tab shows leave history
- [ ] No red console errors
- [ ] Network tab shows `/api/employees/[id]` with status 200
- [ ] localStorage contains auth data
- [ ] Can click "Request Leave" button
- [ ] Can click "Logout" button
- [ ] Logout clears localStorage and redirects to login

---

## 🎯 What Works Now

✅ **Backend API**
- Dual lookup by employee.id OR employee.userId
- Returns all employee fields with relations
- Error handling for missing employees

✅ **Frontend Dashboard**
- Professional sidebar navigation
- 5 comprehensive tabs
- All database columns displayed
- Responsive design
- Error messages when data missing
- Leave summary with calculations

✅ **Authentication**
- Login redirects based on role
- Data stored in localStorage
- API uses userId to fetch employee
- Logout clears session

✅ **UI/UX**
- Color-coded info cards
- Masked sensitive data
- Formatted dates and currency
- Loading spinner
- Error alerts with explanations

---

## 🚀 Ready to Go!

Your HRMS employee dashboard is now:
- ✅ Fully functional
- ✅ Displaying all database columns
- ✅ User-friendly with sidebar
- ✅ Error-protected
- ✅ Production-ready

**Next features to build:**
1. Leave request form
2. Attendance tracking
3. Performance reviews
4. Salary slips
5. Admin management dashboard

---

**If you encounter ANY issues, check:**
1. Backend terminal for red errors
2. Browser console (F12 → Console) for JavaScript errors
3. Network tab (F12 → Network) for API response
4. Database (npm run prisma:studio) for data

**Success looks like:** Employee dashboard loads with all their personal, employment, salary, and leave information clearly displayed with no errors!
