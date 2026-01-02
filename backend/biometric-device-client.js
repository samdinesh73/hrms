/**
 * Biometric Device Client Example
 * This is an example of how a biometric device/scanner can integrate with the HRMS
 * 
 * Usage:
 * 1. Install axios: npm install axios
 * 2. Set the BACKEND_URL to your server
 * 3. When employee scans, call recordAttendance() function
 */

import axios from 'axios';

// Configuration
const BACKEND_URL = 'http://localhost:5000'; // Change to your server IP
const BIOMETRIC_API = `${BACKEND_URL}/api/biometric/checkin`;

// Initialize axios instance
const apiClient = axios.create({
  baseURL: BACKEND_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Record attendance based on biometric scan
 * @param {string} employeeId - Employee ID (e.g., SR0162)
 * @param {string} checkType - 'CHECK_IN' or 'CHECK_OUT'
 * @param {string} biometricData - Fingerprint/Face data
 */
async function recordAttendance(employeeId, checkType, biometricData = null) {
  try {
    console.log(`\n📱 Processing ${checkType} for Employee: ${employeeId}...`);
    
    const payload = {
      employeeId: employeeId,
      checkType: checkType,
      biometricData: biometricData || `biometric_scan_${Date.now()}`,
      timestamp: new Date().toISOString()
    };

    const response = await apiClient.post('/api/biometric/checkin', payload);

    if (response.status === 201 || response.status === 200) {
      const data = response.data.data;
      console.log(`✅ SUCCESS: ${response.data.message}`);
      console.log(`   Check-in Time: ${data.checkInTime}`);
      if (data.checkOutTime) {
        console.log(`   Check-out Time: ${data.checkOutTime}`);
        console.log(`   Work Hours: ${data.workHours}`);
      }
      return { success: true, data };
    }
  } catch (error) {
    console.error(`❌ ERROR: ${error.response?.data?.message || error.message}`);
    return { success: false, error: error.response?.data };
  }
}

/**
 * Get today's attendance record
 * @param {string} employeeId - Employee ID
 */
async function getTodayAttendance(employeeId) {
  try {
    console.log(`\n📊 Fetching today's attendance for: ${employeeId}...`);
    
    const response = await apiClient.get(`/api/biometric/today/${employeeId}`);
    
    if (response.status === 200) {
      const data = response.data.data;
      console.log(`✅ Attendance Record Found:`);
      console.log(`   Status: ${data.status}`);
      console.log(`   Check-in: ${data.checkInTime}`);
      console.log(`   Check-out: ${data.checkOutTime || 'Not yet checked out'}`);
      if (data.workHours) {
        console.log(`   Work Hours: ${data.workHours}`);
      }
      return { success: true, data };
    }
  } catch (error) {
    console.error(`❌ ERROR: ${error.response?.data?.message || error.message}`);
    return { success: false, error };
  }
}

/**
 * Get attendance summary for current month
 * @param {string} employeeId - Employee ID
 */
async function getAttendanceSummary(employeeId) {
  try {
    console.log(`\n📈 Fetching attendance summary for: ${employeeId}...`);
    
    const response = await apiClient.get(`/api/biometric/summary/${employeeId}`);
    
    if (response.status === 200) {
      const summary = response.data.data;
      console.log(`✅ Attendance Summary - ${summary.month}:`);
      console.log(`   Employee: ${summary.employeeName}`);
      console.log(`   Present Days: ${summary.presentDays}`);
      console.log(`   Absent Days: ${summary.absentDays}`);
      console.log(`   Half Days: ${summary.halfDays}`);
      console.log(`   Work From Home: ${summary.workFromHomeDays}`);
      console.log(`   Total Work Hours: ${summary.totalWorkHours}`);
      console.log(`   Average Daily Hours: ${summary.averageWorkHours}`);
      return { success: true, data: summary };
    }
  } catch (error) {
    console.error(`❌ ERROR: ${error.response?.data?.message || error.message}`);
    return { success: false, error };
  }
}

/**
 * Get attendance history
 * @param {string} employeeId - Employee ID
 * @param {number} days - Number of days to retrieve
 */
async function getAttendanceHistory(employeeId, days = 7) {
  try {
    console.log(`\n📅 Fetching attendance history (last ${days} days) for: ${employeeId}...`);
    
    const response = await apiClient.get(`/api/biometric/history/${employeeId}?days=${days}`);
    
    if (response.status === 200) {
      const records = response.data.data;
      console.log(`✅ Found ${records.length} records:`);
      records.forEach((record, index) => {
        console.log(`   ${index + 1}. ${record.attendanceDate.split('T')[0]} - ${record.status} (${record.workHours || 0}h)`);
      });
      return { success: true, data: records };
    }
  } catch (error) {
    console.error(`❌ ERROR: ${error.response?.data?.message || error.message}`);
    return { success: false, error };
  }
}

/**
 * Display device menu and handle user input
 */
async function displayMenu() {
  console.log(`
╔════════════════════════════════════════════╗
║  BIOMETRIC ATTENDANCE SYSTEM               ║
║  Device Interface                          ║
╚════════════════════════════════════════════╝
  `);
}

/**
 * Demo/Test function
 */
async function runDemo() {
  console.log('🚀 Starting Biometric Attendance System Demo...\n');
  
  const employeeId = 'SR0162'; // Aarthi
  
  // Simulate a full day
  console.log('═══════════════════════════════════════');
  console.log('📋 SCENARIO: Aarthi\'s Daily Attendance');
  console.log('═══════════════════════════════════════');
  
  // Morning check-in
  console.log('\n⏰ MORNING - Employee arrives at office');
  await recordAttendance(employeeId, 'CHECK_IN', 'fingerprint_scan_001');
  
  // Simulate some delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Evening check-out
  console.log('\n⏰ EVENING - Employee leaves office');
  await recordAttendance(employeeId, 'CHECK_OUT', 'fingerprint_scan_002');
  
  // View today's record
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('\n📍 Checking today\'s record...');
  await getTodayAttendance(employeeId);
  
  // View summary
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('\n📍 Checking monthly summary...');
  await getAttendanceSummary(employeeId);
  
  // View history
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('\n📍 Checking attendance history...');
  await getAttendanceHistory(employeeId, 7);
  
  console.log('\n✅ Demo completed!\n');
}

// Run demo if this file is executed directly
runDemo().catch(console.error);
