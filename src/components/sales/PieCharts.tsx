import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { SaleRecord } from '@/types/sales';

interface PieChartsProps {
  data: SaleRecord[];
}

const COLORS = [
  '#2E6F40', // Dark forest green
  '#CFFFDC', // Light mint green
  '#68BA7F', // Medium forest green
  '#253D2C', // Deep forest green
  '#4A8B5C', // Forest green variant
];

export function SubscriptionPieChart({ data }: PieChartsProps) {
  const chartData = useMemo(() => {
    const subs: Record<string, number> = {};
    data.forEach(record => {
      subs[record.subscription_type] = (subs[record.subscription_type] || 0) + record.total_revenue;
    });
    return Object.entries(subs)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [data]);

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="chart-container h-[350px] glass-card rounded-xl p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border border-border/50 hover:shadow-lg transition-all duration-300">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
          Subscription Types
        </h3>
        <p className="text-sm text-muted-foreground">Revenue by subscription</p>
      </div>
      
      <ResponsiveContainer width="100%" height="75%">
        <PieChart>
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={85}
            paddingAngle={4}
            dataKey="value"
            strokeWidth={2}
            stroke="rgba(255,255,255,0.1)"
            filter="url(#glow)"
          >
            {chartData.map((_, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
                style={{
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                const percentage = ((data.value / total) * 100).toFixed(1);
                return (
                  <div className="glass-card rounded-lg p-4 shadow-xl border border-border/50 backdrop-blur-md bg-background/80">
                    <p className="font-semibold text-foreground text-base">{data.name}</p>
                    <p className="text-lg text-primary font-bold">
                      ${(data.value / 1000).toFixed(1)}k
                    </p>
                    <p className="text-sm text-muted-foreground">{percentage}% of total</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => <span className="text-sm text-foreground font-medium">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PaymentPieChart({ data }: PieChartsProps) {
  const chartData = useMemo(() => {
    const payments: Record<string, number> = {};
    data.forEach(record => {
      payments[record.payment_method] = (payments[record.payment_method] || 0) + record.total_revenue;
    });
    return Object.entries(payments)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [data]);

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="chart-container h-[350px] glass-card rounded-xl p-6 bg-gradient-to-br from-success/5 to-info/5 border border-border/50 hover:shadow-lg transition-all duration-300">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
          Payment Methods
        </h3>
        <p className="text-sm text-muted-foreground">Revenue by payment type</p>
      </div>
      
      <ResponsiveContainer width="100%" height="75%">
        <PieChart>
          <defs>
            <filter id="shadow">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.2"/>
            </filter>
          </defs>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={85}
            dataKey="value"
            strokeWidth={3}
            stroke="rgba(255,255,255,0.2)"
            filter="url(#shadow)"
          >
            {chartData.map((_, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
                style={{
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                const percentage = ((data.value / total) * 100).toFixed(1);
                return (
                  <div className="glass-card rounded-lg p-4 shadow-xl border border-border/50 backdrop-blur-md bg-background/80">
                    <p className="font-semibold text-foreground text-base">{data.name}</p>
                    <p className="text-lg text-success font-bold">
                      ${(data.value / 1000).toFixed(1)}k
                    </p>
                    <p className="text-sm text-muted-foreground">{percentage}% of total</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => <span className="text-sm text-foreground font-medium">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
