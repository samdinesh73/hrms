# ✅ Login & Dashboard Verification Checklist

## System Requirements
- Node.js v18+
- PostgreSQL running
- Backend server capable of running on port 5000
- Frontend development server on port 3000

---

## 🔧 Setup Steps (In Order)

### 1. Backend Database Setup
```bash
cd backend

# Install dependencies (if not already done)
npm install

# Run database migrations
npm run prisma:migrate

# Seed database with real employee data
npm run seed-auth
```

**Expected Output:**
```
✅ Cleared existing data
✅ Created X departments
✅ Created 45 users
✅ Created 45 employees

Test Credentials:
  - Admin: admin@sellerrocket.in / Sellerrocket@2025
  - Manager: manager@sellerrocket.in / Sellerrocket@2025
```

---

### 2. Start Backend Server
```bash
cd backend
npm run dev
```

**Expected Output:**
```
Server running on http://localhost:5000
Database connected successfully
```

---

### 3. Start Frontend Development Server
```bash
# In a new terminal
npm run dev
```

**Expected Output:**
```
▲ Next.js 13.x.x
- Local:        http://localhost:3000
```

---

## 🧪 Testing the Login System

### Test 1: Admin Login
1. Go to `http://localhost:3000/login`
2. Enter:
   - Email: `admin@sellerrocket.in`
   - Password: `Sellerrocket@2025`
3. Click "Sign in"

**Expected Result:**
- ✅ Redirects to `/admin/dashboard`
- ✅ Admin dashboard loads
- ✅ Can see employee directory and statistics

---

### Test 2: Manager Login
1. Go to `http://localhost:3000/login`
2. Enter:
   - Email: `manager@sellerrocket.in`
   - Password: `Sellerrocket@2025`
3. Click "Sign in"

**Expected Result:**
- ✅ Redirects to `/manager/dashboard`
- ✅ Manager dashboard loads
- ✅ Can see team members and performance metrics

---

### Test 3: Employee Login
1. Go to `http://localhost:3000/login`
2. Enter:
   - Email: `aarthi@sellersrocket.com`
   - Password: `Sellerrocket#162@aarthi`
3. Click "Sign in"

**Expected Result:**
- ✅ Redirects to `/employee/dashboard`
- ✅ Employee dashboard loads
- ✅ Shows correct employee profile data:
  - Name: Aarthi
  - Employee ID: SR0162
  - Department: E-COM
  - Designation: Associate
  - Status: ACTIVE

---

### Test 4: Employee Dashboard Data Verification
After login, the dashboard should display:

**Profile Section:**
- ✅ Name matches login user
- ✅ Employee ID is displayed
- ✅ Status badge shows ACTIVE
- ✅ Department shows E-COM
- ✅ Designation shows Associate
- ✅ Email matches database
- ✅ Join date is formatted correctly

**Leave Balance Section:**
- ✅ Shows leave summary (20 total, 4 used, 16 remaining)
- ✅ Progress bars display correctly
- ✅ Leave types are listed (Sick, Casual, Earned)

**Tabs Section:**
- ✅ Overview tab shows leave balance with progress bars
- ✅ Leaves tab shows detailed leave breakdown
- ✅ Leave Requests tab allows requesting new leaves

---

## 🔍 Browser Developer Tools Checks

### Check 1: localStorage
Press `F12` → Application → localStorage → `http://localhost:3000`

Should contain:
```
authToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
userId: "unique-uuid-here"
userRole: "EMPLOYEE"
userEmail: "aarthi@sellersrocket.com"
userName: "Aarthi"
```

### Check 2: Network Requests
1. Open DevTools → Network tab
2. Reload the dashboard
3. Look for these API calls:
   - ✅ `GET /api/employees/{userId}` - Status 200
   - ✅ Response contains employee data

### Check 3: Console Errors
- ✅ No red error messages in console
- ✅ No warnings about missing data
- ✅ Network requests complete successfully

---

## ⚠️ Common Issues & Solutions

### Issue: "User not authenticated" Error
**Symptoms:**
- Dashboard shows error message
- Redirects to login page

**Solutions:**
1. Check if backend is running: `http://localhost:5000/api/employees`
2. Clear browser cookies and localStorage
3. Try logging in again
4. Check that `userId` is stored in localStorage

---

### Issue: "Employee profile not found"
**Symptoms:**
- Dashboard shows with generic employee data
- Warning message displayed

**Solutions:**
1. Verify user exists in database:
   ```bash
   npm run prisma:studio
   # Navigate to Employee table, search for the email
   ```
2. Ensure employee record has matching userId
3. Re-run seeding script: `npm run seed-auth`

---

### Issue: Wrong Dashboard Opens After Login
**Symptoms:**
- Employee sees admin/manager dashboard
- Manager sees employee dashboard

**Solutions:**
1. Check user role in database:
   ```bash
   npm run prisma:studio
   # Check User table, verify role column
   ```
2. Clear localStorage and login again
3. Verify JWT token contains correct role

---

### Issue: No Data in Summary Cards
**Symptoms:**
- Dashboard loads but shows placeholder values
- Leave balance shows "20/4/16" (defaults)

**Solutions:**
1. Verify API response includes leave data:
   - Open Network tab in DevTools
   - Check `/api/employees/{userId}` response
   - Should include `totalLeaveBalance` field
2. Check database schema has leave fields
3. Re-seed database if fields are missing

---

## 📊 Database Verification

Open Prisma Studio to verify data:
```bash
npm run prisma:studio
```

**Check User Table:**
- [ ] 45 total users (43 employees + admin + manager)
- [ ] All have hashed passwords
- [ ] Roles are correct (EMPLOYEE, MANAGER, ADMIN)
- [ ] isActive = true

**Check Employee Table:**
- [ ] 45 total employees
- [ ] All linked to a User via userId
- [ ] Departments are assigned
- [ ] Join dates are set
- [ ] Employee IDs match (SR0162, etc.)

**Check Department Table:**
- [ ] Has 6+ departments
- [ ] Names are correct (E-COM, Digital Marketing, etc.)

---

## 🎯 Final Verification

After all tests pass, verify:
- [ ] Admin can access admin dashboard
- [ ] Manager can access manager dashboard
- [ ] Employee can access employee dashboard
- [ ] Employee cannot access admin/manager dashboards
- [ ] Each dashboard shows role-appropriate data
- [ ] Profile information is accurate
- [ ] Leave balance displays correctly
- [ ] Tabs are functional
- [ ] No console errors
- [ ] API calls return proper data

---

## 📞 Support

If issues persist:
1. Check backend logs for errors
2. Verify database connection: `npm run prisma:studio`
3. Clear all browser cache and localStorage
4. Restart both backend and frontend servers
5. Re-run seed script: `npm run seed-auth`

---

**Version**: 1.0
**Last Updated**: January 5, 2026
