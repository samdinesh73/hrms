"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TeamMember {
  id: string;
  name: string;
  role: string;
  performanceScore: number;
  tasksCompleted: number;
  tasksOverdue: number;
}

interface PerformanceChartProps {
  members: TeamMember[];
}

export function PerformanceChart({ members }: PerformanceChartProps) {
  const performanceData = members.map(m => ({
    name: m.name.split(" ")[0],
    score: m.performanceScore,
    completed: m.tasksCompleted,
    overdue: m.tasksOverdue,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Team Performance Scores</CardTitle>
          <CardDescription>Individual performance ratings</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Score']}
                contentStyle={{ backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb' }}
              />
              <Bar dataKey="score" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task Productivity</CardTitle>
          <CardDescription>Completed vs Overdue tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip 
                contentStyle={{ backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb' }}
              />
              <Legend />
              <Bar dataKey="completed" fill="#10b981" radius={[8, 8, 0, 0]} name="Completed" />
              <Bar dataKey="overdue" fill="#ef4444" radius={[8, 8, 0, 0]} name="Overdue" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Performance Distribution</CardTitle>
          <CardDescription>Relationship between performance score and task completion</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                dataKey="score" 
                name="Performance Score" 
                label={{ value: 'Performance Score (%)', position: 'bottom', offset: 10 }}
              />
              <YAxis 
                type="number" 
                dataKey="completed" 
                name="Tasks Completed"
                label={{ value: 'Tasks Completed', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                formatter={(value) => value}
                contentStyle={{ backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb' }}
              />
              <Scatter 
                data={performanceData} 
                fill="#3b82f6"
                name="Team Members"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
