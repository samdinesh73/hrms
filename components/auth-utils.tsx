'use client'

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { logout } from "@/lib/auth"

interface LogoutButtonProps {
  className?: string
}

export function LogoutButton({ className }: LogoutButtonProps) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      // Call logout endpoint
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
      })
    } catch (error) {
      console.error("Logout error:", error)
    }

    // Clear all auth data
    logout()

    // Redirect to login
    router.push("/login")
  }

  return (
    <Button variant="outline" onClick={handleLogout} className={className}>
      Logout
    </Button>
  )
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (!token) {
      router.push("/login")
    }
  }, [router])

  return <>{children}</>
}
