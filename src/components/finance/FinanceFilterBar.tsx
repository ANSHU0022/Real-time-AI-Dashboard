import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar as CalendarIcon, Filter, X, Search } from 'lucide-react';
import { format } from 'date-fns';
import { FinanceFilters } from '@/types/finance';

interface FinanceFilterBarProps {
  filters: FinanceFilters;
  setFilters: (filters: FinanceFilters) => void;
  filterOptions: {
    financialYears: string[];
    quarters: string[];
    months: string[];
    departments: string[];
    costCenters: string[];
    projects: string[];
    revenueTypes: string[];
    expenseTypes: string[];
    expenseCategories: string[];
    vendors: string[];
    customerRegions: string[];
    paymentModes: string[];
    paymentStatuses: string[];
    approvalStatuses: string[];
    riskFlags: string[];
  };
}

interface MultiSelectFilterProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
}

function MultiSelectFilter({ label, options, selected, onChange }: MultiSelectFilterProps) {
  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(s => s !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 border-border/50 bg-background hover:bg-muted">
          <Filter className="w-3 h-3 mr-2" />
          {label}
          {selected.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
              {selected.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="start">
        <ScrollArea className="h-64">
          <div className="space-y-1">
            {options.map(option => (
              <div
                key={option}
                className="flex items-center space-x-2 p-2 hover:bg-muted rounded cursor-pointer"
                onClick={() => toggleOption(option)}
              >
                <Checkbox checked={selected.includes(option)} />
                <span className="text-sm truncate">{option}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
        {selected.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-2"
            onClick={() => onChange([])}
          >
            Clear selection
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
}

export function FinanceFilterBar({ filters, setFilters, filterOptions }: FinanceFilterBarProps) {
  const hasActiveFilters = 
    filters.dateRange.from || 
    filters.dateRange.to ||
    filters.financialYears.length > 0 ||
    filters.quarters.length > 0 ||
    filters.months.length > 0 ||
    filters.departments.length > 0 ||
    filters.costCenters.length > 0 ||
    filters.projects.length > 0 ||
    filters.revenueTypes.length > 0 ||
    filters.expenseTypes.length > 0 ||
    filters.expenseCategories.length > 0 ||
    filters.vendors.length > 0 ||
    filters.customerRegions.length > 0 ||
    filters.paymentModes.length > 0 ||
    filters.paymentStatuses.length > 0 ||
    filters.approvalStatuses.length > 0 ||
    filters.riskFlags.length > 0 ||
    filters.searchQuery;

  const clearAllFilters = () => {
    setFilters({
      dateRange: { from: null, to: null },
      financialYears: [],
      quarters: [],
      months: [],
      departments: [],
      costCenters: [],
      projects: [],
      revenueTypes: [],
      expenseTypes: [],
      expenseCategories: [],
      vendors: [],
      customerRegions: [],
      paymentModes: [],
      paymentStatuses: [],
      approvalStatuses: [],
      riskFlags: [],
      searchQuery: '',
    });
  };

  return (
    <div className="bg-card rounded-xl border border-border/50 p-4 space-y-4 animate-fade-in">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={filters.searchQuery}
            onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
            className="pl-9 h-9 bg-background border-border/50"
          />
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 border-border/50 bg-background">
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
              selected={{ from: filters.dateRange.from || undefined, to: filters.dateRange.to || undefined }}
              onSelect={(range) => setFilters({ 
                ...filters, 
                dateRange: { from: range?.from || null, to: range?.to || null } 
              })}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-wrap gap-2">
        <MultiSelectFilter
          label="Financial Year"
          options={filterOptions.financialYears}
          selected={filters.financialYears}
          onChange={(values) => setFilters({ ...filters, financialYears: values })}
        />
        <MultiSelectFilter
          label="Quarter"
          options={filterOptions.quarters}
          selected={filters.quarters}
          onChange={(values) => setFilters({ ...filters, quarters: values })}
        />
        <MultiSelectFilter
          label="Month"
          options={filterOptions.months}
          selected={filters.months}
          onChange={(values) => setFilters({ ...filters, months: values })}
        />
        <MultiSelectFilter
          label="Department"
          options={filterOptions.departments}
          selected={filters.departments}
          onChange={(values) => setFilters({ ...filters, departments: values })}
        />
        <MultiSelectFilter
          label="Cost Center"
          options={filterOptions.costCenters}
          selected={filters.costCenters}
          onChange={(values) => setFilters({ ...filters, costCenters: values })}
        />
        <MultiSelectFilter
          label="Project"
          options={filterOptions.projects}
          selected={filters.projects}
          onChange={(values) => setFilters({ ...filters, projects: values })}
        />
        <MultiSelectFilter
          label="Revenue Type"
          options={filterOptions.revenueTypes}
          selected={filters.revenueTypes}
          onChange={(values) => setFilters({ ...filters, revenueTypes: values })}
        />
        <MultiSelectFilter
          label="Expense Type"
          options={filterOptions.expenseTypes}
          selected={filters.expenseTypes}
          onChange={(values) => setFilters({ ...filters, expenseTypes: values })}
        />
        <MultiSelectFilter
          label="Expense Category"
          options={filterOptions.expenseCategories}
          selected={filters.expenseCategories}
          onChange={(values) => setFilters({ ...filters, expenseCategories: values })}
        />
        <MultiSelectFilter
          label="Vendor"
          options={filterOptions.vendors}
          selected={filters.vendors}
          onChange={(values) => setFilters({ ...filters, vendors: values })}
        />
        <MultiSelectFilter
          label="Region"
          options={filterOptions.customerRegions}
          selected={filters.customerRegions}
          onChange={(values) => setFilters({ ...filters, customerRegions: values })}
        />
        <MultiSelectFilter
          label="Payment Mode"
          options={filterOptions.paymentModes}
          selected={filters.paymentModes}
          onChange={(values) => setFilters({ ...filters, paymentModes: values })}
        />
        <MultiSelectFilter
          label="Payment Status"
          options={filterOptions.paymentStatuses}
          selected={filters.paymentStatuses}
          onChange={(values) => setFilters({ ...filters, paymentStatuses: values })}
        />
        <MultiSelectFilter
          label="Approval"
          options={filterOptions.approvalStatuses}
          selected={filters.approvalStatuses}
          onChange={(values) => setFilters({ ...filters, approvalStatuses: values })}
        />
        <MultiSelectFilter
          label="Risk Flag"
          options={filterOptions.riskFlags}
          selected={filters.riskFlags}
          onChange={(values) => setFilters({ ...filters, riskFlags: values })}
        />
        
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-9 text-muted-foreground hover:text-foreground"
          >
            <X className="w-3 h-3 mr-1" />
            Clear all
          </Button>
        )}
      </div>
    </div>
  );
}
