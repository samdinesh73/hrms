import express from "express"
import { PrismaClient } from "@prisma/client"
import { successResponse } from "../utils/response.js"

const router = express.Router()
const prisma = new PrismaClient()

// Get all leaves (with optional employeeId filter)
router.get("/", async (req, res) => {
  try {
    const { employeeId } = req.query
    
    const where = employeeId ? { employeeId: employeeId as string } : {}
    
    const leaves = await prisma.leave.findMany({
      where,
      include: {
        employee: true,
        leaveApprovals: {
          include: {
            approvedBy: true,
          },
        },
      },
    })
    res.json(successResponse("Leaves fetched successfully", leaves))
  } catch (error) {
    console.error("Error fetching leaves:", error)
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch leaves",
      error: error instanceof Error ? error.message : "Failed to fetch leaves" 
    })
  }
})

// Get pending leaves (must come before /:id route)
router.get("/status/pending", async (req, res) => {
  try {
    const leaves = await prisma.leave.findMany({
      where: { status: "PENDING" },
      include: {
        employee: true,
      },
    })
    res.json(successResponse("Pending leaves fetched successfully", leaves))
  } catch (error) {
    console.error("Error fetching pending leaves:", error)
    res.status(500).json({ error: "Failed to fetch leaves" })
  }
})

// Get leave by ID
router.get("/:id", async (req, res) => {
  try {
    const leave = await prisma.leave.findUnique({
      where: { id: req.params.id },
      include: {
        employee: true,
        leaveApprovals: {
          include: {
            approvedBy: true,
          },
        },
      },
    })

    if (!leave) {
      return res.status(404).json({ error: "Leave not found" })
    }

    res.json(successResponse("Leave fetched successfully", leave))
  } catch (error) {
    console.error("Error fetching leave:", error)
    res.status(500).json({ error: "Failed to fetch leave" })
  }
})

// Apply for leave
router.post("/", async (req, res) => {
  try {
    const { employeeId, userId, leaveType, startDate, endDate, totalDays, reason } = req.body

    if (!leaveType || !startDate || !endDate || !totalDays || !reason) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    // Resolve employeeId from userId if needed
    let actualEmployeeId = employeeId

    if (!actualEmployeeId && userId) {
      const employee = await prisma.employee.findUnique({
        where: { userId },
      })
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" })
      }
      actualEmployeeId = employee.id
    }

    if (!actualEmployeeId) {
      return res.status(400).json({ error: "Employee ID is required" })
    }

    const leave = await prisma.leave.create({
      data: {
        employeeId: actualEmployeeId,
        leaveType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalDays: parseInt(totalDays),
        reason,
        status: "PENDING",
      },
    })

    res.status(201).json(successResponse("Leave applied successfully", leave))
  } catch (error) {
    console.error("Error creating leave:", error)
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to apply leave" })
  }
})

// Approve/Reject leave
router.post("/:id/approve", async (req, res) => {
  try {
    const { managerId, status, approvalDate, comments } = req.body

    // Get the leave details first
    const leaveDetails = await prisma.leave.findUnique({
      where: { id: req.params.id },
      include: { employee: true },
    })

    if (!leaveDetails) {
      return res.status(404).json({ error: "Leave request not found" })
    }

    // Update leave status
    const leave = await prisma.leave.update({
      where: { id: req.params.id },
      data: {
        status,
        approvedBy: managerId,
        approvalDate: new Date(approvalDate),
      },
    })

    // If approved, reduce the employee's available leave balance
    if (status === "APPROVED") {
      await prisma.employee.update({
        where: { id: leaveDetails.employeeId },
        data: {
          usedLeaves: {
            increment: leaveDetails.totalDays,
          },
        },
      })
    }

    await prisma.leaveApproval.create({
      data: {
        leaveId: req.params.id,
        managerId,
        status,
        comments,
      },
    })

    res.json(successResponse("Leave approval updated successfully", leave))
  } catch (error) {
    console.error("Error updating leave approval:", error)
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to update leave approval" })
  }
})

export default router
