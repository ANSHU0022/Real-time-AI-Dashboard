import { useSalesData } from '@/hooks/useSalesData';
import { KPICard } from '@/components/sales/KPICard';
import { FilterBar } from '@/components/sales/FilterBar';
import { RevenueChart } from '@/components/sales/RevenueChart';
import { RegionChart } from '@/components/sales/RegionChart';
import { ProductStabilityMatrix } from '@/components/sales/ProductStabilityMatrix';
import { AgentLeaderboard } from '@/components/sales/AgentLeaderboard';
import { SubscriptionPieChart, PaymentPieChart } from '@/components/sales/PieCharts';
import { CalendarHeatmap } from '@/components/sales/CalendarHeatmap';
import { DataTable } from '@/components/sales/DataTable';
import ChartBot from '@/components/sales/ChartBot';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  DollarSign,
  ShoppingCart, 
  TrendingUp, 
  Package, 
  Percent, 
  Users,
  UserCheck,
  UserX,
  BarChart3,
} from 'lucide-react';
import { useMemo } from 'react';

export default function Sales() {
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
    isUsingLiveData,
  } = useSalesData();



  // Generate sparkline data for KPIs
  const sparklineData = useMemo(() => {
    const dailyRevenue: Record<string, number> = {};
    data.forEach(record => {
      const date = record.date.split('T')[0];
      dailyRevenue[date] = (dailyRevenue[date] || 0) + record.total_revenue;
    });
    return Object.entries(dailyRevenue)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([_, val]) => val);
  }, [data]);

  if (loading) {
    return (
      <DashboardLayout
        title="Sales"
        subtitle="Real-time revenue analytics"
        isUsingLiveData={false}
        recordCount={0}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading sales analytics...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (rawData.length === 0) {
    return (
      <DashboardLayout
        title="Sales"
        subtitle="Real-time revenue analytics"
        isUsingLiveData={false}
        recordCount={0}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-xl mb-2">No data available</p>
            <p className="text-muted-foreground">Make sure your Google Sheet is public and contains data</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }



  return (
    <DashboardLayout
      title="Sales"
      subtitle="Real-time revenue analytics"
      isUsingLiveData={isUsingLiveData}
      recordCount={rawData.length}
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <KPICard
          title="Total Revenue"
          value={kpis.totalRevenue}
          format="million"
          icon={<DollarSign className="w-8 h-8" />}
          sparklineData={sparklineData}
          delay={0}
          gradient="success"
        />
        <KPICard
          title="Total Orders"
          value={kpis.totalOrders}
          format="number"
          icon={<ShoppingCart className="w-8 h-8" />}
          delay={50}
          gradient="info"
        />
        <KPICard
          title="Avg Order Value"
          value={kpis.aov}
          format="currencyShort"
          icon={<TrendingUp className="w-8 h-8" />}
          delay={100}
          gradient="accent"
        />
        <KPICard
          title="Total Quantity"
          value={kpis.totalQuantity}
          format="number"
          icon={<Package className="w-8 h-8" />}
          delay={150}
          gradient="secondary"
        />
        <KPICard
          title="Unique Customers"
          value={kpis.uniqueCustomers}
          format="number"
          icon={<Users className="w-8 h-8" />}
          delay={200}
          gradient="info"
        />
        <KPICard
          title="Gross Sales"
          value={kpis.grossSales}
          format="million"
          icon={<BarChart3 className="w-8 h-8" />}
          delay={250}
          gradient="success"
        />
        <KPICard
          title="Total Discount"
          value={kpis.totalDiscount}
          format="million"
          icon={<Percent className="w-8 h-8" />}
          delay={300}
          gradient="secondary"
        />
        <KPICard
          title="Discount %"
          value={kpis.discountPct}
          format="percent"
          icon={<Percent className="w-8 h-8" />}
          delay={350}
          gradient="accent"
        />
        <KPICard
          title="Renewal Rate"
          value={kpis.renewalRate}
          format="percent"
          icon={<UserCheck className="w-8 h-8" />}
          delay={400}
          gradient="success"
        />
        <KPICard
          title="Churn Rate"
          value={kpis.churnRate}
          format="percent"
          icon={<UserX className="w-8 h-8" />}
          delay={450}
          gradient="info"
        />
      </div>

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        options={filterOptions}
        loading={loading}
      />

      {/* Revenue Chart - Full Width */}
      <div className="mb-6">
        <RevenueChart data={data} />
      </div>

      {/* Agent Leaderboard - 60% width with Subscription Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        <div className="lg:col-span-3">
          <AgentLeaderboard data={data} />
        </div>
        <div className="lg:col-span-2">
          <SubscriptionPieChart data={data} />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        <div className="lg:col-span-3">
          <RegionChart data={data} />
        </div>
        <div className="lg:col-span-2">
          <PaymentPieChart data={data} />
        </div>
      </div>

      {/* Third Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        <div className="lg:col-span-2">
          <CalendarHeatmap data={data} />
        </div>
        <div className="lg:col-span-3">
          <ProductStabilityMatrix data={data} />
        </div>
      </div>

      {/* Data Table */}
      <DataTable data={data} />

      {/* Footer */}
      <footer className="mt-8 pt-6 border-t border-border/50 text-center text-sm text-muted-foreground">
        <p>
          Data refreshes automatically every 5 minutes. Last updated: {new Date().toLocaleTimeString()}
        </p>
      </footer>

      {/* Chart Bot */}
      <ChartBot />
    </DashboardLayout>
  );
}

