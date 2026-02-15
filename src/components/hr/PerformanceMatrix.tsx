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
import { HRRecord } from '@/types/hr';
import { LayoutGrid } from 'lucide-react';

interface PerformanceMatrixProps {
  data: HRRecord[];
}

export function PerformanceMatrix({ data }: PerformanceMatrixProps) {
  const matrixData = useMemo(() => {
    const departments = [...new Set(data.map(r => r.department_name))].filter(Boolean).sort();
    
    const matrix = departments.map(dept => {
      const deptData = data.filter(r => r.department_name === dept);
      const low = deptData.filter(r => r.performance_category === 'Low').length;
      const medium = deptData.filter(r => r.performance_category === 'Medium').length;
      const high = deptData.filter(r => r.performance_category === 'High').length;
      const total = low + medium + high;
      
      return {
        department: dept,
        low,
        medium,
        high,
        total,
      };
    });
    
    // Calculate totals
    const totals = {
      department: 'Total',
      low: matrix.reduce((sum, r) => sum + r.low, 0),
      medium: matrix.reduce((sum, r) => sum + r.medium, 0),
      high: matrix.reduce((sum, r) => sum + r.high, 0),
      total: matrix.reduce((sum, r) => sum + r.total, 0),
    };
    
    return { matrix, totals };
  }, [data]);

  return (
    <Card className="bg-card border-border mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <LayoutGrid className="w-5 h-5 text-primary" />
          Performance by Department Matrix
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Department</TableHead>
                <TableHead className="text-center bg-red-50 dark:bg-red-950/20">
                  <span className="text-red-600">Low</span>
                </TableHead>
                <TableHead className="text-center bg-yellow-50 dark:bg-yellow-950/20">
                  <span className="text-yellow-600">Medium</span>
                </TableHead>
                <TableHead className="text-center bg-green-50 dark:bg-green-950/20">
                  <span className="text-green-600">High</span>
                </TableHead>
                <TableHead className="text-center font-semibold bg-muted">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matrixData.matrix.map((row) => (
                <TableRow key={row.department}>
                  <TableCell className="font-medium">{row.department}</TableCell>
                  <TableCell className="text-center bg-red-50/50 dark:bg-red-950/10">
                    <span className={row.low > 0 ? 'text-red-600 font-medium' : 'text-muted-foreground'}>
                      {row.low}
                    </span>
                  </TableCell>
                  <TableCell className="text-center bg-yellow-50/50 dark:bg-yellow-950/10">
                    <span className={row.medium > 0 ? 'text-yellow-600 font-medium' : 'text-muted-foreground'}>
                      {row.medium}
                    </span>
                  </TableCell>
                  <TableCell className="text-center bg-green-50/50 dark:bg-green-950/10">
                    <span className={row.high > 0 ? 'text-green-600 font-medium' : 'text-muted-foreground'}>
                      {row.high}
                    </span>
                  </TableCell>
                  <TableCell className="text-center font-semibold bg-muted/50">{row.total}</TableCell>
                </TableRow>
              ))}
              <TableRow className="border-t-2 font-semibold">
                <TableCell className="font-bold">{matrixData.totals.department}</TableCell>
                <TableCell className="text-center bg-red-100 dark:bg-red-950/30">
                  <span className="text-red-700">{matrixData.totals.low}</span>
                </TableCell>
                <TableCell className="text-center bg-yellow-100 dark:bg-yellow-950/30">
                  <span className="text-yellow-700">{matrixData.totals.medium}</span>
                </TableCell>
                <TableCell className="text-center bg-green-100 dark:bg-green-950/30">
                  <span className="text-green-700">{matrixData.totals.high}</span>
                </TableCell>
                <TableCell className="text-center font-bold bg-muted">{matrixData.totals.total}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
