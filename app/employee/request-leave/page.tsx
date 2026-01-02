"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

export default function RequestLeavePage() {
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [activeTab, setActiveTab] = useState("request");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Employee data
  const employee = {
    name: "John Doe",
    id: "EMP001",
    avatar: "https://github.com/shadcn.png",
  };

  // Leave balance
  const leaveBalance = [
    { id: 1, type: "Sick Leave", used: 2, total: 5, available: 3, color: "bg-red-600" },
    { id: 2, type: "Casual Leave", used: 4, total: 10, available: 6, color: "bg-blue-600" },
    { id: 3, type: "Earned Leave", used: 10, total: 20, available: 10, color: "bg-green-600" },
    { id: 4, type: "Maternity/Paternity Leave", used: 0, total: 3, available: 3, color: "bg-purple-600" },
    { id: 5, type: "Emergency Leave", used: 0, total: 2, available: 2, color: "bg-amber-600" },
  ];

  // Leave requests history
  const leaveRequests = [
    { id: 1, type: "Casual Leave", from: "Dec 25, 2025", to: "Dec 26, 2025", days: 2, status: "Approved", appliedOn: "Dec 20, 2025", approver: "Sarah Williams" },
    { id: 2, type: "Sick Leave", from: "Jan 1, 2026", to: "Jan 1, 2026", days: 1, status: "Approved", appliedOn: "Dec 30, 2025", approver: "Sarah Williams" },
    { id: 3, type: "Earned Leave", from: "Jan 10, 2026", to: "Jan 15, 2026", days: 5, status: "Pending", appliedOn: "Dec 28, 2025", approver: "Awaiting Approval" },
    { id: 4, type: "Casual Leave", from: "Nov 15, 2025", to: "Nov 16, 2025", days: 2, status: "Rejected", appliedOn: "Nov 10, 2025", approver: "Sarah Williams" },
  ];

  // Holidays
  const holidays = [
    { date: "Jan 15, 2026", name: "Holiday Name", day: "Wednesday" },
    { date: "Jan 26, 2026", name: "Republic Day", day: "Sunday" },
    { date: "Feb 28, 2026", name: "Holiday Name", day: "Saturday" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    // Reset form
    setLeaveType("");
    setStartDate("");
    setEndDate("");
    setReason("");
    alert("Leave request submitted successfully!");
  };

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const selectedLeaveBalance = leaveBalance.find(l => l.type === leaveType);
  const requestedDays = calculateDays();
  const canApplyLeave = selectedLeaveBalance && selectedLeaveBalance.available >= requestedDays;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-white">Request Leave</h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1">Manage and track your leave requests</p>
          </div>
          <AnimatedThemeToggler />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="request">New Request</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>

          {/* New Request Tab */}
          <TabsContent value="request" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Request Form */}
              <Card className="bg-white dark:bg-zinc-950 lg:col-span-2">
                <CardHeader>
                  <CardTitle>Submit Leave Request</CardTitle>
                  <CardDescription>Fill in the details to request a leave</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Employee Info */}
                    <div className="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                      <Avatar>
                        <AvatarImage src={employee.avatar} />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-black dark:text-white">{employee.name}</p>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">{employee.id}</p>
                      </div>
                    </div>

                    {/* Leave Type */}
                    <div className="space-y-2">
                      <Label htmlFor="leave-type">Leave Type *</Label>
                      <Select value={leaveType} onValueChange={setLeaveType}>
                        <SelectTrigger id="leave-type" className="bg-white dark:bg-zinc-900">
                          <SelectValue placeholder="Select leave type" />
                        </SelectTrigger>
                        <SelectContent>
                          {leaveBalance.map((leave) => (
                            <SelectItem key={leave.id} value={leave.type}>
                              {leave.type} ({leave.available} available)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedLeaveBalance && (
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                          You have {selectedLeaveBalance.available} days available
                        </p>
                      )}
                    </div>

                    {/* Start Date */}
                    <div className="space-y-2">
                      <Label htmlFor="start-date">Start Date *</Label>
                      <Input
                        id="start-date"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="bg-white dark:bg-zinc-900"
                      />
                    </div>

                    {/* End Date */}
                    <div className="space-y-2">
                      <Label htmlFor="end-date">End Date *</Label>
                      <Input
                        id="end-date"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="bg-white dark:bg-zinc-900"
                      />
                    </div>

                    {/* Days Summary */}
                    {startDate && endDate && (
                      <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          <span className="font-medium">Total Days: {requestedDays}</span>
                          {selectedLeaveBalance && (
                            <>
                              {" "}
                              {canApplyLeave ? (
                                <span className="text-green-600 dark:text-green-400"> (Sufficient balance available)</span>
                              ) : (
                                <span className="text-red-600 dark:text-red-400"> (Insufficient balance!)</span>
                              )}
                            </>
                          )}
                        </p>
                      </div>
                    )}

                    {/* Reason */}
                    <div className="space-y-2">
                      <Label htmlFor="reason">Reason / Comments</Label>
                      <textarea
                        id="reason"
                        placeholder="Please provide a reason for your leave request..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-black dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-20 resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3">
                      <Button
                        type="submit"
                        disabled={!leaveType || !startDate || !endDate || isSubmitting || !canApplyLeave}
                        className="flex-1"
                      >
                        {isSubmitting ? "Submitting..." : "Submit Request"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setLeaveType("");
                          setStartDate("");
                          setEndDate("");
                          setReason("");
                        }}
                      >
                        Reset
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Leave Balance Summary */}
              <Card className="bg-white dark:bg-zinc-950 h-fit">
                <CardHeader>
                  <CardTitle>Leave Balance</CardTitle>
                  <CardDescription>Current financial year</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {leaveBalance.map((leave) => (
                    <div key={leave.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-700 dark:text-zinc-300">{leave.type}</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="text-sm font-medium text-black dark:text-white cursor-help">
                                {leave.available}/{leave.total}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{leave.used} used</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${leave.color}`}
                          style={{ width: `${(leave.available / leave.total) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400">{leave.used} used • {leave.available} available</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="mt-6">
            <Card className="bg-white dark:bg-zinc-950">
              <CardHeader>
                <CardTitle>Leave Request History</CardTitle>
                <CardDescription>All your previous leave requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaveRequests.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-start justify-between p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                            {request.type}
                          </Badge>
                          <Badge
                            variant={
                              request.status === "Approved"
                                ? "default"
                                : request.status === "Pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {request.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-1">
                          {request.from} to {request.to}
                        </p>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400">
                          {request.days} day(s) • Applied on {request.appliedOn}
                        </p>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                          Approver: {request.approver}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Holiday Calendar */}
              <Card className="bg-white dark:bg-zinc-950 lg:col-span-2">
                <CardHeader>
                  <CardTitle>Holiday Calendar</CardTitle>
                  <CardDescription>Upcoming holidays and important dates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {holidays.map((holiday, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800"
                      >
                        <div>
                          <p className="font-medium text-black dark:text-white">{holiday.name}</p>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">{holiday.date}</p>
                        </div>
                        <Badge variant="outline">{holiday.day}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Leave Policy */}
              <Card className="bg-white dark:bg-zinc-950">
                <CardHeader>
                  <CardTitle>Leave Policy</CardTitle>
                  <CardDescription>Important information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-black dark:text-white">Notice Period</p>
                    <p className="text-zinc-600 dark:text-zinc-400 text-xs mt-1">5 days in advance</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="font-medium text-black dark:text-white">Approval Workflow</p>
                    <p className="text-zinc-600 dark:text-zinc-400 text-xs mt-1">Manager → HR</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="font-medium text-black dark:text-white">Financial Year</p>
                    <p className="text-zinc-600 dark:text-zinc-400 text-xs mt-1">Jan 1 - Dec 31</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="font-medium text-black dark:text-white">Carry Forward</p>
                    <p className="text-zinc-600 dark:text-zinc-400 text-xs mt-1">Up to 5 days</p>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View Full Policy
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
