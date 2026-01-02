# 🚀 Quick Start Reference Guide

## 5-Minute Setup

### 1️⃣ Install & Configure
```bash
cd backend
npm install
cp .env.example .env
```

### 2️⃣ Setup Database
```bash
# Create PostgreSQL database
createdb hrms_db

# Edit .env file
# DATABASE_URL="postgresql://user:password@localhost:5432/hrms_db"
```

### 3️⃣ Initialize Database
```bash
npm run prisma:migrate
npm run prisma:seed
```

### 4️⃣ Start Backend
```bash
npm run dev
# Server: http://localhost:5000
```

### 5️⃣ Access Frontend
```
Dashboard: http://localhost:3000
Manager: http://localhost:3000/manager/dashboard
```

---

## 📋 Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@company.com | admin123 |
| Manager | manager@company.com | manager123 |
| Employee | john@company.com | john123 |

---

## 📡 API Endpoints Quick Reference

### Employees
```
GET    /api/employees
GET    /api/employees/:id
POST   /api/employees
PUT    /api/employees/:id
DELETE /api/employees/:id
```

### Tasks
```
GET    /api/tasks
GET    /api/tasks/:id
GET    /api/tasks/status/:status
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id
```

### Leaves
```
GET    /api/leaves
GET    /api/leaves/:id
POST   /api/leaves
POST   /api/leaves/:id/approve
```

### Salary
```
GET    /api/salary/employee/:employeeId
GET    /api/salary/:employeeId/:year/:month
POST   /api/salary
PUT    /api/salary/:id
```

---

## 🛠️ Common Commands

```bash
# Development
npm run dev              # Start dev server

# Production
npm run build            # Build TypeScript
npm start               # Start server

# Database
npm run prisma:migrate  # Run migrations
npm run prisma:studio   # GUI database viewer
npm run prisma:seed     # Seed sample data

# Code Quality
npm run lint            # ESLint
npm run type-check      # TypeScript check
```

---

## 📊 Database Tables (14 Total)

| # | Table | Purpose |
|---|-------|---------|
| 1 | users | Authentication |
| 2 | employees | Employee records |
| 3 | managers | Manager data |
| 4 | admins | Admin accounts |
| 5 | departments | Organization |
| 6 | tasks | Task management |
| 7 | task_assignments | Task audit |
| 8 | leaves | Leave requests |
| 9 | leave_approvals | Approval workflow |
| 10 | leave_balances | Leave tracking |
| 11 | salary_details | Payroll |
| 12 | attendance | Attendance |
| 13 | performance_reviews | Performance |
| 14 | payroll_history | Payroll audit |

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| BACKEND_SETUP.md | Complete setup guide |
| PROJECT_OVERVIEW.md | Architecture overview |
| COMPLETION_CHECKLIST.md | Feature checklist |
| backend/README.md | API documentation |
| backend/DATABASE_SCHEMA.md | Schema reference |

---

## 🔧 Troubleshooting

### Database Connection Failed
```bash
# Verify PostgreSQL is running
psql -U postgres

# Check connection string in .env
DATABASE_URL="postgresql://user:password@localhost:5432/hrms_db"
```

### Port Already in Use
```bash
# Change port in .env
PORT=5001
```

### Reset Database
```bash
npx prisma migrate reset
```

---

## 📁 Key Files Location

```
backend/
├── src/server.ts              # Main server
├── prisma/schema.prisma       # Database schema
├── src/routes/                # API routes
├── .env                       # Configuration
└── README.md                  # API docs
```

---

## 💻 Sample API Requests

### Create Employee
```bash
curl -X POST http://localhost:5000/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-id",
    "employeeId": "EMP002",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@company.com",
    "departmentId": "dept-id",
    "designation": "Developer",
    "joinDate": "2024-01-15",
    "baseSalary": 500000
  }'
```

### Apply Leave
```bash
curl -X POST http://localhost:5000/api/leaves \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "emp-id",
    "leaveType": "EARNED_LEAVE",
    "startDate": "2024-02-01",
    "endDate": "2024-02-05",
    "totalDays": 5,
    "reason": "Vacation"
  }'
```

### Create Task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "API Development",
    "assignedToId": "emp-id",
    "assignedById": "emp-id",
    "priority": "HIGH",
    "dueDate": "2024-02-15",
    "estimatedHours": 40
  }'
```

---

## ✨ Features Overview

### Manager Dashboard
- ✅ View team members
- ✅ Monitor performance
- ✅ Assign tasks
- ✅ Manage leave requests
- ✅ Track team metrics

### Backend API
- ✅ Employee management
- ✅ Task tracking
- ✅ Leave management
- ✅ Salary processing
- ✅ Attendance tracking
- ✅ Performance reviews

### Database
- ✅ 14 optimized tables
- ✅ 20+ relationships
- ✅ Type-safe enums
- ✅ Automatic indexes
- ✅ Cascading deletes

---

## 🔐 Security Features

- ✅ JWT Authentication
- ✅ Password Hashing (bcryptjs)
- ✅ CORS Protection
- ✅ Environment Variables
- ✅ SQL Injection Prevention
- ✅ Role-based Access

---

## 📈 Performance

- ✅ Database Indexing
- ✅ Optimized Queries
- ✅ Connection Pooling
- ✅ Efficient Middleware
- ✅ Morgan Logging

---

## 🎯 Ready for Production

Everything is set up and ready to deploy:
- ✅ Backend API
- ✅ Database Schema
- ✅ Authentication
- ✅ Error Handling
- ✅ Environment Config
- ✅ Documentation

---

## 📞 Help & Support

- Documentation: See `BACKEND_SETUP.md`
- API Reference: See `backend/README.md`
- Database: See `backend/DATABASE_SCHEMA.md`
- Architecture: See `PROJECT_OVERVIEW.md`

---

**Your HRMS is ready to use! 🎉**
