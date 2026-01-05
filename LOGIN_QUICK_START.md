# 🚀 Login & Authentication - Quick Start

## Demo Credentials

Use these credentials to test the login system:

| Role | Email | Password |
|------|-------|----------|
| 👨‍💼 Admin | `admin@example.com` | `password123` |
| 👔 Manager | `mgr@example.com` | `password123` |
| 👤 Employee | `emp@example.com` | `password123` |
| 👤 Employee 2 | `emp2@example.com` | `password123` |

---

## Setup Steps (One Time)

### 1. Install Backend Dependencies
```bash
cd backend
npm install bcryptjs jsonwebtoken
```

### 2. Seed the Database
```bash
cd backend
npx ts-node prisma/seed-with-auth.ts
```

You should see:
```
✅ Admin: admin@example.com / password123
✅ Manager: mgr@example.com / password123
✅ Employee 1: emp@example.com / password123
✅ Employee 2: emp2@example.com / password123
✨ Database seeded successfully!
```

### 3. Start Backend Server
```bash
# From backend directory
npm run dev
# Should show: Server running on port 5000
```

### 4. Start Frontend
```bash
# From root directory
npm run dev
# Should show: Server running on port 3000
```

---

## Login Process

1. Open **http://localhost:3000/login**
2. Enter email & password from demo credentials above
3. Click **Login**
4. You'll be automatically redirected to your dashboard:
   - Admin → `/admin/dashboard`
   - Manager → `/manager/dashboard`
   - Employee → `/employee/dashboard`

---

## What Happens After Login

### User Data Stored (localStorage)
```javascript
localStorage.getItem("authToken")    // JWT token
localStorage.getItem("userId")       // User ID
localStorage.getItem("userRole")     // User role
localStorage.getItem("userEmail")    // User email
localStorage.getItem("userName")     // First & Last name
```

### Dashboards Available
- **Admin Dashboard**: Manage all users and view company-wide statistics
- **Manager Dashboard**: Manage team and approve team member requests
- **Employee Dashboard**: Request leaves, view personal data, submit forms

---

## Key Features

### ✅ Security
- Passwords are hashed using bcrypt (never stored in plain text)
- JWT tokens expire after 24 hours
- Account activation check (inactive users cannot login)

### ✅ Role-Based Access
- Different dashboards for different roles
- Automatic redirection after login
- Role-specific features and permissions

### ✅ Error Handling
- Clear error messages for invalid credentials
- Connection error handling
- Invalid token detection

---

## Logout

Click the **Logout** button in your dashboard to:
1. Call logout API
2. Clear all stored user data
3. Redirect to login page

---

## Changing Passwords

### For Your Own Account
Navigate to your profile settings and use:
```
POST /api/auth/change-password
```

### Admin Resetting User Passwords
1. Edit `backend/prisma/seed-with-auth.ts`
2. Change the password value
3. Run seeding script again

---

## Troubleshooting

### "Invalid email or password"
- Check email spelling exactly
- Check password is "password123" (case-sensitive)
- Verify user exists: check database or re-run seed script

### "Connection error... backend server... port 5000"
- Make sure backend is running: `npm run dev` from backend directory
- Check no other service is using port 5000
- Verify API is reachable: `http://localhost:5000/api/health`

### "Token expired"
- Login again to get a fresh token
- Tokens are valid for 24 hours

### Cannot access dashboard after login
- Check browser console (F12) for errors
- Verify localStorage has token: `localStorage.getItem("authToken")`
- Clear browser cache and try again

---

## Technical Stack

| Component | Technology |
|-----------|-----------|
| Frontend | Next.js 13+, React, TypeScript |
| Backend API | Express.js, Node.js |
| Database | PostgreSQL |
| Password Hashing | bcrypt |
| Authentication | JWT (JSON Web Tokens) |

---

## API Endpoints

```
POST /api/auth/login              - User login
POST /api/auth/verify             - Verify token validity
POST /api/auth/logout             - User logout
POST /api/auth/change-password    - Change password
```

---

## Next Steps

1. ✅ Test login with all demo credentials
2. ✅ Check dashboard redirection works
3. ✅ Try changing password in dashboard
4. Add profile management
5. Add user administration (create/edit users)
6. Add password reset via email
7. Add 2-factor authentication

---

## File Locations

- **Login Page**: `app/login/page.tsx`
- **Login Component**: `components/login-form.tsx`
- **Backend Auth Routes**: `backend/src/routes/auth.ts`
- **Seeding Script**: `backend/prisma/seed-with-auth.ts`
- **Authentication Guide**: `AUTHENTICATION_GUIDE.md`

---

Need help? Check `AUTHENTICATION_GUIDE.md` for detailed documentation.
