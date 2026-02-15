import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, Download, ArrowUpDown } from 'lucide-react';
import { FinanceRecord } from '@/types/finance';

interface FinanceDataTableProps {
  data: FinanceRecord[];
}

const COLUMNS = [
  { key: 'finance_id', label: 'Finance ID' },
  { key: 'transaction_date', label: 'Transaction Date' },
  { key: 'month', label: 'Month' },
  { key: 'quarter', label: 'Quarter' },
  { key: 'financial_year', label: 'Financial Year' },
  { key: 'department_name', label: 'Department' },
  { key: 'cost_center', label: 'Cost Center' },
  { key: 'project_name', label: 'Project' },
  { key: 'revenue_type', label: 'Revenue Type' },
  { key: 'customer_id', label: 'Customer ID' },
  { key: 'customer_region', label: 'Region' },
  { key: 'gross_revenue', label: 'Gross Revenue', format: 'currency' },
  { key: 'discount_amount', label: 'Discount', format: 'currency' },
  { key: 'net_revenue', label: 'Net Revenue', format: 'currency' },
  { key: 'expense_type', label: 'Expense Type' },
  { key: 'expense_category', label: 'Expense Category' },
  { key: 'vendor_name', label: 'Vendor' },
  { key: 'expense_amount', label: 'Expense Amount', format: 'currency' },
  { key: 'gst_rate', label: 'GST Rate', format: 'percent' },
  { key: 'gst_amount', label: 'GST Amount', format: 'currency' },
  { key: 'taxable_amount', label: 'Taxable Amount', format: 'currency' },
  { key: 'payment_mode', label: 'Payment Mode' },
  { key: 'payment_status', label: 'Payment Status' },
  { key: 'cash_inflow', label: 'Cash Inflow', format: 'currency' },
  { key: 'cash_outflow', label: 'Cash Outflow', format: 'currency' },
  { key: 'net_cash_flow', label: 'Net Cash Flow', format: 'currency' },
  { key: 'total_cost', label: 'Total Cost', format: 'currency' },
  { key: 'gross_profit', label: 'Gross Profit', format: 'currency' },
  { key: 'profit_margin_percent', label: 'Profit Margin %', format: 'percent' },
  { key: 'budget_allocated', label: 'Budget Allocated', format: 'currency' },
  { key: 'budget_used', label: 'Budget Used', format: 'currency' },
  { key: 'budget_variance', label: 'Budget Variance', format: 'currency' },
  { key: 'forecasted_revenue', label: 'Forecasted Revenue', format: 'currency' },
  { key: 'approval_status', label: 'Approval Status' },
  { key: 'risk_flag', label: 'Risk Flag' },
  { key: 'created_at', label: 'Created At' },
  { key: 'updated_at', label: 'Updated At' },
];

export function FinanceDataTable({ data }: FinanceDataTableProps) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<string>('transaction_date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const pageSize = 20;

  const filteredData = useMemo(() => {
    let result = data;
    
    if (search) {
      const query = search.toLowerCase();
      result = result.filter(row =>
        Object.values(row).some(val => String(val).toLowerCase().includes(query))
      );
    }
    
    result = [...result].sort((a, b) => {
      const aVal = a[sortKey as keyof FinanceRecord];
      const bVal = b[sortKey as keyof FinanceRecord];
      const cmp = typeof aVal === 'number' ? aVal - (bVal as number) : String(aVal).localeCompare(String(bVal));
      return sortDir === 'asc' ? cmp : -cmp;
    });
    
    return result;
  }, [data, search, sortKey, sortDir]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const formatValue = (value: any, format?: string) => {
    if (value === null || value === undefined) return '-';
    if (format === 'currency') return `$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (format === 'percent') return `${Number(value).toFixed(2)}%`;
    return String(value);
  };

  const exportToCSV = () => {
    const headers = COLUMNS.map(c => c.label).join(',');
    const rows = filteredData.map(row =>
      COLUMNS.map(col => {
        const val = row[col.key as keyof FinanceRecord];
        return typeof val === 'string' && val.includes(',') ? `"${val}"` : val;
      }).join(',')
    );
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'finance_data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle className="text-lg font-semibold">Finance Data ({filteredData.length.toLocaleString()} records)</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-9 w-64"
              />
            </div>
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {COLUMNS.map(col => (
                  <TableHead
                    key={col.key}
                    className="cursor-pointer hover:bg-muted/50 whitespace-nowrap"
                    onClick={() => handleSort(col.key)}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((row, idx) => (
                <TableRow key={row.finance_id || idx} className="hover:bg-muted/30">
                  {COLUMNS.map(col => (
                    <TableCell key={col.key} className="whitespace-nowrap text-sm">
                      {formatValue(row[col.key as keyof FinanceRecord], col.format)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
          <span className="text-sm text-muted-foreground">
            Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, filteredData.length)} of {filteredData.length}
          </span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={() => setPage(1)} disabled={page === 1}>
              <ChevronsLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setPage(p => p - 1)} disabled={page === 1}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="px-3 text-sm">Page {page} of {totalPages}</span>
            <Button variant="outline" size="icon" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setPage(totalPages)} disabled={page === totalPages}>
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
