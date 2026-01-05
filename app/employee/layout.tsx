"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Home, FileText, Clock, User, Settings, TrendingUp,BarChart3   } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth";

function EmployeeSidebar() {
  const router = useRouter();

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/employee/dashboard" },
    { icon: FileText, label: "Request Leave", href: "/employee/request-leave" },
    { icon: Clock, label: "Attendance", href: "/employee/attendance" },
    { icon: User, label: "My Profile", href: "/employee/profile" },
    { icon: TrendingUp, label: "Performance", href: "/employee/performance" },
    { icon: Settings, label: "Settings", href: "/employee/settings" },
  ];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
            H
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold">HRMS</span>
            <span className="text-xs text-muted-foreground">Employee</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarMenu className="gap-2">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                onClick={() => router.push(item.href)}
                className={`h-10 rounded-md transition-colors hover:bg-accent`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t px-2 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="h-10 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 rounded-md"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-sm font-medium">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <EmployeeSidebar />
      <div className="w-full flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
