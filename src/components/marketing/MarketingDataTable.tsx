import { useState, useMemo } from 'react';
import { MarketingRecord } from '@/types/marketing';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronUp, ChevronDown, Search, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DataTableProps {
  data: MarketingRecord[];
}

type SortField = keyof MarketingRecord;
type SortDirection = 'asc' | 'desc';

export function MarketingDataTable({ data }: DataTableProps) {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('campaign_start_date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [page, setPage] = useState(0);
  const pageSize = 15;

  const filteredData = useMemo(() => {
    let result = [...data];
    
    if (search) {
      const query = search.toLowerCase();
      result = result.filter(r =>
        r.campaign_id.toLowerCase().includes(query) ||
        r.campaign_name.toLowerCase().includes(query) ||
        r.marketing_manager.toLowerCase().includes(query) ||
        r.agency_name.toLowerCase().includes(query) ||
        r.marketing_channel.toLowerCase().includes(query)
      );
    }

    result.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const modifier = sortDirection === 'asc' ? 1 : -1;
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return (aVal - bVal) * modifier;
      }
      return String(aVal).localeCompare(String(bVal)) * modifier;
    });

    return result;
  }, [data, search, sortField, sortDirection]);

  const paginatedData = filteredData.slice(page * pageSize, (page + 1) * pageSize);
  const totalPages = Math.ceil(filteredData.length / pageSize);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const exportCSV = () => {
    const headers = Object.keys(data[0] || {}).join(',');
    const rows = filteredData.map(r => Object.values(r).join(',')).join('\n');
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'marketing_data.csv';
    a.click();
  };

  const SortHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead
      className="cursor-pointer hover:bg-muted/50 transition-colors text-xs"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortField === field && (
          sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
        )}
      </div>
    </TableHead>
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-success/10 text-success';
      case 'completed': return 'bg-primary/10 text-primary';
      case 'paused': return 'bg-warning/10 text-warning';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="glass-card rounded-xl p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Marketing Data</h3>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="pl-9 h-9 w-64 bg-card/50"
            />
          </div>
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <SortHeader field="campaign_id">Campaign ID</SortHeader>
              <SortHeader field="campaign_name">Campaign Name</SortHeader>
              <SortHeader field="campaign_type">Campaign Type</SortHeader>
              <SortHeader field="campaign_start_date">Start Date</SortHeader>
              <SortHeader field="campaign_end_date">End Date</SortHeader>
              <SortHeader field="campaign_status">Status</SortHeader>
              <SortHeader field="marketing_channel">Marketing Channel</SortHeader>
              <SortHeader field="platform_name">Platform Name</SortHeader>
              <SortHeader field="ad_format">Ad Format</SortHeader>
              <SortHeader field="target_region">Target Region</SortHeader>
              <SortHeader field="target_city">Target City</SortHeader>
              <SortHeader field="target_audience">Target Audience</SortHeader>
              <SortHeader field="impressions">Impressions</SortHeader>
              <SortHeader field="clicks">Clicks</SortHeader>
              <SortHeader field="leads_generated">Leads Generated</SortHeader>
              <SortHeader field="conversions">Conversions</SortHeader>
              <SortHeader field="cost_per_click">Cost Per Click</SortHeader>
              <SortHeader field="cost_per_lead">Cost Per Lead</SortHeader>
              <SortHeader field="total_campaign_cost">Total Campaign Cost</SortHeader>
              <SortHeader field="revenue_generated">Revenue Generated</SortHeader>
              <SortHeader field="roi_percent">ROI %</SortHeader>
              <SortHeader field="conversion_rate">Conversion Rate</SortHeader>
              <SortHeader field="click_through_rate">CTR</SortHeader>
              <SortHeader field="landing_page_url">Landing Page URL</SortHeader>
              <SortHeader field="bounce_rate">Bounce Rate</SortHeader>
              <SortHeader field="avg_session_duration">Avg Session Duration</SortHeader>
              <SortHeader field="marketing_manager">Marketing Manager</SortHeader>
              <SortHeader field="agency_name">Agency Name</SortHeader>
              <SortHeader field="created_at">Created At</SortHeader>
              <SortHeader field="updated_at">Updated At</SortHeader>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((record, idx) => (
              <TableRow key={`${record.campaign_id}-${idx}`} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-mono text-xs whitespace-nowrap">{record.campaign_id}</TableCell>
                <TableCell className="max-w-[200px] truncate text-sm">{record.campaign_name}</TableCell>
                <TableCell className="text-sm whitespace-nowrap">{record.campaign_type}</TableCell>
                <TableCell className="text-sm whitespace-nowrap">{record.campaign_start_date}</TableCell>
                <TableCell className="text-sm whitespace-nowrap">{record.campaign_end_date}</TableCell>
                <TableCell>
                  <Badge className={cn('text-xs', getStatusColor(record.campaign_status))}>
                    {record.campaign_status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm whitespace-nowrap">{record.marketing_channel}</TableCell>
                <TableCell className="text-sm whitespace-nowrap">{record.platform_name}</TableCell>
                <TableCell className="text-sm whitespace-nowrap">{record.ad_format}</TableCell>
                <TableCell className="text-sm whitespace-nowrap">{record.target_region}</TableCell>
                <TableCell className="text-sm whitespace-nowrap">{record.target_city}</TableCell>
                <TableCell className="text-sm whitespace-nowrap">{record.target_audience}</TableCell>
                <TableCell className="text-right text-sm">{record.impressions.toLocaleString()}</TableCell>
                <TableCell className="text-right text-sm">{record.clicks.toLocaleString()}</TableCell>
                <TableCell className="text-right text-sm">{record.leads_generated.toLocaleString()}</TableCell>
                <TableCell className="text-right text-sm">{record.conversions.toLocaleString()}</TableCell>
                <TableCell className="text-right text-sm">${record.cost_per_click.toFixed(2)}</TableCell>
                <TableCell className="text-right text-sm">${record.cost_per_lead.toFixed(2)}</TableCell>
                <TableCell className="text-right font-medium text-sm">${record.total_campaign_cost.toLocaleString()}</TableCell>
                <TableCell className="text-right font-medium text-success text-sm">${record.revenue_generated.toLocaleString()}</TableCell>
                <TableCell className={cn('text-right font-medium text-sm', record.roi_percent >= 0 ? 'text-success' : 'text-destructive')}>
                  {record.roi_percent.toFixed(1)}%
                </TableCell>
                <TableCell className="text-right text-sm">{record.conversion_rate.toFixed(2)}%</TableCell>
                <TableCell className="text-right text-sm">{record.click_through_rate.toFixed(2)}%</TableCell>
                <TableCell className="text-sm max-w-[150px] truncate">{record.landing_page_url}</TableCell>
                <TableCell className="text-right text-sm">{record.bounce_rate.toFixed(1)}%</TableCell>
                <TableCell className="text-right text-sm">{record.avg_session_duration.toFixed(0)}s</TableCell>
                <TableCell className="text-sm whitespace-nowrap">{record.marketing_manager}</TableCell>
                <TableCell className="text-sm whitespace-nowrap">{record.agency_name}</TableCell>
                <TableCell className="text-sm whitespace-nowrap">{record.created_at}</TableCell>
                <TableCell className="text-sm whitespace-nowrap">{record.updated_at}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
        <span className="text-sm text-muted-foreground">
          Showing {page * pageSize + 1}-{Math.min((page + 1) * pageSize, filteredData.length)} of {filteredData.length}
        </span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm px-3">Page {page + 1} of {totalPages}</span>
          <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
