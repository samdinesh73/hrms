"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, ChevronLeft } from "lucide-react"

export default function AddEmployeePage() {
  const router = useRouter()
  const [departments, setDepartments] = useState<any[]>([])
  const [managers, setManagers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [deptLoading, setDeptLoading] = useState(true)

  const [formData, setFormData] = useState({
    employeeId: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    departmentId: "",
    reportingManagerId: "",
    designation: "",
    joinDate: "",
    employmentStatus: "ACTIVE",
    employmentType: "Full-time",
    baseSalary: "",
    allowances: "0",
    deductions: "0",
    bankAccountNumber: "",
    bankName: "",
    ifscCode: "",
    totalLeaveBalance: "20",
    panNumber: "",
    aadharNumber: "",
    passportNumber: "",
  })

  // Fetch departments on mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/departments")
        const data = await response.json()
        setDepartments(data.data || [])
      } catch (err) {
        console.error("Error fetching departments:", err)
      } finally {
        setDeptLoading(false)
      }
    }
    fetchDepartments()
  }, [])

  // Fetch managers when department changes
  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/employees")
        const data = await response.json()
        const employees = data.data || []
        // Filter for manager-level employees
        setManagers(employees.filter((emp: any) => emp.designation?.toLowerCase().includes("manager") || emp.designation?.toLowerCase().includes("lead")))
      } catch (err) {
        console.error("Error fetching managers:", err)
      }
    }
    if (formData.departmentId) {
      fetchManagers()
    }
  }, [formData.departmentId])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Validate required fields
    if (!formData.employeeId || !formData.firstName || !formData.lastName ||
        !formData.email || !formData.password || !formData.departmentId || !formData.designation || !formData.joinDate || !formData.baseSalary) {
      setError("Please fill in all required fields")
      return
    }

    setLoading(true)
    try {
      const payload = {
        ...formData,
        baseSalary: parseFloat(formData.baseSalary),
        allowances: parseFloat(formData.allowances),
        deductions: parseFloat(formData.deductions),
        totalLeaveBalance: parseFloat(formData.totalLeaveBalance),
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : null,
        joinDate: formData.joinDate ? new Date(formData.joinDate).toISOString() : null,
      }
      console.log("Sending employee data:", payload)
      
      const response = await fetch("http://localhost:5000/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        setSuccess("Employee added successfully!")
        setTimeout(() => {
          router.push("/admin/dashboard")
        }, 1500)
      } else {
        const data = await response.json()
        console.error("Backend error response:", data)
        setError(data.error || data.message || "Failed to add employee")
      }
    } catch (err) {
      console.error("Error adding employee:", err)
      setError(err instanceof Error ? err.message : "Error adding employee. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 bg-white dark:bg-zinc-950">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/admin/dashboard" className="text-black dark:text-white">HRMS</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/admin/dashboard" className="text-black dark:text-white">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-zinc-600 dark:text-zinc-400">Add Employee</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Page Title */}
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.back()}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-black dark:text-white">Add New Employee</h1>
                <p className="text-zinc-600 dark:text-zinc-400 mt-1">Fill in all required fields to add a new employee to the system</p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-100 px-6 py-4 rounded-lg flex gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-100 px-6 py-4 rounded-lg">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <Card className="bg-white dark:bg-zinc-950">
                <CardHeader>
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                  <CardDescription>Basic personal details of the employee</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="employeeId">Employee ID *</Label>
                      <Input
                        id="employeeId"
                        value={formData.employeeId}
                        onChange={(e) => handleInputChange("employeeId", e.target.value)}
                        placeholder="e.g., EMP001"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        placeholder="First name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        placeholder="Last name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="email@company.com"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="password">Password *</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        placeholder="Set login password"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+91 1234567890"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Address Information */}
              <Card className="bg-white dark:bg-zinc-950">
                <CardHeader>
                  <CardTitle className="text-lg">Address</CardTitle>
                  <CardDescription>Employee's residential address</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        placeholder="Street address"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                        placeholder="State"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">Zip Code</Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange("zipCode", e.target.value)}
                        placeholder="Zip code"
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={formData.country}
                        onChange={(e) => handleInputChange("country", e.target.value)}
                        placeholder="Country"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Employment Details */}
              <Card className="bg-white dark:bg-zinc-950">
                <CardHeader>
                  <CardTitle className="text-lg">Employment Details</CardTitle>
                  <CardDescription>Job role and employment information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="departmentId">Department *</Label>
                      <Select value={formData.departmentId} onValueChange={(value) => handleInputChange("departmentId", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {deptLoading ? (
                            <SelectItem value="loading" disabled>Loading...</SelectItem>
                          ) : (
                            departments.map(dept => (
                              <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="reportingManagerId">Reporting Manager</Label>
                      <Select value={formData.reportingManagerId} onValueChange={(value) => handleInputChange("reportingManagerId", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select manager" />
                        </SelectTrigger>
                        <SelectContent>
                          {managers.map(manager => (
                            <SelectItem key={manager.id} value={manager.id}>
                              {manager.firstName} {manager.lastName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="designation">Designation *</Label>
                      <Input
                        id="designation"
                        value={formData.designation}
                        onChange={(e) => handleInputChange("designation", e.target.value)}
                        placeholder="e.g., Software Engineer"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="joinDate">Join Date *</Label>
                      <Input
                        id="joinDate"
                        type="date"
                        value={formData.joinDate}
                        onChange={(e) => handleInputChange("joinDate", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="employmentStatus">Employment Status</Label>
                      <Select value={formData.employmentStatus} onValueChange={(value) => handleInputChange("employmentStatus", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ACTIVE">Active</SelectItem>
                          <SelectItem value="INACTIVE">Inactive</SelectItem>
                          <SelectItem value="ON_LEAVE">On Leave</SelectItem>
                          <SelectItem value="RESIGNED">Resigned</SelectItem>
                          <SelectItem value="TERMINATED">Terminated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="employmentType">Employment Type</Label>
                      <Select value={formData.employmentType} onValueChange={(value) => handleInputChange("employmentType", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Salary & Benefits */}
              <Card className="bg-white dark:bg-zinc-950">
                <CardHeader>
                  <CardTitle className="text-lg">Salary & Benefits</CardTitle>
                  <CardDescription>Compensation and allowance details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="baseSalary">Base Salary *</Label>
                      <Input
                        id="baseSalary"
                        type="number"
                        value={formData.baseSalary}
                        onChange={(e) => handleInputChange("baseSalary", e.target.value)}
                        placeholder="0"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="allowances">Allowances</Label>
                      <Input
                        id="allowances"
                        type="number"
                        value={formData.allowances}
                        onChange={(e) => handleInputChange("allowances", e.target.value)}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="deductions">Deductions</Label>
                      <Input
                        id="deductions"
                        type="number"
                        value={formData.deductions}
                        onChange={(e) => handleInputChange("deductions", e.target.value)}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="totalLeaveBalance">Total Leave Balance</Label>
                      <Input
                        id="totalLeaveBalance"
                        type="number"
                        value={formData.totalLeaveBalance}
                        onChange={(e) => handleInputChange("totalLeaveBalance", e.target.value)}
                        placeholder="20"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Bank Details */}
              <Card className="bg-white dark:bg-zinc-950">
                <CardHeader>
                  <CardTitle className="text-lg">Bank Details</CardTitle>
                  <CardDescription>Bank account information for salary transfer</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="bankAccountNumber">Bank Account Number</Label>
                      <Input
                        id="bankAccountNumber"
                        value={formData.bankAccountNumber}
                        onChange={(e) => handleInputChange("bankAccountNumber", e.target.value)}
                        placeholder="Account number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input
                        id="bankName"
                        value={formData.bankName}
                        onChange={(e) => handleInputChange("bankName", e.target.value)}
                        placeholder="Bank name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ifscCode">IFSC Code</Label>
                      <Input
                        id="ifscCode"
                        value={formData.ifscCode}
                        onChange={(e) => handleInputChange("ifscCode", e.target.value)}
                        placeholder="IFSC code"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Documents & Compliance */}
              <Card className="bg-white dark:bg-zinc-950">
                <CardHeader>
                  <CardTitle className="text-lg">Documents & Compliance</CardTitle>
                  <CardDescription>Government identification and compliance documents</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="panNumber">PAN Number</Label>
                      <Input
                        id="panNumber"
                        value={formData.panNumber}
                        onChange={(e) => handleInputChange("panNumber", e.target.value)}
                        placeholder="PAN number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="aadharNumber">Aadhar Number</Label>
                      <Input
                        id="aadharNumber"
                        value={formData.aadharNumber}
                        onChange={(e) => handleInputChange("aadharNumber", e.target.value)}
                        placeholder="Aadhar number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="passportNumber">Passport Number</Label>
                      <Input
                        id="passportNumber"
                        value={formData.passportNumber}
                        onChange={(e) => handleInputChange("passportNumber", e.target.value)}
                        placeholder="Passport number"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Form Actions */}
              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="gap-2"
                >
                  {loading ? "Adding Employee..." : "Add Employee"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
