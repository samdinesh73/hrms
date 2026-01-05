import express, { Request, Response } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { PrismaClient } from "@prisma/client"

const router = express.Router()
const prisma = new PrismaClient()

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

// ==================== INTERFACES ====================
interface LoginRequest {
  email: string
  password: string
}

interface AuthResponse {
  success: boolean
  message: string
  data?: {
    user: {
      id: string
      email: string
      firstName: string
      lastName: string
      role: string
      isActive: boolean
    }
    token: string
  }
}

// ==================== ROUTES ====================

/**
 * POST /auth/login
 * Login user with email and password
 */
router.post("/login", async (req: Request, res: Response<AuthResponse>) => {
  try {
    const { email, password } = req.body as LoginRequest

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      })
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      })
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Contact admin.",
      })
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      })
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    )

    // Response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isActive: user.isActive,
        },
        token,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
})

/**
 * POST /auth/verify
 * Verify JWT token
 */
router.post("/verify", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader?.split(" ")[1]

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string
      email: string
      role: string
    }

    // Get updated user info
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    })

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "User not found or inactive",
      })
    }

    return res.status(200).json({
      success: true,
      message: "Token is valid",
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isActive: user.isActive,
        },
      },
    })
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    })
  }
})

/**
 * POST /auth/logout
 * Logout user (frontend should delete token from localStorage)
 */
router.post("/logout", (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "Logout successful. Please delete the token from localStorage.",
  })
})

/**
 * POST /auth/change-password
 * Change password for logged-in user
 */
router.post("/change-password", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader?.split(" ")[1]

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    const { oldPassword, newPassword } = req.body

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Old and new passwords are required",
      })
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Verify old password
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password)

    if (!isOldPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect",
      })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update password
    await prisma.user.update({
      where: { id: decoded.userId },
      data: { password: hashedPassword },
    })

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    })
  } catch (error) {
    console.error("Change password error:", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
})

export default router
