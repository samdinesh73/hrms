"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone, Calendar, Building2, Briefcase, DollarSign, ArrowLeft, Edit, Loader } from "lucide-react";

interface Department {
  id: string;
  name: string;
}

interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  designation: string;
  department?: Department;
  joinDate: string;
  baseSalary: number;
  employmentStatus: string;
  gender?: string;
  dateOfBirth?: string;
  address?: string;
  avatar?: string;
}

export default function EmployeeDetailsPage() {
  const params = useParams();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const employeeId = params.id as string;
        const response = await fetch(`http://localhost:5000/api/employees/${employeeId}`);
        
        if (!response.ok) {
          throw new Error("Employee not found");
        }
        
        const data = await response.json();
        setEmployee(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch employee details");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [params.id]);

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 bg-white dark:bg-zinc-950">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            </div>
          </header>
          <div className="flex-1 overflow-auto flex items-center justify-center">
            <div className="text-center">
              <Loader className="h-8 w-8 animate-spin mx-auto mb-3 text-blue-600" />
              <p className="text-zinc-600 dark:text-zinc-400">Loading employee details...</p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (error || !employee) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 bg-white dark:bg-zinc-950">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            </div>
          </header>
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              <Card className="bg-white dark:bg-zinc-950">
                <CardContent className="pt-12 pb-12">
                  <div className="text-center">
                    <p className="text-zinc-600 dark:text-zinc-400 mb-4">{error || "Employee not found."}</p>
                    <Link href="/admin/employees">
                      <Button variant="outline">Back to Employees</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  const params2 = useParams();
  const employeeId = params2.id as string;

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
                  <BreadcrumbLink href="/admin/dashboard" className="text-black dark:text-white">
                    HRMS
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/admin/employees" className="text-zinc-600 dark:text-zinc-400">
                    Employees
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-zinc-600 dark:text-zinc-400">{employee.firstName} {employee.lastName}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Back Button */}
            <Link href="/admin/employees">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Employees
              </Button>
            </Link>

            {/* Employee Header Card */}
            <Card className="bg-white dark:bg-zinc-950">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={employee.avatar} />
                      <AvatarFallback className="text-xl">
                        {`${employee.firstName[0]}${employee.lastName[0]}`.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h1 className="text-3xl font-bold text-black dark:text-white">{employee.firstName} {employee.lastName}</h1>
                      <p className="text-lg text-zinc-600 dark:text-zinc-400 mt-1">{employee.designation}</p>
                      <div className="flex gap-3 mt-3">
                        <Badge variant="default">{employee.employmentStatus}</Badge>
                        <Badge variant="outline">{employee.employeeId}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs Content */}
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white dark:bg-zinc-950 border">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="professional">Professional</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
              </TabsList>

              {/* Personal Info Tab */}
              <TabsContent value="personal" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Contact Information */}
                  <Card className="bg-white dark:bg-zinc-950">
                    <CardHeader>
                      <CardTitle className="text-lg">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-zinc-500" />
                        <div>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">Email</p>
                          <p className="font-medium text-black dark:text-white">{employee.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-zinc-500" />
                        <div>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">Phone</p>
                          <p className="font-medium text-black dark:text-white">{employee.phone || "N/A"}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Address</p>
                        <p className="font-medium text-black dark:text-white">{employee.address || "N/A"}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Basic Information */}
                  <Card className="bg-white dark:bg-zinc-950">
                    <CardHeader>
                      <CardTitle className="text-lg">Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">Gender</p>
                        <p className="font-medium text-black dark:text-white">{employee.gender || "N/A"}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-zinc-500" />
                        <div>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">Date of Birth</p>
                          <p className="font-medium text-black dark:text-white">{employee.dateOfBirth ? new Date(employee.dateOfBirth).toLocaleDateString() : "N/A"}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Professional Tab */}
              <TabsContent value="professional" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Work Information */}
                  <Card className="bg-white dark:bg-zinc-950">
                    <CardHeader>
                      <CardTitle className="text-lg">Work Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Briefcase className="w-5 h-5 text-zinc-500" />
                        <div>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">Designation</p>
                          <p className="font-medium text-black dark:text-white">{employee.designation}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Building2 className="w-5 h-5 text-zinc-500" />
                        <div>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">Department</p>
                          <p className="font-medium text-black dark:text-white">{employee.department?.name || "N/A"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-zinc-500" />
                        <div>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">Join Date</p>
                          <p className="font-medium text-black dark:text-white">{new Date(employee.joinDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Compensation */}
                  <Card className="bg-white dark:bg-zinc-950">
                    <CardHeader>
                      <CardTitle className="text-lg">Compensation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-5 h-5 text-zinc-500" />
                        <div>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">Base Salary</p>
                          <p className="font-medium text-black dark:text-white text-xl">₹{employee.baseSalary?.toLocaleString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Summary Tab */}
              <TabsContent value="summary" className="space-y-4">
                <Card className="bg-white dark:bg-zinc-950">
                  <CardHeader>
                    <CardTitle>Employment Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">Employee ID</p>
                          <p className="font-semibold text-black dark:text-white">{employee.employeeId}</p>
                        </div>
                        <div>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">Employment Status</p>
                          <Badge>{employee.employmentStatus}</Badge>
                        </div>
                        <div>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">Join Date</p>
                          <p className="font-semibold text-black dark:text-white">{new Date(employee.joinDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">Designation</p>
                          <p className="font-semibold text-black dark:text-white">{employee.designation}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
