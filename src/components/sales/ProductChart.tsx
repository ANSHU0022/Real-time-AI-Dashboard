import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { SaleRecord, DashboardFilters } from '@/types/sales';

interface ProductChartProps {
  data: SaleRecord[];
  onProductClick: (productId: string | null) => void;
  selectedProduct: string | null;
}

const COLORS = [
  '#2E6F40',
  '#CFFFDC', 
  '#68BA7F',
  '#253D2C',
  '#4A8B5C',
  '#5F9A6B',
  '#A8E6B7',
  '#3A7A4A',
  '#1F4A28',
  '#6BC47D',
];

export function ProductChart({ data, onProductClick, selectedProduct }: ProductChartProps) {
  const chartData = useMemo(() => {
    const productRevenue: Record<string, { revenue: number; category: string }> = {};
    
    data.forEach(record => {
      if (!productRevenue[record.product_id]) {
        productRevenue[record.product_id] = { revenue: 0, category: record.product_category };
      }
      productRevenue[record.product_id].revenue += record.total_revenue;
    });

    return Object.entries(productRevenue)
      .map(([product, { revenue, category }]) => ({ product, revenue, category }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
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
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Top 10 Products</h3>
        <p className="text-sm text-muted-foreground">Click a bar to filter by product</p>
      </div>
      
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={true} vertical={false} />
          <XAxis
            type="number"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <YAxis
            type="category"
            dataKey="product"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(var(--foreground))', fontSize: 11 }}
            width={80}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="glass-card rounded-lg p-3 shadow-lg border border-border/50">
                    <p className="font-medium text-foreground mb-1">{data.product}</p>
                    <p className="text-xs text-muted-foreground mb-1">{data.category}</p>
                    <p className="text-sm text-primary">{formatCurrency(data.revenue)}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar
            dataKey="revenue"
            radius={[0, 4, 4, 0]}
            cursor="pointer"
            onClick={(data) => {
              const product = data.product;
              onProductClick(selectedProduct === product ? null : product);
            }}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                opacity={selectedProduct && selectedProduct !== entry.product ? 0.3 : 1}
                stroke={selectedProduct === entry.product ? '#253D2C' : 'transparent'}
                strokeWidth={2}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
