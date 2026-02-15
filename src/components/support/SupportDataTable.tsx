import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Download, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { SupportRecord } from '@/types/support';

interface SupportDataTableProps {
  data: SupportRecord[];
}

const COLUMNS = [
  { key: 'ticket_id', label: 'Ticket ID' },
  { key: 'ticket_created_at', label: 'Created At', format: 'date' },
  { key: 'ticket_status', label: 'Status' },
  { key: 'priority', label: 'Priority' },
  { key: 'issue_category', label: 'Category' },
  { key: 'support_channel', label: 'Channel' },
  { key: 'customer_name', label: 'Customer' },
  { key: 'customer_region', label: 'Region' },
  { key: 'agent_name', label: 'Agent' },
  { key: 'agent_team', label: 'Team' },
  { key: 'first_response_time_minutes', label: 'First Response', format: 'minutes' },
  { key: 'resolution_time_minutes', label: 'Resolution Time', format: 'minutes' },
  { key: 'sla_breached_flag', label: 'SLA Breached' },
  { key: 'escalation_flag', label: 'Escalated' },
  { key: 'ticket_reopen_count', label: 'Reopens' },
  { key: 'customer_satisfaction_score', label: 'CSAT' },
];

export function SupportDataTable({ data }: SupportDataTableProps) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string>('ticket_created_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const pageSize = 15;

  const filteredData = useMemo(() => {
    let result = [...data];

    if (search) {
      const query = search.toLowerCase();
      result = result.filter(r =>
        r.ticket_id.toLowerCase().includes(query) ||
        r.customer_name.toLowerCase().includes(query) ||
        r.agent_name.toLowerCase().includes(query) ||
        r.issue_category.toLowerCase().includes(query)
      );
    }

    result.sort((a, b) => {
      const aVal = a[sortKey as keyof SupportRecord];
      const bVal = b[sortKey as keyof SupportRecord];
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      const aStr = String(aVal || '');
      const bStr = String(bVal || '');
      return sortDir === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
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
    
    switch (format) {
      case 'date':
        return new Date(value).toLocaleDateString();
      case 'minutes':
        return `${value} min`;
      default:
        return String(value);
    }
  };

  const exportCSV = () => {
    const headers = COLUMNS.map(c => c.label).join(',');
    const rows = filteredData.map(row =>
      COLUMNS.map(c => {
        const val = row[c.key as keyof SupportRecord];
        return `"${String(val || '').replace(/"/g, '""')}"`;
      }).join(',')
    );
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'support_data.csv';
    a.click();
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      'Open': 'bg-blue-100 text-blue-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Resolved': 'bg-green-100 text-green-800',
      'Closed': 'bg-gray-100 text-gray-800',
    };
    return <Badge className={colors[status] || 'bg-gray-100'}>{status}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      'Low': 'bg-gray-100 text-gray-800',
      'Medium': 'bg-blue-100 text-blue-800',
      'High': 'bg-orange-100 text-orange-800',
      'Critical': 'bg-red-100 text-red-800',
    };
    return <Badge className={colors[priority] || 'bg-gray-100'}>{priority}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle className="text-lg">Support Tickets Data</CardTitle>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search tickets..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-9 w-64"
              />
            </div>
            <Button variant="outline" size="sm" onClick={exportCSV}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
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
              {paginatedData.map((row) => (
                <TableRow key={row.ticket_id}>
                  {COLUMNS.map(col => (
                    <TableCell key={col.key} className="whitespace-nowrap">
                      {col.key === 'ticket_status' ? getStatusBadge(row.ticket_status) :
                       col.key === 'priority' ? getPriorityBadge(row.priority) :
                       col.key === 'sla_breached_flag' ? (
                         <Badge className={row.sla_breached_flag === 'Yes' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                           {row.sla_breached_flag}
                         </Badge>
                       ) :
                       col.key === 'customer_satisfaction_score' ? (
                         <span className="flex items-center gap-1">
                           {row.customer_satisfaction_score}
                           <span className="text-yellow-500">★</span>
                         </span>
                       ) :
                       formatValue(row[col.key as keyof SupportRecord], col.format)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-muted-foreground">
            Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, filteredData.length)} of {filteredData.length}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm">Page {page} of {totalPages}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
