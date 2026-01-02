import express, { Router, Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

interface BiometricCheckRequest {
  employeeId: string; // Employee ID (e.g., SR0162)
  checkType: "CHECK_IN" | "CHECK_OUT"; // Type of biometric check
  biometricData?: string; // Optional biometric identifier (fingerprint ID, face ID, etc.)
  timestamp?: Date; // Optional timestamp (defaults to current time)
}

/**
 * POST /api/biometric/checkin
 * Records attendance based on biometric data
 * Creates or updates attendance record for the day
 */
router.post("/checkin", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { employeeId, checkType, biometricData, timestamp } = req.body as BiometricCheckRequest;

    // Validate required fields
    if (!employeeId || !checkType) {
      return res.status(400).json({
        success: false,
        message: "Employee ID and check type are required",
      });
    }

    if (!["CHECK_IN", "CHECK_OUT"].includes(checkType)) {
      return res.status(400).json({
        success: false,
        message: "Check type must be CHECK_IN or CHECK_OUT",
      });
    }

    // Find employee by employeeId (not database ID)
    const employee = await prisma.employee.findUnique({
      where: { employeeId },
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: `Employee with ID ${employeeId} not found`,
      });
    }

    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find or create attendance record for today
    let attendance = await prisma.attendance.findUnique({
      where: {
        employeeId_attendanceDate: {
          employeeId: employee.id,
          attendanceDate: today,
        },
      },
    });

    const checkTime = timestamp || new Date();

    if (!attendance) {
      // Create new attendance record
      if (checkType === "CHECK_IN") {
        attendance = await prisma.attendance.create({
          data: {
            employeeId: employee.id,
            attendanceDate: today,
            status: "PRESENT",
            checkInTime: checkTime,
            notes: biometricData ? `Biometric ID: ${biometricData}` : "Biometric check-in",
          },
        });

        return res.status(201).json({
          success: true,
          message: `Check-in recorded for ${employee.firstName} ${employee.lastName}`,
          data: attendance,
        });
      } else {
        // Cannot check out without check in
        return res.status(400).json({
          success: false,
          message: "Employee must check in first before checking out",
        });
      }
    }

    // Update existing attendance record
    if (checkType === "CHECK_IN") {
      if (attendance.checkInTime) {
        return res.status(400).json({
          success: false,
          message: `Employee already checked in at ${attendance.checkInTime}`,
        });
      }

      attendance = await prisma.attendance.update({
        where: { id: attendance.id },
        data: {
          checkInTime: checkTime,
          status: "PRESENT",
        },
      });

      return res.status(200).json({
        success: true,
        message: `Check-in recorded for ${employee.firstName} ${employee.lastName}`,
        data: attendance,
      });
    } else {
      // CHECK_OUT
      if (!attendance.checkInTime) {
        return res.status(400).json({
          success: false,
          message: "Employee has not checked in yet",
        });
      }

      if (attendance.checkOutTime) {
        return res.status(400).json({
          success: false,
          message: `Employee already checked out at ${attendance.checkOutTime}`,
        });
      }

      // Calculate work hours
      const workHours =
        (checkTime.getTime() - attendance.checkInTime.getTime()) / (1000 * 60 * 60);

      attendance = await prisma.attendance.update({
        where: { id: attendance.id },
        data: {
          checkOutTime: checkTime,
          workHours: Math.round(workHours * 100) / 100, // Round to 2 decimal places
        },
      });

      return res.status(200).json({
        success: true,
        message: `Check-out recorded for ${employee.firstName} ${employee.lastName}. Work hours: ${attendance.workHours}`,
        data: attendance,
      });
    }
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/biometric/today/:employeeId
 * Get today's attendance record for an employee
 */
router.get("/today/:employeeId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { employeeId } = req.params;

    const employee = await prisma.employee.findUnique({
      where: { employeeId },
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: `Employee with ID ${employeeId} not found`,
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await prisma.attendance.findUnique({
      where: {
        employeeId_attendanceDate: {
          employeeId: employee.id,
          attendanceDate: today,
        },
      },
    });

    res.status(200).json({
      success: true,
      data: attendance || {
        message: "No attendance record for today",
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/biometric/history/:employeeId
 * Get attendance history for an employee (past 30 days)
 */
router.get("/history/:employeeId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { employeeId } = req.params;
    const { days = 30 } = req.query;

    const employee = await prisma.employee.findUnique({
      where: { employeeId },
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: `Employee with ID ${employeeId} not found`,
      });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (Number(days) || 30));
    startDate.setHours(0, 0, 0, 0);

    const attendance = await prisma.attendance.findMany({
      where: {
        employeeId: employee.id,
        attendanceDate: {
          gte: startDate,
        },
      },
      orderBy: {
        attendanceDate: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/biometric/summary/:employeeId
 * Get attendance summary for an employee (current month)
 */
router.get("/summary/:employeeId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { employeeId } = req.params;

    const employee = await prisma.employee.findUnique({
      where: { employeeId },
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: `Employee with ID ${employeeId} not found`,
      });
    }

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const monthAttendance = await prisma.attendance.findMany({
      where: {
        employeeId: employee.id,
        attendanceDate: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth,
        },
      },
    });

    const summary = {
      employeeId: employee.employeeId,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      month: now.toLocaleString("default", { month: "long", year: "numeric" }),
      totalDays: monthAttendance.length,
      presentDays: monthAttendance.filter((a) => a.status === "PRESENT").length,
      absentDays: monthAttendance.filter((a) => a.status === "ABSENT").length,
      halfDays: monthAttendance.filter((a) => a.status === "HALF_DAY").length,
      workFromHomeDays: monthAttendance.filter((a) => a.status === "WORK_FROM_HOME").length,
      totalWorkHours: monthAttendance.reduce((sum, a) => sum + (a.workHours || 0), 0),
      averageWorkHours: monthAttendance.length > 0
        ? (monthAttendance.reduce((sum, a) => sum + (a.workHours || 0), 0) / monthAttendance.length).toFixed(2)
        : 0,
    };

    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
