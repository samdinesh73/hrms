import express from "express"
import { PrismaClient } from "@prisma/client"
import { successResponse } from "../utils/response.js"

const router = express.Router()
const prisma = new PrismaClient()

// Get all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        assignedTo: true,
        taskAssignments: {
          include: {
            assignedBy: true,
          },
        },
      },
    })
    res.json(successResponse("Tasks fetched successfully", tasks))
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" })
  }
})

// Get tasks by status
router.get("/status/:status", async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { status: req.params.status as any },
      include: {
        assignedTo: true,
      },
    })
    res.json(successResponse("Tasks fetched successfully", tasks))
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" })
  }
})

// Get task by ID
router.get("/:id", async (req, res) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: req.params.id },
      include: {
        assignedTo: true,
        taskAssignments: {
          include: {
            assignedBy: true,
          },
        },
      },
    })

    if (!task) {
      return res.status(404).json({ error: "Task not found" })
    }

    res.json(successResponse("Task fetched successfully", task))
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch task" })
  }
})

// Create task
router.post("/", async (req, res) => {
  try {
    const { title, description, assignedToId, assignedById, status, priority, dueDate, estimatedHours } = req.body

    const task = await prisma.task.create({
      data: {
        title,
        description,
        assignedToId,
        assignedById,
        status,
        priority,
        dueDate: new Date(dueDate),
        estimatedHours,
      },
    })

    res.status(201).json(successResponse("Task created successfully", task))
  } catch (error) {
    res.status(500).json({ error: "Failed to create task" })
  }
})

// Update task
router.put("/:id", async (req, res) => {
  try {
    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: {
        ...req.body,
        dueDate: req.body.dueDate ? new Date(req.body.dueDate) : undefined,
        completedAt: req.body.completedAt ? new Date(req.body.completedAt) : undefined,
      },
    })

    res.json(successResponse("Task updated successfully", task))
  } catch (error) {
    res.status(500).json({ error: "Failed to update task" })
  }
})

// Delete task
router.delete("/:id", async (req, res) => {
  try {
    await prisma.task.delete({
      where: { id: req.params.id },
    })

    res.json(successResponse("Task deleted successfully"))
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task" })
  }
})

export default router
