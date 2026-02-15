import { useMarketingData } from '@/hooks/useMarketingData';
import { KPICard } from '@/components/sales/KPICard';
import { MarketingFilterBar } from '@/components/marketing/MarketingFilterBar';
import { MarketingDataTable } from '@/components/marketing/MarketingDataTable';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

import {
  RevenueVsSpendChart,
  ROITrendChart,
  ChannelGrowthEfficiencyMap,
  PlatformROIChart,
  CampaignEfficiencyQuadrant,
  RegionPerformanceHeatmap,
  MarketingFunnelChart,
  CPCvsConversionScatter,
  CPLvsROIScatter,
} from '@/components/marketing/MarketingCharts';

import {
  DollarSign,
  TrendingUp,
  Target,
  MousePointerClick,
  Users,
  UserCheck,
  Percent,
  Eye,
  RefreshCw,
} from 'lucide-react';

export default function Marketing() {
  const {
    data,
    rawData,
    loading,
    error,
    filters,
    setFilters,
    kpis,
    filterOptions,
    refetch,
    isUsingLiveData
  } = useMarketingData();

  // Show loading only on initial load
  if (loading && rawData.length === 0) {
    return (
      <DashboardLayout
        title="Marketing Dashboard"
        subtitle="Campaign performance and analytics"
        isUsingLiveData={false}
        recordCount={0}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading marketing data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Marketing Dashboard"
      subtitle="Campaign performance and analytics"
      isUsingLiveData={isUsingLiveData}
      recordCount={rawData.length}
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <KPICard
          title="Total Spend"
          value={kpis.totalCampaignSpend}
          format="million"
          icon={<DollarSign className="w-8 h-8" />}
          delay={0}
          gradient="success"
        />
        <KPICard
          title="Total Revenue"
          value={kpis.totalRevenue}
          format="million"
          icon={<TrendingUp className="w-8 h-8" />}
          delay={50}
          gradient="info"
        />
        <KPICard
          title="Overall ROI"
          value={kpis.overallROI}
          format="percent"
          icon={<Target className="w-8 h-8" />}
          delay={100}
          gradient="accent"
        />
        <KPICard
          title="Avg CPC"
          value={kpis.avgCPC}
          format="currencyShort"
          icon={<MousePointerClick className="w-8 h-8" />}
          delay={150}
          gradient="secondary"
        />
        <KPICard
          title="Avg CPL"
          value={kpis.avgCPL}
          format="currencyShort"
          icon={<Users className="w-8 h-8" />}
          delay={200}
          gradient="success"
        />
        <KPICard
          title="Total Leads"
          value={kpis.totalLeads}
          format="million"
          icon={<UserCheck className="w-8 h-8" />}
          delay={250}
          gradient="info"
        />
        <KPICard
          title="Conversions"
          value={kpis.totalConversions}
          format="million"
          icon={<Target className="w-8 h-8" />}
          delay={300}
          gradient="accent"
        />
        <KPICard
          title="Conv. Rate"
          value={kpis.conversionRate}
          format="percent"
          icon={<Percent className="w-8 h-8" />}
          delay={350}
          gradient="secondary"
        />
        <KPICard
          title="Avg CTR"
          value={kpis.avgCTR}
          format="percent"
          icon={<Eye className="w-8 h-8" />}
          delay={400}
          gradient="success"
        />
      </div>

      {/* Filter Bar */}
      <MarketingFilterBar
        filters={filters}
        setFilters={setFilters}
        options={filterOptions}
        loading={loading}
      />

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <RevenueVsSpendChart data={data} />
        </div>
        <CampaignEfficiencyQuadrant data={data} />
      </div>

      {/* Secondary Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <ChannelGrowthEfficiencyMap data={data} />
        <PlatformROIChart data={data} />
        <RegionPerformanceHeatmap data={data} />
      </div>

      {/* Third Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <MarketingFunnelChart data={data} />
        <ROITrendChart data={data} />
      </div>

      {/* Fourth Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <CPCvsConversionScatter data={data} />
        <CPLvsROIScatter data={data} />
      </div>

      {/* Data Table */}
      <MarketingDataTable data={data} />

      {/* Footer */}
      <footer className="mt-8 pt-6 border-t border-border/50 text-center text-sm text-muted-foreground">
        <p>
          Data refreshes automatically every 5 minutes. Last updated: {new Date().toLocaleTimeString()}
        </p>
      </footer>
    </DashboardLayout>
  );
}

