"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { UserPlus, FileText, DollarSign, BarChart3, Building2, Settings, Star, AlertCircle } from "lucide-react"

export default function AdminDashboard() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [searchEmployee, setSearchEmployee] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [employees, setEmployees] = useState<any[]>([]);
  const [departmentData, setDepartmentData] = useState<any[]>([]);
  const [payrollData, setPayrollData] = useState<any[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<any[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [attendance, setAttendance] = useState({
    presentToday: 0,
    onLeave: 0,
    absent: 0,
  });
  const [loading, setLoading] = useState(true);
  const [deptLoading, setDeptLoading] = useState(true);
  const [payrollLoading, setPayrollLoading] = useState(false);
  const [leaveLoading, setLeaveLoading] = useState(false);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deptError, setDeptError] = useState<string | null>(null);


  // Check user role on component mount
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
    
    if (role && role !== "ADMIN") {
      setAccessDenied(true);
      setLoading(false);
    }
  }, []);

  // Fetch employees from backend API
  useEffect(() => {
    if (accessDenied) return;
    
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/employees");
        
        if (!response.ok) {
          throw new Error(`Failed to fetch employees: ${response.statusText}`);
        }
        
        const data = await response.json();
        // Extract employees from response
        const employeeList = data.data || data || [];
        setEmployees(Array.isArray(employeeList) ? employeeList : []);
        setError(null);
      } catch (err) {
        console.error("Error fetching employees:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch employees");
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [accessDenied]);

  // Fetch departments from backend API
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setDeptLoading(true);
        const response = await fetch("http://localhost:5000/api/departments");
        
        if (!response.ok) {
          throw new Error(`Failed to fetch departments: ${response.statusText}`);
        }
        
        const data = await response.json();
        const deptList = data.data || data || [];
        setDepartmentData(Array.isArray(deptList) ? deptList : []);
        setDeptError(null);
      } catch (err) {
        console.error("Error fetching departments:", err);
        setDeptError(err instanceof Error ? err.message : "Failed to fetch departments");
        setDepartmentData([]);
      } finally {
        setDeptLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  // Fetch payroll data from backend API
  useEffect(() => {
    const fetchPayroll = async () => {
      try {
        setPayrollLoading(true);
        const response = await fetch("http://localhost:5000/api/salary");
        
        if (!response.ok) {
          throw new Error("Failed to fetch payroll data");
        }
        
        const data = await response.json();
        const salaries = data.data || data || [];
        // Transform salary data to match UI expectations
        const transformedPayroll = salaries.map((salary: any) => ({
          empId: salary.employeeId,
          name: `${salary.employee?.firstName || ""} ${salary.employee?.lastName || ""}`.trim(),
          month: `${salary.month}/${salary.year}`,
          salary: `$${salary.baseSalary?.toFixed(2) || 0}`,
          bonus: `$${salary.bonuses?.toFixed(2) || 0}`,
          deductions: `$${salary.deductions?.toFixed(2) || 0}`,
          net: `$${salary.netSalary?.toFixed(2) || 0}`,
          status: salary.status || "Pending",
        }));
        setPayrollData(transformedPayroll);
      } catch (err) {
        console.error("Error fetching payroll:", err);
        setPayrollData([]);
      } finally {
        setPayrollLoading(false);
      }
    };

    fetchPayroll();
  }, []);

  // Fetch leave requests from backend API
  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        setLeaveLoading(true);
        const response = await fetch("http://localhost:5000/api/leaves");
        
        if (!response.ok) {
          throw new Error("Failed to fetch leaves");
        }
        
        const data = await response.json();
        const leaves = data.data || data || [];
        // Transform leave data
        const transformedLeaves = leaves.map((leave: any) => ({
          id: leave.id,
          empId: leave.employeeId,
          name: `${leave.employee?.firstName || ""} ${leave.employee?.lastName || ""}`.trim(),
          type: leave.leaveType,
          from: new Date(leave.startDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
          to: new Date(leave.endDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
          days: leave.totalDays,
          status: leave.status,
          reason: leave.reason,
          appliedOn: new Date(leave.createdAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
        }));
        setLeaveRequests(transformedLeaves);
      } catch (err) {
        console.error("Error fetching leaves:", err);
        setLeaveRequests([]);
      } finally {
        setLeaveLoading(false);
      }
    };

    fetchLeaves();
  }, []);

  // Fetch attendance data from backend API
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setAttendanceLoading(true);
        // Fetch today's attendance only
        const today = new Date().toISOString().split("T")[0];
        const response = await fetch(`http://localhost:5000/api/attendance/date/${today}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch attendance");
        }
        
        const data = await response.json();
        const attendanceData = data.data || data || [];
        
        // Calculate attendance statistics for today
        const presentCount = attendanceData.filter((a: any) => a.status === "PRESENT").length;
        const onLeaveCount = attendanceData.filter((a: any) => a.status === "ON_LEAVE").length;
        const absentCount = attendanceData.filter((a: any) => a.status === "ABSENT").length;
        
        setAttendance({
          presentToday: presentCount,
          onLeave: onLeaveCount,
          absent: absentCount,
        });
      } catch (err) {
        console.error("Error fetching attendance:", err);
        // Default to static values if API fails
        setAttendance({
          presentToday: 235,
          onLeave: 13,
          absent: 0,
        });
      } finally {
        setAttendanceLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  const filteredEmployees = employees.filter(emp => {
    const fullName = `${emp.firstName} ${emp.lastName}`;
    const matchesSearch = fullName.toLowerCase().includes(searchEmployee.toLowerCase()) ||
                         emp.id?.toLowerCase().includes(searchEmployee.toLowerCase());
    const matchesDept = filterDepartment === "all" || emp.department?.name === filterDepartment;
    return matchesSearch && matchesDept;
  });

  const handleLeaveStatusChange = async (requestId: string, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/leaves/${requestId}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          managerId: "current-manager-id", // Replace with actual manager ID from session
          status: newStatus,
          approvalDate: new Date().toISOString(),
          comments: `Status changed to ${newStatus}`,
        }),
      });

      if (response.ok) {
        // Update local state
        setLeaveRequests(leaveRequests.map(request =>
          request.id === requestId ? { ...request, status: newStatus } : request
        ));
      } else {
        console.error("Failed to update leave status");
      }
    } catch (err) {
      console.error("Error updating leave status:", err);
    }
  };

  const handleFormInputChange = (field: string, value: string) => {
    // Removed - this function is no longer needed
  };

  const handleAddEmployee = async () => {
    // Removed - moved to dedicated add employee page
  };

  // Access Denied View
  if (accessDenied) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <Card className="w-full max-w-md border-red-200 dark:border-red-900">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-16 w-16 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-red-600">Access Denied</CardTitle>
            <CardDescription>You don't have access to this dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
              Only admins can access the Admin Dashboard. Your current role is <strong>{userRole || "Unknown"}</strong>.
            </p>
            <Button 
              onClick={() => router.push("/login")} 
              className="w-full"
            >
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 bg-white dark:bg-zinc-950">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#" className="text-black dark:text-white">HRMS</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-zinc-600 dark:text-zinc-400">Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Page Title */}
            <div>
              <h1 className="text-3xl font-bold text-black dark:text-white">HRMS Dashboard</h1>
              <p className="text-zinc-600 dark:text-zinc-400 mt-1">Manage employees, leaves, payroll, and HR operations</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <Card className="bg-white dark:bg-zinc-950">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Total Employees</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-black dark:text-white">{loading ? "-" : employees.length}</div>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2">+12 this month</p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-zinc-950">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Present Today</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-black dark:text-white">{attendanceLoading ? "-" : attendance.presentToday}</div>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">{employees.length > 0 ? Math.round((attendance.presentToday / employees.length) * 100) : 0}% rate</p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-zinc-950">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">On Leave</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-black dark:text-white">{attendanceLoading ? "-" : attendance.onLeave}</div>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">Out of office</p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-zinc-950">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Pending Leaves</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-black dark:text-white">{leaveRequests.filter(r => r.status === "Pending").length}</div>
                  <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">Awaiting approval</p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-zinc-950">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Departments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-black dark:text-white">{departmentData.length}</div>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">Active</p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-zinc-950">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Open Positions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-black dark:text-white">6</div>
                  <p className="text-xs text-red-600 dark:text-red-400 mt-2">Recruiting</p>
                </CardContent>
              </Card>
            </div>

            {/* Tabs Section */}
            <Tabs defaultValue="employees" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="employees">Employees</TabsTrigger>
                <TabsTrigger value="leaves">Leave Requests</TabsTrigger>
                <TabsTrigger value="payroll">Payroll</TabsTrigger>
                <TabsTrigger value="departments">Departments</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
              </TabsList>

              {/* Employees Tab */}
              <TabsContent value="employees" className="mt-4">
                <Card className="bg-white dark:bg-zinc-950">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Employee Directory</CardTitle>
                        <CardDescription>Manage all employees</CardDescription>
                      </div>
                      <Button 
                        size="sm" 
                        className="gap-2"
                        onClick={() => router.push("/admin/employees/add")}
                      >
                        <UserPlus className="w-4 h-4" /> Add Employee
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Search and Filter */}
                    <div className="flex gap-4">
                      <Input
                        placeholder="Search by name or ID..."
                        value={searchEmployee}
                        onChange={(e) => setSearchEmployee(e.target.value)}
                        className="flex-1"
                      />
                      <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Departments</SelectItem>
                          {deptLoading ? (
                            <SelectItem value="loading" disabled>Loading...</SelectItem>
                          ) : (
                            departmentData.map(dept => (
                              <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Employee Table */}
                    <div className="space-y-2">
                      {loading ? (
                        <div className="text-center py-8 text-zinc-600 dark:text-zinc-400">Loading employees...</div>
                      ) : error ? (
                        <div className="text-center py-8 text-red-600 dark:text-red-400">Error: {error}</div>
                      ) : filteredEmployees.length > 0 ? (
                        filteredEmployees.map((emp) => (
                          <div key={emp.id} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                            <div className="flex items-center gap-3 flex-1">
                              <Avatar>
                                <AvatarImage src={emp.avatar} />
                                <AvatarFallback>{`${emp.firstName?.[0]}${emp.lastName?.[0]}`.toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-black dark:text-white">{emp.firstName} {emp.lastName}</p>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">{emp.designation} • {emp.department?.name}</p>
                                <p className="text-xs text-zinc-600 dark:text-zinc-400">{emp.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant={emp.employmentStatus === "ACTIVE" ? "default" : "secondary"}>{emp.employmentStatus}</Badge>
                              <Button variant="ghost" size="sm">Edit</Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-zinc-600 dark:text-zinc-400">No employees found</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Leave Requests Tab */}
              <TabsContent value="leaves" className="mt-4">
                <Card className="bg-white dark:bg-zinc-950">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Leave Request Management</CardTitle>
                        <CardDescription>Approve or reject leave requests</CardDescription>
                      </div>
                      <Button size="sm" variant="outline">Export</Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {leaveRequests.map((request) => (
                      <div key={request.id} className="flex items-start justify-between p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="font-medium text-black dark:text-white">{request.name}</p>
                            <Badge variant="outline" className="text-xs">{request.empId}</Badge>
                          </div>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">{request.type} • {request.days} days</p>
                          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">{request.from} to {request.to}</p>
                          <p className="text-xs text-zinc-600 dark:text-zinc-400">Reason: {request.reason}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          {/* Status Badge */}
                          <Badge
                            variant={
                              request.status === "Approved"
                                ? "default"
                                : request.status === "Pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                            className="min-w-fit"
                          >
                            {request.status}
                          </Badge>

                          {/* Status Select */}
                          <select
                            value={request.status}
                            onChange={(e) => handleLeaveStatusChange(request.id, e.target.value)}
                            className="px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Payroll Tab */}
              <TabsContent value="payroll" className="mt-4">
                <Card className="bg-white dark:bg-zinc-950">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Payroll Management</CardTitle>
                        <CardDescription>January 2026 salary processing</CardDescription>
                      </div>
                      <Button size="sm">Generate Payslips</Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {payrollData.map((payroll) => (
                      <div key={payroll.empId} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                        <div className="flex-1">
                          <p className="font-medium text-black dark:text-white">{payroll.name}</p>
                          <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                            <p className="text-zinc-600 dark:text-zinc-400">Salary: <span className="font-medium text-black dark:text-white">{payroll.salary}</span></p>
                            <p className="text-green-600 dark:text-green-400">Bonus: <span className="font-medium">+{payroll.bonus}</span></p>
                            <p className="text-red-600 dark:text-red-400">Deductions: <span className="font-medium">-{payroll.deductions}</span></p>
                            <p className="text-blue-600 dark:text-blue-400">Net: <span className="font-medium">{payroll.net}</span></p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={payroll.status === "Processed" ? "default" : "secondary"}>
                            {payroll.status}
                          </Badge>
                          <Button variant="ghost" size="sm">View</Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Departments Tab */}
              <TabsContent value="departments" className="mt-4">
                <Card className="bg-white dark:bg-zinc-950">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Department Overview</CardTitle>
                        <CardDescription>Staff allocation and utilization</CardDescription>
                      </div>
                      <Button size="sm">+ New Department</Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {deptLoading ? (
                      <div className="text-center py-8 text-zinc-600 dark:text-zinc-400">Loading departments...</div>
                    ) : deptError ? (
                      <div className="text-center py-8 text-red-600 dark:text-red-400">Error: {deptError}</div>
                    ) : departmentData.length > 0 ? (
                      departmentData.map((dept) => (
                        <div key={dept.id} className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="font-medium text-black dark:text-white">{dept.name}</p>
                              <p className="text-sm text-zinc-600 dark:text-zinc-400">Head: {dept.head || "N/A"}</p>
                            </div>
                            <p className="text-2xl font-bold text-black dark:text-white">{dept.total || 0}</p>
                          </div>
                          <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2 mb-3">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${dept.total > 0 ? ((dept.available || 0) / dept.total) * 100 : 0}%` }}
                            ></div>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-zinc-600 dark:text-zinc-400">Available</p>
                              <p className="font-medium text-green-600 dark:text-green-400">{dept.available || 0}</p>
                            </div>
                            <div>
                              <p className="text-zinc-600 dark:text-zinc-400">On Leave</p>
                              <p className="font-medium text-amber-600 dark:text-amber-400">{dept.onLeave || 0}</p>
                            </div>
                            <div>
                              <p className="text-zinc-600 dark:text-zinc-400">Absent</p>
                              <p className="font-medium text-red-600 dark:text-red-400">{dept.absent || 0}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-zinc-600 dark:text-zinc-400">No departments found</div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Performance Tab */}
              <TabsContent value="performance" className="mt-4">
                <Card className="bg-white dark:bg-zinc-950">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Employee Performance</CardTitle>
                        <CardDescription>Top performers and metrics</CardDescription>
                      </div>
                      <Button size="sm" variant="outline">Generate Report</Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {performanceMetrics.map((emp) => (
                      <div key={emp.empId} className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                        <div className="flex items-center justify-between mb-3">
                          <p className="font-medium text-black dark:text-white">{emp.name}</p>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge className="bg-yellow-100 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-200 cursor-help flex items-center gap-1">
                                  <Star className="w-4 h-4" />
                                  {emp.rating}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>Performance Rating</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-zinc-600 dark:text-zinc-400 text-xs">Projects</p>
                            <p className="font-medium text-black dark:text-white mt-1">{emp.projects}</p>
                          </div>
                          <div>
                            <p className="text-zinc-600 dark:text-zinc-400 text-xs">Tasks Completed</p>
                            <p className="font-medium text-black dark:text-white mt-1">{emp.tasksCompleted}%</p>
                          </div>
                          <div>
                            <p className="text-zinc-600 dark:text-zinc-400 text-xs">Attendance</p>
                            <p className="font-medium text-black dark:text-white mt-1">{emp.attendance}%</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Quick Actions */}
            <Card className="bg-white dark:bg-zinc-950">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common HRMS operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  <Button variant="outline" className="justify-center flex-col h-auto py-3">
                    <UserPlus className="w-5 h-5 mb-1" />
                    <span className="text-xs">New Employee</span>
                  </Button>
                  <Button variant="outline" className="justify-center flex-col h-auto py-3">
                    <FileText className="w-5 h-5 mb-1" />
                    <span className="text-xs">Leave Requests</span>
                  </Button>
                  <Button variant="outline" className="justify-center flex-col h-auto py-3">
                    <DollarSign className="w-5 h-5 mb-1" />
                    <span className="text-xs">Payroll</span>
                  </Button>
                  <Button variant="outline" className="justify-center flex-col h-auto py-3">
                    <BarChart3 className="w-5 h-5 mb-1" />
                    <span className="text-xs">Reports</span>
                  </Button>
                  <Button variant="outline" className="justify-center flex-col h-auto py-3">
                    <Building2 className="w-5 h-5 mb-1" />
                    <span className="text-xs">Departments</span>
                  </Button>
                  <Button variant="outline" className="justify-center flex-col h-auto py-3">
                    <Settings className="w-5 h-5 mb-1" />
                    <span className="text-xs">Settings</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
