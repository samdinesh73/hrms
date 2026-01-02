-- HRMS Database Setup Script
-- This script creates the initial database structure for the HRMS application

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Enums
CREATE TYPE "UserRole" AS ENUM ('EMPLOYEE', 'MANAGER', 'ADMIN');
CREATE TYPE "EmploymentStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ON_LEAVE', 'RESIGNED', 'TERMINATED');
CREATE TYPE "LeaveStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');
CREATE TYPE "LeaveType" AS ENUM ('EARNED_LEAVE', 'CASUAL_LEAVE', 'SICK_LEAVE', 'MATERNITY_LEAVE', 'PATERNITY_LEAVE', 'UNPAID_LEAVE', 'SPECIAL_LEAVE');
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELLED');
CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'HALF_DAY', 'WORK_FROM_HOME', 'ON_LEAVE');

-- Note: After running this script, Prisma migrations will handle the table creation
-- You can view the generated tables by running: npm run prisma:migrate

-- Sample queries for verification after migration:
-- SELECT * FROM "users";
-- SELECT * FROM "employees";
-- SELECT * FROM "departments";
-- SELECT * FROM "tasks";
-- SELECT * FROM "leaves";
