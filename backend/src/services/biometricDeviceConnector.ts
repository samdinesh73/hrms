import net from 'net';
import { PrismaClient } from '@prisma/client';

/**
 * Biometric Device Connector
 * Connects to TCP/IP biometric devices (port 4370)
 * Handles real-time check-in and check-out data
 */

interface BiometricDeviceConfig {
  ip: string;
  port: number;
  userId: string; // Numeric user ID from device
  password?: string;
  timeout?: number;
  reconnectInterval?: number;
}

interface DeviceAttendanceData {
  userId: number;
  checkTime: Date;
  checkType: 'CHECK_IN' | 'CHECK_OUT';
  deviceSN?: string;
}

// Mapping of numeric user IDs to employee codes
const userIdToEmployeeIdMap: { [key: number]: string } = {
  // Add mappings here - format: deviceUserID: "SR0162"
  // Example:
  // 1: "SR0162",  // Aarthi
  // 2: "SR0231",  // Abdul Ajees
  // etc.
};

export class BiometricDeviceConnector {
  private socket: net.Socket | null = null;
  private config: BiometricDeviceConfig;
  private prisma: PrismaClient;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private pollInterval: NodeJS.Timeout | null = null;

  constructor(config: BiometricDeviceConfig, prisma: PrismaClient) {
    this.config = {
      timeout: 30000,
      reconnectInterval: 10000,
      ...config,
    };
    this.prisma = prisma;
  }

  /**
   * Connect to biometric device
   */
  async connect(): Promise<boolean> {
    return new Promise((resolve) => {
      console.log(`🔌 Connecting to biometric device at ${this.config.ip}:${this.config.port}...`);

      this.socket = new net.Socket();

      this.socket.setTimeout(this.config.timeout!);

      // Handle successful connection
      this.socket.on('connect', () => {
        console.log(`✅ Connected to biometric device at ${this.config.ip}:${this.config.port}`);
        this.isConnected = true;
        this.reconnectAttempts = 0;
        
        // Authenticate if needed
        if (this.config.userId) {
          this.authenticate();
        }

        resolve(true);
      });

      // Handle incoming data
      this.socket.on('data', (data) => {
        this.handleDeviceData(data);
      });

      // Handle errors
      this.socket.on('error', (error) => {
        console.error(`❌ Connection error: ${error.message}`);
        this.isConnected = false;
        resolve(false);
      });

      // Handle connection timeout
      this.socket.on('timeout', () => {
        console.error(`⏱️  Connection timeout`);
        this.socket?.destroy();
        this.isConnected = false;
        this.attemptReconnect();
      });

      // Handle connection close
      this.socket.on('close', () => {
        console.log('📴 Connection closed');
        this.isConnected = false;
        this.attemptReconnect();
      });

      // Attempt connection
      this.socket.connect(this.config.port, this.config.ip);

      // Set timeout for connection attempt
      setTimeout(() => {
        if (!this.isConnected) {
          resolve(false);
          this.socket?.destroy();
        }
      }, this.config.timeout);
    });
  }

  /**
   * Authenticate with device (if required)
   */
  private authenticate(): void {
    try {
      // Command format may vary by device
      // This is a common format for many biometric devices
      const authCommand = `USER:${this.config.userId}\r\nPASS:${this.config.password || '0'}\r\n`;
      this.socket?.write(authCommand);
      console.log('🔐 Authentication command sent');
    } catch (error) {
      console.error('Authentication error:', error);
    }
  }

  /**
   * Start polling for attendance records
   */
  startPolling(interval: number = 5000): void {
    console.log(`📡 Starting polling with ${interval}ms interval...`);

    this.pollInterval = setInterval(async () => {
      if (this.isConnected) {
        this.requestAttendanceData();
      }
    }, interval);
  }

