import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Download, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { HRRecord } from '@/types/hr';

interface HRDataTableProps {
  data: HRRecord[];
}

const COLUMNS = [
  { key: 'employee_id', label: 'Employee ID', width: 100 },
  { key: 'employee_name', label: 'Name', width: 150 },
  { key: 'email', label: 'Email', width: 200 },
  { key: 'gender', label: 'Gender', width: 80 },
  { key: 'age', label: 'Age', width: 60, type: 'number' },
  { key: 'department_name', label: 'Department', width: 120 },
  { key: 'job_title', label: 'Job Title', width: 150 },
  { key: 'job_level', label: 'Level', width: 80 },
  { key: 'manager_name', label: 'Manager', width: 130 },
  { key: 'office_location', label: 'Location', width: 120 },
  { key: 'employment_type', label: 'Type', width: 100 },
  { key: 'employment_status', label: 'Status', width: 100 },
  { key: 'hire_date', label: 'Hire Date', width: 100 },
  { key: 'exit_date', label: 'Exit Date', width: 100 },
  { key: 'tenure_years', label: 'Tenure (Yrs)', width: 90, type: 'number' },
  { key: 'total_working_days', label: 'Work Days', width: 90, type: 'number' },
  { key: 'days_present', label: 'Present', width: 80, type: 'number' },
  { key: 'days_absent', label: 'Absent', width: 80, type: 'number' },
  { key: 'leave_days', label: 'Leave', width: 70, type: 'number' },
  { key: 'attendance_rate_percent', label: 'Attendance %', width: 100, type: 'percent' },
  { key: 'total_days_not_working', label: 'Not Working', width: 100, type: 'number' },
  { key: 'performance_rating', label: 'Rating', width: 70, type: 'number' },
  { key: 'last_appraisal_date', label: 'Appraisal', width: 100 },
  { key: 'performance_category', label: 'Performance', width: 100 },
  { key: 'promotion_eligibility', label: 'Promo Eligible', width: 110 },
  { key: 'base_salary', label: 'Base Salary', width: 110, type: 'currency' },
  { key: 'bonus', label: 'Bonus', width: 90, type: 'currency' },
  { key: 'deductions', label: 'Deductions', width: 100, type: 'currency' },
  { key: 'net_salary', label: 'Net Salary', width: 110, type: 'currency' },
  { key: 'job_satisfaction_score', label: 'Satisfaction', width: 100, type: 'number' },
  { key: 'attrition_risk_level', label: 'Risk Level', width: 100 },
];

const ROWS_PER_PAGE = 25;

export function HRDataTable({ data }: HRDataTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(row =>
        Object.values(row).some(val =>
          String(val).toLowerCase().includes(query)
        )
      );
    }

    if (sortConfig) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key as keyof HRRecord];
        const bVal = b[sortConfig.key as keyof HRRecord];
        
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
        }
        
        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();
        return sortConfig.direction === 'asc' 
          ? aStr.localeCompare(bStr) 
          : bStr.localeCompare(aStr);
      });
    }

    return result;
  }, [data, searchQuery, sortConfig]);

  const totalPages = Math.ceil(filteredAndSortedData.length / ROWS_PER_PAGE);
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  const handleSort = (key: string) => {
    setSortConfig(prev => {
      if (prev?.key === key) {
        return prev.direction === 'asc' ? { key, direction: 'desc' } : null;
      }
      return { key, direction: 'asc' };
    });
  };

  const formatValue = (value: any, type?: string) => {
    if (value === null || value === undefined || value === '') return '-';
    
    switch (type) {
      case 'currency':
        return `$${Number(value).toLocaleString()}`;
      case 'percent':
        return `${Number(value).toFixed(1)}%`;
      case 'number':
        return Number(value).toLocaleString();
      default:
        return String(value);
    }
  };

  const exportCSV = () => {
    const headers = COLUMNS.map(c => c.label).join(',');
    const rows = filteredAndSortedData.map(row =>
      COLUMNS.map(col => {
        const val = row[col.key as keyof HRRecord];
        return typeof val === 'string' && val.includes(',') ? `"${val}"` : val;
      }).join(',')
    );
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hr_data.csv';
    a.click();
  };

  const SortHeader = ({ column }: { column: typeof COLUMNS[0] }) => (
    <TableHead
      className="cursor-pointer hover:bg-muted/50 transition-colors whitespace-nowrap"
      onClick={() => handleSort(column.key)}
      style={{ minWidth: column.width }}
    >
      <div className="flex items-center gap-1">
        <span>{column.label}</span>
        {sortConfig?.key === column.key && (
          sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
        )}
      </div>
    </TableHead>
  );

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-lg">Complete HR Dataset</CardTitle>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search records..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="sm" onClick={exportCSV}>
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                {COLUMNS.map(col => (
                  <SortHeader key={col.key} column={col} />
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((row, idx) => (
                <TableRow key={row.employee_id || idx} className="hover:bg-muted/30">
                  {COLUMNS.map(col => (
                    <TableCell key={col.key} className="whitespace-nowrap">
                      {col.key === 'employment_status' ? (
                        <Badge variant={row.employment_status === 'Active' ? 'default' : 'destructive'}>
                          {row.employment_status}
                        </Badge>
                      ) : col.key === 'performance_category' ? (
                        <Badge variant={
                          row.performance_category === 'High' ? 'default' :
                          row.performance_category === 'Medium' ? 'secondary' : 'outline'
                        }>
                          {row.performance_category}
                        </Badge>
                      ) : col.key === 'attrition_risk_level' ? (
                        <Badge variant={
                          row.attrition_risk_level === 'High' ? 'destructive' :
                          row.attrition_risk_level === 'Medium' ? 'secondary' : 'outline'
                        }>
                          {row.attrition_risk_level}
                        </Badge>
                      ) : (
                        formatValue(row[col.key as keyof HRRecord], col.type)
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * ROWS_PER_PAGE) + 1} to {Math.min(currentPage * ROWS_PER_PAGE, filteredAndSortedData.length)} of {filteredAndSortedData.length} records
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
