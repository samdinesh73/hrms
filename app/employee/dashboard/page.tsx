"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  AlertCircle,
  LogOut,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Award,
  ChevronRight,
  FileText,BarChart3,Clock
} from "lucide-react";

interface EmployeeData {
  id: string;
  userId: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  departmentId: string;
  designation: string;
  joinDate: string;
  employmentStatus: string;
  employmentType?: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
  bankAccountNumber?: string;
  bankName?: string;
  ifscCode?: string;
  totalLeaveBalance: number;
  usedLeaves: number;
  panNumber?: string;
  aadharNumber?: string;
  passportNumber?: string;
  department?: {
    name: string;
  };
  reportingManager?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  leaves?: any[];
  salaryDetails?: any[];
}

function DashboardContent({ employee, error, loading, onLogout }: {
  employee: EmployeeData | null;
  error: string | null;
  loading: boolean;
  onLogout: () => void;
}) {
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const pendingLeaves = (employee?.leaves?.filter((l: any) => l.status === "PENDING") || []).length;
  const remainingLeaves = Math.max(0, (employee?.totalLeaveBalance || 20) - (employee?.usedLeaves || 0));

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b bg-white dark:bg-slate-950 sticky top-0 z-10">
        <div className="flex items-center justify-between px-6 py-4 md:px-8">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="md:hidden" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Welcome back, {employee?.firstName}!
              </h1>
              <p className="text-sm text-muted-foreground">
                {employee?.designation} • {employee?.department?.name}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="hidden sm:flex text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 md:p-6 lg:p-8 space-y-6">
          {/* Error Alert */}
          {error && (
            <div className="flex gap-3 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-900 dark:text-red-100">Error Loading Data</h4>
                <p className="text-sm text-red-800 dark:text-red-200 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium">Employee ID</CardTitle>
                <Award className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{employee?.employeeId}</div>
                <p className="text-xs text-muted-foreground mt-1">Unique identifier</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium">Status</CardTitle>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200">
                  {employee?.employmentStatus}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  {employee?.employmentType || "Full-time"}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium">Department</CardTitle>
                <BarChart3 className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-sm">{employee?.department?.name}</div>
                <p className="text-xs text-muted-foreground mt-1">{employee?.designation}</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium">Join Date</CardTitle>
                <Calendar className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-sm font-semibold">
                  {employee?.joinDate
                    ? new Date(employee.joinDate).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A"}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Leave Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-0 shadow-sm bg-blue-50 dark:bg-blue-950/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium">Total Leaves</CardTitle>
                <Clock className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{employee?.totalLeaveBalance}</div>
                <p className="text-xs text-muted-foreground mt-1">Days allocated</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-orange-50 dark:bg-orange-950/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium">Used</CardTitle>
                <Clock className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">{employee?.usedLeaves}</div>
                <p className="text-xs text-muted-foreground mt-1">Days consumed</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-yellow-50 dark:bg-yellow-950/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <AlertCircle className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">{pendingLeaves}</div>
                <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-green-50 dark:bg-green-950/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium">Balance</CardTitle>
                <Award className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{remainingLeaves}</div>
                <p className="text-xs text-muted-foreground mt-1">Days available</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Information */}
          <Card className="border-0 shadow-sm">
            <Tabs defaultValue="personal" className="w-full">
              <div className="border-b px-6 pt-6">
                <TabsList className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-transparent border-0 p-0 h-auto">
                  <TabsTrigger
                    value="personal"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-0 py-3 font-medium text-sm"
                  >
                    Personal
                  </TabsTrigger>
                  <TabsTrigger
                    value="employment"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-0 py-3 font-medium text-sm"
                  >
                    Employment
                  </TabsTrigger>
                  <TabsTrigger
                    value="salary"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-0 py-3 font-medium text-sm"
                  >
                    Salary
                  </TabsTrigger>
                  <TabsTrigger
                    value="documents"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-0 py-3 font-medium text-sm"
                  >
                    Documents
                  </TabsTrigger>
                  <TabsTrigger
                    value="leaves"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-0 py-3 font-medium text-sm"
                  >
                    Leaves
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="px-6 py-6">
                {/* Personal Info Tab */}
                <TabsContent value="personal" className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase">
                        <Mail className="h-4 w-4" />
                        Email Address
                      </label>
                      <p className="text-sm font-medium">{employee?.email}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase">
                        <Phone className="h-4 w-4" />
                        Phone Number
                      </label>
                      <p className="text-sm font-medium">{employee?.phone || "Not provided"}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase">
                        <Calendar className="h-4 w-4" />
                        Date of Birth
                      </label>
                      <p className="text-sm font-medium">
                        {employee?.dateOfBirth
                          ? new Date(employee.dateOfBirth).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "Not provided"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase">Gender</label>
                      <p className="text-sm font-medium">{employee?.gender || "Not provided"}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase">
                        <MapPin className="h-4 w-4" />
                        Address
                      </label>
                      <p className="text-sm font-medium">{employee?.address || "Not provided"}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase">City</label>
                      <p className="text-sm font-medium">{employee?.city || "Not provided"}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase">State</label>
                      <p className="text-sm font-medium">{employee?.state || "Not provided"}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase">Country</label>
                      <p className="text-sm font-medium">{employee?.country || "Not provided"}</p>
                    </div>
                  </div>
                </TabsContent>

                {/* Employment Tab */}
                <TabsContent value="employment" className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase">Designation</label>
                      <p className="text-sm font-bold">{employee?.designation}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase">Department</label>
                      <p className="text-sm font-bold">{employee?.department?.name}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase">Employment Type</label>
                      <p className="text-sm font-medium">{employee?.employmentType || "Full-time"}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase">Status</label>
                      <Badge className="w-fit bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200">
                        {employee?.employmentStatus}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase">Join Date</label>
                      <p className="text-sm font-medium">
                        {employee?.joinDate
                          ? new Date(employee.joinDate).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "N/A"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase">Reporting Manager</label>
                      <p className="text-sm font-medium">
                        {employee?.reportingManager
                          ? `${employee.reportingManager.firstName} ${employee.reportingManager.lastName}`
                          : "Not assigned"}
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Salary Tab */}
                <TabsContent value="salary" className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase">
                        <DollarSign className="h-4 w-4" />
                        Base Salary
                      </label>
                      <p className="text-2xl font-bold text-blue-600">₹ {employee?.baseSalary?.toLocaleString()}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase">Allowances</label>
                      <p className="text-2xl font-bold text-green-600">₹ {(employee?.allowances || 0).toLocaleString()}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase">Deductions</label>
                      <p className="text-2xl font-bold text-red-600">₹ {(employee?.deductions || 0).toLocaleString()}</p>
                    </div>
                    <div className="space-y-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <label className="text-xs font-semibold text-muted-foreground uppercase">Net Salary</label>
                      <p className="text-3xl font-bold text-blue-600">
                        ₹{" "}
                        {(
                          (employee?.baseSalary || 0) +
                          (employee?.allowances || 0) -
                          (employee?.deductions || 0)
                        ).toLocaleString()}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase">Bank Account</label>
                      <p className="text-sm font-mono font-medium">
                        {employee?.bankAccountNumber ? `****${employee.bankAccountNumber.slice(-4)}` : "Not provided"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase">Bank Name</label>
                      <p className="text-sm font-medium">{employee?.bankName || "Not provided"}</p>
                    </div>
                  </div>
                </TabsContent>

                {/* Documents Tab */}
                <TabsContent value="documents" className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase">PAN Number</label>
                      <p className="text-sm font-mono font-medium">
                        {employee?.panNumber
                          ? `${employee.panNumber.slice(0, 3)}****${employee.panNumber.slice(-3)}`
                          : "Not provided"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase">Aadhar Number</label>
                      <p className="text-sm font-mono font-medium">
                        {employee?.aadharNumber ? `****${employee.aadharNumber.slice(-4)}` : "Not provided"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase">Passport Number</label>
                      <p className="text-sm font-medium">{employee?.passportNumber || "Not provided"}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase">IFSC Code</label>
                      <p className="text-sm font-mono font-medium">{employee?.ifscCode || "Not provided"}</p>
                    </div>
                  </div>
                </TabsContent>

                {/* Leaves Tab */}
                <TabsContent value="leaves" className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Card className="border-0 shadow-sm bg-blue-50 dark:bg-blue-950/20">
                        <CardContent className="pt-6">
                          <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                            Total Allocated
                          </p>
                          <p className="text-3xl font-bold text-blue-600">{employee?.totalLeaveBalance}</p>
                        </CardContent>
                      </Card>
                      <Card className="border-0 shadow-sm bg-orange-50 dark:bg-orange-950/20">
                        <CardContent className="pt-6">
                          <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Used</p>
                          <p className="text-3xl font-bold text-orange-600">{employee?.usedLeaves}</p>
                        </CardContent>
                      </Card>
                    </div>

                    {employee?.leaves && employee.leaves.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="font-semibold">Recent Leave Requests</h3>
                        <div className="space-y-2">
                          {employee.leaves.slice(0, 5).map((leave: any, idx: number) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border"
                            >
                              <div className="flex-1">
                                <p className="font-medium text-sm">{leave.leaveType}</p>
                                <p className="text-xs text-muted-foreground">{leave.totalDays} days</p>
                              </div>
                              <Badge
                                variant={
                                  leave.status === "APPROVED"
                                    ? "default"
                                    : leave.status === "REJECTED"
                                      ? "destructive"
                                      : "outline"
                                }
                              >
                                {leave.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => router.push("/employee/request-leave")}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Request New Leave
                    </Button>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function EmployeeDashboard() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [employee, setEmployee] = useState<EmployeeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);

    if (role && role !== "EMPLOYEE") {
      setAccessDenied(true);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (accessDenied) return;

    const fetchEmployeeData = async () => {
      try {
        setLoading(true);
        setError(null);

        const userId = localStorage.getItem("userId");

        if (!userId) {
          setError("User not authenticated. Please log in again.");
          router.push("/login");
          return;
        }

        const empResponse = await fetch(`http://localhost:5000/api/employees/${userId}`);

        if (!empResponse.ok) {
          if (empResponse.status === 404) {
            throw new Error("Employee profile not found in database. Please contact HR.");
          }
          throw new Error("Failed to fetch employee data");
        }

        const empData = await empResponse.json();
        const currentEmployee = empData.data || empData;

        if (!currentEmployee) {
          throw new Error("No employee data found in system");
        }

        setEmployee(currentEmployee);
        setError(null);
      } catch (err) {
        console.error("Error fetching employee data:", err);
        const errorMsg = err instanceof Error ? err.message : "Failed to fetch employee data";
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [accessDenied, router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-red-200 dark:border-red-800 shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="rounded-full bg-red-100 dark:bg-red-950 p-3">
                <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl text-red-600 dark:text-red-400">Access Denied</CardTitle>
              <CardDescription className="mt-2">You don't have access to this dashboard</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-center text-muted-foreground">
              Only employees can access the Employee Dashboard. Your current role is{" "}
              <strong className="text-foreground">{userRole || "Unknown"}</strong>.
            </p>
            <Button onClick={() => router.push("/login")} className="w-full">
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full">
      <DashboardContent employee={employee} error={error} loading={loading} onLogout={handleLogout} />
    </div>
  );
}