  /**
   * Stop polling
   */
  stopPolling(): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
      console.log('⏹️  Polling stopped');
    }
  }

  /**
   * Request attendance data from device
   */
  private requestAttendanceData(): void {
    try {
      // Common command to request attendance records
      // Format may vary by device manufacturer
      const commands = [
        'GET_RECORDS\r\n',
        '*GETATT*\r\n', // Alternative format
        'GETATT\r\n', // Another common format
      ];

      // Try the most common format
      this.socket?.write(commands[0]);
    } catch (error) {
      console.error('Error requesting attendance data:', error);
    }
  }

  /**
   * Handle data received from device
   */
  private async handleDeviceData(data: Buffer): Promise<void> {
    try {
      const dataStr = data.toString('utf-8').trim();

      if (!dataStr) return;

      console.log(`📥 Received data: ${dataStr.substring(0, 100)}...`);

      // Parse different data formats
      const records = this.parseDeviceData(dataStr);

      for (const record of records) {
        await this.processAttendanceRecord(record);
      }
    } catch (error) {
      console.error('Error handling device data:', error);
    }
  }

  /**
   * Parse device data - supports multiple formats
   */
  private parseDeviceData(dataStr: string): DeviceAttendanceData[] {
    const records: DeviceAttendanceData[] = [];

    try {
      // Format 1: CSV-like format
      // userid,checktime,checktype,deviceSN
      // 1,2026-01-02 09:30:00,0,ZK123456
      const lines = dataStr.split('\n').filter((line) => line.trim());

      for (const line of lines) {
        if (line.includes(',')) {
          const parts = line.split(',');
          if (parts.length >= 3) {
            const userId = parseInt(parts[0].trim());
            const timeStr = parts[1].trim();
            const checkType = parseInt(parts[2].trim());

            const record = this.parseRecord(userId, timeStr, checkType, parts[3]?.trim());
            if (record) {
              records.push(record);
            }
          }
        }
      }

      // Format 2: JSON format
      if (dataStr.includes('{') && dataStr.includes('}')) {
        try {
          const jsonData = JSON.parse(dataStr);
          if (Array.isArray(jsonData)) {
            for (const item of jsonData) {
              const record = this.parseJsonRecord(item);
              if (record) {
                records.push(record);
              }
            }
          }
        } catch {
          // Not JSON or parse error
        }
      }
    } catch (error) {
      console.error('Error parsing device data:', error);
    }

    return records;
  }

  /**
   * Parse individual attendance record
   */
  private parseRecord(
    userId: number,
    timeStr: string,
    checkTypeCode: number,
    deviceSN?: string
  ): DeviceAttendanceData | null {
    try {
      // 0 = Check-In, 1 = Check-Out
      const checkType = checkTypeCode === 0 ? 'CHECK_IN' : 'CHECK_OUT';

      // Try to parse timestamp
      let checkTime = new Date(timeStr);
      if (isNaN(checkTime.getTime())) {
        // Try alternative format: YYYY-MM-DD HH:mm:ss
        checkTime = new Date(timeStr.replace(' ', 'T'));
      }

      if (isNaN(checkTime.getTime())) {
        console.warn(`Invalid timestamp: ${timeStr}`);
        return null;
      }

      return {
        userId,
        checkTime,
        checkType,
        deviceSN,
      };
    } catch (error) {
      console.error('Error parsing record:', error);
      return null;
    }
  }

  /**
   * Parse JSON format record
   */
  private parseJsonRecord(item: any): DeviceAttendanceData | null {
    try {
      const userId = parseInt(item.userId || item.user_id || item.uid);
      const checkTime = new Date(item.checkTime || item.check_time || item.time);
      const checkTypeCode = parseInt(
        item.checkType || item.check_type || item.type || item.inout
      );

      if (isNaN(userId) || isNaN(checkTime.getTime())) {
        return null;
      }

      return this.parseRecord(userId, checkTime.toISOString(), checkTypeCode);
    } catch (error) {
      console.error('Error parsing JSON record:', error);
      return null;
    }
  }

  /**
   * Process attendance record and save to database
   */
  private async processAttendanceRecord(record: DeviceAttendanceData): Promise<void> {
    try {
      // Map numeric user ID to employee code
      const employeeId = userIdToEmployeeIdMap[record.userId];

      if (!employeeId) {
        console.warn(`⚠️  No employee mapping for user ID: ${record.userId}`);
        return;
      }

      // Find employee
      const employee = await this.prisma.employee.findUnique({
        where: { employeeId },
      });

      if (!employee) {
        console.warn(`Employee not found: ${employeeId}`);
        return;
      }

      // Get attendance date (midnight)
      const attendanceDate = new Date(record.checkTime);
      attendanceDate.setHours(0, 0, 0, 0);

      // Find or create attendance record
      let attendance = await this.prisma.attendance.findUnique({
        where: {
          employeeId_attendanceDate: {
            employeeId: employee.id,
            attendanceDate,
          },
        },
      });

      if (!attendance) {
        // Create new record for check-in
        if (record.checkType === 'CHECK_IN') {
          attendance = await this.prisma.attendance.create({
            data: {
              employeeId: employee.id,
              attendanceDate,
              status: 'PRESENT',
              checkInTime: record.checkTime,
              notes: `Biometric device: ${record.deviceSN || 'Device'}`,
            },
          });

          console.log(
            `✅ Check-in recorded: ${employee.firstName} ${employee.lastName} at ${record.checkTime.toLocaleTimeString()}`
          );
        } else {
          console.warn(
            `⚠️  Check-out without check-in for ${employee.firstName} ${employee.lastName}`
          );
        }
      } else {
        // Update existing record
        if (record.checkType === 'CHECK_IN') {
          // Update check-in if not already set
          if (!attendance.checkInTime) {
            attendance = await this.prisma.attendance.update({
              where: { id: attendance.id },
              data: {
                checkInTime: record.checkTime,
                status: 'PRESENT',
              },
            });

            console.log(
              `✅ Check-in updated: ${employee.firstName} ${employee.lastName} at ${record.checkTime.toLocaleTimeString()}`
            );
          }
        } else {
          // Check-out
          if (!attendance.checkOutTime) {
            // Calculate work hours
            const checkIn = attendance.checkInTime
              ? new Date(attendance.checkInTime)
              : new Date(record.checkTime);
            const workHours =
              (record.checkTime.getTime() - checkIn.getTime()) / (1000 * 60 * 60);

            attendance = await this.prisma.attendance.update({
              where: { id: attendance.id },
              data: {
                checkOutTime: record.checkTime,
                workHours: Math.round(workHours * 100) / 100,
              },
            });

            console.log(
              `✅ Check-out recorded: ${employee.firstName} ${employee.lastName} at ${record.checkTime.toLocaleTimeString()} (Work hours: ${attendance.workHours})`
            );
          }
        }
      }
    } catch (error) {
      console.error('Error processing attendance record:', error);
    }
  }

  /**
   * Attempt to reconnect to device
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `🔄 Reconnecting... (Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`
      );

      setTimeout(() => {
        this.connect();
      }, this.config.reconnectInterval);
    } else {
      console.error('❌ Max reconnection attempts reached. Device offline.');
    }
  }

  /**
   * Disconnect from device
   */
  disconnect(): void {
    this.stopPolling();
    if (this.socket) {
      this.socket.destroy();
      this.socket = null;
    }
    this.isConnected = false;
    console.log('🔌 Disconnected from biometric device');
  }

  /**
   * Get connection status
   */
  getStatus(): {
    connected: boolean;
    ip: string;
    port: number;
    reconnectAttempts: number;
  } {
    return {
      connected: this.isConnected,
      ip: this.config.ip,
      port: this.config.port,
      reconnectAttempts: this.reconnectAttempts,
    };
  }

  /**
   * Set user ID mapping
   */
  setUserIdMapping(mapping: { [key: number]: string }): void {
    Object.assign(userIdToEmployeeIdMap, mapping);
    console.log('📝 User ID mapping updated:', mapping);
  }

  /**
   * Send custom command to device
   */
  sendCommand(command: string): void {
    if (this.isConnected && this.socket) {
      this.socket.write(command + '\r\n');
      console.log(`📤 Command sent: ${command}`);
    } else {
      console.error('Device not connected');
    }
  }
}

export default BiometricDeviceConnector;
