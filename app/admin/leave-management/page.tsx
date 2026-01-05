"use client"

import { useState, useEffect } from "react"
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react"
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface LeaveRequest {
  id: string
  employeeId: string
  employee?: {
    firstName: string
    lastName: string
    email: string
    designation: string
    department?: { name: string }
  }
  leaveType: string
  startDate: string
  endDate: string
  totalDays: number
  reason: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  appliedOn: string
  approvalDate?: string
  rejectionReason?: string
  approvedBy?: string
}

const LEAVE_TYPES: Record<string, string> = {
  EARNED_LEAVE: "Earned Leave",
  CASUAL_LEAVE: "Casual Leave",
  SICK_LEAVE: "Sick Leave",
  MATERNITY_LEAVE: "Maternity Leave",
  PATERNITY_LEAVE: "Paternity Leave",
  UNPAID_LEAVE: "Unpaid Leave",
  SPECIAL_LEAVE: "Special Leave",
}

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
          <XCircle className="w-3 h-3 mr-1" /> Rejected
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


export default function AdminLeavePage() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
  const [filteredRequests, setFilteredRequests] = useState<LeaveRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null)
  const [approvalStatus, setApprovalStatus] = useState<"APPROVED" | "REJECTED">("APPROVED")
  const [approvalComments, setApprovalComments] = useState("")
  const [processing, setProcessing] = useState(false)
  const [filterStatus, setFilterStatus] = useState("PENDING")
  const [searchTerm, setSearchTerm] = useState("")
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  })

  useEffect(() => {
    fetchLeaveRequests()
  }, [])

  useEffect(() => {
    filterLeaveRequests()
  }, [leaveRequests, filterStatus, searchTerm])

  const fetchLeaveRequests = async () => {
    setLoading(true)
    try {
      const response = await fetch("http://localhost:5000/api/leaves")
      const data = await response.json()
      if (data.data) {
        const leaves: LeaveRequest[] = Array.isArray(data.data) ? data.data : [data.data]
        setLeaveRequests(leaves)

        // Calculate stats
        const pending = leaves.filter((l) => l.status === "PENDING").length
        const approved = leaves.filter((l) => l.status === "APPROVED").length
        const rejected = leaves.filter((l) => l.status === "REJECTED").length
        setStats({
          pending,
          approved,
          rejected,
          total: leaves.length,
        })
      }
    } catch (err) {
      console.error("Failed to fetch leave requests:", err)
      setError("Failed to load leave requests")
    } finally {
      setLoading(false)
    }
  }

  const filterLeaveRequests = () => {
    let filtered = leaveRequests

    // Filter by status
    if (filterStatus !== "ALL") {
      filtered = filtered.filter((l) => l.status === filterStatus)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((l) => {
        const employeeName = `${l.employee?.firstName} ${l.employee?.lastName}`.toLowerCase()
        const email = l.employee?.email.toLowerCase() || ""
        const search = searchTerm.toLowerCase()
        return employeeName.includes(search) || email.includes(search)
      })
    }

    setFilteredRequests(filtered)
  }

  const handleApproveReject = async (leaveId: string, status: "APPROVED" | "REJECTED") => {
    setProcessing(true)
    try {
      const response = await fetch(`http://localhost:5000/api/leaves/${leaveId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          managerId: "admin", // Could be current user's ID
          status,
          approvalDate: new Date().toISOString(),
          comments: approvalComments,
        }),
      })

      if (response.ok) {
        // Update local state
        setLeaveRequests((prev) =>
          prev.map((l) =>
            l.id === leaveId
              ? {
                  ...l,
                  status,
                  approvalDate: new Date().toISOString(),
                  rejectionReason: status === "REJECTED" ? approvalComments : undefined,
                }
              : l
          )
        )
        setSelectedLeave(null)
        setApprovalComments("")
        setApprovalStatus("APPROVED")
      } else {
        setError("Failed to update leave request")
      }
    } catch (err) {
      console.error("Error updating leave:", err)
      setError("Error processing leave request")
    } finally {
      setProcessing(false)
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
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#" className="text-black dark:text-white">HRMS</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-zinc-600 dark:text-zinc-400">Leave Management</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Page Title */}
            <div>
              <h1 className="text-3xl font-bold text-black dark:text-white">Leave Management</h1>
              <p className="text-zinc-600 dark:text-zinc-400 mt-1">Review and approve employee leave requests</p>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-100 px-6 py-4 rounded-lg flex gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-white dark:bg-zinc-950">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Total Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">All time</p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-zinc-950">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Pending</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">Awaiting approval</p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-zinc-950">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Approved</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.approved}</p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">Approved</p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-zinc-950">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Rejected</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.rejected}</p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">Rejected</p>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="bg-white dark:bg-zinc-950">
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Status</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Status</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="APPROVED">Approved</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Search Employee</Label>
                  <Input
                    placeholder="Name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFilterStatus("PENDING")
                  setSearchTerm("")
                }}
              >
                Clear Filters
              </Button>
                </div>
              </CardContent>
            </Card>

            {/* Leave Requests Table */}
            <Card className="bg-white dark:bg-zinc-950">
              <CardHeader>
                <CardTitle>Leave Requests</CardTitle>
                <CardDescription>Showing {filteredRequests.length} request(s)</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
                  </div>
                ) : filteredRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-zinc-600 dark:text-zinc-400">No leave requests found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Employee</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Leave Type</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Days</TableHead>
                          <TableHead>Applied On</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRequests.map((leave) => (
                          <TableRow key={leave.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium text-black dark:text-white">
                                  {leave.employee?.firstName} {leave.employee?.lastName}
                                </p>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">{leave.employee?.email}</p>
                              </div>
                            </TableCell>
                            <TableCell>{leave.employee?.department?.name || "-"}</TableCell>
                            <TableCell>{LEAVE_TYPES[leave.leaveType]}</TableCell>
                            <TableCell className="text-sm">
                              {new Date(leave.startDate).toLocaleDateString()} to{" "}
                              {new Date(leave.endDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="font-medium">{leave.totalDays}</TableCell>
                            <TableCell className="text-sm">
                              {new Date(leave.appliedOn).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{getStatusBadge(leave.status)}</TableCell>
                            <TableCell className="text-right">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedLeave(leave)}
                                    disabled={leave.status !== "PENDING"}
                                  >
                                    {leave.status === "PENDING" ? "Review" : "View"}
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>Leave Request Details</DialogTitle>
                                    <DialogDescription>
                                      {leave.employee?.firstName} {leave.employee?.lastName}
                                    </DialogDescription>
                                  </DialogHeader>

                                  {selectedLeave?.id === leave.id && (
                                    <div className="space-y-6">
                                      {/* Employee Info */}
                                      <div className="grid grid-cols-2 gap-4 bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg">
                                        <div>
                                          <p className="text-sm text-zinc-600 dark:text-zinc-400">Employee Name</p>
                                          <p className="font-semibold text-black dark:text-white">
                                            {leave.employee?.firstName} {leave.employee?.lastName}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-zinc-600 dark:text-zinc-400">Email</p>
                                          <p className="font-semibold text-black dark:text-white">{leave.employee?.email}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-zinc-600 dark:text-zinc-400">Designation</p>
                                          <p className="font-semibold text-black dark:text-white">{leave.employee?.designation}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-zinc-600 dark:text-zinc-400">Department</p>
                                          <p className="font-semibold text-black dark:text-white">{leave.employee?.department?.name}</p>
                                        </div>
                                      </div>

                                      {/* Leave Details */}
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <p className="text-sm text-zinc-600 dark:text-zinc-400">Leave Type</p>
                                          <p className="font-semibold text-black dark:text-white">{LEAVE_TYPES[leave.leaveType]}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Days</p>
                                          <p className="font-semibold text-black dark:text-white">{leave.totalDays}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-zinc-600 dark:text-zinc-400">Start Date</p>
                                          <p className="font-semibold text-black dark:text-white">
                                            {new Date(leave.startDate).toLocaleDateString()}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-zinc-600 dark:text-zinc-400">End Date</p>
                                          <p className="font-semibold text-black dark:text-white">
                                            {new Date(leave.endDate).toLocaleDateString()}
                                          </p>
                                        </div>
                                      </div>

                                      {/* Reason */}
                                      <div>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">Reason</p>
                                        <p className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg text-sm text-black dark:text-white">{leave.reason}</p>
                                      </div>

                                      {/* Leave Balance Warning */}
                                      {leave.status === "PENDING" && (
                                        <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 p-4 rounded-lg">
                                          <p className="text-sm font-semibold text-orange-700 dark:text-orange-100 mb-2">⚠️ Leave Balance Alert</p>
                                          <p className="text-sm text-orange-600 dark:text-orange-200">
                                            Note: This employee's leave balance may be low or zero. Please verify their balance before approving.
                                          </p>
                                        </div>
                                      )}

                                      {/* Approval Section */}
                                      {leave.status === "PENDING" && (
                                        <div className="space-y-4 border-t border-zinc-200 dark:border-zinc-800 pt-4">
                                          <div>
                                            <Label>Decision</Label>
                                            <Select
                                              value={approvalStatus}
                                              onValueChange={(value) =>
                                                setApprovalStatus(value as "APPROVED" | "REJECTED")
                                              }
                                            >
                                              <SelectTrigger>
                                                <SelectValue />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="APPROVED">Approve</SelectItem>
                                                <SelectItem value="REJECTED">Reject</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>

                                          <div>
                                            <Label>Comments {approvalStatus === "REJECTED" && "*"}</Label>
                                            <Textarea
                                              placeholder={
                                                approvalStatus === "REJECTED"
                                                  ? "Reason for rejection (required)"
                                                  : "Add any comments (optional)"
                                              }
                                              value={approvalComments}
                                              onChange={(e) => setApprovalComments(e.target.value)}
                                              rows={3}
                                              required={approvalStatus === "REJECTED"}
                                            />
                                          </div>

                                          <div className="flex gap-3 justify-end">
                                            <DialogTrigger asChild>
                                              <Button variant="outline">Cancel</Button>
                                            </DialogTrigger>
                                            <Button
                                              onClick={() => handleApproveReject(leave.id, approvalStatus)}
                                              disabled={
                                                processing ||
                                                (approvalStatus === "REJECTED" && !approvalComments)
                                              }
                                              className={
                                                approvalStatus === "APPROVED"
                                                  ? "bg-green-600 hover:bg-green-700 text-white"
                                                  : "bg-red-600 hover:bg-red-700 text-white"
                                              }
                                            >
                                              {processing ? "Processing..." : approvalStatus === "APPROVED" ? "Approve" : "Reject"}
                                            </Button>
                                          </div>
                                        </div>
                                      )}

                                      {/* Approved/Rejected Info */}
                                      {leave.status !== "PENDING" && (
                                        <div
                                          className={`border p-4 rounded-lg ${
                                            leave.status === "APPROVED"
                                              ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
                                              : "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800"
                                          }`}
                                        >
                                          <p className={`text-sm font-medium mb-2 ${
                                            leave.status === "APPROVED"
                                              ? "text-green-700 dark:text-green-100"
                                              : "text-red-700 dark:text-red-100"
                                          }`}>
                                            {leave.status === "APPROVED" ? "Approved" : "Rejected"} on{" "}
                                            {leave.approvalDate && new Date(leave.approvalDate).toLocaleDateString()}
                                          </p>
                                          {leave.rejectionReason && (
                                            <p className={`text-sm ${
                                              leave.status === "APPROVED"
                                                ? "text-green-600 dark:text-green-200"
                                                : "text-red-600 dark:text-red-200"
                                            }`}>{leave.rejectionReason}</p>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
