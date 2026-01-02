# Quick Start: Biometric Device Integration

**Time Required**: 10-15 minutes  
**Prerequisites**: Device powered on, connected to network at 192.168.1.50:4370

## Step 1: Configure Environment (2 minutes)

Create or update `.env` in `backend/` directory:

```env
# Required settings
BIOMETRIC_DEVICE_ENABLED=true
BIOMETRIC_DEVICE_IP=192.168.1.50
BIOMETRIC_DEVICE_PORT=4370

# Optional (defaults provided)
BIOMETRIC_DEVICE_USER=admin
BIOMETRIC_DEVICE_PASSWORD=0
BIOMETRIC_POLLING_INTERVAL=5000
BIOMETRIC_POLLING_ENABLED=true
```

## Step 2: Generate Device Mapping (2 minutes)

This maps your 40 employees to device user IDs (1-40):

```bash
cd backend
npm run generate-device-mapping
```

Expected output:
```
📥 Fetching employees from database...
✅ Found 40 employees

📋 Generated Mapping:
Device ID | Employee Code | Name
----------|---------------|-----
1         | SR0162        | Aarthi
2         | SR0163        | Abdul Ajees
3         | SR0164        | Abhijit
...
✅ Mapping saved to: src/config/biometricDeviceMapping.json
✅ Updated biometricDeviceConfig.ts with new mapping
```

## Step 3: Start Backend Server (1 minute)

```bash
npm run dev
```

Look for these messages:
```
✅ Database connected successfully
🔌 Initializing Biometric Device Connector...
🔌 Connecting to biometric device at 192.168.1.50:4370...
✅ Connected to biometric device
📡 Starting polling with 5000ms interval...
✅ Biometric device connected and ready
```

## Step 4: Verify Connection (2 minutes)

In another terminal:

```bash
# Check device status
curl http://localhost:5000/api/device/status

# Expected response:
# {
#   "status": "ONLINE",
#   "device": {
#     "ip": "192.168.1.50",
#     "port": 4370,
#     "reconnectAttempts": 0
#   },
#   "timestamp": "2026-01-02T10:30:00Z"
# }
```

## Step 5: Test with Real Scan (3 minutes)

1. **On Device**: Open employee with ID matching SR0162 (Aarthi)
2. **On Device**: Scan a fingerprint
3. **On Backend**: Check logs - should see:
   ```
   ✅ Check-in recorded: Aarthi at 09:30:15 AM
   ```
4. **Verify**: 
   ```bash
   curl http://localhost:5000/api/biometric/today/SR0162
   ```

## Step 6: Test Check-Out (2 minutes)

1. **On Device**: Same employee (Aarthi) scans again
2. **On Backend**: Check logs - should see:
   ```
   ✅ Check-out recorded: Aarthi at 05:45:30 PM (Work hours: 8.25)
   ```

## Done! ✅

Your biometric device is now integrated and recording attendance in real-time.

### What's Happening Behind the Scenes:

1. **TCP/IP Connection** (🔌): Backend connects to device at 192.168.1.50:4370
2. **Polling** (📡): Backend checks for new scans every 5 seconds
3. **Data Processing** (📥): Fingerprints are converted to check-in/out records
4. **Mapping** (🔄): Device user ID (e.g., 1) → Employee code (e.g., SR0162)
5. **Storage** (💾): Attendance records saved to PostgreSQL

### Real-Time Flow:

```
Employee scans fingerprint
        ↓
Device captures biometric data
        ↓
Backend polls device
        ↓
Backend receives: {userId: 1, time: "09:30:00", type: "CHECK_IN"}
        ↓
Backend maps: 1 → SR0162 (Aarthi)
        ↓
Backend creates attendance record
        ↓
Database updated: Aarthi checked in at 09:30 AM
```

## Next Steps

- [ ] Monitor logs for attendance records
- [ ] Test with all 40 employees
- [ ] Set up frontend dashboard to display attendance
- [ ] Configure alerts for device offline status
- [ ] Set up daily attendance reports

## Troubleshooting

| Problem | Solution |
|---------|----------|
| **Device shows OFFLINE** | Check: `ping 192.168.1.50` - verify network connection |
| **No check-ins recorded** | Verify user ID mapping with device user management |
| **Wrong employee names** | Regenerate mapping: `npm run generate-device-mapping` |
| **Backend won't start** | Check .env file, verify database connection |

## API Endpoints Reference

```bash
# Device Status
curl http://localhost:5000/api/device/status

# Today's Attendance
curl http://localhost:5000/api/biometric/today/SR0162

# Past 30 Days
curl http://localhost:5000/api/biometric/history/SR0162

# Monthly Summary
curl http://localhost:5000/api/biometric/summary/SR0162

# Manual Check-In (for testing)
curl -X POST http://localhost:5000/api/biometric/checkin \
  -H "Content-Type: application/json" \
  -d '{"employeeId": "SR0162", "checkType": "CHECK_IN"}'
```

---

**Need help?** See [BIOMETRIC_DEVICE_SETUP.md](./BIOMETRIC_DEVICE_SETUP.md) for detailed documentation.
