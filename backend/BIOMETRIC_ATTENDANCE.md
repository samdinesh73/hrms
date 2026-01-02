# Biometric Attendance System - API Documentation

## Overview
The biometric attendance system automatically records employee attendance based on biometric check-ins and check-outs. When an employee uses a biometric device (fingerprint, face recognition, etc.), it triggers API calls that create or update attendance records.

## System Architecture

```
Biometric Device
    ↓
    └─→ Captures biometric data (fingerprint/face)
    ↓
API Endpoint: POST /api/biometric/checkin
    ↓
    ├─→ Finds employee by employeeId
    ├─→ Gets/Creates attendance record for today
    ├─→ Updates checkInTime or checkOutTime
    └─→ Calculates work hours
    ↓
Database (Prisma)
    ↓
    └─→ Attendance Table Updated
```

## API Endpoints

### 1. POST /api/biometric/checkin
Records attendance based on biometric check-in or check-out

**Request Body:**
```json
{
  "employeeId": "SR0162",
  "checkType": "CHECK_IN",
  "biometricData": "fingerprint_123456",
  "timestamp": "2024-01-02T09:30:00Z"
}
```

**Parameters:**
- `employeeId` (required): Employee ID (e.g., SR0162)
- `checkType` (required): Either "CHECK_IN" or "CHECK_OUT"
- `biometricData` (optional): Biometric identifier (fingerprint ID, face ID, etc.)
- `timestamp` (optional): Check time (defaults to current time)

**Success Response (201 for CHECK_IN, 200 for updates):**
```json
{
  "success": true,
  "message": "Check-in recorded for Aarthi",
  "data": {
    "id": "clh7x8z9a0001q9z",
    "employeeId": "clh7x8y8a0000q9z",
    "attendanceDate": "2024-01-02T00:00:00Z",
    "status": "PRESENT",
    "checkInTime": "2024-01-02T09:30:00Z",
    "checkOutTime": null,
    "workHours": null,
    "notes": "Biometric ID: fingerprint_123456"
  }
}
```

**Error Responses:**
```json
{
  "success": false,
  "message": "Employee with ID SR0162 not found"
}
```

---

### 2. GET /api/biometric/today/:employeeId
Get today's attendance record for an employee

**Example Request:**
```
GET /api/biometric/today/SR0162
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "id": "clh7x8z9a0001q9z",
    "employeeId": "clh7x8y8a0000q9z",
    "attendanceDate": "2024-01-02T00:00:00Z",
    "status": "PRESENT",
    "checkInTime": "2024-01-02T09:30:00Z",
    "checkOutTime": "2024-01-02T18:00:00Z",
    "workHours": 8.5,
    "notes": "Biometric ID: fingerprint_123456"
  }
}
```

---

### 3. GET /api/biometric/history/:employeeId
Get attendance history for an employee (past 30 days by default)

**Example Request:**
```
GET /api/biometric/history/SR0162?days=30
```

**Query Parameters:**
- `days` (optional): Number of days to retrieve (default: 30)

**Success Response:**
```json
{
  "success": true,
  "count": 20,
  "data": [
    {
      "id": "clh7x8z9a0001q9z",
      "employeeId": "clh7x8y8a0000q9z",
      "attendanceDate": "2024-01-02T00:00:00Z",
      "status": "PRESENT",
      "checkInTime": "2024-01-02T09:30:00Z",
      "checkOutTime": "2024-01-02T18:00:00Z",
      "workHours": 8.5
    }
  ]
}
```

---

### 4. GET /api/biometric/summary/:employeeId
Get attendance summary for current month

**Example Request:**
```
GET /api/biometric/summary/SR0162
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "employeeId": "SR0162",
    "employeeName": "Aarthi",
    "month": "January 2024",
    "totalDays": 22,
    "presentDays": 20,
    "absentDays": 2,
    "halfDays": 0,
    "workFromHomeDays": 0,
    "totalWorkHours": 176.5,
    "averageWorkHours": "8.02"
  }
}
```

---

## Integration Examples

### Example 1: Check-In with Biometric Device
```bash
curl -X POST http://localhost:5000/api/biometric/checkin \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "SR0162",
    "checkType": "CHECK_IN",
    "biometricData": "fingerprint_xyz123"
  }'
```

### Example 2: Check-Out with Biometric Device
```bash
curl -X POST http://localhost:5000/api/biometric/checkin \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "SR0162",
    "checkType": "CHECK_OUT",
    "biometricData": "fingerprint_xyz123"
  }'
```

