"use client"

import { useState, useEffect } from "react"
import { Calendar, AlertCircle, CheckCircle, Clock, FileText } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface LeaveRequest {
  id: string
  leaveType: string
  startDate: string
  endDate: string
  totalDays: number
  reason: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  appliedOn: string
  approvalDate?: string
  rejectionReason?: string
}

const LEAVE_TYPES = [
  { value: "EARNED_LEAVE", label: "Earned Leave" },
  { value: "CASUAL_LEAVE", label: "Casual Leave" },
  { value: "SICK_LEAVE", label: "Sick Leave" },
  { value: "MATERNITY_LEAVE", label: "Maternity Leave" },
  { value: "PATERNITY_LEAVE", label: "Paternity Leave" },
  { value: "UNPAID_LEAVE", label: "Unpaid Leave" },
  { value: "SPECIAL_LEAVE", label: "Special Leave" },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "APPROVED":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
          <CheckCircle className="w-3 h-3 mr-1" /> Approved
        </Badge>
      )
    case "REJECTED":
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
          <AlertCircle className="w-3 h-3 mr-1" /> Rejected
        </Badge>
      )
    default:
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
          <Clock className="w-3 h-3 mr-1" /> Pending
        </Badge>
      )
  }
}

export default function RequestLeavePage() {
  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  })

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
  const [leaveBalance, setLeaveBalance] = useState(0)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [employee, setEmployee] = useState<any>(null)
  const [employeeId, setEmployeeId] = useState<string | null>(null)

  // Get logged-in user ID from localStorage on mount
  useEffect(() => {
    const id = typeof window !== "undefined" ? localStorage.getItem("userId") : null
    setEmployeeId(id)
  }, [])

  useEffect(() => {
    if (employeeId) {
      fetchEmployeeData()
      fetchLeaveRequests()
    }
  }, [employeeId])

  const fetchEmployeeData = async () => {
    try {
      // Fetch employee data using the userId
      const response = await fetch(`http://localhost:5000/api/employees/${employeeId}`)
      
      if (!response.ok) {
        console.error("Failed to fetch employee data:", response.status, response.statusText)
        setError("Failed to load employee data")
        return
      }
      
      const data = await response.json()
      if (data.data) {
        setEmployee(data.data)
        const balance = (data.data.totalLeaveBalance || 20) - (data.data.usedLeaves || 0)
        setLeaveBalance(balance)
      } else if (data.error) {
        setError("Failed to load employee data")
      }
    } catch (err) {
      console.error("Failed to fetch employee data:", err)
      setError("Unable to fetch employee data. Please try again.")
    }
  }

  const fetchLeaveRequests = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch(
        `http://localhost:5000/api/leaves?employeeId=${employeeId}`
      )
      
      if (!response.ok) {
        console.error("Failed to fetch leave requests:", response.status, response.statusText)
        setError("Failed to load leave requests")
        setLeaveRequests([])
        return
      }
      
      const data = await response.json()
      if (data.success && data.data) {
        setLeaveRequests(
          Array.isArray(data.data) ? data.data : [data.data]
        )
      } else {
        setLeaveRequests([])
      }
    } catch (err) {
      console.error("Failed to fetch leave requests:", err)
      setError("Failed to load leave requests")
      setLeaveRequests([])
    } finally {
      setLoading(false)
    }
  }

  const calculateTotalDays = (start: string, end: string) => {
    if (!start || !end) return 0
    const startDate = new Date(start)
    const endDate = new Date(end)
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => {
      const updated = { ...prev, [name]: value }
      return updated
    })
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, leaveType: value }))
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!employeeId) {
      setError("Error: User ID not found. Please log in again.")
      return
    }

    if (!formData.leaveType || !formData.startDate || !formData.endDate || !formData.reason) {
      setError("Please fill all required fields")
      return
    }

    const totalDays = calculateTotalDays(formData.startDate, formData.endDate)

    setSubmitting(true)
    try {
      const requestBody = {
        userId: employeeId,
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        totalDays,
        reason: formData.reason,
      }

      console.log("Submitting leave request:", requestBody)

      const response = await fetch("http://localhost:5000/api/leaves", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      })

      const responseData = await response.json()
      console.log("Response:", responseData)

      if (response.ok) {
        setSuccess("Leave request submitted successfully!")
        setFormData({
          leaveType: "",
          startDate: "",
          endDate: "",
          reason: "",
        })
        fetchLeaveRequests()
        fetchEmployeeData()
      } else {
        setError(responseData?.error || "Failed to submit leave request")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error submitting leave request"
      setError(`Error: ${errorMessage}`)
      console.error("Full error:", err)
    } finally {
      setSubmitting(false)
    }
  }

  const totalDays = calculateTotalDays(formData.startDate, formData.endDate)

  return (
    <main className="flex-1 overflow-auto">
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4 sm:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="mb-8 border-b pb-6">
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">Leave Requests</h1>
            <p className="text-base text-muted-foreground">Manage your leave requests and track approvals</p>
          </div>

        {/* Leave Balance Card */}
        <Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-4 border-b border-border/40">
            <CardTitle className="text-lg font-semibold">Leave Balance Summary</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-800/40">
                <p className="text-sm font-medium text-muted-foreground">Total Available</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{leaveBalance}</p>
                <p className="text-xs text-muted-foreground">days</p>
              </div>
              {totalDays > 0 && (
                <div className="space-y-2 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-800/40">
                  <p className="text-sm font-medium text-muted-foreground">Requesting</p>
                  <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{totalDays}</p>
                  <p className="text-xs text-muted-foreground">days</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Leave Request Form */}
          <div className="lg:col-span-1">
            <Card className="border border-border/50 shadow-sm sticky top-8 h-fit">
              <CardHeader className="border-b border-border/40 pb-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Request Leave
                </CardTitle>
                <CardDescription>Submit a new leave request</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm flex gap-2 animate-in fade-in">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  {leaveBalance <= 0 && (
                    <div className="bg-amber-100 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800/60 text-amber-900 dark:text-amber-100 px-4 py-3 rounded-lg text-sm flex gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>⚠️ Your leave balance is {leaveBalance}. Request will be pending approval even after submission.</span>
                    </div>
                  )}

                  {leaveBalance > 0 && leaveBalance < 5 && (
                    <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-100 px-4 py-3 rounded-lg text-sm flex gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>⚠️ Low leave balance: Only {leaveBalance} days remaining</span>
                    </div>
                  )}

                  {success && (
                    <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-100 px-4 py-3 rounded-lg text-sm flex gap-2 animate-in fade-in">
                      <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{success}</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="leaveType" className="text-sm font-semibold">Leave Type *</Label>
                    <Select value={formData.leaveType} onValueChange={handleSelectChange}>
                      <SelectTrigger id="leaveType" className="border-border/70 focus:ring-blue-500">
                        <SelectValue placeholder="Select leave type" />
                      </SelectTrigger>
                      <SelectContent>
                        {LEAVE_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startDate" className="text-sm font-semibold">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleDateChange}
                      min={new Date().toISOString().split("T")[0]}
                      className="border-border/70 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate" className="text-sm font-semibold">End Date *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleDateChange}
                      min={formData.startDate || new Date().toISOString().split("T")[0]}
                      className="border-border/70 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason" className="text-sm font-semibold">Reason *</Label>
                    <Textarea
                      id="reason"
                      name="reason"
                      placeholder="Provide reason for leave"
                      value={formData.reason}
                      onChange={handleInputChange}
                      rows={4}
                      className="border-border/70 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm transition-all"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Submitting...
                      </>
                    ) : (
                      "Submit Request"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Leave History */}
          <div className="lg:col-span-2">
            <Card className="border border-border/50 shadow-sm">
              <CardHeader className="border-b border-border/40 pb-4">
                <CardTitle className="text-lg font-semibold">Leave History</CardTitle>
                <CardDescription>Your previous leave requests</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center">
                      <div className="animate-spin mr-2">⏳</div>
                      <p className="text-muted-foreground font-medium">Loading leave history...</p>
                    </div>
                  </div>
                ) : leaveRequests.length === 0 ? (
                  <div className="text-center py-12 border rounded-lg border-dashed border-border/50 bg-secondary/20">
                    <FileText className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="text-muted-foreground font-medium">No leave requests yet</p>
                    <p className="text-xs text-muted-foreground mt-1">Submit your first leave request using the form on the left</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="overflow-x-auto rounded-lg border border-border/40">
                      <Table>
                        <TableHeader className="bg-secondary/40">
                          <TableRow className="border-b border-border/40 hover:bg-transparent">
                            <TableHead className="font-semibold">Type</TableHead>
                            <TableHead className="font-semibold">Start Date</TableHead>
                            <TableHead className="font-semibold">End Date</TableHead>
                            <TableHead className="font-semibold text-center">Days</TableHead>
                            <TableHead className="font-semibold">Status</TableHead>
                            <TableHead className="font-semibold">Applied On</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {leaveRequests.map((leave) => (
                            <TableRow key={leave.id} className="border-b border-border/40 hover:bg-secondary/30 transition-colors">
                              <TableCell className="font-medium text-sm">
                                {LEAVE_TYPES.find((t) => t.value === leave.leaveType)?.label || leave.leaveType}
                              </TableCell>
                              <TableCell className="text-sm">
                                {new Date(leave.startDate).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </TableCell>
                              <TableCell className="text-sm">
                                {new Date(leave.endDate).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </TableCell>
                              <TableCell className="text-sm text-center font-semibold">{leave.totalDays}</TableCell>
                              <TableCell>{getStatusBadge(leave.status)}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {new Date(leave.appliedOn).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {leaveRequests.length > 0 && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="border border-border/50 hover:bg-secondary/40 text-sm font-medium">
                            View Detailed History
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Leave Request Details</DialogTitle>
                            <DialogDescription>
                              Complete information about your leave requests
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 mt-4">
                            {leaveRequests.map((leave) => (
                              <Card key={leave.id} className="border border-border/40">
                                <CardContent className="pt-6">
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <p className="font-semibold text-muted-foreground text-xs mb-1">Leave Type</p>
                                      <p className="font-medium text-base">
                                        {LEAVE_TYPES.find((t) => t.value === leave.leaveType)?.label}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="font-semibold text-muted-foreground text-xs mb-1">Total Days</p>
                                      <p className="font-medium text-base">{leave.totalDays} days</p>
                                    </div>
                                    <div>
                                      <p className="font-semibold text-muted-foreground text-xs mb-1">Start Date</p>
                                      <p className="font-medium">
                                        {new Date(leave.startDate).toLocaleDateString("en-US", {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                        })}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="font-semibold text-muted-foreground text-xs mb-1">End Date</p>
                                      <p className="font-medium">
                                        {new Date(leave.endDate).toLocaleDateString("en-US", {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                        })}
                                      </p>
                                    </div>
                                    <div className="col-span-2">
                                      <p className="font-semibold text-muted-foreground text-xs mb-1">Reason</p>
                                      <p className="font-medium text-sm">{leave.reason}</p>
                                    </div>
                                    <div>
                                      <p className="font-semibold text-muted-foreground text-xs mb-1">Status</p>
                                      {getStatusBadge(leave.status)}
                                    </div>
                                    <div>
                                      <p className="font-semibold text-muted-foreground text-xs mb-1">Applied On</p>
                                      <p className="font-medium text-sm">
                                        {new Date(leave.appliedOn).toLocaleDateString("en-US", {
                                          year: "numeric",
                                          month: "short",
                                          day: "numeric",
                                        })}
                                      </p>
                                    </div>
                                    {leave.rejectionReason && (
                                      <div className="col-span-2">
                                        <p className="font-semibold text-red-600 dark:text-red-400 text-xs mb-1">Rejection Reason</p>
                                        <p className="font-medium text-sm text-red-600 dark:text-red-400">{leave.rejectionReason}</p>
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      </div>
    </main>
  )
}

