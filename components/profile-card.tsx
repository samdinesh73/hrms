'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LogoutButton } from "@/components/auth-utils"
import Link from "next/link"
import { UserIcon, LogOutIcon } from "lucide-react"

interface ProfileCardProps {
  firstName: string
  lastName: string
  email: string
  designation: string
  department: string
  employeeId: string
  employmentStatus: string
}

export function ProfileCard({
  firstName,
  lastName,
  email,
  designation,
  department,
  employeeId,
  employmentStatus,
}: ProfileCardProps) {
  const getInitials = (first: string, last: string) => {
    return `${first?.charAt(0)}${last?.charAt(0)}`.toUpperCase()
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-blue-500">
              <AvatarImage src="" />
              <AvatarFallback className="bg-blue-500 text-white font-semibold">
                {getInitials(firstName, lastName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {firstName} {lastName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{designation}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{email}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary" className="text-xs">
                  {employeeId}
                </Badge>
                <Badge className="text-xs bg-green-600">
                  {employmentStatus}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-200 dark:border-blue-800 pt-4 mt-4">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Department</p>
              <p className="font-semibold text-gray-900 dark:text-white">{department}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Status</p>
              <p className="font-semibold text-gray-900 dark:text-white">{employmentStatus}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Link href="/employee/account" className="flex-1">
              <Button variant="outline" className="w-full text-sm gap-1.5">
                <UserIcon className="h-4 w-4" />
                My Account
              </Button>
            </Link>
            <LogoutButton className="text-sm gap-1.5">
              <LogOutIcon className="h-4 w-4" />
              Logout
            </LogoutButton>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
