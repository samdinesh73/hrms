# Biometric Device Integration Guide

## Overview
This guide helps you integrate your TCP/IP biometric device with the HRMS system for real-time attendance tracking.

## Device Specifications

- **Connection Type**: TCP/IP
- **Default IP**: 192.168.1.50
- **Default Port**: 4370
- **Protocol**: TCP (streaming data)
- **Authentication**: User ID and Password (optional)

## Installation Steps

### 1. Environment Configuration

Create or update your `.env` file in the backend directory with device settings:

```env
# Biometric Device Configuration
BIOMETRIC_DEVICE_ENABLED=true
BIOMETRIC_DEVICE_IP=192.168.1.50
BIOMETRIC_DEVICE_PORT=4370
BIOMETRIC_DEVICE_USER=admin
BIOMETRIC_DEVICE_PASSWORD=0

# Polling Configuration
BIOMETRIC_POLLING_ENABLED=true
BIOMETRIC_POLLING_INTERVAL=5000

# Data Format (csv, json, or binary)
BIOMETRIC_DATA_FORMAT=csv

# Logging
BIOMETRIC_LOGGING_ENABLED=true
BIOMETRIC_LOG_LEVEL=info
```

### 2. User ID Mapping

You need to map device user IDs to employee codes. Update the mapping in `backend/src/config/biometricDeviceConfig.ts`:

```typescript
// Example mapping
userIdMapping: {
  1: 'SR0162',   // Aarthi
  2: 'SR0163',   // Abdul Ajees
  3: 'SR0164',   // Abhijit
  4: 'SR0165',   // Abilash
  5: 'SR0166',   // Abinash
  // Add all 40 employees
  40: 'SR0201'   // Last employee
}
```

**To generate this mapping:**

1. Open your biometric device's web interface or admin panel
2. List all enrolled users and their numeric IDs
3. Match each numeric ID to the corresponding employee code
4. Update the configuration file

### 3. Device Configuration (On Device Admin Panel)

1. **Network Settings**:
   - Static IP: 192.168.1.50
   - Gateway: 192.168.1.1 (your router)
   - Subnet Mask: 255.255.255.0
   - Port: 4370

2. **Server Configuration** (if available on device):
   - Real-time server IP: Your backend server IP
   - Real-time server port: 4370
   - Enable push notifications/real-time mode

3. **User Management**:
   - Ensure all employees are enrolled with numeric IDs (1-40)
   - Test fingerprint scanning

## API Endpoints

### Device Status
```
GET /api/device/status

Response:
{
  "status": "ONLINE",
  "device": {
    "ip": "192.168.1.50",
    "port": 4370,
    "reconnectAttempts": 0
  },
  "timestamp": "2026-01-02T10:30:00Z"
}
```

### Send Command to Device
```
POST /api/device/command

Body:
{
  "command": "GET_RECORDS"
}

Response:
{
  "message": "Command sent successfully"
}
```

### Check-In/Check-Out Records
```
POST /api/biometric/checkin
GET /api/biometric/today/:employeeId
GET /api/biometric/history/:employeeId
GET /api/biometric/summary/:employeeId
```

## Data Format Support

### CSV Format
```
userId,checkTime,checkType,deviceSN
1,2026-01-02 09:30:00,0,ZK123456
1,2026-01-02 17:45:00,1,ZK123456
```

- **userId**: Numeric ID from device (maps to employee code)
- **checkTime**: Timestamp (YYYY-MM-DD HH:mm:ss)
- **checkType**: 0=Check-In, 1=Check-Out
- **deviceSN**: Device serial number

### JSON Format
```json
[
  {
    "userId": 1,
    "checkTime": "2026-01-02T09:30:00Z",
    "checkType": 0,
    "deviceSN": "ZK123456"
  }
]
```

## Testing

### Test Connection
```bash
curl http://localhost:5000/api/device/status
```

### Manual Check-In
```bash
curl -X POST http://localhost:5000/api/biometric/checkin \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "SR0162",
    "checkType": "CHECK_IN"
  }'
```

### View Today's Records
```bash
curl http://localhost:5000/api/biometric/today/SR0162
```

## Troubleshooting

### Device Not Connecting
- Verify network connectivity: `ping 192.168.1.50`
- Check firewall settings (port 4370 should be open)
- Verify device IP address and port in `.env`
- Check device logs on admin panel

### No Records Being Received
- Verify user ID mapping is correct
- Check device enrollment (users should have numeric IDs 1-40)
- Test device by scanning a fingerprint
- Check logs: `tail -f backend/logs/biometric-device.log`

### Mapping Issues
- Ensure numeric IDs match device user management
- Verify employee codes (SR0162, SR0163, etc.) exist in database
- Check database: `SELECT * FROM employees LIMIT 5;`

### Connection Drops
- Check network stability
- Verify device power supply
- Increase reconnect interval in config if needed
- Check firewall/router logs

## Monitoring

### View Real-time Logs
```bash
tail -f backend/logs/biometric-device.log
```

### Check Connection Status
```bash
curl http://localhost:5000/api/device/status | json_pp
```

### Database Verification
```sql
-- Check today's attendance
SELECT e.firstName, e.lastName, a.checkInTime, a.checkOutTime, a.workHours
FROM attendance a
JOIN employees e ON a.employeeId = e.id
WHERE DATE(a.attendanceDate) = TODAY()
ORDER BY a.checkInTime DESC;

-- Check all records for an employee
SELECT * FROM attendance 
WHERE employeeId = 'SR0162' 
ORDER BY attendanceDate DESC;
```

## Advanced Configuration

### Batch Import User Mapping
If you have many employees, create a CSV and bulk update:

```bash
# Create mapping.csv with format:
# deviceUserId,employeeCode
# 1,SR0162
# 2,SR0163
# ...

# Run import script (create this script)
node scripts/import-device-mapping.js mapping.csv
```

### Custom Data Parser
If your device uses a different format:

1. Edit `biometricDeviceConnector.ts`
2. Add new parser in `parseDeviceData()` method
3. Test with sample data
4. Update `biometricDeviceConfig.ts` with format type

### Enable Debug Logging
Set environment variable:
```bash
BIOMETRIC_LOG_LEVEL=debug
```

## Security Considerations

1. **Device Password**: Change default password in config
2. **Network**: Use VPN if device is on public network
3. **Authentication**: Implement JWT for API endpoints
4. **Data**: Ensure attendance data is backed up regularly
5. **Access Control**: Restrict device status/command endpoints

## Maintenance

### Regular Tasks
- Weekly: Check device status logs
- Monthly: Verify all employees have attendance records
- Monthly: Backup attendance database
- Quarterly: Update device firmware if available

### Health Checks
```bash
# Monitor real-time
watch -n 5 'curl -s http://localhost:5000/api/device/status | json_pp'

# Check recent records
curl http://localhost:5000/api/biometric/today/SR0162
```

## Support

For device-specific issues:
1. Check device manual
2. Contact device manufacturer support
3. Review device logs in admin panel
4. Check backend application logs

For integration issues:
1. Verify all configuration steps
2. Check error logs
3. Review database for attendance records
4. Test with manual API calls
