# 🔐 Authentication & Login System - Complete Guide

## Overview

The HRMS now has a complete role-based authentication system with:
- ✅ Secure password hashing using bcrypt
- ✅ JWT token-based sessions
- ✅ Role-based dashboard redirection (Admin, Manager, Employee)
- ✅ Protected routes and user context
- ✅ Password management

---

## Quick Start

### 1. Install Dependencies

```bash
# Backend dependencies (if not already installed)
cd backend
npm install bcryptjs jsonwebtoken

# Frontend uses existing dependencies
```

### 2. Seed Database with Demo Users

```bash
# Run the seeding script
cd backend
npx ts-node prisma/seed-with-auth.ts
```

This creates:
- **Admin User**: `admin@example.com` / `password123`
- **Manager User**: `mgr@example.com` / `password123`
- **Employee 1**: `emp@example.com` / `password123`
- **Employee 2**: `emp2@example.com` / `password123`

### 3. Start Backend Server

```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

### 4. Start Frontend

```bash
cd (root directory)
npm run dev
# Runs on http://localhost:3000
```

---

## How Passwords Are Managed

### Password Hashing

Passwords are **never** stored in plain text. They are hashed using **bcrypt**:

```typescript
// In backend/src/routes/auth.ts
import bcrypt from "bcryptjs"

// When creating a user:
const hashedPassword = await bcrypt.hash(password, 10)
// Stores: $2a$10$... (hashed string)

// When verifying a user:
const isValid = await bcrypt.compare(inputPassword, storedHash)
// Returns: true/false
```

### Password Security

- **Salt Rounds**: 10 (more = slower but more secure)
- **Hashing Algorithm**: bcrypt (industry standard)
- **Storage**: PostgreSQL database
- **Transmission**: HTTPS (recommended for production)

---

## Login Flow

### Step-by-Step Login Process

```
1. User enters email & password on login page
   ↓
2. Frontend POST to /api/auth/login
   {
     "email": "emp@example.com",
     "password": "password123"
   }
   ↓
3. Backend validates:
   - Email exists in database
   - Account is active
   - Password matches hash (bcrypt.compare)
   ↓
4. If valid:
   - Generate JWT token (expires in 24 hours)
   - Return user data + token
   ↓
5. Frontend stores:
   - authToken (JWT) in localStorage
   - userId, userRole, userEmail in localStorage
   ↓
6. Frontend redirects based on role:
   - ADMIN → /admin/dashboard
   - MANAGER → /manager/dashboard
   - EMPLOYEE → /employee/dashboard
```

---

## API Endpoints

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "emp@example.com",
  "password": "password123"
}

Response 200:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "cuid",
      "email": "emp@example.com",
      "firstName": "John",
      "lastName": "Employee",
      "role": "EMPLOYEE",
      "isActive": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Verify Token
```http
POST /api/auth/verify
Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "message": "Token is valid",
  "data": {
    "user": { ... }
  }
}
```

### Logout
```http
POST /api/auth/logout

Response 200:
{
  "success": true,
  "message": "Logout successful. Please delete the token from localStorage."
}
```

### Change Password
```http
POST /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "oldPassword": "password123",
  "newPassword": "newPassword456"
}

Response 200:
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## Frontend Login Component

### Location
`components/login-form.tsx`

### Features
- Email & password input fields
- Show/hide password toggle
- Error message display
- Loading state during submission
- Demo credentials reference
- Role-based redirection

### How to Use

```typescript
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return <LoginForm />
}
```

---

## How to Change/Reset Passwords

### For Database Admin

#### Option 1: Using Seed Script
```bash
# Edit backend/prisma/seed-with-auth.ts
# Change password, then run:
npx ts-node prisma/seed-with-auth.ts
```

#### Option 2: Using PostgreSQL Client
```sql
-- Connect to PostgreSQL database

-- Hash a new password (example)
-- You need to run this in Node.js:
-- const bcrypt = require('bcryptjs');
-- bcrypt.hash('newPassword123', 10).then(hash => console.log(hash))

-- Then update:
UPDATE "users" SET password = '$2a$10$...' WHERE email = 'emp@example.com';
```

