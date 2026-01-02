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
import { UserPlus, Search, Edit, Trash2, Loader } from "lucide-react";

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
  joinDate: string;
  baseSalary: number;
  employmentStatus: string;
  avatar?: string;
}

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch employees from backend
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/employees");
        
        if (!response.ok) {
          throw new Error(`Failed to fetch employees: ${response.statusText}`);
        }
        
        const data = await response.json();
        // Extract employees from response (assuming response has a 'data' field)
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
  }, []);

  // Filter employees based on search and department
  const filteredEmployees = employees.filter((emp) => {
    const fullName = `${emp.firstName} ${emp.lastName}`;
    const matchesSearch =
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = filterDepartment === "all" || emp.department?.name === filterDepartment;

    return matchesSearch && matchesDept;
  });

  // Get unique departments for filter dropdown
  const departments = [
    "all",
    ...new Set(employees.map((emp) => emp.department?.name || "Unknown")),
  ];

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
                  <BreadcrumbLink href="/dashboard" className="text-black dark:text-white">
                    HRMS
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-zinc-600 dark:text-zinc-400">Employees</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-black dark:text-white">Employee Directory</h1>
                <p className="text-zinc-600 dark:text-zinc-400 mt-1">Manage and view all employees</p>
              </div>
              <Button className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Add Employee
              </Button>
            </div>

            {/* Search and Filter */}
            <Card className="bg-white dark:bg-zinc-950">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <Input
                      placeholder="Search by name, email, or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept === "all" ? "All Departments" : dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Employee Count */}
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              Showing {filteredEmployees.length} of {employees.length} employees
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader className="h-8 w-8 animate-spin mx-auto mb-3 text-blue-600" />
                  <p className="text-zinc-600 dark:text-zinc-400">Loading employees...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <Card className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
                <CardContent className="pt-6">
                  <p className="text-red-700 dark:text-red-300">
                    <strong>Error:</strong> {error}
                  </p>
                  <Button
                    onClick={() => window.location.reload()}
                    className="mt-3"
                  >
                    Retry
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Empty State */}
            {!loading && !error && filteredEmployees.length === 0 && (
              <Card className="bg-white dark:bg-zinc-950">
                <CardContent className="pt-6 text-center py-12">
                  <p className="text-zinc-600 dark:text-zinc-400">
                    No employees found. {searchTerm || filterDepartment !== "all" ? "Try adjusting your filters." : ""}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Employee List */}
            {!loading && !error && filteredEmployees.length > 0 && (
            <div className="space-y-3">
              {filteredEmployees.map((emp) => (
                <Link key={emp.id} href={`/admin/employees/${emp.id}`}>
                  <Card className="bg-white dark:bg-zinc-950 hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      {/* Left Section */}
                      <div className="flex items-center gap-4 flex-1">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={emp.avatar} />
                          <AvatarFallback>{`${emp.firstName[0]}${emp.lastName[0]}`.toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-black dark:text-white">{emp.firstName} {emp.lastName}</p>
                            <Badge variant="outline" className="text-xs">
                              {emp.id}
                            </Badge>
                          </div>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">{emp.designation}</p>
                          <div className="flex gap-4 mt-2 text-xs text-zinc-500 dark:text-zinc-500">
                            <span>{emp.email}</span>
                            {emp.phone && <span>{emp.phone}</span>}
                          </div>
                        </div>
                      </div>

                      {/* Middle Section */}
                      <div className="flex items-center gap-6 mr-6">
                        <div className="text-right">
                          <p className="text-xs text-zinc-600 dark:text-zinc-400">Department</p>
                          <p className="font-medium text-black dark:text-white">{emp.department?.name || "N/A"}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-zinc-600 dark:text-zinc-400">Joined</p>
                          <p className="font-medium text-black dark:text-white">
                            {new Date(emp.joinDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-zinc-600 dark:text-zinc-400">Salary</p>
                          <p className="font-medium text-black dark:text-white">₹{emp.baseSalary?.toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Right Section */}
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={emp.employmentStatus === "ACTIVE" ? "default" : "secondary"}
                          className="shrink-0"
                        >
                          {emp.employmentStatus === "ACTIVE" ? "Active" : emp.employmentStatus}
                        </Badge>
                        <Button variant="ghost" size="sm" className="text-zinc-600 hover:text-black dark:hover:text-white">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 dark:hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                </Link>
              ))}
            </div>
            )}
            {/* Empty State */}
            {filteredEmployees.length === 0 && (
              <Card className="bg-white dark:bg-zinc-950">
                <CardContent className="pt-12 pb-12">
                  <div className="text-center">
                    <p className="text-zinc-600 dark:text-zinc-400 mb-4">No employees found matching your criteria.</p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("");
                        setFilterDepartment("all");
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
