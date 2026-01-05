import express from "express"
import { PrismaClient } from "@prisma/client"
import { successResponse } from "../utils/response.js"

const router = express.Router()
const prisma = new PrismaClient()

// Get all attendance records
router.get("/", async (req, res) => {
  try {
    const attendance = await prisma.attendance.findMany({
      include: {
        employee: true,
      },
    })

    res.json(successResponse("Attendance fetched successfully", attendance))
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch attendance" })
  }
})

// Get attendance by date (today by default)
router.get("/date/:date", async (req, res) => {
  try {
    const dateStr = req.params.date
    const date = new Date(dateStr)
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const attendance = await prisma.attendance.findMany({
      where: {
        attendanceDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        employee: true,
      },
    })

    res.json(successResponse("Attendance fetched successfully", attendance))
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch attendance" })
  }
})

// Get attendance for employee
router.get("/employee/:employeeId", async (req, res) => {
  try {
    const attendance = await prisma.attendance.findMany({
      where: { employeeId: req.params.employeeId },
      include: {
        employee: true,
      },
    })

    res.json(successResponse("Attendance fetched successfully", attendance))
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch attendance" })
  }
})

// Mark attendance for today
router.post("/", async (req, res) => {
  try {
    const { employeeId, status, checkInTime, checkOutTime, notes } = req.body

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Check if attendance already marked for today
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        employeeId,
        attendanceDate: {
          gte: today,
          lt: tomorrow,
        },
      },
    })

    if (existingAttendance) {
      // Update existing record
      const updated = await prisma.attendance.update({
        where: { id: existingAttendance.id },
        data: {
          status,
          checkInTime: checkInTime ? new Date(checkInTime) : undefined,
          checkOutTime: checkOutTime ? new Date(checkOutTime) : undefined,
          notes,
        },
        include: {
          employee: true,
        },
      })
      return res.json(successResponse("Attendance updated successfully", updated))
    }

    // Create new attendance record
    const attendance = await prisma.attendance.create({
      data: {
        employeeId,
        attendanceDate: new Date(),
        status,
        checkInTime: checkInTime ? new Date(checkInTime) : null,
        checkOutTime: checkOutTime ? new Date(checkOutTime) : null,
        notes,
      },
      include: {
        employee: true,
      },
    })

    res.status(201).json(successResponse("Attendance marked successfully", attendance))
  } catch (error) {
    res.status(500).json({ error: "Failed to mark attendance" })
  }
})

// Update attendance
router.put("/:id", async (req, res) => {
  try {
    const attendance = await prisma.attendance.update({
      where: { id: req.params.id },
      data: {
        ...req.body,
        checkInTime: req.body.checkInTime ? new Date(req.body.checkInTime) : undefined,
        checkOutTime: req.body.checkOutTime ? new Date(req.body.checkOutTime) : undefined,
      },
      include: {
        employee: true,
      },
    })

    res.json(successResponse("Attendance updated successfully", attendance))
  } catch (error) {
    res.status(500).json({ error: "Failed to update attendance" })
  }
})

export default router
