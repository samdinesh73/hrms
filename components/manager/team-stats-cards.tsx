import { Card, CardContent } from "@/components/ui/card"
import { Users, TrendingUp, CheckCircle, AlertCircle } from "lucide-react"

interface Metrics {
  totalTeam: number;
  activeMembers: number;
  avgPerformance: number;
  overdueTasksCount: number;
  totalTasksCompleted: number;
}

interface TeamStatsCardsProps {
  metrics: Metrics;
}

export function TeamStatsCards({ metrics }: TeamStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Team</p>
              <p className="text-2xl font-bold mt-2">{metrics.totalTeam}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Members</p>
              <p className="text-2xl font-bold mt-2">{metrics.activeMembers}</p>
              <p className="text-xs text-muted-foreground mt-1">{Math.round((metrics.activeMembers / metrics.totalTeam) * 100)}% available</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg Performance</p>
              <p className="text-2xl font-bold mt-2">{metrics.avgPerformance}%</p>
              <p className="text-xs text-green-600 mt-1">Team average</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tasks Completed</p>
              <p className="text-2xl font-bold mt-2">{metrics.totalTasksCompleted}</p>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Overdue Tasks</p>
              <p className="text-2xl font-bold mt-2 text-red-600">{metrics.overdueTasksCount}</p>
              <p className="text-xs text-red-600 mt-1">Needs attention</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
