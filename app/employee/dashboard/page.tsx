"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

export default function EmployeeDashboard() {
  const [selectedMonth, setSelectedMonth] = useState("January 2026");

  // Employee data
  const employee = {
    name: "John Doe",
    id: "EMP001",
    role: "Senior Software Engineer",
    department: "IT",
    email: "john.doe@company.com",
    phone: "+1 (555) 123-4567",
    joinDate: "March 15, 2021",
    manager: "Sarah Williams",
    avatar: "https://github.com/shadcn.png",
  };

  // Attendance data
  const attendanceData = {
    present: 18,
    absent: 2,
    leave: 5,
    workFromHome: 3,
  };

  // Leave balance
  const leaveBalance = [
    { type: "Sick Leave", used: 2, total: 5, remaining: 3 },
    { type: "Casual Leave", used: 4, total: 10, remaining: 6 },
    { type: "Earned Leave", used: 10, total: 20, remaining: 10 },
    { type: "Maternity/Paternity", used: 0, total: 3, remaining: 3 },
  ];

  // Performance metrics
  const performanceMetrics = [
    { metric: "Project Completion Rate", value: 95, target: 100 },
    { metric: "Code Quality Score", value: 88, target: 90 },
    { metric: "Attendance Rate", value: 94, target: 95 },
    { metric: "Deadline Adherence", value: 92, target: 95 },
  ];

  // Recent tasks
  const recentTasks = [
    { id: 1, title: "Complete API Integration", status: "In Progress", dueDate: "Jan 5, 2026", priority: "high" },
    { id: 2, title: "Code Review for Team", status: "Pending", dueDate: "Jan 3, 2026", priority: "medium" },
    { id: 3, title: "Update Documentation", status: "Completed", dueDate: "Jan 2, 2026", priority: "low" },
    { id: 4, title: "Team Standup Meeting", status: "Scheduled", dueDate: "Today", priority: "high" },
  ];

  // Salary information
  const currentSalary = {
    baseSalary: "$5,000",
    hra: "$1,000",
    da: "$800",
    bonus: "$500",
    deductions: "$200",
    netSalary: "$7,100",
  };

  // Recent leaves
  const recentLeaves = [
    { id: 1, type: "Casual Leave", from: "Dec 25, 2025", to: "Dec 26, 2025", status: "Approved", days: 2 },
    { id: 2, type: "Sick Leave", from: "Jan 1, 2026", to: "Jan 1, 2026", status: "Approved", days: 1 },
    { id: 3, type: "Earned Leave", from: "Pending", to: "Pending", status: "Pending", days: 5 },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-white">Employee Dashboard</h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1">Welcome, {employee.name}</p>
          </div>
          <AnimatedThemeToggler />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        {/* Employee Card */}
        <Card className="bg-white dark:bg-zinc-950">
          <CardContent className="pt-6">
            <div className="flex items-start gap-6 mb-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={employee.avatar} />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-black dark:text-white">{employee.name}</h2>
                    <p className="text-lg text-blue-600 dark:text-blue-400 mt-1">{employee.role}</p>
                  </div>
                  <Badge className="text-base px-4 py-2">{employee.department}</Badge>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-4">ID: {employee.id}</p>
              </div>
            </div>
            <Separator className="my-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm">Email</p>
                <p className="text-black dark:text-white font-medium mt-1">{employee.email}</p>
              </div>
              <div>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm">Phone</p>
                <p className="text-black dark:text-white font-medium mt-1">{employee.phone}</p>
              </div>
              <div>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm">Manager</p>
                <p className="text-black dark:text-white font-medium mt-1">{employee.manager}</p>
              </div>
              <div>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm">Joined</p>
                <p className="text-black dark:text-white font-medium mt-1">{employee.joinDate}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance & Leave Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white dark:bg-zinc-950">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Present</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black dark:text-white">{attendanceData.present}</div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-2">This month</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-zinc-950">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">On Leave</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black dark:text-white">{attendanceData.leave}</div>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">Days taken</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-zinc-950">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Work From Home</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black dark:text-white">{attendanceData.workFromHome}</div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">Days</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-zinc-950">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Absent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black dark:text-white">{attendanceData.absent}</div>
              <p className="text-xs text-red-600 dark:text-red-400 mt-2">Days</p>
            </CardContent>
          </Card>
        </div>

        {/* Leave Balance & Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leave Balance */}
          <Card className="bg-white dark:bg-zinc-950 lg:col-span-2">
            <CardHeader>
              <CardTitle>Leave Balance</CardTitle>
              <CardDescription>Your available leave days</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {leaveBalance.map((leave, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">{leave.type}</span>
                    <span className="text-sm font-medium text-black dark:text-white">{leave.remaining} / {leave.total}</span>
                  </div>
                  <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${(leave.remaining / leave.total) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">{leave.used} used</p>
                </div>
              ))}
              <Button className="w-full mt-4">Request Leave</Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-white dark:bg-zinc-950">
            <CardHeader>
              <CardTitle>This Month</CardTitle>
              <CardDescription>Key statistics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <p className="text-xs text-green-700 dark:text-green-300 font-medium">Attendance Rate</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">94%</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">Tasks Completed</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">12</p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <p className="text-xs text-purple-700 dark:text-purple-300 font-medium">Performance Score</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">92/100</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Card className="bg-white dark:bg-zinc-950">
          <CardContent className="pt-6">
            <Tabs defaultValue="tasks" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="payroll">Payroll</TabsTrigger>
                <TabsTrigger value="leaves">Leaves</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
              </TabsList>

              {/* Tasks Tab */}
              <TabsContent value="tasks" className="mt-4 space-y-3">
                <div className="flex gap-4 mb-4">
                  <Input placeholder="Search tasks..." className="flex-1" />
                  <Select>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tasks</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="inprogress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {recentTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-black dark:text-white">{task.title}</p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Due: {task.dueDate}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={task.priority === "high" ? "destructive" : task.priority === "medium" ? "secondary" : "outline"}>
                        {task.priority}
                      </Badge>
                      <Badge variant={task.status === "Completed" ? "default" : task.status === "In Progress" ? "secondary" : "outline"}>
                        {task.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </TabsContent>

              {/* Payroll Tab */}
              <TabsContent value="payroll" className="mt-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                    <span className="text-zinc-700 dark:text-zinc-300">Base Salary</span>
                    <span className="font-medium text-black dark:text-white">{currentSalary.baseSalary}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                    <span className="text-zinc-700 dark:text-zinc-300">HRA</span>
                    <span className="font-medium text-black dark:text-white">{currentSalary.hra}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                    <span className="text-zinc-700 dark:text-zinc-300">DA (Dearness Allowance)</span>
                    <span className="font-medium text-black dark:text-white">{currentSalary.da}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                    <span className="text-green-700 dark:text-green-300 font-medium">Bonus</span>
                    <span className="font-medium text-green-600 dark:text-green-400">+{currentSalary.bonus}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                    <span className="text-red-700 dark:text-red-300 font-medium">Deductions</span>
                    <span className="font-medium text-red-600 dark:text-red-400">-{currentSalary.deductions}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <span className="text-blue-700 dark:text-blue-300 font-bold text-lg">Net Salary</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">{currentSalary.netSalary}</span>
                  </div>
                  <Button variant="outline" className="w-full">Download Payslip</Button>
                </div>
              </TabsContent>

              {/* Leaves Tab */}
              <TabsContent value="leaves" className="mt-4 space-y-3">
                {recentLeaves.map((leave) => (
                  <div key={leave.id} className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-black dark:text-white">{leave.type}</p>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                          {leave.from} to {leave.to}
                        </p>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">{leave.days} day(s)</p>
                      </div>
                      <Badge variant={leave.status === "Approved" ? "default" : "secondary"}>
                        {leave.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </TabsContent>

              {/* Performance Tab */}
              <TabsContent value="performance" className="mt-4 space-y-4">
                {performanceMetrics.map((metric, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-700 dark:text-zinc-300">{metric.metric}</span>
                      <div className="flex gap-2">
                        <span className="text-sm font-medium text-black dark:text-white">{metric.value}%</span>
                        <span className="text-xs text-zinc-600 dark:text-zinc-400">/ {metric.target}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${metric.value >= metric.target ? "bg-green-600" : "bg-blue-600"}`}
                        style={{ width: `${Math.min(metric.value, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white dark:bg-zinc-950">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common employee operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <Button variant="outline" className="justify-start">Update Profile</Button>
              <Button variant="outline" className="justify-start">Request Leave</Button>
              <Button variant="outline" className="justify-start">Download Payslip</Button>
              <Button variant="outline" className="justify-start">View Documents</Button>
              <Button variant="outline" className="justify-start">Submit Expense</Button>
              <Button variant="outline" className="justify-start">View Announcements</Button>
              <Button variant="outline" className="justify-start">Contact HR</Button>
              <Button variant="outline" className="justify-start">Training Portal</Button>
            </div>
          </CardContent>
        </Card>

        <Separator className="my-4" />

        {/* Footer */}
        <div className="text-center text-zinc-600 dark:text-zinc-400 text-sm py-4">
          <p>© 2026 HRMS Employee Dashboard. Last updated: January 1, 2026</p>
        </div>
      </div>
    </div>
  );
}
