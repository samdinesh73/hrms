"use client";

import { useState } from "react";
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
import { UserPlus, FileText, DollarSign, BarChart3, Building2, Settings, Star } from "lucide-react"

export default function AdminDashboard() {
  const [searchEmployee, setSearchEmployee] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, empId: "EMP001", name: "John Doe", type: "Earned Leave", from: "Jan 10, 2026", to: "Jan 15, 2026", days: 5, status: "Pending", reason: "Vacation", appliedOn: "Dec 28, 2025" },
    { id: 2, empId: "EMP002", name: "Jane Smith", type: "Casual Leave", from: "Jan 5, 2026", to: "Jan 6, 2026", days: 2, status: "Pending", reason: "Personal", appliedOn: "Dec 30, 2025" },
    { id: 3, empId: "EMP003", name: "Mike Johnson", type: "Sick Leave", from: "Jan 3, 2026", to: "Jan 4, 2026", days: 2, status: "Approved", reason: "Medical", appliedOn: "Dec 31, 2025" },
    { id: 4, empId: "EMP004", name: "Sarah Williams", type: "Earned Leave", from: "Jan 20, 2026", to: "Jan 25, 2026", days: 5, status: "Rejected", reason: "Family", appliedOn: "Dec 25, 2025" },
  ]);

  // Employee data
  const employees = [
    { id: "EMP001", name: "John Doe", role: "Senior Software Engineer", department: "IT", email: "john@company.com", phone: "+1 555-1234", joinDate: "Mar 15, 2021", salary: "$5,000", status: "Active", avatar: "https://github.com/shadcn.png" },
    { id: "EMP002", name: "Jane Smith", role: "HR Manager", department: "HR", email: "jane@company.com", phone: "+1 555-5678", joinDate: "Jan 10, 2020", salary: "$4,500", status: "Active", avatar: "https://github.com/vercel.png" },
    { id: "EMP003", name: "Mike Johnson", role: "Product Designer", department: "Design", email: "mike@company.com", phone: "+1 555-9012", joinDate: "Jun 20, 2022", salary: "$4,200", status: "Active", avatar: "" },
    { id: "EMP004", name: "Sarah Williams", role: "Finance Lead", department: "Finance", email: "sarah@company.com", phone: "+1 555-3456", joinDate: "Feb 5, 2021", salary: "$4,800", status: "Active", avatar: "" },
    { id: "EMP005", name: "Alex Turner", role: "Sales Manager", department: "Sales", email: "alex@company.com", phone: "+1 555-7890", joinDate: "Aug 12, 2021", salary: "$4,300", status: "Active", avatar: "" },
    { id: "EMP006", name: "Emma Davis", role: "QA Engineer", department: "IT", email: "emma@company.com", phone: "+1 555-2345", joinDate: "Apr 8, 2022", salary: "$3,800", status: "On Leave", avatar: "" },
  ];

  // Payroll data
  const payrollData = [
    { empId: "EMP001", name: "John Doe", month: "January 2026", salary: "$5,000", bonus: "$500", deductions: "$200", net: "$5,300", status: "Processed" },
    { empId: "EMP002", name: "Jane Smith", month: "January 2026", salary: "$4,500", bonus: "$0", deductions: "$180", net: "$4,320", status: "Processed" },
    { empId: "EMP003", name: "Mike Johnson", month: "January 2026", salary: "$4,200", bonus: "$300", deductions: "$170", net: "$4,330", status: "Pending" },
    { empId: "EMP004", name: "Sarah Williams", month: "January 2026", salary: "$4,800", bonus: "$400", deductions: "$200", net: "$5,000", status: "Processed" },
  ];

  // Department allocation
  const departmentData = [
    { name: "IT", total: 45, available: 38, onLeave: 4, absent: 3, head: "David Chen" },
    { name: "HR", total: 12, available: 10, onLeave: 1, absent: 1, head: "Sarah Williams" },
    { name: "Finance", total: 28, available: 25, onLeave: 2, absent: 1, head: "Robert Brown" },
    { name: "Sales", total: 35, available: 32, onLeave: 2, absent: 1, head: "Lisa Anderson" },
    { name: "Design", total: 18, available: 16, onLeave: 1, absent: 1, head: "Jessica White" },
    { name: "Operations", total: 54, available: 48, onLeave: 3, absent: 3, head: "Marcus Wilson" },
  ];

  // Performance metrics
  const performanceMetrics = [
    { empId: "EMP001", name: "John Doe", rating: 4.5, projects: 12, tasksCompleted: 95, attendance: 96 },
    { empId: "EMP002", name: "Jane Smith", rating: 4.2, projects: 8, tasksCompleted: 88, attendance: 98 },
    { empId: "EMP003", name: "Mike Johnson", rating: 4.0, projects: 15, tasksCompleted: 92, attendance: 94 },
  ];

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchEmployee.toLowerCase()) ||
                         emp.id.toLowerCase().includes(searchEmployee.toLowerCase());
    const matchesDept = filterDepartment === "all" || emp.department === filterDepartment;
    return matchesSearch && matchesDept;
  });

  const handleLeaveStatusChange = (requestId: number, newStatus: string) => {
    setLeaveRequests(leaveRequests.map(request =>
      request.id === requestId ? { ...request, status: newStatus } : request
    ));
  };

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
                  <div className="text-3xl font-bold text-black dark:text-white">248</div>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2">+12 this month</p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-zinc-950">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Present Today</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-black dark:text-white">235</div>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">94.8% rate</p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-zinc-950">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">On Leave</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-black dark:text-white">13</div>
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
                      <Button size="sm">+ Add Employee</Button>
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
                          {departmentData.map(dept => (
                            <SelectItem key={dept.name} value={dept.name}>{dept.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Employee Table */}
                    <div className="space-y-2">
                      {filteredEmployees.map((emp) => (
                        <div key={emp.id} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                          <div className="flex items-center gap-3 flex-1">
                            <Avatar>
                              <AvatarImage src={emp.avatar} />
                              <AvatarFallback>{emp.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-black dark:text-white">{emp.name}</p>
                              <p className="text-sm text-zinc-600 dark:text-zinc-400">{emp.role} • {emp.department}</p>
                              <p className="text-xs text-zinc-600 dark:text-zinc-400">{emp.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant={emp.status === "Active" ? "default" : "secondary"}>{emp.status}</Badge>
                            <Button variant="ghost" size="sm">Edit</Button>
                          </div>
                        </div>
                      ))}
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
                    {departmentData.map((dept) => (
                      <div key={dept.name} className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-medium text-black dark:text-white">{dept.name}</p>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">Head: {dept.head}</p>
                          </div>
                          <p className="text-2xl font-bold text-black dark:text-white">{dept.total}</p>
                        </div>
                        <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2 mb-3">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${(dept.available / dept.total) * 100}%` }}
                          ></div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-zinc-600 dark:text-zinc-400">Available</p>
                            <p className="font-medium text-green-600 dark:text-green-400">{dept.available}</p>
                          </div>
                          <div>
                            <p className="text-zinc-600 dark:text-zinc-400">On Leave</p>
                            <p className="font-medium text-amber-600 dark:text-amber-400">{dept.onLeave}</p>
                          </div>
                          <div>
                            <p className="text-zinc-600 dark:text-zinc-400">Absent</p>
                            <p className="font-medium text-red-600 dark:text-red-400">{dept.absent}</p>
                          </div>
                        </div>
                      </div>
                    ))}
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
