import { MarketingFilters } from '@/types/marketing';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { CalendarIcon, Search, X, RefreshCw, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  filters: MarketingFilters;
  setFilters: (filters: MarketingFilters) => void;
  options: {
    campaignTypes: string[];
    campaignStatuses: string[];
    marketingChannels: string[];
    platformNames: string[];
    targetRegions: string[];
    targetCities: string[];
    targetAudiences: string[];
    marketingManagers: string[];
    agencyNames: string[];
  };
  onRefresh: () => void;
  loading: boolean;
}

function MultiSelect({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (value: string[]) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-9 border-border/50 bg-card/50 hover:bg-card text-sm">
          <Filter className="w-3.5 h-3.5 mr-2" />
          {label}
          {selected.length > 0 && (
            <Badge variant="secondary" className="ml-2 h-5 px-1.5">
              {selected.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-2" align="start">
        <ScrollArea className="h-48">
          <div className="space-y-1">
            {options.map((option) => (
              <label
                key={option}
                className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded cursor-pointer text-sm"
              >
                <Checkbox
                  checked={selected.includes(option)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onChange([...selected, option]);
                    } else {
                      onChange(selected.filter((s) => s !== option));
                    }
                  }}
                />
                <span className="truncate">{option}</span>
              </label>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

export function MarketingFilterBar({ filters, setFilters, options, onRefresh, loading }: FilterBarProps) {
  const hasActiveFilters = 
    filters.dateRange.start || 
    filters.dateRange.end ||
    filters.campaignTypes.length > 0 ||
    filters.campaignStatuses.length > 0 ||
    filters.marketingChannels.length > 0 ||
    filters.platformNames.length > 0 ||
    filters.targetRegions.length > 0 ||
    filters.marketingManagers.length > 0 ||
    filters.searchQuery;

  const clearFilters = () => {
    setFilters({
      dateRange: { start: null, end: null },
      campaignTypes: [],
      campaignStatuses: [],
      marketingChannels: [],
      platformNames: [],
      targetRegions: [],
      targetCities: [],
      targetAudiences: [],
      marketingManagers: [],
      agencyNames: [],
      roiRange: { min: null, max: null },
      cpcRange: { min: null, max: null },
      searchQuery: '',
    });
  };

  return (
    <div className="glass-card rounded-xl p-4 mb-6 animate-fade-in">
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            value={filters.searchQuery}
            onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
            className="pl-9 h-9 bg-card/50 border-border/50"
          />
        </div>

        {/* Date Range */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-9 border-border/50 bg-card/50 hover:bg-card text-sm">
              <CalendarIcon className="w-3.5 h-3.5 mr-2" />
              {filters.dateRange.start ? (
                filters.dateRange.end ? (
                  <>
                    {format(filters.dateRange.start, 'MMM d')} - {format(filters.dateRange.end, 'MMM d')}
                  </>
                ) : (
                  format(filters.dateRange.start, 'MMM d, yyyy')
                )
              ) : (
                'Date Range'
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={{
                from: filters.dateRange.start || undefined,
                to: filters.dateRange.end || undefined,
              }}
              onSelect={(range) => {
                setFilters({
                  ...filters,
                  dateRange: {
                    start: range?.from || null,
                    end: range?.to || null,
                  },
                });
              }}
              className="pointer-events-auto"
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        {/* Multi-selects */}
        <MultiSelect
          label="Channel"
          options={options.marketingChannels}
          selected={filters.marketingChannels}
          onChange={(v) => setFilters({ ...filters, marketingChannels: v })}
        />
        <MultiSelect
          label="Platform"
          options={options.platformNames}
          selected={filters.platformNames}
          onChange={(v) => setFilters({ ...filters, platformNames: v })}
        />
        <MultiSelect
          label="Type"
          options={options.campaignTypes}
          selected={filters.campaignTypes}
          onChange={(v) => setFilters({ ...filters, campaignTypes: v })}
        />
        <MultiSelect
          label="Status"
          options={options.campaignStatuses}
          selected={filters.campaignStatuses}
          onChange={(v) => setFilters({ ...filters, campaignStatuses: v })}
        />
        <MultiSelect
          label="Region"
          options={options.targetRegions}
          selected={filters.targetRegions}
          onChange={(v) => setFilters({ ...filters, targetRegions: v })}
        />
        <MultiSelect
          label="Manager"
          options={options.marketingManagers}
          selected={filters.marketingManagers}
          onChange={(v) => setFilters({ ...filters, marketingManagers: v })}
        />

        {/* Actions */}
        <div className="flex items-center gap-2 ml-auto">
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 text-muted-foreground">
              <X className="w-3.5 h-3.5 mr-1" />
              Clear
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={onRefresh} disabled={loading} className="h-9">
            <RefreshCw className={cn('w-3.5 h-3.5 mr-1', loading && 'animate-spin')} />
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
}
