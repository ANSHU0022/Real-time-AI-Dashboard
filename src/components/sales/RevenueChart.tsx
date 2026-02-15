import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from 'recharts';
import { SaleRecord } from '@/types/sales';
import { format, parseISO } from 'date-fns';

interface RevenueChartProps {
  data: SaleRecord[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  const chartData = useMemo(() => {
    // Group by week for better readability
    const weeklyRevenue: Record<string, number> = {};
    
    data.forEach(record => {
      const date = new Date(record.date);
      // Get Monday of the week
      const monday = new Date(date);
      monday.setDate(date.getDate() - date.getDay() + 1);
      const weekKey = monday.toISOString().split('T')[0];
      
      weeklyRevenue[weekKey] = (weeklyRevenue[weekKey] || 0) + record.total_revenue;
    });

    // Sort by date and format
    return Object.entries(weeklyRevenue)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, revenue]) => ({
        date,
        revenue,
        displayDate: format(parseISO(date), 'MMM d'),
      }));
  }, [data]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="chart-container h-[350px]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Revenue Over Time</h3>
          <p className="text-sm text-muted-foreground">Weekly revenue trends</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-3 h-3 rounded-full bg-success" />
          <span className="text-muted-foreground">Weekly Revenue</span>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="85%">
        <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2E6F40" stopOpacity={0.8} />
              <stop offset="25%" stopColor="#4A8B5C" stopOpacity={0.6} />
              <stop offset="50%" stopColor="#68BA7F" stopOpacity={0.4} />
              <stop offset="75%" stopColor="#CFFFDC" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#CFFFDC" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis
            dataKey="displayDate"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            tickMargin={10}
            interval="preserveStartEnd"
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
            tickMargin={10}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="glass-card rounded-lg p-3 shadow-lg border border-border/50">
                    <p className="font-medium text-foreground mb-1">Week of {label}</p>
                    <p className="text-sm text-success">
                      Revenue: ${(payload[0]?.value as number / 1000).toFixed(0)}K
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#2E6F40"
            strokeWidth={3}
            fill="url(#revenueGradient)"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
