"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Clock, 
  Search, 
  Loader, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Wifi,
  WifiOff,
  Edit2,
  Save,
  Check,
  X,
  Trash2
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  designation: string;
  department: {
    name: string;
  };
  email: string;
  phone?: string;
  avatar?: string;
}

interface AttendanceRecord {
  id?: string;
  employeeId: string;
  employeeName: string;
  status: "PRESENT" | "ABSENT" | "ON_LEAVE" | "HALF_DAY" | "WORK_FROM_HOME";
  checkInTime?: string;
  checkOutTime?: string;
  source: "BIOMETRIC" | "MANUAL";
  notes?: string;
  avatar?: string;
  department?: string;
  designation?: string;
}

export default function AttendancePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [deviceConnected, setDeviceConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<AttendanceRecord["status"]>("PRESENT");
  const [manualNotes, setManualNotes] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [savingAttendance, setSavingAttendance] = useState(false);
  const [selectedUnmarkedEmployees, setSelectedUnmarkedEmployees] = useState<Set<string>>(new Set());
  const [selectAllUnmarked, setSelectAllUnmarked] = useState(false);
  const [bulkStatus, setBulkStatus] = useState<AttendanceRecord["status"]>("PRESENT");
  const [bulkNotes, setBulkNotes] = useState("");
  const [selectedMarkedRecords, setSelectedMarkedRecords] = useState<Set<string>>(new Set());
  const [selectAllMarked, setSelectAllMarked] = useState(false);
  const [bulkStatusMarked, setBulkStatusMarked] = useState<AttendanceRecord["status"]>("PRESENT");

  // Fetch employees and today's attendance
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch employees
        const empResponse = await fetch("http://localhost:5000/api/employees");
        if (!empResponse.ok) throw new Error("Failed to fetch employees");
        const empData = await empResponse.json();
        const empList = empData.data || empData || [];
        setEmployees(Array.isArray(empList) ? empList : []);

        // Fetch today's attendance
        const today = new Date().toISOString().split("T")[0];
        const attResponse = await fetch(`http://localhost:5000/api/attendance/date/${today}`);
        if (!attResponse.ok) throw new Error("Failed to fetch attendance");
        const attData = await attResponse.json();
        const records = attData.data || attData || [];

        // Transform attendance data
        const transformedRecords = records.map((record: any) => ({
          id: record.id,
          employeeId: record.employeeId,
          employeeName: `${record.employee?.firstName} ${record.employee?.lastName}`,
          status: record.status,
          checkInTime: record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : undefined,
          checkOutTime: record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : undefined,
          source: record.source || "BIOMETRIC",
          notes: record.notes,
          avatar: record.employee?.avatar,
          department: record.employee?.department?.name,
          designation: record.employee?.designation,
        }));

        setAttendanceRecords(transformedRecords);

        // Check device status
        const deviceResponse = await fetch("http://localhost:5000/api/device/status");
        if (deviceResponse.ok) {
          const deviceData = await deviceResponse.json();
          setDeviceConnected(deviceData.status === "ONLINE");
        } else {
          setDeviceConnected(false);
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get unique departments
  const departments = [
    "all",
    ...new Set(employees.map((emp) => emp.department?.name || "Unknown")),
  ];

  // Filter attendance records
  const filteredRecords = attendanceRecords.filter((record) => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDepartment === "all" || record.department === filterDepartment;
    const matchesStatus = filterStatus === "all" || record.status === filterStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  // Get employees without attendance marked
  const unmarkedEmployees = employees.filter((emp) =>
    !attendanceRecords.find((rec) => rec.employeeId === emp.id)
  );

  // Refresh attendance from device
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const response = await fetch("http://localhost:5000/api/device/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: "FETCH_ATTENDANCE" }),
      });

      if (response.ok) {
        // Reload attendance data
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (err) {
      console.error("Error refreshing:", err);
    } finally {
      setRefreshing(false);
    }
  };

  // Mark attendance manually
  const handleMarkAttendance = async (employeeId: string, status: AttendanceRecord["status"]) => {
    try {
      setSavingAttendance(true);

      const response = await fetch("http://localhost:5000/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId,
          status,
          notes: manualNotes || undefined,
        }),
      });

      if (!response.ok) throw new Error("Failed to mark attendance");

      const newRecord = await response.json();
      const emp = employees.find((e) => e.id === employeeId);

      // Add to records
      setAttendanceRecords([
        ...attendanceRecords,
        {
          id: newRecord.data?.id,
          employeeId,
          employeeName: `${emp?.firstName} ${emp?.lastName}`,
          status,
          source: "MANUAL",
          notes: manualNotes,
          avatar: emp?.avatar,
          department: emp?.department?.name,
          designation: emp?.designation,
        },
      ]);

      setSelectedEmployee(null);
      setManualNotes("");
      setSelectedStatus("PRESENT");
    } catch (err) {
      console.error("Error marking attendance:", err);
      setError(err instanceof Error ? err.message : "Failed to mark attendance");
    } finally {
      setSavingAttendance(false);
    }
  };

  // Update attendance status
  const handleUpdateAttendance = async (recordId: string | undefined, newStatus: AttendanceRecord["status"]) => {
    if (!recordId) return;

    try {
      const response = await fetch(`http://localhost:5000/api/attendance/${recordId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update attendance");

      // Update local state
      setAttendanceRecords(
        attendanceRecords.map((rec) =>
          rec.id === recordId ? { ...rec, status: newStatus } : rec
        )
      );
    } catch (err) {
      console.error("Error updating attendance:", err);
      setError(err instanceof Error ? err.message : "Failed to update attendance");
    }
  };

  // Bulk select handlers
  const handleSelectUnmarked = (employeeId: string, checked: boolean) => {
    const newSelected = new Set(selectedUnmarkedEmployees);
    if (checked) {
      newSelected.add(employeeId);
    } else {
      newSelected.delete(employeeId);
    }
    setSelectedUnmarkedEmployees(newSelected);
    setSelectAllUnmarked(newSelected.size === unmarkedEmployees.length);
  };

  const handleSelectAllUnmarked = (checked: boolean) => {
    if (checked) {
      setSelectedUnmarkedEmployees(new Set(unmarkedEmployees.map((e) => e.id)));
      setSelectAllUnmarked(true);
    } else {
      setSelectedUnmarkedEmployees(new Set());
      setSelectAllUnmarked(false);
    }
  };

  const handleBulkMarkAttendance = async (status: AttendanceRecord["status"]) => {
    try {
      setSavingAttendance(true);

      // Mark all selected employees with the specified status
      for (const empId of selectedUnmarkedEmployees) {
        const response = await fetch("http://localhost:5000/api/attendance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            employeeId: empId,
            status,
            notes: bulkNotes || undefined,
          }),
        });

        if (!response.ok) throw new Error(`Failed to mark attendance for ${empId}`);

        const newRecord = await response.json();
        const emp = employees.find((e) => e.id === empId);

        // Add to records
        setAttendanceRecords((prev) => [
          ...prev,
          {
            id: newRecord.data?.id,
            employeeId: empId,
            employeeName: `${emp?.firstName} ${emp?.lastName}`,
            status,
            source: "MANUAL",
            notes: bulkNotes,
            avatar: emp?.avatar,
            department: emp?.department?.name,
            designation: emp?.designation,
          },
        ]);
      }

      // Clear selection
      setSelectedUnmarkedEmployees(new Set());
      setSelectAllUnmarked(false);
      setBulkNotes("");
    } catch (err) {
      console.error("Error bulk marking attendance:", err);
      setError(err instanceof Error ? err.message : "Failed to mark attendance");
    } finally {
      setSavingAttendance(false);
    }
  };

  // Bulk operations for marked records
  const handleSelectMarkedRecord = (recordId: string | undefined, checked: boolean) => {
    if (!recordId) return;
    const newSelected = new Set(selectedMarkedRecords);
    if (checked) {
      newSelected.add(recordId);
    } else {
      newSelected.delete(recordId);
    }
    setSelectedMarkedRecords(newSelected);
    setSelectAllMarked(newSelected.size === filteredRecords.length && filteredRecords.length > 0);
  };

  const handleSelectAllMarked = (checked: boolean) => {
    if (checked) {
      setSelectedMarkedRecords(new Set(filteredRecords.map((r) => r.id).filter((id) => id !== undefined) as string[]));
      setSelectAllMarked(true);
    } else {
      setSelectedMarkedRecords(new Set());
      setSelectAllMarked(false);
    }
  };

  const handleBulkUpdateAttendance = async (newStatus: AttendanceRecord["status"]) => {
    try {
      setSavingAttendance(true);

      // Update all selected records with new status
      for (const recordId of selectedMarkedRecords) {
        const response = await fetch(`http://localhost:5000/api/attendance/${recordId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });

        if (!response.ok) throw new Error(`Failed to update attendance ${recordId}`);

        // Update local state
        setAttendanceRecords((prev) =>
          prev.map((rec) =>
            rec.id === recordId ? { ...rec, status: newStatus } : rec
          )
        );
      }

      // Clear selection
      setSelectedMarkedRecords(new Set());
      setSelectAllMarked(false);
    } catch (err) {
      console.error("Error bulk updating attendance:", err);
      setError(err instanceof Error ? err.message : "Failed to update attendance");
    } finally {
      setSavingAttendance(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PRESENT":
        return "bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-200 border-green-300 dark:border-green-800";
      case "ABSENT":
        return "bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200 border-red-300 dark:border-red-800";
      case "ON_LEAVE":
        return "bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-800";
      case "HALF_DAY":
        return "bg-yellow-100 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-800";
      case "WORK_FROM_HOME":
        return "bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-800";
      default:
        return "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PRESENT":
        return <CheckCircle className="w-4 h-4" />;
      case "ABSENT":
        return <XCircle className="w-4 h-4" />;
      case "ON_LEAVE":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 bg-white dark:bg-zinc-950">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/admin/dashboard">HRMS</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Attendance Management</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              {deviceConnected ? (
                <Badge className="bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-200 border border-green-300 dark:border-green-800">
                  <Wifi className="w-3 h-3 mr-1" />
                  Biometric Connected
                </Badge>
              ) : (
                <Badge className="bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-800">
                  <WifiOff className="w-3 h-3 mr-1" />
                  Biometric Offline
                </Badge>
              )}
            </div>
            {deviceConnected && (
              <Button
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="gap-2"
              >
                {refreshing ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Clock className="w-4 h-4" />
                )}
                {refreshing ? "Refreshing..." : "Refresh from Device"}
              </Button>
            )}
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Page Title */}
            <div>
              <h1 className="text-3xl font-bold text-black dark:text-white">Attendance Management</h1>
              <p className="text-zinc-600 dark:text-zinc-400 mt-1">
                Today's attendance: {filteredRecords.length} / {employees.length} marked
              </p>
            </div>

            {/* Device Status Alert */}
            {!deviceConnected && (
              <Card className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <WifiOff className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    <div className="flex-1">
                      <p className="font-medium text-amber-900 dark:text-amber-100">
                        Biometric Device Not Connected
                      </p>
                      <p className="text-sm text-amber-800 dark:text-amber-200 mt-1">
                        Use the manual marking option to record attendance. Make sure the biometric device is powered on and connected.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Error Alert */}
            {error && (
              <Card className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
                <CardContent className="pt-6">
                  <p className="text-red-800 dark:text-red-200">{error}</p>
                </CardContent>
              </Card>
            )}

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-white dark:bg-zinc-950">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Total Employees
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-black dark:text-white">{employees.length}</div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-zinc-950">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Present
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {attendanceRecords.filter((r) => r.status === "PRESENT").length}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-zinc-950">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Absent
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {attendanceRecords.filter((r) => r.status === "ABSENT").length}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-zinc-950">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Not Marked
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                    {unmarkedEmployees.length}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Attendance List */}
            <Card className="bg-white dark:bg-zinc-950">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Employee Attendance</CardTitle>
                    <CardDescription>Mark and manage employee attendance</CardDescription>
                  </div>
                  {unmarkedEmployees.length > 0 && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          + Mark Absent
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Mark Unmarked Employees as Absent</DialogTitle>
                          <DialogDescription>
                            Mark all {unmarkedEmployees.length} unmarked employees as absent
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                          {unmarkedEmployees.slice(0, 10).map((emp) => (
                            <div
                              key={emp.id}
                              className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg"
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={emp.avatar} />
                                  <AvatarFallback>
                                    {emp.firstName[0]}{emp.lastName[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                  <p className="font-medium text-black dark:text-white">
                                    {emp.firstName} {emp.lastName}
                                  </p>
                                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                                    {emp.department?.name}
                                  </p>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleMarkAttendance(emp.id, "ABSENT")}
                                disabled={savingAttendance}
                              >
                                {savingAttendance ? (
                                  <Loader className="w-4 h-4 animate-spin" />
                                ) : (
                                  "Absent"
                                )}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Search and Filter */}
                <div className="flex gap-4 flex-wrap">
                  <Input
                    placeholder="Search by name or employee ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 min-w-64"
                  />
                  <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept === "all" ? "All Departments" : dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="PRESENT">Present</SelectItem>
                      <SelectItem value="ABSENT">Absent</SelectItem>
                      <SelectItem value="ON_LEAVE">On Leave</SelectItem>
                      <SelectItem value="HALF_DAY">Half Day</SelectItem>
                      <SelectItem value="WORK_FROM_HOME">Work From Home</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Bulk Action Toolbar for Marked Records */}
                {selectedMarkedRecords.size > 0 && (
                  <div className="border-t border-zinc-200 dark:border-zinc-800 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg mb-4">
                    <div className="flex items-center gap-3 flex-wrap">
                      <Select defaultValue="PRESENT" onValueChange={(value) => setBulkStatusMarked(value as AttendanceRecord["status"])}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PRESENT">Mark Present</SelectItem>
                          <SelectItem value="ABSENT">Mark Absent</SelectItem>
                          <SelectItem value="ON_LEAVE">Mark On Leave</SelectItem>
                          <SelectItem value="HALF_DAY">Mark Half Day</SelectItem>
                          <SelectItem value="WORK_FROM_HOME">Mark WFH</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        size="sm"
                        onClick={() => handleBulkUpdateAttendance(bulkStatusMarked)}
                        disabled={savingAttendance}
                        className="gap-2"
                      >
                        {savingAttendance ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                        {savingAttendance ? `Updating ${selectedMarkedRecords.size}...` : `Update ${selectedMarkedRecords.size} Selected`}
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedMarkedRecords(new Set());
                          setSelectAllMarked(false);
                        }}
                      >
                        <X className="w-4 h-4" />
                        Clear
                      </Button>
                    </div>
                  </div>
                )}

                {/* Marked Attendance List */}
                {loading ? (
                  <div className="text-center py-8 text-zinc-600 dark:text-zinc-400">
                    <Loader className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading attendance data...
                  </div>
                ) : filteredRecords.length > 0 ? (
                  <div className="space-y-3">
                    {/* Select All for Marked Records */}
                    {filteredRecords.length > 0 && (
                      <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                        <Checkbox
                          id="select-all-marked"
                          checked={selectAllMarked}
                          onCheckedChange={(checked) => handleSelectAllMarked(checked as boolean)}
                        />
                        <label
                          htmlFor="select-all-marked"
                          className="flex-1 cursor-pointer font-medium text-black dark:text-white text-sm"
                        >
                          Select All ({filteredRecords.length})
                        </label>
                      </div>
                    )}

                    {filteredRecords.map((record) => (
                      <div
                        key={record.id || record.employeeId}
                        className={`flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg border transition-colors cursor-pointer ${
                          selectedMarkedRecords.has(record.id || "")
                            ? "border-blue-400 dark:border-blue-600 bg-blue-50 dark:bg-blue-950/20"
                            : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                        }`}
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <Checkbox
                            checked={selectedMarkedRecords.has(record.id || "")}
                            onCheckedChange={(checked) => handleSelectMarkedRecord(record.id, checked as boolean)}
                          />
                          <Avatar>
                            <AvatarImage src={record.avatar} />
                            <AvatarFallback>
                              {record.employeeName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-black dark:text-white">
                              {record.employeeName}
                            </p>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                              {record.designation} • {record.department}
                            </p>
                            {record.checkInTime && (
                              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                                Check-in: {record.checkInTime}
                                {record.checkOutTime && ` | Check-out: ${record.checkOutTime}`}
                              </p>
                            )}
                            {record.notes && (
                              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                                Note: {record.notes}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Badge
                            className={`flex items-center gap-2 ${getStatusColor(record.status)}`}
                          >
                            {getStatusIcon(record.status)}
                            {record.status.replace(/_/g, " ")}
                          </Badge>

                          <Badge
                            variant="outline"
                            className="text-xs"
                          >
                            {record.source}
                          </Badge>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="gap-2"
                              >
                                <Edit2 className="w-4 h-4" />
                                Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Update Attendance</DialogTitle>
                                <DialogDescription>
                                  {record.employeeName}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium text-black dark:text-white">
                                    Status
                                  </label>
                                  <Select
                                    defaultValue={record.status}
                                    onValueChange={(value) =>
                                      handleUpdateAttendance(
                                        record.id,
                                        value as AttendanceRecord["status"]
                                      )
                                    }
                                  >
                                    <SelectTrigger className="mt-2">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="PRESENT">Present</SelectItem>
                                      <SelectItem value="ABSENT">Absent</SelectItem>
                                      <SelectItem value="ON_LEAVE">On Leave</SelectItem>
                                      <SelectItem value="HALF_DAY">Half Day</SelectItem>
                                      <SelectItem value="WORK_FROM_HOME">
                                        Work From Home
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-zinc-600 dark:text-zinc-400">
                    No attendance records found for the selected filters
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Unmarked Employees */}
            {unmarkedEmployees.length > 0 && (
              <Card className="bg-white dark:bg-zinc-950 border-amber-200 dark:border-amber-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-amber-900 dark:text-amber-100">
                        Employees Without Attendance ({unmarkedEmployees.length})
                      </CardTitle>
                      <CardDescription>
                        Employees yet to mark attendance for today
                      </CardDescription>
                    </div>
                    {selectedUnmarkedEmployees.size > 0 && (
                      <Badge className="bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200">
                        {selectedUnmarkedEmployees.size} selected
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                {/* Bulk Action Toolbar */}
                {selectedUnmarkedEmployees.size > 0 && (
                  <div className="border-t border-amber-200 dark:border-amber-800 p-4 bg-blue-50 dark:bg-blue-950/30">
                    <div className="flex items-center gap-3 flex-wrap">
                      <Select defaultValue="PRESENT" onValueChange={(value) => setBulkStatus(value as AttendanceRecord["status"])}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PRESENT">Mark Present</SelectItem>
                          <SelectItem value="ABSENT">Mark Absent</SelectItem>
                          <SelectItem value="ON_LEAVE">Mark On Leave</SelectItem>
                          <SelectItem value="HALF_DAY">Mark Half Day</SelectItem>
                          <SelectItem value="WORK_FROM_HOME">Mark WFH</SelectItem>
                        </SelectContent>
                      </Select>

                      <Input
                        placeholder="Add notes (optional)"
                        value={bulkNotes}
                        onChange={(e) => setBulkNotes(e.target.value)}
                        className="flex-1 min-w-48"
                      />

                      <Button
                        size="sm"
                        onClick={() => handleBulkMarkAttendance(bulkStatus)}
                        disabled={savingAttendance}
                        className="gap-2"
                      >
                        {savingAttendance ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                        {savingAttendance ? "Marking..." : "Apply to Selected"}
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedUnmarkedEmployees(new Set());
                          setSelectAllUnmarked(false);
                        }}
                      >
                        <X className="w-4 h-4" />
                        Clear
                      </Button>
                    </div>
                  </div>
                )}

                <CardContent className="space-y-3 pt-6">
                  {/* Select All Checkbox */}
                  <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-amber-200 dark:border-amber-800 mb-4">
                    <Checkbox
                      id="select-all-unmarked"
                      checked={selectAllUnmarked}
                      onCheckedChange={(checked) => handleSelectAllUnmarked(checked as boolean)}
                    />
                    <label
                      htmlFor="select-all-unmarked"
                      className="flex-1 cursor-pointer font-medium text-black dark:text-white"
                    >
                      Select All ({unmarkedEmployees.length})
                    </label>
                  </div>

                  {/* Individual Employee Rows with Checkboxes */}
                  {unmarkedEmployees.map((emp) => (
                    <div
                      key={emp.id}
                      className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-amber-200 dark:border-amber-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <Checkbox
                          checked={selectedUnmarkedEmployees.has(emp.id)}
                          onCheckedChange={(checked) => handleSelectUnmarked(emp.id, checked as boolean)}
                        />
                        <Avatar>
                          <AvatarImage src={emp.avatar} />
                          <AvatarFallback>
                            {emp.firstName[0]}{emp.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-black dark:text-white">
                            {emp.firstName} {emp.lastName}
                          </p>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            {emp.designation} • {emp.department?.name}
                          </p>
                          <p className="text-xs text-zinc-600 dark:text-zinc-400">
                            {emp.email}
                          </p>
                        </div>
                      </div>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            Mark Attendance
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Mark Attendance</DialogTitle>
                            <DialogDescription>{emp.firstName} {emp.lastName}</DialogDescription>
                          </DialogHeader>

                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium text-black dark:text-white">
                                Attendance Status
                              </label>
                              <Select
                                defaultValue="PRESENT"
                                onValueChange={(value) =>
                                  setSelectedStatus(value as AttendanceRecord["status"])
                                }
                              >
                                <SelectTrigger className="mt-2">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="PRESENT">Present</SelectItem>
                                  <SelectItem value="ABSENT">Absent</SelectItem>
                                  <SelectItem value="ON_LEAVE">On Leave</SelectItem>
                                  <SelectItem value="HALF_DAY">Half Day</SelectItem>
                                  <SelectItem value="WORK_FROM_HOME">
                                    Work From Home
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <label className="text-sm font-medium text-black dark:text-white">
                                Notes (Optional)
                              </label>
                              <Input
                                placeholder="Add any notes..."
                                value={manualNotes}
                                onChange={(e) => setManualNotes(e.target.value)}
                                className="mt-2"
                              />
                            </div>

                            <Button
                              onClick={() => handleMarkAttendance(emp.id, selectedStatus)}
                              disabled={savingAttendance}
                              className="w-full"
                            >
                              {savingAttendance ? (
                                <>
                                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <Save className="w-4 h-4 mr-2" />
                                  Mark Attendance
                                </>
                              )}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
