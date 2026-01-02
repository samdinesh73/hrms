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
import { Users, TrendingUp, CheckCircle, AlertCircle, Clock, FileText, BarChart3, Zap, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { TeamMembersTable } from "@/components/manager/team-members-table"
import { TeamStatsCards } from "@/components/manager/team-stats-cards"
import { PerformanceChart } from "@/components/manager/performance-chart"
import { TasksOverview } from "@/components/manager/tasks-overview"

export default function ManagerDashboard() {
  const [searchEmployee, setSearchEmployee] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");

  // Team members data
  const teamMembers = [
    { id: "EMP001", name: "John Doe", role: "Senior Software Engineer", department: "IT", email: "john@company.com", status: "Active", avatar: "https://github.com/shadcn.png", performanceScore: 92, tasksCompleted: 24, tasksOverdue: 1, leaveBalance: 8 },
    { id: "EMP002", name: "Jane Smith", role: "Frontend Developer", department: "IT", email: "jane@company.com", status: "Active", avatar: "https://github.com/vercel.png", performanceScore: 88, tasksCompleted: 19, tasksOverdue: 0, leaveBalance: 10 },
    { id: "EMP003", name: "Mike Johnson", role: "Backend Developer", department: "IT", email: "mike@company.com", status: "Active", avatar: "", performanceScore: 85, tasksCompleted: 22, tasksOverdue: 2, leaveBalance: 7 },
    { id: "EMP004", name: "Sarah Williams", role: "DevOps Engineer", department: "IT", email: "sarah@company.com", status: "On Leave", avatar: "", performanceScore: 90, tasksCompleted: 18, tasksOverdue: 0, leaveBalance: 2 },
    { id: "EMP005", name: "Alex Turner", role: "QA Engineer", department: "IT", email: "alex@company.com", status: "Active", avatar: "", performanceScore: 87, tasksCompleted: 20, tasksOverdue: 1, leaveBalance: 9 },
    { id: "EMP006", name: "Emma Davis", role: "Tech Lead", department: "IT", email: "emma@company.com", status: "Active", avatar: "", performanceScore: 94, tasksCompleted: 25, tasksOverdue: 0, leaveBalance: 6 },
  ];

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchEmployee.toLowerCase()) || 
                         member.role.toLowerCase().includes(searchEmployee.toLowerCase());
    const matchesDepartment = filterDepartment === "all" || member.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  // Key metrics
  const metrics = {
    totalTeam: teamMembers.length,
    activeMembers: teamMembers.filter(m => m.status === "Active").length,
    avgPerformance: Math.round(teamMembers.reduce((acc, m) => acc + m.performanceScore, 0) / teamMembers.length),
    overdueTasksCount: teamMembers.reduce((acc, m) => acc + m.tasksOverdue, 0),
    totalTasksCompleted: teamMembers.reduce((acc, m) => acc + m.tasksCompleted, 0),
  };

  return (
    <SidebarProvider>
      <AppSidebar userType="manager" />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mx-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:flex">
                  <BreadcrumbLink href="/manager/dashboard">
                    Manager Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:flex" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">Filters</Button>
            <Button size="sm">Generate Report</Button>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="space-y-8 p-8">
            {/* Header Section */}
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Team Dashboard</h1>
              <p className="text-muted-foreground mt-2">Manage and monitor your team's performance and activities</p>
            </div>

            {/* Stats Cards */}
            <TeamStatsCards metrics={metrics} />

            {/* Main Content Tabs */}
            <Tabs defaultValue="team" className="w-full">
              <TabsList>
                <TabsTrigger value="team" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Team Members
                </TabsTrigger>
                <TabsTrigger value="performance" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Performance
                </TabsTrigger>
                <TabsTrigger value="tasks" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Tasks & Assignments
                </TabsTrigger>
              </TabsList>

              {/* Team Members Tab */}
              <TabsContent value="team" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>Manage and view your team members</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Search and Filter */}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Search by name or role..."
                        value={searchEmployee}
                        onChange={(e) => setSearchEmployee(e.target.value)}
                        className="flex-1"
                      />
                      <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Departments</SelectItem>
                          <SelectItem value="IT">IT</SelectItem>
                          <SelectItem value="HR">HR</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="Sales">Sales</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Team Members Table */}
                    <TeamMembersTable members={filteredMembers} />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Performance Tab */}
              <TabsContent value="performance" className="space-y-4">
                <PerformanceChart members={teamMembers} />
              </TabsContent>

              {/* Tasks Tab */}
              <TabsContent value="tasks" className="space-y-4">
                <TasksOverview />
              </TabsContent>
            </Tabs>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="mr-2 h-4 w-4" />
                    Assign Tasks
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    Conduct Review
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    View Analytics
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Send Notification
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