#### Option 3: Create Admin Password Reset API
```typescript
// In backend/src/routes/auth.ts - add this endpoint

router.post("/admin/reset-password", async (req, res) => {
  // Verify admin authentication first
  const { userId, newPassword } = req.body
  
  const hashedPassword = await bcrypt.hash(newPassword, 10)
  
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword }
  })
  
  return res.json({ success: true })
})
```

### For End Users (Self-Service)

Users can change their own passwords using:
```
POST /api/auth/change-password
```

---

## Dashboard Redirection

After login, users are automatically redirected to their dashboard:

```typescript
// In components/login-form.tsx

const role = data.data.user.role

if (role === "ADMIN") {
  router.push("/admin/dashboard")          // Admin Dashboard
} else if (role === "MANAGER") {
  router.push("/manager/dashboard")        // Manager Dashboard
} else if (role === "EMPLOYEE") {
  router.push("/employee/dashboard")       // Employee Dashboard
}
```

### Dashboard Locations
- Admin: `app/admin/dashboard/page.tsx`
- Manager: `app/manager/dashboard/page.tsx`
- Employee: `app/employee/dashboard/page.tsx`

---

## Role-Based Access

### User Roles

| Role | Access | Permissions |
|------|--------|-------------|
| **ADMIN** | Admin Dashboard | Manage all users, approve all leaves, view company stats |
| **MANAGER** | Manager Dashboard | Manage team members, approve team leaves, view team stats |
| **EMPLOYEE** | Employee Dashboard | Request leaves, view own data, submit timesheets |

### Implement Role Checking

```typescript
// In any page component
'use client'

export default function ProtectedPage() {
  const userRole = localStorage.getItem('userRole')
  
  if (userRole !== 'ADMIN') {
    return <div>Access Denied</div>
  }
  
  return <div>Admin Content Only</div>
}
```

---

## Security Best Practices

### ✅ Currently Implemented
- [x] Password hashing with bcrypt
- [x] JWT tokens with expiration (24h)
- [x] CORS enabled for localhost:3000
- [x] Account activation check
- [x] Secure password comparison

### ⚠️ Recommended for Production
- [ ] HTTPS/TLS encryption
- [ ] HTTP-only cookies for tokens
- [ ] CSRF protection
- [ ] Rate limiting on login endpoint
- [ ] 2FA (Two-Factor Authentication)
- [ ] Password strength validation
- [ ] Password expiration policy
- [ ] Audit logging for auth events

### Production Configuration

```typescript
// Environment variables (.env)
JWT_SECRET=your-very-long-random-secret-key
JWT_EXPIRY=24h
CORS_ORIGIN=https://yourdomain.com
NODE_ENV=production
DATABASE_URL=postgresql://...
```

---

## Troubleshooting

### Login Failed - "Invalid email or password"
- Check email is correct
- Check password is correct
- Verify user exists in database
- Check user is active (isActive = true)

### Connection Error on Login
```
Error: Connection error. Make sure the backend server is running on port 5000.
```
Solution:
```bash
# Make sure backend is running
cd backend && npm run dev
# Check http://localhost:5000/api/health
```

### Token Expired
- JWT expires after 24 hours
- User must login again to get new token
- Can extend expiration in `/api/auth/verify`

### Forgotten Passwords
1. Database admin can reset using seed script
2. Implement forgot password API endpoint
3. Send reset link via email
4. User sets new password

---

## Database Schema (Users Table)

```sql
CREATE TABLE "users" (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  phone VARCHAR(255),
  role ENUM('EMPLOYEE', 'MANAGER', 'ADMIN'),
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

---

## Next Steps

1. ✅ Test login with demo credentials
2. ✅ Verify role-based redirection works
3. Add password reset email functionality
4. Implement 2FA for added security
5. Set up password expiration policies
6. Create user management admin panel
7. Add login activity logging

---

## Support & Documentation

- **Backend Auth Routes**: `backend/src/routes/auth.ts`
- **Frontend Login Form**: `components/login-form.tsx`
- **Seeding Script**: `backend/prisma/seed-with-auth.ts`
- **Database Schema**: `backend/prisma/schema.prisma`

For more info, check the code comments in these files.
