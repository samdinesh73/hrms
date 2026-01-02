/**
 * Biometric Device Configuration
 * Stores connection settings and device mappings
 */

export const biometricDeviceConfig = {
  // Device Connection Settings
  device: {
    ip: process.env.BIOMETRIC_DEVICE_IP || '192.168.1.50',
    port: process.env.BIOMETRIC_DEVICE_PORT ? parseInt(process.env.BIOMETRIC_DEVICE_PORT) : 4370,
    userId: process.env.BIOMETRIC_DEVICE_USER || 'admin',
    password: process.env.BIOMETRIC_DEVICE_PASSWORD || '0',
    timeout: 30000, // Connection timeout in ms
    reconnectInterval: 10000, // Reconnection interval in ms
  },

  // Polling Configuration
  polling: {
    enabled: process.env.BIOMETRIC_POLLING_ENABLED !== 'false',
    interval: process.env.BIOMETRIC_POLLING_INTERVAL
      ? parseInt(process.env.BIOMETRIC_POLLING_INTERVAL)
      : 5000, // Poll every 5 seconds
  },

  // User ID Mapping (Device User ID => Employee Code)
  // Update this mapping based on your device's user management
  userIdMapping: {
    "1": "SR0118",
    "2": "SR0157",
    "3": "SR0160",
    "4": "SR0162",
    "5": "SR0166",
    "6": "SR0167",
    "7": "SR0169",
    "8": "SR0170",
    "9": "SR0174",
    "10": "SR0176",
    "11": "SR0178",
    "12": "SR0180",
    "13": "SR0200",
    "14": "SR0209",
    "15": "SR0212",
    "16": "SR0217",
    "17": "SR0223",
    "18": "SR0226",
    "19": "SR0230",
    "20": "SR0231",
    "21": "SR0237",
    "22": "SR0242",
    "23": "SR0243",
    "24": "SR0244",
    "25": "SR0245",
    "26": "SR0246",
    "27": "SR0247",
    "28": "SR0250",
    "29": "SR0251",
    "30": "SR0252",
    "31": "SR0255",
    "32": "SR0257",
    "33": "SR0258",
    "34": "SR0259",
    "35": "SR0260",
    "36": "SR0262",
    "37": "SR0263",
    "38": "SR0266",
    "39": "SR0267",
    "40": "SR0268",
    "41": "SR0269",
    "42": "SR0270",
    "43": "SR0271",
    "44": "SR0272"
},

  // Device Data Format Parsers (based on device manufacturer)
  // Common formats: CSV, JSON, proprietary binary
  dataFormat: {
    type: process.env.BIOMETRIC_DATA_FORMAT || 'csv', // 'csv', 'json', 'binary'
    // Field mapping for CSV format
    csv: {
      delimiter: ',',
      fields: ['userId', 'checkTime', 'checkType', 'deviceSN'],
      timeFormat: 'YYYY-MM-DD HH:mm:ss',
    },
    // Field mapping for JSON format
    json: {
      userIdField: 'userId',
      timeField: 'checkTime',
      checkTypeField: 'checkType',
    },
  },

  // Logging Configuration
  logging: {
    enabled: process.env.BIOMETRIC_LOGGING_ENABLED !== 'false',
    level: process.env.BIOMETRIC_LOG_LEVEL || 'info', // 'debug', 'info', 'warn', 'error'
    logFile: './logs/biometric-device.log',
  },

  // Error Handling
  errorHandling: {
    maxReconnectAttempts: 5,
    retryDelay: 5000, // Retry after 5 seconds
    failureNotificationEmail: process.env.ADMIN_EMAIL,
  },
};

/**
 * Get user ID mapping
 * You can also fetch this from database if you have a device_user_mapping table
 */
export function getUserIdMapping(): { [key: number]: string } {
  return biometricDeviceConfig.userIdMapping;
}

/**
 * Set user ID mapping
 * Call this to dynamically update the mapping
 */
export function setUserIdMapping(mapping: { [key: number]: string }): void {
  Object.assign(biometricDeviceConfig.userIdMapping, mapping);
}

/**
 * Add user ID mapping
 */
export function addUserIdMapping(userId: number, employeeId: string): void {
  biometricDeviceConfig.userIdMapping[userId] = employeeId;
}

export default biometricDeviceConfig;
