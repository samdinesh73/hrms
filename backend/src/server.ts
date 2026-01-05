import express from "express"
import cors from "cors"
import morgan from "morgan"
import dotenv from "dotenv"
import { PrismaClient } from "@prisma/client"

// Import routes
import authRoutes from "./routes/auth.js"
import employeeRoutes from "./routes/employees.js"
import taskRoutes from "./routes/tasks.js"
import leaveRoutes from "./routes/leaves.js"
import salaryRoutes from "./routes/salary.js"
import departmentRoutes from "./routes/departments.js"
import attendanceRoutes from "./routes/attendance.js"
import biometricRoutes from "./routes/biometric.js"

// Import biometric device connector
import BiometricDeviceConnector from "./services/biometricDeviceConnector.js"
import { biometricDeviceConfig } from "./config/biometricDeviceConfig.js"

// Load environment variables
dotenv.config()

const app = express()
const prisma = new PrismaClient()
const PORT = process.env.PORT || 5000

// Biometric device connector instance
let deviceConnector: BiometricDeviceConnector | null = null

// ==================== MIDDLEWARE ====================
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true
}))
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ==================== HEALTH CHECK ====================
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// ==================== API ROUTES ====================
app.use("/api/auth", authRoutes)
app.use("/api/employees", employeeRoutes)
app.use("/api/tasks", taskRoutes)
app.use("/api/leaves", leaveRoutes)
app.use("/api/salary", salaryRoutes)
app.use("/api/departments", departmentRoutes)
app.use("/api/attendance", attendanceRoutes)
app.use("/api/biometric", biometricRoutes)

// ==================== BIOMETRIC DEVICE STATUS ENDPOINT ====================
app.get("/api/device/status", (req, res) => {
  if (!deviceConnector) {
    return res.status(503).json({
      status: "OFFLINE",
      message: "Device connector not initialized",
      device: null
    })
  }

  const status = deviceConnector.getStatus()
  res.status(200).json({
    status: status.connected ? "ONLINE" : "OFFLINE",
    device: {
      ip: status.ip,
      port: status.port,
      reconnectAttempts: status.reconnectAttempts
    },
    timestamp: new Date().toISOString()
  })
})

// ==================== BIOMETRIC DEVICE CONTROL ENDPOINT ====================
app.post("/api/device/command", (req, res) => {
  const { command } = req.body

  if (!command) {
    return res.status(400).json({ error: "Command is required" })
  }

  if (!deviceConnector) {
    return res.status(503).json({ error: "Device connector not initialized" })
  }

  try {
    deviceConnector.sendCommand(command)
    res.status(200).json({ message: "Command sent successfully" })
  } catch (error) {
    res.status(500).json({ error: "Failed to send command" })
  }
})

// ==================== ERROR HANDLING ====================
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("❌ Error:", err)
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    status: err.status || 500
  })
})

// ==================== 404 HANDLER ====================
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.path,
    method: req.method
  })
})

// ==================== SERVER STARTUP ====================
const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect()
    console.log("✅ Database connected successfully")

    // Initialize biometric device connector
    if (process.env.BIOMETRIC_DEVICE_ENABLED !== "false") {
      console.log("\n🔌 Initializing Biometric Device Connector...")
      
      deviceConnector = new BiometricDeviceConnector(
        biometricDeviceConfig.device,
        prisma
      )

      // Set user ID mapping (you can fetch this from database later)
      // For now, we'll use the config mapping
      deviceConnector.setUserIdMapping(biometricDeviceConfig.userIdMapping)

      // Attempt to connect
      const connected = await deviceConnector.connect()

      if (connected) {
        // Start polling if enabled
        if (biometricDeviceConfig.polling.enabled) {
          deviceConnector.startPolling(biometricDeviceConfig.polling.interval)
        }
        console.log("✅ Biometric device connected and ready")
      } else {
        console.warn("⚠️  Could not connect to biometric device. Will retry...")
      }
    }

    app.listen(PORT, () => {
      console.log(`\n🚀 HRMS Backend Server`)
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
      console.log(`📡 Running on: http://localhost:${PORT}`)
      console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`)
      console.log(`📚 API Endpoints:`)
      console.log(`   - /api/employees`)
      console.log(`   - /api/departments`)
      console.log(`   - /api/tasks`)
      console.log(`   - /api/leaves`)
      console.log(`   - /api/salary`)
      console.log(`   - /api/attendance`)
      console.log(`   - /api/biometric`)
      console.log(`   - /api/device/status`)
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`)
    })
  } catch (error) {
    console.error("❌ Failed to start server:", error)
    process.exit(1)
  }
}

// ==================== GRACEFUL SHUTDOWN ====================
process.on("SIGINT", async () => {
  console.log("\n⛔ Shutting down server gracefully...")
  
  // Disconnect biometric device
  if (deviceConnector) {
    deviceConnector.disconnect()
  }
  
  await prisma.$disconnect()
  console.log("✅ Database disconnected")
  process.exit(0)
})

process.on("SIGTERM", async () => {
  console.log("\n⛔ Terminating server...")
  
  // Disconnect biometric device
  if (deviceConnector) {
    deviceConnector.disconnect()
  }
  
  await prisma.$disconnect()
  console.log("✅ Database disconnected")
  process.exit(0)
})

startServer()
