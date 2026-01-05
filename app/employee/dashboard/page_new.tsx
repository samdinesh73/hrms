"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { AlertCircle } from "lucide-react";

export default function EmployeeDashboard() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check user role on component mount
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
    
    if (role && role !== "EMPLOYEE") {
      setAccessDenied(true);
      setLoading(false);
    }
  }, []);

  // Fetch employee data from backend API
  useEffect(() => {
    if (accessDenied) return;
    
    const fetchEmployeeData = async () => {
      try {
        setLoading(true);
        
        // Get current user ID from localStorage
        const userId = localStorage.getItem("userId");
        if (!userId) {
          throw new Error("User not authenticated");
        }

        // Fetch current employee data
        const empResponse = await fetch(`http://localhost:5000/api/employees/${userId}`);
        
        if (!empResponse.ok) {
          throw new Error("Failed to fetch employee data");
        }
        
        const empData = await empResponse.json();
        const currentEmployee = empData.data || empData;
        
        if (!currentEmployee) {
          throw new Error("No employee data found");
        }
        
        // Set employee data
        const empId = currentEmployee.id || currentEmployee.employeeId;
        setEmployee({
          name: `${currentEmployee.firstName} ${currentEmployee.lastName}`,
          id: empId,
          code: currentEmployee.code,
          designation: currentEmployee.designation,
          department: currentEmployee.department?.name || "Unknown",
          email: currentEmployee.email,
          phone: currentEmployee.phone || "Not provided",
          joinDate: new Date(currentEmployee.joinDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
          status: currentEmployee.status || "ACTIVE",
        });
        
        setError(null);
      } catch (err) {
        console.error("Error fetching employee data:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch employee data");
        
        // Set fallback data
        setEmployee({
          name: "Employee Name",
          id: "EMP001",
          code: "SR001",
          designation: "Position",
          department: "Department",
          email: "email@company.com",
          phone: "+1 (555) 123-4567",
          joinDate: "January 1, 2024",
          status: "ACTIVE",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [accessDenied]);

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
              Only employees can access the Employee Dashboard. Your current role is <strong>{userRole || "Unknown"}</strong>.
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-lg text-zinc-600 dark:text-zinc-400">Loading your dashboard...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            <span>Employee</span>
            <span>›</span>
            <span>Dashboard</span>
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-zinc-900 dark:text-white">My Dashboard</h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">View your profile, leaves, and performance</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Profile Card */}
          <Card className="border-zinc-200 dark:border-zinc-800">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Name</p>
                <p className="text-lg font-semibold text-zinc-900 dark:text-white">{employee?.name}</p>
              </div>
              <Separator className="bg-zinc-200 dark:bg-zinc-800" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Employee ID</p>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">{employee?.code}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Status</p>
                  <Badge variant="outline" className="mt-1 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                    {employee?.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Designation Card */}
          <Card className="border-zinc-200 dark:border-zinc-800">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">Designation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-lg font-semibold text-zinc-900 dark:text-white">{employee?.designation}</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{employee?.department}</p>
              </div>
              <Separator className="bg-zinc-200 dark:bg-zinc-800" />
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Joined</p>
                <p className="text-sm font-medium text-zinc-900 dark:text-white">{employee?.joinDate}</p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Card */}
          <Card className="border-zinc-200 dark:border-zinc-800">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Email</p>
                <p className="text-sm font-medium text-zinc-900 dark:text-white break-all">{employee?.email}</p>
              </div>
              <Separator className="bg-zinc-200 dark:bg-zinc-800" />
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Phone</p>
                <p className="text-sm font-medium text-zinc-900 dark:text-white">{employee?.phone}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Card className="border-zinc-200 dark:border-zinc-800">
          <CardHeader className="pb-0">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 rounded-none w-full justify-start h-auto p-0">
                <TabsTrigger 
                  value="overview"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-zinc-900 dark:data-[state=active]:border-white data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="leaves"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-zinc-900 dark:data-[state=active]:border-white data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950"
                >
                  Leaves
                </TabsTrigger>
                <TabsTrigger 
                  value="requests"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-zinc-900 dark:data-[state=active]:border-white data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950"
                >
                  Leave Requests
                </TabsTrigger>
              </TabsList>

              <div className="p-6">
                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">Quick Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-2">Total Leaves</p>
                        <p className="text-2xl font-semibold text-zinc-900 dark:text-white">20</p>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">20 days</p>
                      </div>
                      <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-2">Used Leaves</p>
                        <p className="text-2xl font-semibold text-zinc-900 dark:text-white">4</p>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">4 days</p>
                      </div>
                      <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-2">Pending Leaves</p>
                        <p className="text-2xl font-semibold text-zinc-900 dark:text-white">0</p>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">0 days</p>
                      </div>
                      <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-2">Balance</p>
                        <p className="text-2xl font-semibold text-zinc-900 dark:text-white">16</p>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">16 days</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Leaves Tab */}
                <TabsContent value="leaves" className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">Leave Balance</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-zinc-900 dark:text-white">Sick Leave</p>
                          <p className="text-xs text-zinc-600 dark:text-zinc-400">2 used of 5 total</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-zinc-900 dark:bg-white" style={{width: "40%"}}></div>
                          </div>
                          <span className="text-sm font-medium text-zinc-900 dark:text-white">60%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-zinc-900 dark:text-white">Casual Leave</p>
                          <p className="text-xs text-zinc-600 dark:text-zinc-400">4 used of 10 total</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-zinc-900 dark:bg-white" style={{width: "60%"}}></div>
                          </div>
                          <span className="text-sm font-medium text-zinc-900 dark:text-white">60%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-zinc-900 dark:text-white">Earned Leave</p>
                          <p className="text-xs text-zinc-600 dark:text-zinc-400">0 used of 20 total</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-zinc-900 dark:bg-white" style={{width: "0%"}}></div>
                          </div>
                          <span className="text-sm font-medium text-zinc-900 dark:text-white">0%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Leave Requests Tab */}
                <TabsContent value="requests" className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Your Leave Requests</h3>
                    <Button 
                      onClick={() => router.push("/employee/request-leave")}
                      size="sm"
                      className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100"
                    >
                      Request Leave
                    </Button>
                  </div>
                  <div className="text-center py-8">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">No leave requests yet</p>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </CardHeader>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <Button 
            onClick={() => router.push("/employee/account")}
            variant="outline"
            className="border-zinc-200 dark:border-zinc-800"
          >
            View Full Profile
          </Button>
          <Button 
            onClick={() => router.push("/employee/request-leave")}
            className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100"
          >
            Request Leave
          </Button>
        </div>
      </div>
    </div>
  );
}
