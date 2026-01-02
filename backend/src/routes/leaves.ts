import express from "express"
import { PrismaClient } from "@prisma/client"
import { successResponse } from "../utils/response.js"

const router = express.Router()
const prisma = new PrismaClient()

// Get all leaves
router.get("/", async (req, res) => {
  try {
    const leaves = await prisma.leave.findMany({
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
    res.status(500).json({ error: "Failed to fetch leaves" })
  }
})

// Get pending leaves
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
    res.status(500).json({ error: "Failed to fetch leave" })
  }
})

// Apply for leave
router.post("/", async (req, res) => {
  try {
    const { employeeId, leaveType, startDate, endDate, totalDays, reason } = req.body

    const leave = await prisma.leave.create({
      data: {
        employeeId,
        leaveType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalDays,
        reason,
        status: "PENDING",
      },
    })

    res.status(201).json(successResponse("Leave applied successfully", leave))
  } catch (error) {
    res.status(500).json({ error: "Failed to apply leave" })
  }
})

// Approve/Reject leave
router.post("/:id/approve", async (req, res) => {
  try {
    const { managerId, status, approvalDate, comments } = req.body

    const leave = await prisma.leave.update({
      where: { id: req.params.id },
      data: {
        status,
        approvedBy: managerId,
        approvalDate: new Date(approvalDate),
      },
    })

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
    res.status(500).json({ error: "Failed to update leave approval" })
  }
})

export default router
