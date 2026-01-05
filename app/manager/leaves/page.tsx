"use client"

import { useState, useEffect } from "react"
import { CheckCircle, XCircle, Clock, AlertCircle, Users } from "lucide-react"
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

export default function ManagerLeavesPage() {
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
  const [managerId, setManagerId] = useState<string | null>(null)
  const [teamMembers, setTeamMembers] = useState<string[]>([])
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  })

  useEffect(() => {
    const managerId = typeof window !== "undefined" ? localStorage.getItem("managerId") : null
    setManagerId(managerId)
    if (managerId) {
      fetchManagerTeam(managerId)
      fetchTeamLeaveRequests(managerId)
    }
  }, [])

  useEffect(() => {
    filterLeaveRequests()
  }, [leaveRequests, filterStatus, searchTerm])

  const fetchManagerTeam = async (managerId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/employees?managerId=${managerId}`)
      const data = await response.json()
      if (data.data) {
        const teamIds = Array.isArray(data.data)
          ? data.data.map((emp: any) => emp.id)
          : [data.data.id]
        setTeamMembers(teamIds)
      }
    } catch (err) {
      console.error("Failed to fetch team members:", err)
    }
  }

  const fetchTeamLeaveRequests = async (managerId: string) => {
    setLoading(true)
    try {
      const response = await fetch("http://localhost:5000/api/leaves")
      const data = await response.json()
      if (data.data) {
        let leaves = Array.isArray(data.data) ? data.data : [data.data]
        
        // Filter only leaves from reporting team members
        leaves = leaves.filter((leave) => teamMembers.includes(leave.employeeId))
        
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
          managerId: managerId,
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
                  approvedBy: managerId,
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Users className="w-10 h-10" />
            Team Leave Requests
          </h1>
          <p className="text-gray-600">Approve or reject leave requests from your team members</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg flex gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
              <p className="text-xs text-gray-500 mt-1">From team</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              <p className="text-xs text-gray-500 mt-1">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
              <p className="text-xs text-gray-500 mt-1">Approved</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
              <p className="text-xs text-gray-500 mt-1">Rejected</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
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
        <Card>
          <CardHeader>
            <CardTitle>Leave Requests</CardTitle>
            <CardDescription>Showing {filteredRequests.length} request(s) from your team</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading...</p>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No leave requests found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Designation</TableHead>
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
                            <p className="font-medium">
                              {leave.employee?.firstName} {leave.employee?.lastName}
                            </p>
                            <p className="text-sm text-gray-500">{leave.employee?.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{leave.employee?.designation || "-"}</TableCell>
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
                                  <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                                    <div>
                                      <p className="text-sm text-gray-600">Employee Name</p>
                                      <p className="font-semibold">
                                        {leave.employee?.firstName} {leave.employee?.lastName}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-600">Email</p>
                                      <p className="font-semibold">{leave.employee?.email}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-600">Designation</p>
                                      <p className="font-semibold">{leave.employee?.designation}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-600">Department</p>
                                      <p className="font-semibold">{leave.employee?.department?.name}</p>
                                    </div>
                                  </div>

                                  {/* Leave Details */}
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm text-gray-600">Leave Type</p>
                                      <p className="font-semibold">{LEAVE_TYPES[leave.leaveType]}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-600">Total Days</p>
                                      <p className="font-semibold">{leave.totalDays}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-600">Start Date</p>
                                      <p className="font-semibold">
                                        {new Date(leave.startDate).toLocaleDateString()}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-600">End Date</p>
                                      <p className="font-semibold">
                                        {new Date(leave.endDate).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Reason */}
                                  <div>
                                    <p className="text-sm text-gray-600 mb-2">Reason</p>
                                    <p className="p-3 bg-gray-50 rounded-lg text-sm">{leave.reason}</p>
                                  </div>

                                  {/* Leave Balance Warning */}
                                  {leave.status === "PENDING" && (
                                    <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                                      <p className="text-sm font-semibold text-orange-700 mb-2">⚠️ Leave Balance Alert</p>
                                      <p className="text-sm text-orange-600">
                                        Note: This employee's leave balance may be low or zero. Please verify their balance before approving.
                                      </p>
                                    </div>
                                  )}

                                  {/* Approval Section */}
                                  {leave.status === "PENDING" && (
                                    <div className="space-y-4 border-t pt-4">
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
                                              ? "bg-green-600 hover:bg-green-700"
                                              : "bg-red-600 hover:bg-red-700"
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
                                          ? "bg-green-50 border-green-200"
                                          : "bg-red-50 border-red-200"
                                      }`}
                                    >
                                      <p className="text-sm font-medium mb-2">
                                        {leave.status === "APPROVED" ? "Approved" : "Rejected"} on{" "}
                                        {leave.approvalDate && new Date(leave.approvalDate).toLocaleDateString()}
                                      </p>
                                      {leave.rejectionReason && (
                                        <p className="text-sm">{leave.rejectionReason}</p>
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
  )
}
