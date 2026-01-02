import * as React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { SearchForm } from "@/components/search-form"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, FileText, DollarSign, BarChart3, Settings, Home, Calendar, TrendingUp, CheckCircle, Zap } from "lucide-react"

// HRMS Menu Data
const hrmsMenuData = {
  admin: {
    main: [
      {
        icon: Home,
        label: "Dashboard",
        url: "/admin/dashboard",
      },
      {
        icon: Users,
        label: "Employees",
        url: "/admin/employees",
      },
      {
        icon: FileText,
        label: "Leave Management",
        url: "/admin/leave-management",
      },
      {
        icon: DollarSign,
        label: "Payroll",
        url: "/admin/payroll",
      },
      {
        icon: Calendar,
        label: "Attendance",
        url: "/admin/attendance",
      },
      {
        icon: BarChart3,
        label: "Reports",
        url: "/admin/reports",
      },
      {
        icon: TrendingUp,
        label: "Performance",
        url: "/admin/performance",
      },
      {
        icon: Settings,
        label: "Settings",
        url: "/admin/settings",
      },
    ],
    shortcut: [
      {
        icon: FileText,
        label: "New Leave Request",
        url: "/leave-request",
      },
      {
        icon: Users,
        label: "Add Employee",
        url: "/add-employee",
      },
      {
        icon: DollarSign,
        label: "Process Payroll",
        url: "/process-payroll",
      },
    ],
    recent: [
      {
        label: "Leave Approvals",
        url: "/approvals",
      },
      {
        label: "Pending Tasks",
        url: "/tasks",
      },
      {
        label: "Team Status",
        url: "/team-status",
      },
      {
        label: "Monthly Report",
        url: "/monthly-report",
      },
    ],
  },
  manager: {
    main: [
      {
        icon: Home,
        label: "Dashboard",
        url: "/manager/dashboard",
      },
      {
        icon: Users,
        label: "Team Members",
        url: "/manager/team",
      },
      {
        icon: CheckCircle,
        label: "Tasks",
        url: "/manager/tasks",
      },
      {
        icon: BarChart3,
        label: "Performance",
        url: "/manager/performance",
      },
      {
        icon: FileText,
        label: "Leave Requests",
        url: "/manager/leave-requests",
      },
      {
        icon: TrendingUp,
        label: "Reports",
        url: "/manager/reports",
      },
      {
        icon: Settings,
        label: "Settings",
        url: "/manager/settings",
      },
    ],
    shortcut: [
      {
        icon: Users,
        label: "Assign Task",
        url: "/manager/assign-task",
      },
      {
        icon: FileText,
        label: "Send Message",
        url: "/manager/message",
      },
      {
        icon: TrendingUp,
        label: "View Analytics",
        url: "/manager/analytics",
      },
    ],
    recent: [
      {
        label: "Team Performance",
        url: "/manager/performance",
      },
      {
        label: "Pending Tasks",
        url: "/manager/tasks",
      },
      {
        label: "Team Availability",
        url: "/manager/availability",
      },
      {
        label: "Monthly Report",
        url: "/manager/monthly-report",
      },
    ],
  },
}

export function AppSidebar({ userType = "admin", ...props }: React.ComponentProps<typeof Sidebar> & { userType?: "admin" | "manager" }) {
  const [activeTab, setActiveTab] = useState("menu")
  const menuData = hrmsMenuData[userType] || hrmsMenuData.admin

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white font-bold">
            H
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-sm">HRMS</span>
            <span className="text-xs text-zinc-600 dark:text-zinc-400">v2.0.0</span>
          </div>
        </div>
        <SearchForm />
      </SidebarHeader>

      <SidebarContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="menu" className="text-xs">Menu</TabsTrigger>
            <TabsTrigger value="shortcuts" className="text-xs">Quick</TabsTrigger>
            <TabsTrigger value="recent" className="text-xs">Recent</TabsTrigger>
          </TabsList>

          {/* Main Menu Tab */}
          <TabsContent value="menu" className="m-0">
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuData.main.map((item) => {
                    const Icon = item.icon
                    return (
                      <SidebarMenuItem key={item.label}>
                        <SidebarMenuButton asChild>
                          <Link href={item.url} className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </TabsContent>

          {/* Shortcuts Tab */}
          <TabsContent value="shortcuts" className="m-0">
            <SidebarGroup>
              <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuData.shortcut.map((item) => {
                    const Icon = item.icon
                    return (
                      <SidebarMenuItem key={item.label}>
                        <SidebarMenuButton asChild>
                          <Link href={item.url} className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            <span className="text-sm">{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </TabsContent>

          {/* Recent Tab */}
          <TabsContent value="recent" className="m-0">
            <SidebarGroup>
              <SidebarGroupLabel>Recent Access</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuData.recent.map((item) => (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton asChild>
                        <Link href={item.url} className="flex items-center">
                          <span className="text-sm">{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </TabsContent>
        </Tabs>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
