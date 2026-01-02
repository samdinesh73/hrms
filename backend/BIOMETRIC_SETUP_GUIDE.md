# Biometric Attendance Implementation Guide

## How It Works

### System Flow Diagram
```
┌──────────────────┐
│ Biometric Device │
│  (Fingerprint/   │
│    Face Scanner) │
└────────┬─────────┘
         │
         │ Employee scans biometric
         │
         ▼
┌─────────────────────────────────┐
│  Device identifies employee     │
│  Retrieves: SR0162 (Aarthi)     │
└────────┬────────────────────────┘
         │
         │ Sends API request
         │
         ▼
┌──────────────────────────────────────┐
│ POST /api/biometric/checkin          │
│ {                                    │
│   "employeeId": "SR0162",            │
│   "checkType": "CHECK_IN/CHECK_OUT"  │
│ }                                    │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ Backend API Processing           │
│ 1. Find employee by ID           │
│ 2. Check for today's record      │
│ 3. Create/Update attendance      │
│ 4. Calculate work hours          │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ Database Update                  │
│ ✓ checkInTime set/updated        │
│ ✓ checkOutTime set/updated       │
│ ✓ workHours calculated           │
│ ✓ status = PRESENT               │
└──────────────────────────────────┘
```

---

## Implementation Steps

### Step 1: Configure Biometric Device
**What you need:**
- Biometric device (fingerprint or face scanner)
- Network connection to backend server
- Device admin/management software

**Steps:**
1. Install and setup the biometric device
2. Enroll all employees:
   - Take biometric samples (fingerprint/face)
   - Store with employee ID (SR0162, SR0231, etc.)
3. Configure network settings:
   - Set device IP
   - Configure gateway/DNS
   - Test internet connectivity

---

### Step 2: Configure Device Software
**Device settings should include:**

1. **API Endpoint**: `http://YOUR_SERVER_IP:5000/api/biometric/checkin`
2. **Check-in Time**: When employee first scans
3. **Check-out Time**: When employee scans at end of day
4. **Data Format**:
```json
{
  "employeeId": "SR0162",
  "checkType": "CHECK_IN",
  "biometricData": "fingerprint_data"
}
```

**Example Device Configuration Screen:**
```
╔════════════════════════════════════╗
║  Biometric Device Configuration    ║
╠════════════════════════════════════╣
║ Mode: Employee Attendance          ║
║ API Endpoint: http://192.168.1.x:  ║
║              5000/api/biometric/   ║
║              checkin               ║
║                                    ║
║ Check-in Prefix:  (auto)           ║
║ Check-out Prefix: (auto)           ║
║                                    ║
║ [✓] Send to Server                 ║
║ [✓] Update Database                ║
║ [✓] Enable Logging                 ║
║                                    ║
║ [Save] [Test] [Cancel]             ║
╚════════════════════════════════════╝
```

---

### Step 3: Test the Integration

#### Test 1: Check-In
```
Employee: Aarthi (SR0162)
Action: Place finger on scanner
Expected: ✓ "Check-in recorded" message

Result: 
- checkInTime: 2024-01-02 09:30:00
- Status: PRESENT
```

#### Test 2: Check-Out
```
Employee: Aarthi (SR0162)
Action: Place finger on scanner again
Expected: ✓ "Check-out recorded" message
         ✓ Work hours calculated

Result:
- checkOutTime: 2024-01-02 18:00:00
- workHours: 8.5
- Status: PRESENT
```

#### Test 3: View Today's Record
```bash
curl http://localhost:5000/api/biometric/today/SR0162
```

Response shows complete check-in and check-out record.

---

## Real-World Example

### Scenario: Daily Attendance Process

**Morning (9:30 AM)**
```
1. Aarthi arrives at office
2. Scans fingerprint at device
3. Device sends:
   POST /api/biometric/checkin
   {
     "employeeId": "SR0162",
     "checkType": "CHECK_IN",
     "biometricData": "fingerprint_scan_data"
   }
4. System creates record:
   - attendanceDate: 2024-01-02
   - checkInTime: 09:30:00
   - status: PRESENT
5. Device displays: "Good Morning, Aarthi!"
```

**Evening (6:00 PM)**
```
1. Aarthi leaves office
2. Scans fingerprint at device
3. Device sends:
   POST /api/biometric/checkin
   {
     "employeeId": "SR0162",
     "checkType": "CHECK_OUT",
     "biometricData": "fingerprint_scan_data"
   }
4. System updates record:
   - checkOutTime: 18:00:00
   - workHours: 8.5 (calculated)
   - status: PRESENT
5. Device displays: "Thank you, Aarthi! Work hours: 8.5"
```

