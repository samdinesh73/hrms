import express from "express"
import { PrismaClient } from "@prisma/client"
import { successResponse } from "../utils/response.js"
import { hashPassword } from "../utils/auth.js"

const router = express.Router()
const prisma = new PrismaClient()

// Get all employees
router.get("/", async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        department: true,
        reportingManager: true,
      },
    })
    res.json(successResponse("Employees fetched successfully", employees))
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch employees" })
  }
})

// Get employee by ID (can be employee.id or employee.userId)
router.get("/:id", async (req, res) => {
  try {
    let employee = await prisma.employee.findUnique({
      where: { id: req.params.id },
      include: {
        department: true,
        reportingManager: true,
        leaves: true,
        salaryDetails: true,
      },
    })

    // If not found by employee.id, try to find by userId
    if (!employee) {
      employee = await prisma.employee.findUnique({
        where: { userId: req.params.id },
        include: {
          department: true,
          reportingManager: true,
          leaves: true,
          salaryDetails: true,
        },
      })
    }

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" })
    }

    res.json(successResponse("Employee fetched successfully", employee))
  } catch (error) {
    console.error("Error fetching employee:", error)
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to fetch employee" })
  }
})

// Create employee (Admin only)
router.post("/", async (req, res) => {
  try {
    console.log("Received employee creation request:", req.body)
    
    const {
      userId,
      employeeId,
      firstName,
      lastName,
      email,
      password,
      phone,
      dateOfBirth,
      gender,
      address,
      city,
      state,
      zipCode,
      country,
      departmentId,
      reportingManagerId,
      designation,
      joinDate,
      employmentStatus = "ACTIVE",
      employmentType = "Full-time",
      baseSalary,
      allowances = 0,
      deductions = 0,
      bankAccountNumber,
      bankName,
      ifscCode,
      totalLeaveBalance = 20,
      panNumber,
      aadharNumber,
      passportNumber,
    } = req.body

    // Validate required fields
    if (!employeeId || !firstName || !lastName || !email || !password || !departmentId || !designation || !joinDate || !baseSalary) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email }
    })

    // Create user if it doesn't exist
    if (!user) {
      const hashedPassword = await hashPassword(password)
      user = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          phone: phone || undefined,
          password: hashedPassword, // Hashed password
          role: "EMPLOYEE"
        }
      })
      console.log("User created successfully:", user.id)
    }

    console.log("Creating employee with userId:", user.id)
    const employee = await prisma.employee.create({
      data: {
        userId: user.id,
        employeeId,
        firstName,
        lastName,
        email,
        phone: phone || null,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender: gender || null,
        address: address || null,
        city: city || null,
        state: state || null,
        zipCode: zipCode || null,
        country: country || null,
        departmentId,
        reportingManagerId: reportingManagerId && reportingManagerId.trim() ? reportingManagerId : null,
        designation,
        joinDate: new Date(joinDate),
        employmentStatus,
        employmentType: employmentType || null,
        baseSalary: parseFloat(baseSalary),
        allowances: parseFloat(allowances) || 0,
        deductions: parseFloat(deductions) || 0,
        bankAccountNumber: bankAccountNumber || null,
        bankName: bankName || null,
        ifscCode: ifscCode || null,
        totalLeaveBalance: parseFloat(totalLeaveBalance) || 20,
        panNumber: panNumber || null,
        aadharNumber: aadharNumber || null,
        passportNumber: passportNumber || null,
      },
      include: {
        department: true,
        reportingManager: true,
      },
    })

    console.log("Employee created successfully:", employee.id)
    res.status(201).json(successResponse("Employee created successfully", employee))
  } catch (error) {
    console.error("Error creating employee:", error)
    res.status(500).json({ 
      error: error instanceof Error ? error.message : "Failed to create employee",
      details: error instanceof Error ? error.message : undefined
    })
  }
})

// Update employee
router.put("/:id", async (req, res) => {
  try {
    const employee = await prisma.employee.update({
      where: { id: req.params.id },
      data: req.body,
    })

    res.json(successResponse("Employee updated successfully", employee))
  } catch (error) {
    res.status(500).json({ error: "Failed to update employee" })
  }
})

// Delete employee
router.delete("/:id", async (req, res) => {
  try {
    await prisma.employee.delete({
      where: { id: req.params.id },
    })

    res.json(successResponse("Employee deleted successfully"))
  } catch (error) {
    res.status(500).json({ error: "Failed to delete employee" })
  }
})

export default router
