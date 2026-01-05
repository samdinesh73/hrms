# 🔒 Complete Authentication System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────┐
│                    LOGIN PAGE                            │
│              (app/login/page.tsx)                        │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Email: admin@example.com                        │  │
│  │  Password: ••••••••                              │  │
│  │                                                   │  │
│  │  [ Login Button ]                                │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────┬────────────────────────────────────────┘
                 │
                 │ POST /api/auth/login
                 │ { email, password }
                 ↓
┌─────────────────────────────────────────────────────────┐
│           BACKEND - AUTH ROUTE                          │
│      (backend/src/routes/auth.ts)                       │
│                                                          │
│  1. Find user by email                                 │
│  2. Check if user is active                            │
│  3. Verify password with bcrypt.compare()              │
│  4. Generate JWT token                                 │
│  5. Return user data + token                           │
└────────────────┬────────────────────────────────────────┘
                 │
                 │ { success, user, token }
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│        FRONTEND - LOGIN FORM COMPONENT                  │
│    (components/login-form.tsx)                          │
│                                                          │
│  localStorage.setItem("authToken", token)              │
│  localStorage.setItem("userId", user.id)               │
│  localStorage.setItem("userRole", user.role)           │
│  localStorage.setItem("userEmail", user.email)         │
│  localStorage.setItem("userName", user.name)           │
└────────────────┬────────────────────────────────────────┘
                 │
                 │ Redirect based on role
                 │
                 ├─→ ADMIN  → /admin/dashboard
                 ├─→ MANAGER → /manager/dashboard
                 └─→ EMPLOYEE → /employee/dashboard
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│              USER DASHBOARD                             │
│     (Role-Specific Features)                            │
│                                                          │
│  ✓ View personal/team/company data                      │
│  ✓ Submit requests                                      │
│  ✓ Approve workflows                                    │
│  ✓ Manage team members                                  │
└─────────────────────────────────────────────────────────┘
```

---

## Password Storage & Verification Flow

### When User Signs Up/Password is Set
```
User Password: "password123"
         ↓
   [bcrypt.hash]
   (salt rounds: 10)
         ↓
Hashed: "$2a$10$uv2xCL4DFn4C0TRJqCvNqOPKa9.V.6vhXVGkqRo6IuVdKxhx3rUe2"
         ↓
[Store in Database]
```

### When User Tries to Login
```
User Input: "password123"
         ↓
[bcrypt.compare with stored hash]
         ↓
Match? → YES → Generate JWT → Return Token
         ↓
        NO → Return Error "Invalid credentials"
```

---

## Database Schema (Simplified)

```sql
-- USERS TABLE
┌─────────────────────────────────────────┐
│ users                                   │
├─────────────────────────────────────────┤
│ id          → VARCHAR (Primary Key)     │
│ email       → VARCHAR (Unique)          │
│ password    → VARCHAR (Hashed)          │
│ firstName   → VARCHAR                   │
│ lastName    → VARCHAR                   │
│ role        → ENUM (EMPLOYEE|MANAGER|ADMIN)
│ isActive    → BOOLEAN (Default: true)   │
│ createdAt   → TIMESTAMP                 │
│ updatedAt   → TIMESTAMP                 │
└─────────────────────────────────────────┘

-- EMPLOYEES TABLE
┌─────────────────────────────────────────┐
│ employees                               │
├─────────────────────────────────────────┤
│ id                  → VARCHAR           │
│ userId (FK)         → VARCHAR           │
│ departmentId (FK)   → VARCHAR           │
│ reportingManagerId  → VARCHAR           │
│ designation         → VARCHAR           │
│ salary              → DECIMAL           │
│ employmentStatus    → ENUM              │
│ totalLeaveBalance   → INT               │
└─────────────────────────────────────────┘
```

---

## API Endpoints Detail

### POST /api/auth/login
```
Request:
{
  "email": "emp@example.com",
  "password": "password123"
}

Success Response (200):
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "clx123...",
      "email": "emp@example.com",
      "firstName": "John",
      "lastName": "Employee",
      "role": "EMPLOYEE",
      "isActive": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}

Error Responses:
401 - "Invalid email or password"
403 - "Your account has been deactivated"
400 - "Email and password are required"
```

### POST /api/auth/verify
```
Request:
Authorization: Bearer <token>

Success Response (200):
{
  "success": true,
  "message": "Token is valid",
  "data": { "user": {...} }
}

Error Response (401):
{ "success": false, "message": "Invalid or expired token" }
```

### POST /api/auth/change-password
```
Request:
Authorization: Bearer <token>
{
  "oldPassword": "password123",
  "newPassword": "newPassword456"
}

Success Response (200):
{ "success": true, "message": "Password changed successfully" }