**Next Day - View Report**
```
Employee: Aarthi (SR0162)
Command: GET /api/biometric/summary/SR0162

Response:
{
  "employeeId": "SR0162",
  "employeeName": "Aarthi",
  "month": "January 2024",
  "totalDays": 22,
  "presentDays": 21,
  "absentDays": 1,
  "totalWorkHours": 176.5,
  "averageWorkHours": 8.4
}
```

---

## API Testing Guide

### Using cURL (Linux/Mac)
```bash
# Check-In
curl -X POST http://localhost:5000/api/biometric/checkin \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "SR0162",
    "checkType": "CHECK_IN",
    "biometricData": "fingerprint_123"
  }'

# Check-Out
curl -X POST http://localhost:5000/api/biometric/checkin \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "SR0162",
    "checkType": "CHECK_OUT"
  }'

# Get Today's Record
curl http://localhost:5000/api/biometric/today/SR0162

# Get Summary
curl http://localhost:5000/api/biometric/summary/SR0162

# Get 30-Day History
curl http://localhost:5000/api/biometric/history/SR0162?days=30
```

### Using PowerShell (Windows)
```powershell
# Check-In
$body = @{
  employeeId = "SR0162"
  checkType = "CHECK_IN"
  biometricData = "fingerprint_123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/biometric/checkin" `
  -Method POST -Body $body -ContentType "application/json"

# Get Today's Record
Invoke-WebRequest -Uri "http://localhost:5000/api/biometric/today/SR0162" `
  -Method GET
```

### Using Postman
1. Create new POST request
2. URL: `http://localhost:5000/api/biometric/checkin`
3. Headers: `Content-Type: application/json`
4. Body (JSON):
```json
{
  "employeeId": "SR0162",
  "checkType": "CHECK_IN",
  "biometricData": "fingerprint_data"
}
```
5. Click Send

---

## Troubleshooting

### Issue: "Employee not found"
**Cause**: Employee ID doesn't exist in database
**Solution**: 
- Verify employee ID matches database records
- Check if employee name is correct (SR0162 = Aarthi)

### Issue: "Already checked in"
**Cause**: Employee already checked in today
**Solution**:
- Cannot check in twice same day
- If needed, manually update via database
- Next day they can check in again

### Issue: "Employee must check in first"
**Cause**: Trying to check out without checking in
**Solution**:
- Employee must check in first
- Cannot skip check-in

### Issue: Device not connecting to API
**Cause**: Network/firewall issue
**Solution**:
- Verify device can ping backend server
- Check firewall allows port 5000
- Verify API endpoint URL is correct
- Check backend server is running

---

## Employee List (Ready for Biometric)

All 40 employees can now use biometric attendance:

1. SR0162 - Aarthi ✓
2. SR0231 - Abdul Ajees ✓
3. SR0237 - Abharna V ✓
4. SR0160 - Akshaya Saravanan ✓
5. SR0243 - Atchaya ✓
... and 35 more employees

Each employee ID corresponds to database records with:
- Name
- Email
- Department
- Designation
- Salary
- Address (Thanjavur-based)

---

## Monthly Attendance Report Example

```
┌─────────────────────────────────────────────────────┐
│         ATTENDANCE REPORT - JANUARY 2024             │
├─────────────────────────────────────────────────────┤
│ Employee: Aarthi (SR0162)                           │
│ Department: Sales                                   │
│                                                     │
│ Present Days:        21                             │
│ Absent Days:          1                             │
│ Half Days:            0                             │
│ Work From Home:       0                             │
│                                                     │
│ Total Work Hours:    176.5                          │
│ Average Daily Hours:  8.4                           │
│                                                     │
│ Attendance %:        95.45% ✓                       │
└─────────────────────────────────────────────────────┘
```

---

## Next Steps

1. ✅ Backend API created and tested
2. ✅ Attendance model ready
3. ⏳ Integrate biometric device
4. ⏳ Create frontend dashboard for attendance
5. ⏳ Setup attendance reports
6. ⏳ Configure leave integration

---

## Support

For issues or questions about biometric integration:
- Check API logs: `/backend/logs/`
- Review database: PostgreSQL attendance table
- Test endpoints manually with cURL/Postman
- Refer to BIOMETRIC_ATTENDANCE.md for detailed API docs
