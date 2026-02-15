import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KPICard } from '@/components/sales/KPICard';
import { HRFilterBar } from '@/components/hr/HRFilterBar';
import { HRCharts } from '@/components/hr/HRCharts';
import { HRDataTable } from '@/components/hr/HRDataTable';
import { TopPerformersTable } from '@/components/hr/TopPerformersTable';
import { PerformanceMatrix } from '@/components/hr/PerformanceMatrix';

import { useHRData } from '@/hooks/useHRData';
import {
  Users,
  UserCheck,
  UserX,
  TrendingDown,
  Clock,
  CalendarCheck,
  Cake,
  Award,
  Star,
  CalendarOff,
  DollarSign,
  Smile,
} from 'lucide-react';

const HR = () => {
  const {
    data,
    loading,
    isUsingLiveData,
    filters,
    setFilters,
    kpis,
    filterOptions
  } = useHRData();

  // Show loading only on initial load without data
  if (loading && data.length === 0) {
    return (
      <DashboardLayout
        title="HR Dashboard"
        subtitle="Enterprise HR Analytics & Attrition Intelligence"
        isUsingLiveData={false}
        recordCount={0}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading HR data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="HR Dashboard"
      subtitle="Enterprise HR Analytics & Attrition Intelligence"
      isUsingLiveData={isUsingLiveData}
      recordCount={data.length}
    >
      {/* KPI Section - 12 KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
        <KPICard
          title="Total Employees"
          value={kpis.totalEmployees}
          format="number"
          icon={<Users className="w-8 h-8" />}
        />
        <KPICard
          title="Active Employees"
          value={kpis.activeEmployees}
          format="number"
          icon={<UserCheck className="w-8 h-8" />}
          gradient="success"
        />
        <KPICard
          title="Terminated"
          value={kpis.terminatedEmployees}
          format="number"
          icon={<UserX className="w-8 h-8" />}
          gradient="warning"
        />
        <KPICard
          title="Attrition Rate"
          value={kpis.attritionRate}
          format="percent"
          icon={<TrendingDown className="w-8 h-8" />}
          gradient="warning"
        />
        <KPICard
          title="Avg Tenure"
          value={kpis.averageTenure}
          format="number"
          icon={<Clock className="w-8 h-8" />}
        />
        <KPICard
          title="Avg Attendance"
          value={kpis.averageAttendanceRate}
          format="percent"
          icon={<CalendarCheck className="w-8 h-8" />}
          gradient="success"
        />
        <KPICard
          title="Avg Age"
          value={kpis.averageAge}
          format="number"
          icon={<Cake className="w-8 h-8" />}
        />
        <KPICard
          title="Promo Eligible"
          value={kpis.promotionEligible}
          format="number"
          icon={<Award className="w-8 h-8" />}
          gradient="accent"
        />
        <KPICard
          title="High Performers"
          value={kpis.highPerformers}
          format="number"
          icon={<Star className="w-8 h-8" />}
          gradient="success"
        />
        <KPICard
          title="Days Not Working"
          value={kpis.averageDaysNotWorking}
          format="number"
          icon={<CalendarOff className="w-8 h-8" />}
        />
        <KPICard
          title="Avg Salary"
          value={kpis.averageSalary}
          format="currencyShort"
          icon={<DollarSign className="w-8 h-8" />}
        />
        <KPICard
          title="Job Satisfaction"
          value={kpis.averageJobSatisfaction}
          format="number"
          icon={<Smile className="w-8 h-8" />}
          gradient="accent"
        />
      </div>

      {/* Filter Bar */}
      <HRFilterBar
        filters={filters}
        setFilters={setFilters}
        filterOptions={filterOptions}
      />

      {/* Charts */}
      <HRCharts data={data} />

      {/* Top Performers Table */}
      <TopPerformersTable data={data} />

      {/* Performance Matrix */}
      <PerformanceMatrix data={data} />

      {/* Full Data Table */}
      <HRDataTable data={data} />
    </DashboardLayout>
  );
};

export default HR;

