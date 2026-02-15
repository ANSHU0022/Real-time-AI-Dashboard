import { useState, useMemo } from 'react';
import { SaleRecord } from '@/types/sales';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  Download,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DataTableProps {
  data: SaleRecord[];
}

type SortKey = keyof SaleRecord;
type SortOrder = 'asc' | 'desc';

const COLUMNS: { key: SortKey; label: string; format?: 'currency' | 'percent' | 'number' }[] = [
  { key: 'sale_id', label: 'Sale ID' },
  { key: 'date', label: 'Date' },
  { key: 'customer_id', label: 'Customer ID' },
  { key: 'customer_region', label: 'Customer Region' },
  { key: 'product_id', label: 'Product ID' },
  { key: 'product_category', label: 'Product Category' },
  { key: 'unit_price', label: 'Unit Price', format: 'currency' },
  { key: 'quantity', label: 'Quantity', format: 'number' },
  { key: 'discount_percent', label: 'Discount Percent', format: 'percent' },
  { key: 'sales_agent', label: 'Sales Agent' },
  { key: 'payment_method', label: 'Payment Method' },
  { key: 'subscription_type', label: 'Subscription Type' },
  { key: 'renewal_status', label: 'Renewal Status' },
  { key: 'total_revenue', label: 'Total Revenue', format: 'currency' },
  { key: 'gross_sales', label: 'Gross Sales', format: 'currency' },
  { key: 'discount_amount', label: 'Discount Amount', format: 'currency' },
  { key: 'discount_pct_row', label: 'Discount % (Row)', format: 'percent' },
  { key: 'revenue_per_unit', label: 'Revenue Per Unit', format: 'currency' },
];

export function DataTable({ data }: DataTableProps) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [page, setPage] = useState(1);
  const pageSize = 15;

  const filteredData = useMemo(() => {
    let result = data;
    
    if (search) {
      const query = search.toLowerCase();
      result = result.filter(record =>
        Object.values(record).some(val =>
          String(val).toLowerCase().includes(query)
        )
      );
    }

    result = [...result].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      const multiplier = sortOrder === 'desc' ? -1 : 1;
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return (aVal - bVal) * multiplier;
      }
      return String(aVal).localeCompare(String(bVal)) * multiplier;
    });

    return result;
  }, [data, search, sortKey, sortOrder]);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const formatValue = (value: any, format?: 'currency' | 'percent' | 'number') => {
    if (value === null || value === undefined) return '-';
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }).format(value);
      case 'percent':
        return `${value}%`;
      case 'number':
        return new Intl.NumberFormat('en-US').format(value);
      default:
        return String(value);
    }
  };

  const exportCSV = () => {
    const headers = COLUMNS.map(c => c.label).join(',');
    const rows = filteredData.map(record =>
      COLUMNS.map(col => {
        const val = record[col.key];
        return typeof val === 'string' && val.includes(',') ? `"${val}"` : val;
      }).join(',')
    );
    
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-data-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="chart-container">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Sales Data</h3>
          <p className="text-sm text-muted-foreground">
            {filteredData.length.toLocaleString()} records
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-10 bg-background/50"
            />
          </div>
          <Button variant="outline" size="icon" onClick={exportCSV} title="Export CSV">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto border border-border/50 rounded-lg">
        <table className="data-table">
          <thead>
            <tr>
              {COLUMNS.map(col => (
                <th
                  key={col.key}
                  className="cursor-pointer hover:bg-muted/70 transition-colors whitespace-nowrap"
                  onClick={() => handleSort(col.key)}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {sortKey === col.key && (
                      sortOrder === 'desc' ? 
                        <ChevronDown className="w-4 h-4 text-primary" /> : 
                        <ChevronUp className="w-4 h-4 text-primary" />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((record, index) => (
              <tr key={`${record.sale_id}-${index}`}>
                {COLUMNS.map(col => (
                  <td 
                    key={col.key} 
                    className={cn(
                      'whitespace-nowrap',
                      col.format === 'currency' && 'text-right font-medium',
                      col.key === 'total_revenue' && 'text-green-600 font-semibold'
                    )}
                  >
                    {formatValue(record[col.key], col.format)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-muted-foreground">
          Showing {((page - 1) * pageSize) + 1} - {Math.min(page * pageSize, filteredData.length)} of {filteredData.length}
        </p>
        
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(1)}
            disabled={page === 1}
            className="h-8 w-8"
          >
            <ChevronsLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="h-8 w-8"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <span className="px-3 text-sm font-medium">
            {page} / {totalPages}
          </span>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="h-8 w-8"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
            className="h-8 w-8"
          >
            <ChevronsRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
