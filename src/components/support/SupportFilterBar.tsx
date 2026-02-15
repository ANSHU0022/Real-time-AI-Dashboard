import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Calendar as CalendarIcon, X, RefreshCw, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { SupportFilters } from '@/types/support';

interface SupportFilterBarProps {
  filters: SupportFilters;
  onFiltersChange: (filters: SupportFilters) => void;
  filterOptions: {
    statuses: string[];
    priorities: string[];
    issueCategories: string[];
    channels: string[];
    agents: string[];
    teams: string[];
    regions: string[];
    products: string[];
    slaBreached: string[];
    escalated: string[];
  };
  onRefresh: () => void;
  isLoading: boolean;
}

function MultiSelect({
  label,
  selected,
  options,
  onChange,
}: {
  label: string;
  selected: string[];
  options: string[];
  onChange: (values: string[]) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 border-dashed">
          <Filter className="w-3 h-3 mr-2" />
          {label}
          {selected.length > 0 && (
            <Badge variant="secondary" className="ml-2 rounded-sm px-1">
              {selected.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="start">
        <ScrollArea className="h-64">
          <div className="space-y-1">
            {options.map((option) => (
              <div
                key={option}
                className="flex items-center space-x-2 p-2 hover:bg-muted rounded cursor-pointer"
                onClick={() => {
                  onChange(
                    selected.includes(option)
                      ? selected.filter((s) => s !== option)
                      : [...selected, option]
                  );
                }}
              >
                <Checkbox checked={selected.includes(option)} />
                <span className="text-sm">{option}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

export function SupportFilterBar({
  filters,
  onFiltersChange,
  filterOptions,
  onRefresh,
  isLoading,
}: SupportFilterBarProps) {
  const activeFilterCount = [
    filters.statuses.length,
    filters.priorities.length,
    filters.issueCategories.length,
    filters.channels.length,
    filters.agents.length,
    filters.teams.length,
    filters.regions.length,
    filters.products.length,
    filters.slaBreached.length,
    filters.escalated.length,
    filters.dateRange.from ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const clearAllFilters = () => {
    onFiltersChange({
      searchQuery: '',
      dateRange: { from: undefined, to: undefined },
      statuses: [],
      priorities: [],
      issueCategories: [],
      channels: [],
      agents: [],
      teams: [],
      regions: [],
      products: [],
      slaBreached: [],
      escalated: [],
    });
  };

  return (
    <div className="space-y-4 p-4 bg-card rounded-xl border border-border/50 animate-fade-in">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tickets, customers, agents..."
            value={filters.searchQuery}
            onChange={(e) => onFiltersChange({ ...filters, searchQuery: e.target.value })}
            className="pl-9"
          />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-9">
              <CalendarIcon className="w-3 h-3 mr-2" />
              {filters.dateRange.from ? (
                filters.dateRange.to ? (
                  <>
                    {format(filters.dateRange.from, 'MMM d')} - {format(filters.dateRange.to, 'MMM d')}
                  </>
                ) : (
                  format(filters.dateRange.from, 'MMM d, yyyy')
                )
              ) : (
                'Date Range'
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={{ from: filters.dateRange.from, to: filters.dateRange.to }}
              onSelect={(range) =>
                onFiltersChange({
                  ...filters,
                  dateRange: { from: range?.from, to: range?.to },
                })
              }
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        <MultiSelect
          label="Status"
          selected={filters.statuses}
          options={filterOptions.statuses}
          onChange={(statuses) => onFiltersChange({ ...filters, statuses })}
        />

        <MultiSelect
          label="Priority"
          selected={filters.priorities}
          options={filterOptions.priorities}
          onChange={(priorities) => onFiltersChange({ ...filters, priorities })}
        />

        <MultiSelect
          label="Category"
          selected={filters.issueCategories}
          options={filterOptions.issueCategories}
          onChange={(issueCategories) => onFiltersChange({ ...filters, issueCategories })}
        />

        <MultiSelect
          label="Channel"
          selected={filters.channels}
          options={filterOptions.channels}
          onChange={(channels) => onFiltersChange({ ...filters, channels })}
        />

        <MultiSelect
          label="Agent"
          selected={filters.agents}
          options={filterOptions.agents}
          onChange={(agents) => onFiltersChange({ ...filters, agents })}
        />

        <MultiSelect
          label="Team"
          selected={filters.teams}
          options={filterOptions.teams}
          onChange={(teams) => onFiltersChange({ ...filters, teams })}
        />

        <MultiSelect
          label="SLA Breached"
          selected={filters.slaBreached}
          options={filterOptions.slaBreached}
          onChange={(slaBreached) => onFiltersChange({ ...filters, slaBreached })}
        />

        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="h-9"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {activeFilterCount > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          <Badge variant="secondary">{activeFilterCount}</Badge>
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-6 px-2">
            <X className="w-3 h-3 mr-1" />
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
