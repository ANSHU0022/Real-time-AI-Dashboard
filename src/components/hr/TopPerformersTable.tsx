import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { HRRecord } from '@/types/hr';
import { Trophy } from 'lucide-react';

interface TopPerformersTableProps {
  data: HRRecord[];
}

export function TopPerformersTable({ data }: TopPerformersTableProps) {
  const topPerformers = useMemo(() => {
    return [...data]
      .sort((a, b) => {
        // Primary: performance_rating DESC
        if (b.performance_rating !== a.performance_rating) {
          return b.performance_rating - a.performance_rating;
        }
        // Secondary: attendance_rate_percent DESC
        if (b.attendance_rate_percent !== a.attendance_rate_percent) {
          return b.attendance_rate_percent - a.attendance_rate_percent;
        }
        // Tertiary: total_days_not_working ASC
        return a.total_days_not_working - b.total_days_not_working;
      })
      .slice(0, 10);
  }, [data]);

  return (
    <Card className="bg-card border-border mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Top Performing Employees
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Employee ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Job Title</TableHead>
                <TableHead className="text-center">Rating</TableHead>
                <TableHead className="text-center">Attendance %</TableHead>
                <TableHead className="text-center">Days Not Working</TableHead>
                <TableHead className="text-right">Net Salary</TableHead>
                <TableHead className="text-center">Promotion</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topPerformers.map((employee, index) => (
                <TableRow key={employee.employee_id}>
                  <TableCell className="font-medium">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                  </TableCell>
                  <TableCell className="font-mono text-sm">{employee.employee_id}</TableCell>
                  <TableCell className="font-medium">{employee.employee_name}</TableCell>
                  <TableCell>{employee.department_name}</TableCell>
                  <TableCell>{employee.job_title}</TableCell>
                  <TableCell className="text-center">
                    <span className="font-semibold text-primary">{employee.performance_rating.toFixed(1)}</span>
                  </TableCell>
                  <TableCell className="text-center">{employee.attendance_rate_percent.toFixed(1)}%</TableCell>
                  <TableCell className="text-center">{employee.total_days_not_working}</TableCell>
                  <TableCell className="text-right font-medium">${employee.net_salary.toLocaleString()}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={employee.promotion_eligibility === 'Yes' ? 'default' : 'secondary'}>
                      {employee.promotion_eligibility}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
