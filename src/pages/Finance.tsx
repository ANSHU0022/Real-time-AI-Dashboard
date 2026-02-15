import { useFinanceData } from '@/hooks/useFinanceData';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KPICard } from '@/components/sales/KPICard';
import { FinanceFilterBar } from '@/components/finance/FinanceFilterBar';
import { FinanceCharts } from '@/components/finance/FinanceCharts';
import { FinanceDataTable } from '@/components/finance/FinanceDataTable';

import { 
  DollarSign, TrendingUp, Receipt, PiggyBank, Percent, 
  Wallet, Target, AlertTriangle, BarChart3, ShieldAlert 
} from 'lucide-react';

export default function Finance() {
  const { 
    data, 
    isLoading, 
    isUsingLiveData, 
    filters, 
    setFilters, 
    filterOptions, 
    kpis
  } = useFinanceData();

  // Show loading only on initial load without data
  if (isLoading && data.length === 0) {
    return (
      <DashboardLayout
        title="Finance Dashboard"
        subtitle="Real-time financial analytics and insights"
        isUsingLiveData={false}
        recordCount={0}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading financial data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Finance Dashboard"
      subtitle="Real-time financial analytics and insights"
      isUsingLiveData={isUsingLiveData}
      recordCount={data.length}
    >
      {/* KPI Section - 10 KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <KPICard
          title="Gross Revenue"
          value={kpis.grossRevenue}
          format="million"
          icon={<DollarSign className="w-8 h-8" />}
          delay={0}
          gradient="success"
        />
        <KPICard
          title="Net Revenue"
          value={kpis.netRevenue}
          format="million"
          icon={<TrendingUp className="w-8 h-8" />}
          delay={100}
          gradient="info"
        />
        <KPICard
          title="Total Expenses"
          value={kpis.totalExpenses}
          format="million"
          icon={<Receipt className="w-8 h-8" />}
          delay={200}
          gradient="secondary"
        />
        <KPICard
          title="Gross Profit"
          value={kpis.grossProfit}
          format="million"
          icon={<PiggyBank className="w-8 h-8" />}
          delay={300}
          gradient="accent"
        />
        <KPICard
          title="Profit Margin"
          value={kpis.profitMargin}
          format="percent"
          icon={<Percent className="w-8 h-8" />}
          delay={400}
          gradient="success"
        />
        <KPICard
          title="Net Cash Flow"
          value={kpis.netCashFlow}
          format="million"
          icon={<Wallet className="w-8 h-8" />}
          delay={500}
          gradient="info"
        />
        <KPICard
          title="Budget Utilization"
          value={kpis.budgetUtilization}
          format="percent"
          icon={<Target className="w-8 h-8" />}
          delay={600}
          gradient="secondary"
        />
        <KPICard
          title="Budget Variance"
          value={kpis.budgetVariance}
          format="million"
          icon={<BarChart3 className="w-8 h-8" />}
          delay={700}
          gradient="accent"
        />
        <KPICard
          title="Forecast Accuracy"
          value={kpis.forecastAccuracy}
          format="percent"
          icon={<AlertTriangle className="w-8 h-8" />}
          delay={800}
          gradient="success"
        />
        <KPICard
          title="High-Risk Transactions"
          value={kpis.highRiskTransactions}
          format="number"
          icon={<ShieldAlert className="w-8 h-8" />}
          delay={900}
          gradient="info"
        />
      </div>

      {/* Filter Bar */}
      <FinanceFilterBar
        filters={filters}
        setFilters={setFilters}
        filterOptions={filterOptions}
      />

      {/* Charts */}
      <FinanceCharts data={data} />

      {/* Data Table */}
      <FinanceDataTable data={data} />
    </DashboardLayout>
  );
}

