import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function ManagerHome() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4">
      <div className="max-w-2xl text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter md:text-5xl">
            Manager Dashboard
          </h1>
          <p className="text-lg text-slate-600">
            Manage your team, monitor performance, and stay on top of tasks
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row justify-center pt-4">
          <Link href="/manager/dashboard">
            <Button size="lg" className="gap-2">
              Go to Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/admin/dashboard">
            <Button size="lg" variant="outline">
              Admin Dashboard
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-12">
          <div className="rounded-lg border bg-white p-6 text-left">
            <h3 className="font-semibold mb-2">👥 Team Members</h3>
            <p className="text-sm text-slate-600">
              View and manage all team members with performance metrics
            </p>
          </div>
          <div className="rounded-lg border bg-white p-6 text-left">
            <h3 className="font-semibold mb-2">📊 Performance Tracking</h3>
            <p className="text-sm text-slate-600">
              Monitor team performance and individual metrics
            </p>
          </div>
          <div className="rounded-lg border bg-white p-6 text-left">
            <h3 className="font-semibold mb-2">✅ Task Management</h3>
            <p className="text-sm text-slate-600">
              Assign and track team tasks efficiently
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
