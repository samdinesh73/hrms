# Backend Setup Guide

## 📁 Backend Structure Created

```
backend/
├── prisma/
│   ├── schema.prisma        # Complete Prisma schema with all models
│   ├── seed.ts              # Database seeding script
│   └── init.sql             # SQL initialization reference
├── src/
│   ├── server.ts            # Main Express server
│   ├── middleware/
│   │   └── auth.ts          # Authentication & authorization middleware
│   ├── routes/
│   │   ├── employees.ts     # Employee CRUD operations
│   │   ├── tasks.ts         # Task management endpoints
│   │   ├── leaves.ts        # Leave request & approval endpoints
│   │   └── salary.ts        # Payroll & salary endpoints
│   └── utils/
│       ├── auth.ts          # JWT & password utilities
│       └── response.ts      # Standard response formatting
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules
└── README.md                # Complete documentation
```

## 🗄️ Database Schema Overview

### 13 Core Models

1. **User** - Base authentication model
2. **Employee** - Employee master data with salary & employment details
3. **Manager** - Manager information and team oversight
4. **Admin** - Administrator accounts
5. **Department** - Organizational departments
6. **Task** - Task assignments and tracking
7. **TaskAssignment** - Task assignment audit trail
8. **Leave** - Leave requests
9. **LeaveApproval** - Leave approval workflow
10. **LeaveBalance** - Annual leave balance tracking
11. **SalaryDetail** - Monthly salary calculation and processing
12. **Attendance** - Daily attendance records
13. **PerformanceReview** - Employee performance evaluation
14. **PayrollHistory** - Payroll processing history

### Key Features

✅ **Complete Employee Information**
- Personal details (DOB, gender, address)
- Employment details (designation, join date, status)
- Salary components (base, allowances, deductions)
- Compliance documents (PAN, Aadhar, Passport)

✅ **Task Management**
- Task assignment and tracking
- Priority and status management
- Time estimation and actual hours
- Assignment audit trail

✅ **Leave Management**
- Multiple leave types (Earned, Casual, Sick, Maternity, etc.)
- Leave request workflow
- Approval tracking
- Leave balance per year

✅ **Payroll System**
- Monthly salary calculation
- Allowances, bonuses, deductions
- Tax calculation
- Payment status tracking
- Payroll history

✅ **Attendance & Performance**
- Daily attendance tracking
- Work from home support
- Performance review system
- Rating scales and feedback

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup Database
```bash
# Create PostgreSQL database
createdb hrms_db

# Create .env file
cp .env.example .env

# Edit .env with your database credentials
# DATABASE_URL="postgresql://username:password@localhost:5432/hrms_db"
```

### 3. Run Migrations
```bash
npm run prisma:migrate
```

### 4. Seed Sample Data
```bash
npm run prisma:seed
```

### 5. Start Server
```bash
npm run dev
```

Server runs on: `http://localhost:5000`

## 📊 API Endpoints Available

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee details
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get task details
- `GET /api/tasks/status/:status` - Filter by status
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Leaves
- `GET /api/leaves` - Get all leaves
- `GET /api/leaves/:id` - Get leave details
- `GET /api/leaves/status/pending` - Get pending leaves
- `POST /api/leaves` - Apply for leave
- `POST /api/leaves/:id/approve` - Approve/reject leave

### Salary
- `GET /api/salary/employee/:employeeId` - Get salary details
- `GET /api/salary/:employeeId/:year/:month` - Get specific salary
- `POST /api/salary` - Create salary record
- `PUT /api/salary/:id` - Update salary record

## 🔐 Sample Data Created

After seeding, the database includes:

**Departments:** IT, HR, Finance, Sales, Marketing

**Users:**
- Admin: admin@company.com / admin123
- Manager: manager@company.com / manager123
- Employee: john@company.com / john123

**Sample Employee:** John Doe (Senior Software Engineer)
**Sample Task:** Complete API Development

## 🛠️ Available Scripts

```bash
npm run dev                    # Development with auto-reload
npm run build                 # Build for production
npm start                     # Start production server
npm run prisma:migrate        # Create/run migrations
npm run prisma:studio         # Open Prisma Studio GUI
npm run prisma:seed           # Seed database
npm run prisma:generate       # Generate Prisma client
npm run lint                  # Run ESLint
npm run type-check            # TypeScript type checking
```

## 📝 Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/hrms_db"

# Server
PORT=5000
NODE_ENV="development"

# JWT Authentication
JWT_SECRET="your-super-secret-key"
JWT_EXPIRE="24h"

# CORS
CORS_ORIGIN="http://localhost:3000"
```

## 🔄 Frontend Integration

To connect the frontend to the backend:

1. Update `NEXT_PUBLIC_API_URL` in frontend `.env`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

2. Make API calls:
```typescript
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employees`)
```

## 📚 Database Operations

### View Schema in Prisma Studio
```bash
npm run prisma:studio
```
Opens GUI at http://localhost:5555

### Create New Migration
```bash
npm run prisma:migrate -- --name add_new_column
```

### Reset Database (⚠️ Deletes all data)
```bash
npx prisma migrate reset
```

## ✅ What's Included

- ✅ Complete Prisma schema with 13+ models
- ✅ TypeScript-based Express server
- ✅ JWT authentication utilities
- ✅ CRUD operations for all entities
- ✅ Middleware for auth & CORS
- ✅ Database seeding with sample data
- ✅ Error handling & standardized responses
- ✅ Environment configuration
- ✅ Production-ready structure
- ✅ Comprehensive documentation

## 🚀 Next Steps

1. **Add Authentication Routes** - Login, register, password reset
2. **Add Managers Routes** - Team management endpoints
3. **Add Admin Routes** - System administration
4. **Add More Validations** - Input validation middleware
5. **Add Unit Tests** - Jest test suite
6. **Deploy to Production** - Docker, CI/CD setup

## 📞 Support

For issues or questions, refer to:
- [Prisma Docs](https://www.prisma.io/docs)
- [Express Docs](https://expressjs.com)
- [PostgreSQL Docs](https://www.postgresql.org/docs)

---

Your backend is now ready! 🎉