### Example 3: Get Today's Status
```bash
curl http://localhost:5000/api/biometric/today/SR0162
```

---

## Biometric Device Integration

### Step 1: Setup Biometric Device
1. Configure your biometric device (fingerprint/face scanner)
2. Enroll all employees with their biometric data
3. Map each biometric to employee ID (SR0162, SR0231, etc.)

### Step 2: Device Software/Firmware
The biometric device should:
1. Capture biometric data when employee scans
2. Identify the employee from the biometric
3. Send POST request to `/api/biometric/checkin` with:
   - employeeId
   - checkType (CHECK_IN or CHECK_OUT)
   - biometricData (fingerprint/face ID)

### Step 3: Network Configuration
- Biometric device needs network access to backend server
- Configure device IP address: `http://your-server:5000/api/biometric/checkin`
- Ensure firewall allows the biometric device to reach the backend

---

## Attendance Status Values

```
PRESENT        - Employee checked in and out
ABSENT         - No check-in record
HALF_DAY       - Early checkout or late check-in
WORK_FROM_HOME - Marked as work from home
ON_LEAVE       - Employee is on leave
```

---

## Database Schema

### Attendance Table
```
id                 | String    | Primary Key
employeeId         | String    | Foreign Key → Employee
attendanceDate     | DateTime  | Date of attendance
status             | String    | PRESENT, ABSENT, HALF_DAY, WORK_FROM_HOME, ON_LEAVE
checkInTime        | DateTime  | Check-in timestamp
checkOutTime       | DateTime  | Check-out timestamp
workHours          | Float     | Calculated hours worked
notes              | String    | Additional notes (biometric ID, etc.)
createdAt          | DateTime  | Record creation time
updatedAt          | DateTime  | Record update time
```

---

## Workflow Examples

### Daily Attendance Flow
```
Morning:
1. Employee scans fingerprint
2. Biometric device identifies employee (SR0162)
3. Device sends: POST /api/biometric/checkin
   {
     "employeeId": "SR0162",
     "checkType": "CHECK_IN",
     "biometricData": "fingerprint_data"
   }
4. System creates attendance record with checkInTime

Evening:
1. Employee scans fingerprint again
2. Device sends: POST /api/biometric/checkin
   {
     "employeeId": "SR0162",
     "checkType": "CHECK_OUT",
     "biometricData": "fingerprint_data"
   }
3. System updates attendance with checkOutTime
4. System calculates workHours = (checkOutTime - checkInTime)
```

---

## Features

✅ **Automated Attendance**: Check-in/check-out via biometric  
✅ **Work Hours Calculation**: Auto-calculates hours worked  
✅ **Daily Records**: One attendance record per employee per day  
✅ **Prevent Duplicates**: Cannot check-in twice or check-out twice  
✅ **History Tracking**: View past attendance records  
✅ **Monthly Summary**: Get attendance summary with statistics  
✅ **Real-time Updates**: Instant attendance recording  
✅ **Flexible Timestamps**: Support for custom check times  

---

## Error Handling

| Error | HTTP Status | Meaning |
|-------|-------------|---------|
| Employee not found | 404 | Employee ID doesn't exist |
| Already checked in | 400 | Employee already checked in today |
| Already checked out | 400 | Employee already checked out today |
| No check-in first | 400 | Cannot check out without check-in |
| Invalid check type | 400 | Check type not CHECK_IN or CHECK_OUT |
| Missing fields | 400 | Required fields are missing |

---

## Testing the API

### Quick Test Script
```bash
# Check-In
curl -X POST http://localhost:5000/api/biometric/checkin \
  -H "Content-Type: application/json" \
  -d '{"employeeId":"SR0162","checkType":"CHECK_IN"}'

# Check-Out
curl -X POST http://localhost:5000/api/biometric/checkin \
  -H "Content-Type: application/json" \
  -d '{"employeeId":"SR0162","checkType":"CHECK_OUT"}'

# View Today
curl http://localhost:5000/api/biometric/today/SR0162

# View Summary
curl http://localhost:5000/api/biometric/summary/SR0162
```

---

## Future Enhancements

- [ ] Geolocation tracking
- [ ] Photo capture on check-in
- [ ] Mobile app for remote check-in
- [ ] Monthly attendance reports
- [ ] Holiday/leave integration
- [ ] Late/early alerts
- [ ] Dashboard visualizations
