import { Request, Response, NextFunction } from "express"
import { verifyToken } from "../utils/auth.js"
import { ApiError } from "../utils/response.js"

export interface AuthRequest extends Request {
  user?: any
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
      throw new ApiError(401, "No token provided")
    }

    const decoded = verifyToken(token)
    req.user = decoded
    next()
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json({ error: error.message })
    } else {
      res.status(401).json({ error: "Unauthorized" })
    }
  }
}

export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden: Insufficient permissions" })
    }
    next()
  }
}
