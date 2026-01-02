import express from "express"
import { PrismaClient } from "@prisma/client"
import { successResponse } from "../utils/response.js"

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

// Get employee by ID
router.get("/:id", async (req, res) => {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: req.params.id },
      include: {
        department: true,
        reportingManager: true,
        leaves: true,
        salaryDetails: true,
      },
    })

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" })
    }

    res.json(successResponse("Employee fetched successfully", employee))
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch employee" })
  }
})

// Create employee (Admin only)
router.post("/", async (req, res) => {
  try {
    const { userId, employeeId, firstName, lastName, email, departmentId, designation, joinDate, baseSalary } = req.body

    const employee = await prisma.employee.create({
      data: {
        userId,
        employeeId,
        firstName,
        lastName,
        email,
        departmentId,
        designation,
        joinDate: new Date(joinDate),
        baseSalary,
      },
    })

    res.status(201).json(successResponse("Employee created successfully", employee))
  } catch (error) {
    res.status(500).json({ error: "Failed to create employee" })
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
