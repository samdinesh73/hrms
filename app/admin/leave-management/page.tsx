"use client";

import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, Check, X, Clock, Search } from "lucide-react";

export default function LeaveManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterLeaveType, setFilterLeaveType] = useState("all");
  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: 1,
      empId: "EMP001",
      name: "John Doe",
      avatar: "https://github.com/shadcn.png",
      leaveType: "Earned Leave",
      department: "IT",
      from: "Jan 10, 2026",
      to: "Jan 15, 2026",
      days: 5,
      status: "Pending",
      reason: "Vacation with family",
      appliedOn: "Dec 28, 2025",
    },
    {
      id: 2,
      empId: "EMP002",
      name: "Jane Smith",
      avatar: "https://github.com/vercel.png",
      leaveType: "Casual Leave",
      department: "HR",
      from: "Jan 5, 2026",
      to: "Jan 6, 2026",
      days: 2,
      status: "Pending",
      reason: "Personal work",
      appliedOn: "Dec 30, 2025",
    },
    {
      id: 3,
      empId: "EMP003",
      name: "Mike Johnson",
      avatar: "",
      leaveType: "Sick Leave",
      department: "Design",
      from: "Jan 3, 2026",
      to: "Jan 4, 2026",
      days: 2,
      status: "Approved",
      reason: "Medical appointment",
      appliedOn: "Dec 31, 2025",
    },
    {
      id: 4,
      empId: "EMP004",
      name: "Sarah Williams",
      avatar: "",
      leaveType: "Earned Leave",
      department: "Finance",
      from: "Jan 20, 2026",
      to: "Jan 25, 2026",
      days: 5,
      status: "Rejected",
      reason: "Family trip",
      appliedOn: "Dec 25, 2025",
    },
    {
      id: 5,
      empId: "EMP005",
      name: "Alex Turner",
      avatar: "",
      leaveType: "Casual Leave",
      department: "Sales",
      from: "Jan 8, 2026",
      to: "Jan 8, 2026",
      days: 1,
      status: "Pending",
      reason: "Home appointment",
      appliedOn: "Jan 1, 2026",
    },
    {
      id: 6,
      empId: "EMP006",
      name: "Emma Davis",
      avatar: "",
      leaveType: "Sick Leave",
      department: "IT",
      from: "Jan 1, 2026",
      to: "Jan 2, 2026",
      days: 2,
      status: "Approved",
      reason: "Fever",
      appliedOn: "Dec 31, 2025",
    },
    {
      id: 7,
      empId: "EMP007",
      name: "Robert Brown",
      avatar: "",
      leaveType: "Maternity/Paternity",
      department: "Finance",
      from: "Feb 1, 2026",
      to: "Mar 31, 2026",
      days: 60,
      status: "Pending",
      reason: "Paternity leave",
      appliedOn: "Dec 15, 2025",
    },
    {
      id: 8,
      empId: "EMP008",
      name: "Lisa Anderson",
      avatar: "",
      leaveType: "Earned Leave",
      department: "Sales",
      from: "Jan 12, 2026",
      to: "Jan 14, 2026",
      days: 3,
      status: "Approved",
      reason: "Wedding ceremony",
      appliedOn: "Dec 26, 2025",
    },
  ]);

  const [selectedRequest, setSelectedRequest] = useState<(typeof leaveRequests)[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<"approve" | "reject" | null>(null);

  const leaveTypes = ["all", "Earned Leave", "Casual Leave", "Sick Leave", "Maternity/Paternity"];
  const statuses = ["all", "Pending", "Approved", "Rejected"];

  const filteredRequests = leaveRequests.filter((request) => {
    const matchesSearch =
      request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.empId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "all" || request.status === filterStatus;
    const matchesLeaveType = filterLeaveType === "all" || request.leaveType === filterLeaveType;

    return matchesSearch && matchesStatus && matchesLeaveType;
  });

  const handleApprove = (request: (typeof leaveRequests)[0]) => {
    setSelectedRequest(request);
    setDialogAction("approve");
    setDialogOpen(true);
  };

  const handleReject = (request: (typeof leaveRequests)[0]) => {
    setSelectedRequest(request);
    setDialogAction("reject");
    setDialogOpen(true);
  };

  const confirmAction = () => {
    if (selectedRequest && dialogAction) {
      setLeaveRequests(
        leaveRequests.map((req) =>
          req.id === selectedRequest.id ? { ...req, status: dialogAction === "approve" ? "Approved" : "Rejected" } : req
        )
      );
      setDialogOpen(false);
      setSelectedRequest(null);
      setDialogAction(null);
    }
  };

  const stats = {
    pending: leaveRequests.filter((r) => r.status === "Pending").length,
    approved: leaveRequests.filter((r) => r.status === "Approved").length,
    rejected: leaveRequests.filter((r) => r.status === "Rejected").length,
    total: leaveRequests.length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <Check className="w-4 h-4" />;
      case "Rejected":
        return <X className="w-4 h-4" />;
      case "Pending":
        return <Clock className="w-4 h-4" />;
      default:
        return null;
    }
  };

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
                  <BreadcrumbPage className="text-zinc-600 dark:text-zinc-400">Leave Management</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Page Header */}
            <div>
              <h1 className="text-3xl font-bold text-black dark:text-white">Leave Management</h1>
              <p className="text-zinc-600 dark:text-zinc-400 mt-1">Review and manage employee leave requests</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4">
              <Card className="bg-white dark:bg-zinc-950">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Requests</p>
                    <p className="text-3xl font-bold text-black dark:text-white mt-2">{stats.total}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">Pending</p>
                    <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">{stats.pending}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-green-700 dark:text-green-300">Approved</p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{stats.approved}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-red-700 dark:text-red-300">Rejected</p>
                    <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">{stats.rejected}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="bg-white dark:bg-zinc-950">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <Input
                      placeholder="Search by name or employee ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status === "all" ? "All Status" : status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterLeaveType} onValueChange={setFilterLeaveType}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      {leaveTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type === "all" ? "All Types" : type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Request Count */}
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              Showing {filteredRequests.length} of {leaveRequests.length} requests
            </div>

            {/* Leave Requests List */}
            <div className="space-y-3">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <Card key={request.id} className="bg-white dark:bg-zinc-950 hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        {/* Left Section */}
                        <div className="flex items-center gap-4 flex-1">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={request.avatar} />
                            <AvatarFallback>{request.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-black dark:text-white">{request.name}</p>
                              <Badge variant="outline" className="text-xs">
                                {request.empId}
                              </Badge>
                            </div>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">{request.leaveType}</p>
                            <div className="flex gap-4 text-xs text-zinc-500 dark:text-zinc-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {request.from} to {request.to}
                              </span>
                              <span>({request.days} days)</span>
                            </div>
                            <p className="text-xs text-zinc-500 mt-1">Reason: {request.reason}</p>
                          </div>
                        </div>

                        {/* Middle Section */}
                        <div className="flex items-center gap-6 mr-6">
                          <div className="text-right">
                            <p className="text-xs text-zinc-600 dark:text-zinc-400">Department</p>
                            <p className="font-medium text-black dark:text-white">{request.department}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-zinc-600 dark:text-zinc-400">Applied On</p>
                            <p className="font-medium text-black dark:text-white">{request.appliedOn}</p>
                          </div>
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center gap-3">
                          <Badge className={`shrink-0 flex items-center gap-1 ${getStatusColor(request.status)}`}>
                            {getStatusIcon(request.status)}
                            {request.status}
                          </Badge>

                          {request.status === "Pending" && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="default"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleApprove(request)}
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleReject(request)}
                              >
                                <X className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="bg-white dark:bg-zinc-950">
                  <CardContent className="pt-12 pb-12">
                    <div className="text-center">
                      <p className="text-zinc-600 dark:text-zinc-400 mb-4">No leave requests found matching your criteria.</p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchTerm("");
                          setFilterStatus("all");
                          setFilterLeaveType("all");
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
        </div>

        {/* Confirmation Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {dialogAction === "approve" ? "Approve Leave Request" : "Reject Leave Request"}
              </DialogTitle>
              <DialogDescription>
                {dialogAction === "approve"
                  ? `Are you sure you want to approve ${selectedRequest?.name}'s ${selectedRequest?.leaveType} from ${selectedRequest?.from} to ${selectedRequest?.to}?`
                  : `Are you sure you want to reject ${selectedRequest?.name}'s ${selectedRequest?.leaveType} from ${selectedRequest?.from} to ${selectedRequest?.to}?`}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={confirmAction}
                className={dialogAction === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
              >
                {dialogAction === "approve" ? "Approve" : "Reject"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  );
}
