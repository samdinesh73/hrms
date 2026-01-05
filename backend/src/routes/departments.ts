import express from "express"
import { PrismaClient } from "@prisma/client"
import { successResponse } from "../utils/response.js"

const router = express.Router()
const prisma = new PrismaClient()

// Get all departments
router.get("/", async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
      include: {
        employees: true,
      },
    })

    // Transform to include counts and stats
    const deptStats = departments.map(dept => ({
      id: dept.id,
      name: dept.name,
      description: dept.description,
      budget: dept.budget,
      total: dept.employees.length,
      available: dept.employees.filter(e => e.employmentStatus === "ACTIVE").length,
      onLeave: dept.employees.filter(e => e.employmentStatus === "ON_LEAVE").length,
      absent: 0, // Will be updated with attendance API
      head: null, // To be updated with manager info
      createdAt: dept.createdAt,
      updatedAt: dept.updatedAt,
    }))

    res.json(successResponse("Departments fetched successfully", deptStats))
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch departments" })
  }
})

// Get department by ID
router.get("/:id", async (req, res) => {
  try {
    const department = await prisma.department.findUnique({
      where: { id: req.params.id },
      include: {
        employees: true,
        managers: true,
      },
    })

    if (!department) {
      return res.status(404).json({ error: "Department not found" })
    }

    res.json(successResponse("Department fetched successfully", department))
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch department" })
  }
})

// Create department
router.post("/", async (req, res) => {
  try {
    const { name, description, budget } = req.body

    const department = await prisma.department.create({
      data: {
        name,
        description,
        budget,
      },
    })

    res.status(201).json(successResponse("Department created successfully", department))
  } catch (error) {
    res.status(500).json({ error: "Failed to create department" })
  }
})

// Update department
router.put("/:id", async (req, res) => {
  try {
    const department = await prisma.department.update({
      where: { id: req.params.id },
      data: req.body,
    })

    res.json(successResponse("Department updated successfully", department))
  } catch (error) {
    res.status(500).json({ error: "Failed to update department" })
  }
})

// Delete department
router.delete("/:id", async (req, res) => {
  try {
    await prisma.department.delete({
      where: { id: req.params.id },
    })

    res.json(successResponse("Department deleted successfully", null))
  } catch (error) {
    res.status(500).json({ error: "Failed to delete department" })
  }
})

export default router
