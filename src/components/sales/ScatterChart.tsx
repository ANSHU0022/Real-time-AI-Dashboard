import { useMemo } from 'react';
import {
  ScatterChart as RechartsScatter,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
} from 'recharts';
import { SaleRecord } from '@/types/sales';

interface ScatterChartProps {
  data: SaleRecord[];
}

export function DiscountScatterChart({ data }: ScatterChartProps) {
  const chartData = useMemo(() => {
    return data.map(record => ({
      x: record.discount_percent,
      y: record.total_revenue,
      z: record.quantity,
      product: record.product_id,
      agent: record.sales_agent,
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
    <div className="chart-container h-[300px]">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Discount vs Revenue</h3>
        <p className="text-sm text-muted-foreground">Bubble size = quantity sold</p>
      </div>
      
      <ResponsiveContainer width="100%" height="80%">
        <RechartsScatter margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            type="number"
            dataKey="x"
            name="Discount %"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            tickFormatter={(value) => `${value}%`}
            domain={[0, 'dataMax']}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Revenue"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <ZAxis type="number" dataKey="z" range={[20, 400]} />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="glass-card rounded-lg p-3 shadow-lg border border-border/50">
                    <p className="font-medium text-foreground mb-1">{data.product}</p>
                    <p className="text-sm text-muted-foreground">Agent: {data.agent}</p>
                    <p className="text-sm text-primary">Revenue: {formatCurrency(data.y)}</p>
                    <p className="text-sm text-secondary">Discount: {data.x}%</p>
                    <p className="text-sm text-muted-foreground">Qty: {data.z}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Scatter
            data={chartData}
            fill="hsl(var(--primary))"
            fillOpacity={0.6}
          />
        </RechartsScatter>
      </ResponsiveContainer>
    </div>
  );
}
