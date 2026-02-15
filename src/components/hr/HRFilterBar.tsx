import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import { HRFilters } from '@/types/hr';

interface HRFilterBarProps {
  filters: HRFilters;
  setFilters: (filters: HRFilters) => void;
  filterOptions: {
    departments: string[];
    jobLevels: string[];
    managers: string[];
    locations: string[];
    employmentTypes: string[];
    employmentStatuses: string[];
    performanceCategories: string[];
    promotionEligibility: string[];
    attritionRiskLevels: string[];
    genders: string[];
  };
}

export function HRFilterBar({ filters, setFilters, filterOptions }: HRFilterBarProps) {
  const clearFilters = () => {
    setFilters({
      dateRange: { from: null, to: null },
      departments: [],
      jobLevels: [],
      managers: [],
      locations: [],
      employmentTypes: [],
      employmentStatuses: [],
      performanceCategories: [],
      promotionEligibility: [],
      attritionRiskLevels: [],
      genders: [],
      searchQuery: '',
    });
  };

  const hasActiveFilters = 
    filters.departments.length > 0 ||
    filters.jobLevels.length > 0 ||
    filters.managers.length > 0 ||
    filters.locations.length > 0 ||
    filters.employmentTypes.length > 0 ||
    filters.employmentStatuses.length > 0 ||
    filters.performanceCategories.length > 0 ||
    filters.promotionEligibility.length > 0 ||
    filters.attritionRiskLevels.length > 0 ||
    filters.genders.length > 0 ||
    filters.searchQuery;

  return (
    <div className="bg-card border border-border rounded-xl p-4 mb-6 animate-fade-in">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            value={filters.searchQuery}
            onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
            className="pl-9"
          />
        </div>

        <Select
          value={filters.departments[0] || ''}
          onValueChange={(value) => setFilters({ ...filters, departments: value ? [value] : [] })}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.departments.map((dept) => (
              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.employmentStatuses[0] || ''}
          onValueChange={(value) => setFilters({ ...filters, employmentStatuses: value ? [value] : [] })}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.employmentStatuses.map((status) => (
              <SelectItem key={status} value={status}>{status}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.performanceCategories[0] || ''}
          onValueChange={(value) => setFilters({ ...filters, performanceCategories: value ? [value] : [] })}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Performance" />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.performanceCategories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.attritionRiskLevels[0] || ''}
          onValueChange={(value) => setFilters({ ...filters, attritionRiskLevels: value ? [value] : [] })}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Risk Level" />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.attritionRiskLevels.map((risk) => (
              <SelectItem key={risk} value={risk}>{risk}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.jobLevels[0] || ''}
          onValueChange={(value) => setFilters({ ...filters, jobLevels: value ? [value] : [] })}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Job Level" />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.jobLevels.map((level) => (
              <SelectItem key={level} value={level}>{level}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.locations[0] || ''}
          onValueChange={(value) => setFilters({ ...filters, locations: value ? [value] : [] })}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.locations.map((loc) => (
              <SelectItem key={loc} value={loc}>{loc}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
