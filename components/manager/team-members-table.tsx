import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Eye } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  status: string;
  avatar: string;
  performanceScore: number;
  tasksCompleted: number;
  tasksOverdue: number;
  leaveBalance: number;
}

interface TeamMembersTableProps {
  members: TeamMember[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "On Leave":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "Inactive":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

const getPerformanceColor = (score: number) => {
  if (score >= 90) return "text-green-600 font-semibold";
  if (score >= 80) return "text-blue-600 font-semibold";
  if (score >= 70) return "text-yellow-600 font-semibold";
  return "text-red-600 font-semibold";
};

export function TeamMembersTable({ members }: TeamMembersTableProps) {
  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-12">Avatar</TableHead>
            <TableHead>Name & Role</TableHead>
            <TableHead>Department</TableHead>
            <TableHead className="text-right">Performance</TableHead>
            <TableHead className="text-center">Tasks</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Leave Balance</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id} className="hover:bg-muted/50 transition-colors">
              <TableCell>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-semibold text-sm">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{member.department}</Badge>
              </TableCell>
              <TableCell>
                <div className="text-right">
                  <p className={getPerformanceColor(member.performanceScore)}>
                    {member.performanceScore}%
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-center text-sm">
                  <p className="font-semibold text-green-600">{member.tasksCompleted}</p>
                  {member.tasksOverdue > 0 && (
                    <p className="text-xs text-red-600">{member.tasksOverdue} overdue</p>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-center">
                <Badge className={getStatusColor(member.status)}>
                  {member.status}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="secondary">{member.leaveBalance} days</Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>Assign Task</DropdownMenuItem>
                    <DropdownMenuItem>Send Message</DropdownMenuItem>
                    <DropdownMenuItem>View Performance</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Remove</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
