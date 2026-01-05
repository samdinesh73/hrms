"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { LogoutButton } from "@/components/auth-utils"
import {
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  BriefcaseIcon,
  CalendarIcon,
  DollarSignIcon,
  LogOutIcon,
} from "lucide-react"

interface Employee {
  id: string
  employeeId: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  designation: string
  department: string
  joinDate: string
  baseSalary: number
  employmentStatus: string
  totalLeaveBalance: number
  address?: string
  city?: string
  dateOfBirth?: string
}

export default function MyAccountPage() {
  const router = useRouter()
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        setLoading(true)
        const userId = localStorage.getItem("userId")
        const token = localStorage.getItem("authToken")

        if (!userId || !token) {
          router.push("/login")
          return
        }

        const response = await fetch(`http://localhost:5000/api/employees/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch employee data")
        }

        const data = await response.json()
        setEmployee(data)
      } catch (err) {
        console.error("Error fetching employee:", err)
        setError("Failed to load profile data")
      } finally {
        setLoading(false)
      }
    }

    fetchEmployeeData()
  }, [router])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0)}${lastName?.charAt(0)}`.toUpperCase()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <Button onClick={() => router.back()} className="mt-4 w-full">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with back button and logout */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Account</h1>
          <LogoutButton className="gap-2">
            <LogOutIcon className="h-4 w-4" />
            Logout
          </LogoutButton>
        </div>

        {/* Profile Card */}
        {employee && (
          <>
            {/* Top Section - Profile Overview */}
            <Card className="mb-6 overflow-hidden bg-white dark:bg-gray-800 border-0 shadow-lg">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-32"></div>
              <CardContent className="pt-0 px-6 pb-6">
                <div className="flex flex-col md:flex-row gap-6 -mt-16 mb-6">
                  <Avatar className="h-32 w-32 border-4 border-white dark:border-gray-800 shadow-lg">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-2xl bg-blue-500 text-white">
                      {getInitials(employee.firstName, employee.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 mt-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {employee.firstName} {employee.lastName}
                    </h2>
                    <p className="text-lg text-blue-600 dark:text-blue-400 mt-1 font-semibold">
                      {employee.designation}
                    </p>
                    <div className="flex gap-3 mt-3">
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        {employee.employmentStatus}
                      </Badge>
                      <Badge variant="outline">{employee.employeeId}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="mb-6 bg-white dark:bg-gray-800 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Contact Information</CardTitle>
                <CardDescription>Your contact details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <MailIcon className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{employee.email}</p>
                    </div>
                  </div>
                  {employee.phone && (
                    <div className="flex items-center gap-3">
                      <PhoneIcon className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{employee.phone}</p>
                      </div>
                    </div>
                  )}
                  {employee.address && (
                    <div className="flex items-center gap-3 md:col-span-2">
                      <MapPinIcon className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Address</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {employee.address}
                          {employee.city && `, ${employee.city}`}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Employment Details */}
            <Card className="mb-6 bg-white dark:bg-gray-800 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Employment Details</CardTitle>
                <CardDescription>Your employment information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <BriefcaseIcon className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Designation</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{employee.designation}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 text-blue-500">📁</div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Department</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{employee.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Joining Date</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{formatDate(employee.joinDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <DollarSignIcon className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Base Salary</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        ₹{employee.baseSalary.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Leave & Benefits */}
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Leave & Benefits</CardTitle>
                <CardDescription>Your leave and benefit information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900 dark:to-red-900 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-300 mb-2">Total Leave Balance</p>
                    <p className="text-4xl font-bold text-orange-600 dark:text-orange-400">
                      {employee.totalLeaveBalance}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">days remaining</p>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">Status</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{employee.employmentStatus}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">Employee ID</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{employee.employeeId}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">Department</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{employee.department}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8 mb-8">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                Back to Dashboard
              </Button>
              <LogoutButton className="flex-1 gap-2">
                <LogOutIcon className="h-4 w-4" />
                Logout
              </LogoutButton>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
