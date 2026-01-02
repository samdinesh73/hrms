import express from "express"
import { PrismaClient } from "@prisma/client"
import { successResponse } from "../utils/response.js"

const router = express.Router()
const prisma = new PrismaClient()

// Get salary details for employee
router.get("/employee/:employeeId", async (req, res) => {
  try {
    const salaryDetails = await prisma.salaryDetail.findMany({
      where: { employeeId: req.params.employeeId },
      orderBy: { year: "desc" },
    })

    res.json(successResponse("Salary details fetched successfully", salaryDetails))
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch salary details" })
  }
})

// Get salary detail by month and year
router.get("/:employeeId/:year/:month", async (req, res) => {
  try {
    const salaryDetail = await prisma.salaryDetail.findUnique({
      where: {
        employeeId_month_year: {
          employeeId: req.params.employeeId,
          month: parseInt(req.params.month),
          year: parseInt(req.params.year),
        },
      },
    })

    if (!salaryDetail) {
      return res.status(404).json({ error: "Salary detail not found" })
    }

    res.json(successResponse("Salary detail fetched successfully", salaryDetail))
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch salary detail" })
  }
})

// Create salary detail
router.post("/", async (req, res) => {
  try {
    const {
      employeeId,
      month,
      year,
      baseSalary,
      allowances,
      bonuses,
      deductions,
      taxes,
    } = req.body

    const grossSalary = baseSalary + allowances + bonuses
    const netSalary = grossSalary - deductions - taxes

    const salaryDetail = await prisma.salaryDetail.create({
      data: {
        employeeId,
        month,
        year,
        baseSalary,
        allowances,
        bonuses,
        deductions,
        taxes,
        grossSalary,
        netSalary,
      },
    })

    res.status(201).json(successResponse("Salary detail created successfully", salaryDetail))
  } catch (error) {
    res.status(500).json({ error: "Failed to create salary detail" })
  }
})

// Update salary detail
router.put("/:id", async (req, res) => {
  try {
    const {
      baseSalary,
      allowances,
      bonuses,
      deductions,
      taxes,
      status,
    } = req.body

    const grossSalary = baseSalary + allowances + bonuses
    const netSalary = grossSalary - deductions - taxes

    const salaryDetail = await prisma.salaryDetail.update({
      where: { id: req.params.id },
      data: {
        baseSalary,
        allowances,
        bonuses,
        deductions,
        taxes,
        grossSalary,
        netSalary,
        status,
      },
    })

    res.json(successResponse("Salary detail updated successfully", salaryDetail))
  } catch (error) {
    res.status(500).json({ error: "Failed to update salary detail" })
  }
})

export default router
