import { Search, X, Calendar, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { DashboardFilters } from '@/types/sales';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  filters: DashboardFilters;
  setFilters: (filters: DashboardFilters) => void;
  options: {
    regions: string[];
    categories: string[];
    agents: string[];
    paymentMethods: string[];
    subscriptionTypes: string[];
  };
  onRefresh: () => void;
  loading: boolean;
}

export function FilterBar({ filters, setFilters, options, onRefresh, loading }: FilterBarProps) {
  const activeFilterCount = [
    filters.regions.length > 0,
    filters.categories.length > 0,
    filters.agents.length > 0,
    filters.paymentMethods.length > 0,
    filters.subscriptionTypes.length > 0,
    filters.dateRange.start !== null,
    filters.searchQuery !== '',
    filters.selectedProduct !== null,
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    setFilters({
      dateRange: { start: null, end: null },
      regions: [],
      categories: [],
      agents: [],
      paymentMethods: [],
      subscriptionTypes: [],
      searchQuery: '',
      selectedProduct: null,
    });
  };

  const toggleFilter = (key: keyof Pick<DashboardFilters, 'regions' | 'categories' | 'agents' | 'paymentMethods' | 'subscriptionTypes'>, value: string) => {
    const current = filters[key];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    setFilters({ ...filters, [key]: updated });
  };

  return (
    <div className="glass-card rounded-xl p-4 mb-6 animate-fade-in">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search sales, customers, products..."
            value={filters.searchQuery}
            onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
            className="pl-10 bg-background/50 border-border/50 focus:border-primary"
          />
        </div>

        {/* Date Range */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2 bg-background/50">
              <Calendar className="w-4 h-4" />
              {filters.dateRange.start ? (
                <>
                  {format(filters.dateRange.start, 'MMM d')}
                  {filters.dateRange.end && ` - ${format(filters.dateRange.end, 'MMM d')}`}
                </>
              ) : (
                'Date Range'
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="range"
              selected={{
                from: filters.dateRange.start || undefined,
                to: filters.dateRange.end || undefined,
              }}
              onSelect={(range) =>
                setFilters({
                  ...filters,
                  dateRange: {
                    start: range?.from || null,
                    end: range?.to || null,
                  },
                })
              }
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        {/* Region Filter */}
        <MultiSelect
          label="Region"
          values={filters.regions}
          options={options.regions}
          onChange={(values) => setFilters({ ...filters, regions: values })}
        />

        {/* Category Filter */}
        <MultiSelect
          label="Category"
          values={filters.categories}
          options={options.categories}
          onChange={(values) => setFilters({ ...filters, categories: values })}
        />

        {/* Agent Filter */}
        <MultiSelect
          label="Agent"
          values={filters.agents}
          options={options.agents}
          onChange={(values) => setFilters({ ...filters, agents: values })}
        />

        {/* Payment Method */}
        <MultiSelect
          label="Payment"
          values={filters.paymentMethods}
          options={options.paymentMethods}
          onChange={(values) => setFilters({ ...filters, paymentMethods: values })}
        />

        {/* Subscription Type */}
        <MultiSelect
          label="Subscription"
          values={filters.subscriptionTypes}
          options={options.subscriptionTypes}
          onChange={(values) => setFilters({ ...filters, subscriptionTypes: values })}
        />

        <div className="flex items-center gap-2 ml-auto">
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="w-4 h-4 mr-1" />
              Clear ({activeFilterCount})
            </Button>
          )}
          
          <Button
            variant="outline"
            size="icon"
            onClick={onRefresh}
            disabled={loading}
            className="bg-background/50"
          >
            <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      {(filters.selectedProduct || filters.regions.length > 0 || filters.categories.length > 0) && (
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border/50">
          {filters.selectedProduct && (
            <Badge variant="secondary" className="gap-1">
              Product: {filters.selectedProduct}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => setFilters({ ...filters, selectedProduct: null })}
              />
            </Badge>
          )}
          {filters.regions.map(region => (
            <Badge key={region} variant="secondary" className="gap-1">
              {region}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => toggleFilter('regions', region)}
              />
            </Badge>
          ))}
          {filters.categories.map(cat => (
            <Badge key={cat} variant="secondary" className="gap-1">
              {cat}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => toggleFilter('categories', cat)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

interface MultiSelectProps {
  label: string;
  values: string[];
  options: string[];
  onChange: (values: string[]) => void;
}

function MultiSelect({ label, values, options, onChange }: MultiSelectProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2 bg-background/50">
          {label}
          {values.length > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
              {values.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="start">
        <div className="space-y-1 max-h-64 overflow-auto">
          {options.map(option => (
            <div
              key={option}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors',
                values.includes(option)
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-muted'
              )}
              onClick={() => {
                const newValues = values.includes(option)
                  ? values.filter(v => v !== option)
                  : [...values, option];
                onChange(newValues);
              }}
            >
              <div className={cn(
                'w-4 h-4 rounded border-2 flex items-center justify-center transition-colors',
                values.includes(option)
                  ? 'bg-primary border-primary'
                  : 'border-muted-foreground/30'
              )}>
                {values.includes(option) && (
                  <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-sm">{option}</span>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
