import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Clock, AlertCircle, Plus } from "lucide-react"

interface Task {
  id: string;
  title: string;
  assignedTo: string;
  dueDate: string;
  status: "Completed" | "In Progress" | "Overdue";
  priority: "High" | "Medium" | "Low";
}

const tasks: Task[] = [
  {
    id: "1",
    title: "Complete API Integration",
    assignedTo: "John Doe",
    dueDate: "Jan 10, 2026",
    status: "In Progress",
    priority: "High",
  },
  {
    id: "2",
    title: "Update User Documentation",
    assignedTo: "Jane Smith",
    dueDate: "Jan 8, 2026",
    status: "Completed",
    priority: "Medium",
  },
  {
    id: "3",
    title: "Database Optimization",
    assignedTo: "Mike Johnson",
    dueDate: "Jan 5, 2026",
    status: "Overdue",
    priority: "High",
  },
  {
    id: "4",
    title: "Code Review",
    assignedTo: "Sarah Williams",
    dueDate: "Jan 12, 2026",
    status: "In Progress",
    priority: "Medium",
  },
  {
    id: "5",
    title: "Test Suite Development",
    assignedTo: "Alex Turner",
    dueDate: "Jan 15, 2026",
    status: "In Progress",
    priority: "Low",
  },
  {
    id: "6",
    title: "Security Audit",
    assignedTo: "Emma Davis",
    dueDate: "Jan 20, 2026",
    status: "Completed",
    priority: "High",
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Completed":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "In Progress":
      return <Clock className="h-4 w-4 text-blue-600" />;
    case "Overdue":
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    default:
      return null;
  }
};

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "In Progress":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "Overdue":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    default:
      return "";
  }
};

const getPriorityBadgeClass = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    case "Medium":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "Low":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    default:
      return "";
  }
};

export function TasksOverview() {
  const completedTasks = tasks.filter(t => t.status === "Completed");
  const inProgressTasks = tasks.filter(t => t.status === "In Progress");
  const overdueTasks = tasks.filter(t => t.status === "Overdue");

  const TaskCard = ({ task }: { task: Task }) => (
    <div className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex gap-3 flex-1">
        <div className="mt-1">{getStatusIcon(task.status)}</div>
        <div className="flex-1">
          <p className="font-semibold">{task.title}</p>
          <p className="text-sm text-muted-foreground mt-1">Assigned to: {task.assignedTo}</p>
          <p className="text-xs text-muted-foreground">Due: {task.dueDate}</p>
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <Badge className={getPriorityBadgeClass(task.priority)}>
          {task.priority}
        </Badge>
        <Badge className={getStatusBadgeClass(task.status)}>
          {task.status}
        </Badge>
      </div>
    </div>
  );

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="all">All ({tasks.length})</TabsTrigger>
        <TabsTrigger value="inProgress">In Progress ({inProgressTasks.length})</TabsTrigger>
        <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
        <TabsTrigger value="overdue">Overdue ({overdueTasks.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="space-y-3 mt-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold">All Tasks</h3>
            <p className="text-sm text-muted-foreground">View and manage all team tasks</p>
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
        <div className="space-y-2">
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="inProgress" className="space-y-3 mt-4">
        <div>
          <h3 className="text-lg font-semibold mb-4">In Progress Tasks</h3>
          <div className="space-y-2">
            {inProgressTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="completed" className="space-y-3 mt-4">
        <div>
          <h3 className="text-lg font-semibold mb-4">Completed Tasks</h3>
          <div className="space-y-2">
            {completedTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="overdue" className="space-y-3 mt-4">
        <div>
          <h3 className="text-lg font-semibold mb-4">Overdue Tasks</h3>
          <div className="space-y-2">
            {overdueTasks.length > 0 ? (
              overdueTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No overdue tasks - Great job!
              </div>
            )}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