Error Responses:
401 - "Old password is incorrect"
400 - "Old and new passwords are required"
```

---

## Token Structure (JWT)

### Token Header
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

### Token Payload
```json
{
  "userId": "clx123...",
  "email": "emp@example.com",
  "role": "EMPLOYEE",
  "iat": 1672531200,      // Issued at
  "exp": 1672617600       // Expires in 24 hours
}
```

### Token Signature
```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  "your-secret-key"
)
```

---

## Frontend Storage

### localStorage Keys
```javascript
// Set after successful login
localStorage.authToken = "eyJhbGc..."          // JWT token
localStorage.userId = "clx123..."              // User ID
localStorage.userRole = "EMPLOYEE"             // Role
localStorage.userEmail = "emp@example.com"     // Email
localStorage.userName = "John Employee"        // Full name
```

### Usage in Components
```typescript
import { useEffect } from "react"

export default function Dashboard() {
  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (!token) {
      // Redirect to login
      window.location.href = "/login"
    }
  }, [])

  const userRole = localStorage.getItem("userRole")
  const userName = localStorage.getItem("userName")

  return <div>Welcome, {userName}!</div>
}
```

---

## Role-Based Access Control (RBAC)

### Admin Dashboard
```
Accessible by: ADMIN role only
Features:
  ✓ View all users
  ✓ Manage user accounts
  ✓ Approve all leave requests
  ✓ View company statistics
  ✓ Manage departments
  ✓ Generate reports
```

### Manager Dashboard
```
Accessible by: MANAGER role only
Features:
  ✓ View team members
  ✓ Approve team leave requests
  ✓ View team statistics
  ✓ Assign tasks to team
  ✓ Monitor team performance
```

### Employee Dashboard
```
Accessible by: EMPLOYEE role only
Features:
  ✓ View personal profile
  ✓ Request leave
  ✓ View leave history
  ✓ Submit timesheets
  ✓ View personal tasks
  ✓ View payslip
```

---

## Security Measures

### ✅ Implemented
- [x] Bcrypt password hashing (10 salt rounds)
- [x] JWT token authentication
- [x] Token expiration (24 hours)
- [x] CORS protection
- [x] Account activation verification
- [x] Secure password comparison

### ⚠️ Recommended for Production
- [ ] HTTPS/TLS encryption
- [ ] HTTP-only secure cookies
- [ ] CSRF tokens
- [ ] Rate limiting
- [ ] 2-Factor Authentication
- [ ] Password expiration policy
- [ ] Audit logging
- [ ] Account lockout after failed attempts

---

## File Structure

```
HRMS Project
├── app/
│   ├── login/
│   │   └── page.tsx              ← Login page
│   ├── admin/
│   │   └── dashboard/
│   │       └── page.tsx           ← Admin dashboard
│   ├── manager/
│   │   └── dashboard/
│   │       └── page.tsx           ← Manager dashboard
│   └── employee/
│       └── dashboard/
│           └── page.tsx           ← Employee dashboard
│
├── components/
│   ├── login-form.tsx             ← Login form component
│   └── auth-utils.tsx             ← Logout & protection utilities
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── auth.ts            ← Auth endpoints
│   │   └── server.ts              ← Express server
│   └── prisma/
│       ├── schema.prisma          ← Database schema
│       └── seed-with-auth.ts      ← Seeding script
│
├── AUTHENTICATION_GUIDE.md         ← Detailed guide
└── LOGIN_QUICK_START.md           ← Quick start guide
```

---

## Development Checklist

- [x] Setup bcrypt for password hashing
- [x] Create authentication API routes
- [x] Implement JWT token generation
- [x] Create login form component
- [x] Add role-based redirection
- [x] Create seeding script with demo users
- [x] Add logout functionality
- [x] Create authentication documentation
- [ ] Add password reset via email
- [ ] Implement 2-factor authentication
- [ ] Add user management admin panel
- [ ] Setup audit logging
- [ ] Configure HTTPS for production

---

## Testing the System

### Quick Test Sequence

1. **Start Services**
   ```bash
   # Terminal 1: Backend
   cd backend && npm run dev
   
   # Terminal 2: Frontend
   cd (root) && npm run dev
   ```

2. **Seed Database**
   ```bash
   # Terminal 3: (from backend)
   npx ts-node prisma/seed-with-auth.ts
   ```

3. **Test Login**
   - Navigate to http://localhost:3000/login
   - Try each demo credential
   - Verify correct dashboard loads

4. **Test Logout**
   - Click logout button
   - Verify redirected to login
   - Verify localStorage cleared

5. **Test Token Persistence**
   - Login and refresh page
   - Verify still logged in
   - Check localStorage has token

---

## Troubleshooting Guide

| Issue | Cause | Solution |
|-------|-------|----------|
| Backend won't start | Port 5000 in use | `lsof -i :5000` then kill process |
| Seed script fails | Missing dependencies | `npm install bcryptjs jsonwebtoken` |
| Login always fails | Database not seeded | Run seed script again |
| Token expires immediately | Wrong JWT_SECRET | Check .env configuration |
| CORS error on login | Frontend/backend mismatch | Verify URLs and CORS settings |
| Password hash issues | Old seed script | Delete DB and reseed |

---

## Next Steps

1. Test all login credentials work
2. Verify role-based redirection
3. Add additional authentication features (2FA, password reset)
4. Implement audit logging
5. Setup production security measures
6. Deploy to production environment

