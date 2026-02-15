import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { SaleRecord } from '@/types/sales';

interface RegionChartProps {
  data: SaleRecord[];
}

const COLORS = [
  '#2E6F40',
  '#CFFFDC',
  '#68BA7F',
  '#253D2C',
  '#4A8B5C',
];

export function RegionChart({ data }: RegionChartProps) {
  const chartData = useMemo(() => {
    const monthlyData: Record<string, Record<string, number>> = {};
    
    data.forEach(record => {
      const month = record.date.substring(0, 7); // YYYY-MM
      if (!monthlyData[month]) {
        monthlyData[month] = {};
      }
      if (!monthlyData[month][record.customer_region]) {
        monthlyData[month][record.customer_region] = 0;
      }
      monthlyData[month][record.customer_region] += record.total_revenue;
    });

    return Object.entries(monthlyData)
      .map(([month, regions]) => ({ month, ...regions }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12); // Last 12 months
  }, [data]);

  const regions = useMemo(() => {
    const regionSet = new Set<string>();
    data.forEach(record => regionSet.add(record.customer_region));
    return Array.from(regionSet).slice(0, 5);
  }, [data]);

  const formatCurrency = (value: number) => {
    return `$${(value / 1000).toFixed(0)}K`;
  };

  return (
    <div className="chart-container h-[350px]">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Revenue Volatility by Region</h3>
        <p className="text-sm text-muted-foreground">Monthly revenue trends across regions</p>
      </div>
      
      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={chartData} margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
            tickFormatter={(value) => value.slice(-2)} // Show only MM
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
            tickFormatter={formatCurrency}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="glass-card rounded-lg p-3 shadow-lg border border-border/50">
                    <p className="font-medium text-foreground mb-2">{label}</p>
                    {payload.map((entry, index) => (
                      <div key={index} className="flex items-center gap-2 mb-1">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: entry.color }}
                        ></div>
                        <span className="text-sm text-foreground">
                          {entry.dataKey}: {formatCurrency(entry.value as number)}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
          />
          {regions.map((region, index) => (
            <Line
              key={region}
              type="monotone"
              dataKey={region}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}