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

export default function Home() {
  const [selectedMonth, setSelectedMonth] = useState("January");

  // Sample data
  const employees = [
    { id: 1, name: "John Doe", role: "Software Engineer", status: "Present", avatar: "https://github.com/shadcn.png", department: "IT" },
    { id: 2, name: "Jane Smith", role: "HR Manager", status: "Present", avatar: "https://github.com/vercel.png", department: "HR" },
    { id: 3, name: "Mike Johnson", role: "Product Designer", status: "Absent", avatar: "", department: "Design" },
    { id: 4, name: "Sarah Williams", role: "Finance Lead", status: "Leave", avatar: "https://github.com/shadcn.png", department: "Finance" },
  ];

  const leaveStats = [
    { type: "Sick Leave", used: 3, total: 5, available: 2 },
    { type: "Casual Leave", used: 5, total: 10, available: 5 },
    { type: "Earned Leave", used: 8, total: 20, available: 12 },
  ];

  const payrollData = [
    { month: "January 2026", salary: "$5,000", bonus: "$500", deductions: "$200" },
    { month: "December 2025", salary: "$5,000", bonus: "$0", deductions: "$200" },
    { month: "November 2025", salary: "$5,000", bonus: "$300", deductions: "$200" },
  ];

  const announcements = [
    { id: 1, title: "New Company Policy", date: "2026-01-01", priority: "high" },
    { id: 2, title: "Office Closure on Jan 15", date: "2025-12-30", priority: "medium" },
    { id: 3, title: "Team Building Event", date: "2025-12-28", priority: "low" },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-white">HRMS Dashboard</h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1">Welcome back, Admin</p>
          </div>
          <AnimatedThemeToggler />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">94.8% attendance</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-zinc-950">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">On Leave</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black dark:text-white">8</div>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">2 pending approvals</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-zinc-950">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Pending Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black dark:text-white">15</div>
              <p className="text-xs text-red-600 dark:text-red-400 mt-2">3 urgent</p>
            </CardContent>
          </Card>
        </div>

        {/* Attendance & Leave Management */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Attendance */}
          <Card className="bg-white dark:bg-zinc-950 lg:col-span-2">
            <CardHeader>
              <CardTitle>Today's Attendance</CardTitle>
              <CardDescription>Real-time attendance status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {employees.map((emp) => (
                  <div key={emp.id} className="flex items-center justify-between py-2 border-b border-zinc-200 dark:border-zinc-800 last:border-0">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={emp.avatar} />
                        <AvatarFallback>{emp.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm text-black dark:text-white">{emp.name}</p>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400">{emp.role}</p>
                      </div>
                    </div>
                    <Badge 
                      variant={emp.status === "Present" ? "default" : emp.status === "Absent" ? "destructive" : "secondary"}
                    >
                      {emp.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Leave Balance */}
          <Card className="bg-white dark:bg-zinc-950">
            <CardHeader>
              <CardTitle>Your Leave Balance</CardTitle>
              <CardDescription>Current financial year</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {leaveStats.map((leave, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-700 dark:text-zinc-300">{leave.type}</span>
                    <span className="font-medium text-black dark:text-white">{leave.available}/{leave.total}</span>
                  </div>
                  <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(leave.available / leave.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              <Button className="w-full mt-4">Request Leave</Button>
            </CardContent>
          </Card>
        </div>

        {/* Payroll & Announcements */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payroll History */}
          <Card className="bg-white dark:bg-zinc-950 lg:col-span-2">
            <CardHeader>
              <CardTitle>Payroll History</CardTitle>
              <CardDescription>Recent salary and bonus information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {payrollData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3 px-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                    <div>
                      <p className="font-medium text-sm text-black dark:text-white">{item.month}</p>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">Salary: {item.salary}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">+{item.bonus}</p>
                      <p className="text-xs text-red-600 dark:text-red-400">-{item.deductions}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Announcements */}
          <Card className="bg-white dark:bg-zinc-950">
            <CardHeader>
              <CardTitle>Announcements</CardTitle>
              <CardDescription>Latest updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="py-2 border-b border-zinc-200 dark:border-zinc-800 last:border-0">
                  <div className="flex items-start gap-2">
                    <Badge 
                      variant={announcement.priority === "high" ? "destructive" : announcement.priority === "medium" ? "secondary" : "outline"}
                      className="text-xs mt-1"
                    >
                      {announcement.priority}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-black dark:text-white truncate">{announcement.title}</p>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400">{announcement.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Department & Employee Management */}
        <Card className="bg-white dark:bg-zinc-950">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Employee Directory</CardTitle>
                <CardDescription>Manage and view all employees</CardDescription>
              </div>
              <Button size="sm">+ Add Employee</Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All (248)</TabsTrigger>
                <TabsTrigger value="it">IT (45)</TabsTrigger>
                <TabsTrigger value="hr">HR (12)</TabsTrigger>
                <TabsTrigger value="finance">Finance (28)</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-4">
                <div className="space-y-3">
                  <div className="flex gap-4 mb-4">
                    <Input placeholder="Search employees..." className="flex-1" />
                    <Select>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">Name (A-Z)</SelectItem>
                        <SelectItem value="date">Recently Added</SelectItem>
                        <SelectItem value="salary">Salary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {employees.map((emp) => (
                    <div key={emp.id} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                      <div className="flex items-center gap-3 flex-1">
                        <Avatar>
                          <AvatarImage src={emp.avatar} />
                          <AvatarFallback>{emp.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-black dark:text-white">{emp.name}</p>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">{emp.role}</p>
                        </div>
                      </div>
                      <Badge variant="outline">{emp.department}</Badge>
                      <Button variant="ghost" size="sm" className="ml-4">View</Button>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="it" className="mt-4">
                <p className="text-center text-zinc-600 dark:text-zinc-400 py-4">IT Department employees - 45 total</p>
              </TabsContent>
              
              <TabsContent value="hr" className="mt-4">
                <p className="text-center text-zinc-600 dark:text-zinc-400 py-4">HR Department employees - 12 total</p>
              </TabsContent>
              
              <TabsContent value="finance" className="mt-4">
                <p className="text-center text-zinc-600 dark:text-zinc-400 py-4">Finance Department employees - 28 total</p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Quick Actions & Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white dark:bg-zinc-950">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Frequently used operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">Generate Salary Slip</Button>
              <Button variant="outline" className="w-full justify-start">Attendance Report</Button>
              <Button variant="outline" className="w-full justify-start">Leave Approvals</Button>
              <Button variant="outline" className="w-full justify-start">Export Data</Button>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-zinc-950">
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Department performance this month</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <TooltipProvider>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center text-sm mb-1">
                      <span className="text-zinc-700 dark:text-zinc-300">Productivity</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="font-medium text-black dark:text-white cursor-help">92%</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Based on project completion</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: "92%" }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center text-sm mb-1">
                      <span className="text-zinc-700 dark:text-zinc-300">Attendance</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="font-medium text-black dark:text-white cursor-help">94.8%</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>This month average</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "94.8%" }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center text-sm mb-1">
                      <span className="text-zinc-700 dark:text-zinc-300">Employee Satisfaction</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="font-medium text-black dark:text-white cursor-help">87%</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>From latest survey</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                      <div className="bg-amber-600 h-2 rounded-full" style={{ width: "87%" }}></div>
                    </div>
                  </div>
                </div>
              </TooltipProvider>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-4" />

        {/* Footer */}
        <div className="text-center text-zinc-600 dark:text-zinc-400 text-sm py-4">
          <p>© 2026 HRMS Dashboard. Last updated: January 1, 2026</p>
        </div>
      </div>
    </div>
  );
           
}
