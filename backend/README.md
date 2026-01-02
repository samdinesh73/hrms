# HRMS Backend API

A comprehensive Human Resource Management System backend built with Node.js, Express, Prisma ORM, and PostgreSQL.

## 📋 Features

- **Employee Management**: Complete employee records with personal, employment, and salary details
- **Manager Dashboard**: Team management and employee oversight
- **Admin Controls**: System administration and user management
- **Task Management**: Assign, track, and manage team tasks
- **Leave Management**: Apply, approve, and track employee leaves
- **Payroll System**: Salary calculations and payroll processing
- **Attendance Tracking**: Daily attendance and work hour tracking
- **Performance Reviews**: Employee performance evaluation system
- **Authentication**: JWT-based authentication and authorization

## 🗄️ Database Schema

### Core Models

1. **User** - Base user model for authentication
2. **Employee** - Employee information and details
3. **Manager** - Manager information and team management
4. **Admin** - Administrator accounts and permissions
5. **Department** - Department/team organization
6. **Task** - Task management and assignments
7. **Leave** - Leave requests and approvals
8. **SalaryDetail** - Payroll and salary information
9. **Attendance** - Daily attendance records
10. **PerformanceReview** - Performance evaluation
11. **LeaveBalance** - Leave balance tracking per year
12. **PayrollHistory** - Payroll processing history

### Key Features in Schema

- **Relationships**: Complete relational structure with proper constraints
- **Enums**: Type-safe status and role definitions
- **Indexes**: Optimized queries for better performance
- **Cascading Deletes**: Automatic cleanup of related records
- **Timestamps**: Created and updated timestamps for all models

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.x
- PostgreSQL >= 12
- npm or yarn

### Installation

1. **Clone the repository**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
```

Edit `.env` file with your PostgreSQL credentials:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/hrms_db"
PORT=5000
NODE_ENV="development"
JWT_SECRET="your-secret-key"
CORS_ORIGIN="http://localhost:3000"
```

4. **Setup database**
```bash
# Create database
createdb hrms_db

# Run migrations
npm run prisma:migrate

# Seed sample data
npm run prisma:seed
```

5. **Start the server**
```bash
npm run dev
```

Server will be running on `http://localhost:5000`

## 📚 API Endpoints

### Health Check
```
GET /api/health
```

### Employees
```
GET    /api/employees              # Get all employees
GET    /api/employees/:id          # Get employee by ID
POST   /api/employees              # Create employee
PUT    /api/employees/:id          # Update employee
DELETE /api/employees/:id          # Delete employee
```

### Tasks
```
GET    /api/tasks                  # Get all tasks
GET    /api/tasks/:id              # Get task by ID
GET    /api/tasks/status/:status   # Get tasks by status
POST   /api/tasks                  # Create task
PUT    /api/tasks/:id              # Update task
DELETE /api/tasks/:id              # Delete task
```

### Leaves
```
GET    /api/leaves                 # Get all leaves
GET    /api/leaves/:id             # Get leave by ID
GET    /api/leaves/status/pending  # Get pending leaves
POST   /api/leaves                 # Apply for leave
POST   /api/leaves/:id/approve     # Approve/reject leave
```

### Salary
```
GET    /api/salary/employee/:employeeId           # Get salary details
GET    /api/salary/:employeeId/:year/:month       # Get specific salary
POST   /api/salary                                # Create salary detail
PUT    /api/salary/:id                           # Update salary detail
```

## 🛠️ Available Commands

```bash
# Development
npm run dev              # Start development server with auto-reload

# Production
npm run build           # Build TypeScript to JavaScript
npm start              # Start production server

# Database
npm run prisma:migrate # Create and run migrations
npm run prisma:studio  # Open Prisma Studio
npm run prisma:seed    # Seed database with sample data
npm run prisma:generate # Generate Prisma client

# Code Quality
npm run lint           # Run ESLint
npm run type-check     # Check TypeScript types
```

## 📝 Example Requests

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

### Apply for Leave
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
    "description": "Develop REST API",
    "assignedToId": "emp-id",
    "assignedById": "emp-id",
    "priority": "HIGH",
    "dueDate": "2024-02-15",
    "estimatedHours": 40
  }'
```

## 📊 Database Diagram

The schema includes the following key relationships:

- **User → Employee/Manager/Admin**: One-to-One relationships
- **Department → Employee/Manager**: One-to-Many relationships
- **Manager → Employee**: One-to-Many (reporting structure)
- **Employee → Task**: One-to-Many
- **Employee → Leave**: One-to-Many
- **Employee → SalaryDetail**: One-to-Many
- **Leave → LeaveApproval**: One-to-Many
- **Task → TaskAssignment**: One-to-Many

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. Get token from login endpoint
2. Include token in Authorization header: `Authorization: Bearer <token>`
3. Token expires after 24 hours (configurable)

## 🌐 CORS Configuration

CORS is enabled for frontend integration. Configure allowed origins in `.env`:
```env
CORS_ORIGIN="http://localhost:3000,https://yourdomain.com"
```

## 📦 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Language**: TypeScript
- **Authentication**: JWT + bcryptjs
- **Middleware**: Morgan, CORS

## 🐛 Troubleshooting

### Database Connection Failed
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Ensure database exists: `createdb hrms_db`

### Migration Errors
```bash
# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# Or deploy migrations
npm run prisma:migrate:prod
```

### Port Already in Use
```bash
# Change PORT in .env file
PORT=5001
```

## 📚 Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Express.js Guide](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT Documentation](https://jwt.io/)

## 📄 License

ISC

## 👨‍💻 Development

To add new features:

1. Update Prisma schema if needed
2. Create migration: `npm run prisma:migrate`
3. Create new route in `src/routes/`
4. Add middleware if required
5. Test with sample requests

---

**Happy coding! 🚀**
