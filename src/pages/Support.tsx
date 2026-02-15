import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KPICard } from '@/components/sales/KPICard';
import { SupportFilterBar } from '@/components/support/SupportFilterBar';
import { SupportCharts } from '@/components/support/SupportCharts';
import { TopAgentsTable } from '@/components/support/TopAgentsTable';
import { SupportDataTable } from '@/components/support/SupportDataTable';

import { useSupportData } from '@/hooks/useSupportData';
import {
  Ticket, TicketCheck, Clock, CheckCircle, XCircle,
  Timer, Star, TrendingUp, RefreshCw,
} from 'lucide-react';

export default function Support() {
  const {
    data,
    isLoading,
    isUsingLiveData,
    filters,
    setFilters,
    filterOptions,
    kpis,
    refresh,
  } = useSupportData();

  // Show loading only on initial load without data
  if (isLoading && data.length === 0) {
    return (
      <DashboardLayout
        title="Customer Support Dashboard"
        subtitle="SLA & Customer Experience Analytics"
        isUsingLiveData={false}
        recordCount={0}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading support data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const kpiCards = [
    { title: 'Total Tickets', value: kpis.totalTickets, format: 'number' as const, icon: Ticket, gradient: 'primary' as const },
    { title: 'Open Tickets', value: kpis.openTickets, format: 'number' as const, icon: TicketCheck, gradient: 'warning' as const },
    { title: 'Resolved & Closed', value: kpis.resolvedClosedTickets, format: 'number' as const, icon: CheckCircle, gradient: 'success' as const },
    { title: 'SLA Compliance', value: kpis.slaCompliance, format: 'percent' as const, icon: CheckCircle, gradient: 'accent' as const },
    { title: 'SLA Breach Rate', value: kpis.slaBreachRate, format: 'percent' as const, icon: XCircle, gradient: 'warning' as const },
    { title: 'Avg First Response', value: kpis.avgFirstResponseTime, format: 'number' as const, icon: Timer, gradient: 'secondary' as const },
    { title: 'Avg Resolution Time', value: kpis.avgResolutionTime, format: 'number' as const, icon: Clock, gradient: 'primary' as const },
    { title: 'Avg CSAT Score', value: kpis.avgCSAT, format: 'number' as const, icon: Star, gradient: 'success' as const },
    { title: 'Escalation Rate', value: kpis.escalationRate, format: 'percent' as const, icon: TrendingUp, gradient: 'warning' as const },
    { title: 'Reopen Rate', value: kpis.reopenRate, format: 'percent' as const, icon: RefreshCw, gradient: 'secondary' as const },
  ];

  return (
    <DashboardLayout
      title="Customer Support Dashboard"
      subtitle="SLA & Customer Experience Analytics"
      isUsingLiveData={isUsingLiveData}
      recordCount={data.length}
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {kpiCards.map((kpi, index) => {
          const IconComponent = kpi.icon;
          return (
            <KPICard
              key={kpi.title}
              title={kpi.title}
              value={kpi.value}
              format={kpi.format}
              icon={<IconComponent className="w-8 h-8" />}
              gradient={kpi.gradient}
              delay={index * 100}
            />
          );
        })}
      </div>

      {/* Filter Bar */}
      <div className="mb-6">
        <SupportFilterBar
          filters={filters}
          onFiltersChange={setFilters}
          filterOptions={filterOptions}
          isLoading={isLoading}
        />
      </div>

      {/* Charts */}
      <div className="mb-6">
        <SupportCharts data={data} />
      </div>

      {/* Top Agents Table */}
      <div className="mb-6">
        <TopAgentsTable data={data} />
      </div>

      {/* Data Table */}
      <div className="mb-6">
        <SupportDataTable data={data} />
      </div>
    </DashboardLayout>
  );
}

