import { useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter, ComposedChart, Area
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FinanceRecord } from '@/types/finance';

interface FinanceChartsProps {
  data: FinanceRecord[];
}

const COLORS = ['#2E6F40', '#CFFFDC', '#68BA7F', '#253D2C', '#4A8B5C', '#5F9A6B', '#A8E6B7', '#3A7A4A'];

export function FinanceCharts({ data }: FinanceChartsProps) {
  // Revenue vs Expense Trend
  const revenueExpenseTrend = useMemo(() => {
    const grouped = data.reduce((acc, r) => {
      const month = r.transaction_date.substring(0, 7);
      if (!acc[month]) acc[month] = { month, revenue: 0, expense: 0 };
      acc[month].revenue += r.net_revenue;
      acc[month].expense += r.expense_amount;
      return acc;
    }, {} as Record<string, { month: string; revenue: number; expense: number }>);
    return Object.values(grouped).sort((a, b) => a.month.localeCompare(b.month));
  }, [data]);

  // Gross Profit Trend
  const profitTrend = useMemo(() => {
    const grouped = data.reduce((acc, r) => {
      const month = r.transaction_date.substring(0, 7);
      if (!acc[month]) acc[month] = { month, profit: 0 };
      acc[month].profit += r.gross_profit;
      return acc;
    }, {} as Record<string, { month: string; profit: number }>);
    return Object.values(grouped).sort((a, b) => a.month.localeCompare(b.month));
  }, [data]);

  // Cash Flow Stability Index
  const cashFlowStability = useMemo(() => {
    const grouped = data.reduce((acc, r) => {
      const month = r.transaction_date.substring(0, 7);
      if (!acc[month]) acc[month] = { month, cashFlow: 0, count: 0 };
      acc[month].cashFlow += r.net_cash_flow;
      acc[month].count += 1;
      return acc;
    }, {} as Record<string, { month: string; cashFlow: number; count: number }>);
    
    const sortedData = Object.values(grouped).sort((a, b) => a.month.localeCompare(b.month));
    
    // Calculate rolling average (3-month)
    const withRollingAvg = sortedData.map((item, index) => {
      const start = Math.max(0, index - 2);
      const end = index + 1;
      const rollingData = sortedData.slice(start, end);
      const rollingAvg = rollingData.reduce((sum, d) => sum + d.cashFlow, 0) / rollingData.length;
      
      // Calculate confidence band (±20% of rolling average)
      const confidenceRange = Math.abs(rollingAvg) * 0.2;
      
      return {
        ...item,
        rollingAvg,
        upperBand: rollingAvg + confidenceRange,
        lowerBand: rollingAvg - confidenceRange,
        isNegative: item.cashFlow < 0
      };
    });
    
    return withRollingAvg;
  }, [data]);

  // Revenue by Department
  const revenueByDept = useMemo(() => {
    const grouped = data.reduce((acc, r) => {
      acc[r.department_name] = (acc[r.department_name] || 0) + r.net_revenue;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(grouped).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [data]);

  // Expense by Category
  const expenseByCategory = useMemo(() => {
    const grouped = data.reduce((acc, r) => {
      acc[r.expense_category] = (acc[r.expense_category] || 0) + r.expense_amount;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(grouped).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [data]);

  // Profit Margin by Region (Heatmap)
  const profitMarginByRegion = useMemo(() => {
    const grouped = data.reduce((acc, r) => {
      if (!acc[r.customer_region]) {
        acc[r.customer_region] = { 
          region: r.customer_region, 
          margins: [], 
          revenue: 0, 
          expenses: 0,
          count: 0
        };
      }
      acc[r.customer_region].margins.push(r.profit_margin_percent);
      acc[r.customer_region].revenue += r.net_revenue;
      acc[r.customer_region].expenses += r.expense_amount;
      acc[r.customer_region].count += 1;
      return acc;
    }, {} as Record<string, { region: string; margins: number[]; revenue: number; expenses: number; count: number }>);
    
    return Object.values(grouped).map(g => ({
      region: g.region,
      avgMargin: g.margins.reduce((a, b) => a + b, 0) / g.margins.length,
      revenue: g.revenue,
      expenses: g.expenses,
      transactionCount: g.count,
      profitability: g.revenue - g.expenses
    })).sort((a, b) => b.avgMargin - a.avgMargin);
  }, [data]);

  // Budget Allocated vs Used by Cost Center
  const budgetComparison = useMemo(() => {
    const grouped = data.reduce((acc, r) => {
      if (!acc[r.cost_center]) acc[r.cost_center] = { costCenter: r.cost_center, allocated: 0, used: 0 };
      acc[r.cost_center].allocated += r.budget_allocated;
      acc[r.cost_center].used += r.budget_used;
      return acc;
    }, {} as Record<string, { costCenter: string; allocated: number; used: number }>);
    
    return Object.values(grouped)
      .map(item => ({
        ...item,
        variance: item.allocated > 0 ? ((item.used - item.allocated) / item.allocated) * 100 : 0,
        isOverBudget: item.used > item.allocated
      }))
      .slice(0, 10);
  }, [data]);

  // Payment Status Distribution
  const paymentStatusDist = useMemo(() => {
    const grouped = data.reduce((acc, r) => {
      acc[r.payment_status] = (acc[r.payment_status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [data]);

  // Risk Analysis by Approval Status
  const riskAnalysis = useMemo(() => {
    const grouped = data.reduce((acc, r) => {
      const key = `${r.approval_status}`;
      if (!acc[key]) acc[key] = { status: r.approval_status, highRisk: 0, lowRisk: 0 };
      if (r.risk_flag === 'Yes') {
        acc[key].highRisk += 1;
      } else {
        acc[key].lowRisk += 1;
      }
      return acc;
    }, {} as Record<string, { status: string; highRisk: number; lowRisk: number }>);
    return Object.values(grouped);
  }, [data]);

  const formatCurrency = (value: number) => `$${(value / 1000000).toFixed(2)}M`;
  const formatK = (value: number) => `$${(value / 1000).toFixed(0)}K`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {/* Revenue vs Expense Trend */}
      <Card className="col-span-1 lg:col-span-2 border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Revenue vs Expense Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={revenueExpenseTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#2E6F40" strokeWidth={2} name="Revenue" />
              <Line type="monotone" dataKey="expense" stroke="#68BA7F" strokeWidth={2} name="Expense" />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gross Profit Trend */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Gross Profit Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={profitTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Line type="monotone" dataKey="profit" stroke="#253D2C" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Payment Status Distribution */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Payment Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentStatusDist}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {paymentStatusDist.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Revenue by Department */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Revenue by Department</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={revenueByDept}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {revenueByDept.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Expense by Category */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Expense by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseByCategory}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {expenseByCategory.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatK(value)} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Profit Margin by Region and Cash Flow Stability Index Row */}
      <div className="col-span-full flex gap-4">
        {/* Profit Margin by Region Heatmap */}
        <Card className="flex-1 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Profit Margin by Region</CardTitle>
            <p className="text-xs text-muted-foreground">Average profit margin % - Red (low) to Green (high)</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 h-[300px] overflow-y-auto">
              {profitMarginByRegion.map((item, index) => {
                const margin = item.avgMargin;
                const marginColor = margin >= 35 ? '#22c55e' : 
                                   margin >= 30 ? '#84cc16' :
                                   margin >= 25 ? '#eab308' :
                                   margin >= 20 ? '#f97316' : '#ef4444';
                
                return (
                  <div
                    key={item.region}
                    className="relative p-3 rounded-lg border transition-all hover:scale-105 cursor-pointer"
                    style={{ 
                      backgroundColor: `${marginColor}15`,
                      borderColor: `${marginColor}40`
                    }}
                    title={`${item.region}: ${margin.toFixed(1)}% avg margin, ${item.transactionCount} transactions`}
                  >
                    <div className="text-xs font-medium text-foreground mb-1 truncate">
                      {item.region}
                    </div>
                    <div 
                      className="text-lg font-bold mb-1"
                      style={{ color: marginColor }}
                    >
                      {margin.toFixed(1)}%
                    </div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Rev: {formatCurrency(item.revenue)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.transactionCount} txns
                    </div>
                    <div 
                      className="absolute top-1 right-1 w-3 h-3 rounded-full"
                      style={{ backgroundColor: marginColor }}
                    />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Cash Flow Stability Index */}
        <Card className="flex-1 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Cash Flow Stability Index</CardTitle>
            <p className="text-xs text-muted-foreground">Net cash flow with rolling average and confidence band</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={cashFlowStability}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 11 }} 
                  stroke="hsl(var(--muted-foreground))" 
                  tickFormatter={(value) => value.slice(-2)}
                />
                <YAxis 
                  tickFormatter={formatK} 
                  tick={{ fontSize: 11 }} 
                  stroke="hsl(var(--muted-foreground))" 
                />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    const label = name === 'cashFlow' ? 'Cash Flow' : 
                                 name === 'rollingAvg' ? 'Rolling Avg' : name;
                    return [formatK(value), label];
                  }}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Legend />
                
                {/* Confidence Band */}
                <Area
                  type="monotone"
                  dataKey="upperBand"
                  stackId="1"
                  stroke="none"
                  fill="#4A8B5C"
                  fillOpacity={0.1}
                  name="Confidence Band"
                />
                <Area
                  type="monotone"
                  dataKey="lowerBand"
                  stackId="1"
                  stroke="none"
                  fill="#4A8B5C"
                  fillOpacity={0.1}
                />
                
                {/* Rolling Average Line */}
                <Line
                  type="monotone"
                  dataKey="rollingAvg"
                  stroke="#2E6F40"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Rolling Avg"
                />
                
                {/* Actual Cash Flow Line */}
                <Line
                  type="monotone"
                  dataKey="cashFlow"
                  stroke={(entry: any) => entry?.isNegative ? '#ef4444' : '#22c55e'}
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#4A8B5C' }}
                  activeDot={{ r: 6 }}
                  name="Cash Flow"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Budget Comparison */}
      <Card className="col-span-1 lg:col-span-2 border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Budget Control by Cost Center</CardTitle>
          <p className="text-xs text-muted-foreground">Green: Under budget | Red: Over budget</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={budgetComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="costCenter" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="glass-card rounded-lg p-3 shadow-lg border border-border/50">
                        <p className="font-medium text-foreground mb-2">{label}</p>
                        <div className="space-y-1 text-sm">
                          <div>Allocated: {formatCurrency(data.allocated)}</div>
                          <div>Used: {formatCurrency(data.used)}</div>
                          <div className={`font-medium ${
                            data.isOverBudget ? 'text-red-500' : 'text-green-500'
                          }`}>
                            Variance: {data.variance > 0 ? '+' : ''}{data.variance.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Bar dataKey="allocated" fill="#68BA7F" name="Allocated" />
              <Bar dataKey="used" name="Used">
                {budgetComparison.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.isOverBudget ? '#ef4444' : '#22c55e'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Risk Analysis */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Risk Analysis by Approval Status</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={riskAnalysis}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="status" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Legend />
              <Bar dataKey="highRisk" stackId="a" fill="#68BA7F" name="High Risk" />
              <Bar dataKey="lowRisk" stackId="a" fill="#2E6F40" name="Low Risk" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}