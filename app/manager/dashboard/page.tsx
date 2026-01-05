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
import { Users, TrendingUp, CheckCircle, AlertCircle, Clock, FileText, BarChart3, Zap, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { TeamMembersTable } from "@/components/manager/team-members-table"
import { TeamStatsCards } from "@/components/manager/team-stats-cards"
import { PerformanceChart } from "@/components/manager/performance-chart"
import { TasksOverview } from "@/components/manager/tasks-overview"

export default function ManagerDashboard() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [searchEmployee, setSearchEmployee] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check user role on component mount
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
    
    if (role && role !== "MANAGER" && role !== "ADMIN") {
      setAccessDenied(true);
      setLoading(false);
    }
  }, []);

  // Fetch team members from backend API
  useEffect(() => {
    if (accessDenied) return;
    
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/employees");
        
        if (!response.ok) {
          throw new Error("Failed to fetch team members");
        }
        
        const data = await response.json();
        const employees = data.data || data || [];
        
        // Transform employees to team members format
        const transformed = employees.map((emp: any) => ({
          id: emp.id || emp.employeeId,
          name: `${emp.firstName} ${emp.lastName}`,
          role: emp.designation,
          department: emp.department?.name || "Unknown",
          email: emp.email,
          status: emp.employmentStatus === "ACTIVE" ? "Active" : emp.employmentStatus,
          avatar: emp.avatar || "",
          performanceScore: Math.round(Math.random() * 20 + 80), // Will be from performance reviews
          tasksCompleted: Math.round(Math.random() * 25 + 15),
          tasksOverdue: Math.round(Math.random() * 3),
          leaveBalance: Math.round(Math.random() * 12 + 1),
        }));
        
        setTeamMembers(transformed);
        setError(null);
      } catch (err) {
        console.error("Error fetching team members:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch team members");
        setTeamMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, [accessDenied]);

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchEmployee.toLowerCase()) || 
                         member.role.toLowerCase().includes(searchEmployee.toLowerCase());
    const matchesDepartment = filterDepartment === "all" || member.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  // Get unique departments
  const departments = [
    "all",
    ...new Set(teamMembers.map(m => m.department))
  ];

  // Key metrics
  const metrics = {
    totalTeam: teamMembers.length,
    activeMembers: teamMembers.filter(m => m.status === "Active").length,
    avgPerformance: teamMembers.length > 0 ? Math.round(teamMembers.reduce((acc, m) => acc + m.performanceScore, 0) / teamMembers.length) : 0,
    overdueTasksCount: teamMembers.reduce((acc, m) => acc + m.tasksOverdue, 0),
    totalTasksCompleted: teamMembers.reduce((acc, m) => acc + m.tasksCompleted, 0),
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
              Only managers and admins can access the Manager Dashboard. Your current role is <strong>{userRole || "Unknown"}</strong>.
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
                          {departments.map(dept => (
                            <SelectItem key={dept} value={dept}>
                              {dept === "all" ? "All Departments" : dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Loading State */}
                    {loading && (
                      <div className="text-center py-8 text-zinc-600">Loading team members...</div>
                    )}

                    {/* Error State */}
                    {error && !loading && (
                      <div className="text-center py-8 text-red-600">Error: {error}</div>
                    )}

                    {/* Team Members Table */}
                    {!loading && !error && (
                      <TeamMembersTable members={filteredMembers} />
                    )}
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
