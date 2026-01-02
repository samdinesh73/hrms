import jwt from "jsonwebtoken"
import bcryptjs from "bcryptjs"

const JWT_SECRET = process.env.JWT_SECRET || "default-secret-key"
const JWT_EXPIRE = process.env.JWT_EXPIRE || "24h"

// Generate JWT Token
export const generateToken = (userId: string, role: string): string => {
  return jwt.sign(
    { userId, role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  )
}

// Verify JWT Token
export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    throw new Error("Invalid or expired token")
  }
}

// Hash Password
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcryptjs.genSalt(10)
  return bcryptjs.hash(password, salt)
}

// Compare Password
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcryptjs.compare(password, hashedPassword)
}
