import { useMemo } from 'react';
import { Treemap as RechartsTreemap, ResponsiveContainer, Tooltip } from 'recharts';
import { SaleRecord } from '@/types/sales';

interface TreemapProps {
  data: SaleRecord[];
}

const COLORS = [
  'hsl(187, 94%, 43%)',
  'hsl(217, 91%, 60%)',
  'hsl(142, 76%, 36%)',
  'hsl(38, 92%, 50%)',
  'hsl(262, 83%, 58%)',
  'hsl(187, 94%, 53%)',
  'hsl(217, 91%, 70%)',
];

export function CategoryTreemap({ data }: TreemapProps) {
  const treemapData = useMemo(() => {
    const categoryProducts: Record<string, Record<string, number>> = {};
    
    data.forEach(record => {
      if (!categoryProducts[record.product_category]) {
        categoryProducts[record.product_category] = {};
      }
      categoryProducts[record.product_category][record.product_id] = 
        (categoryProducts[record.product_category][record.product_id] || 0) + record.total_revenue;
    });

    return Object.entries(categoryProducts).map(([category, products], catIndex) => ({
      name: category,
      children: Object.entries(products).map(([product, revenue]) => ({
        name: product,
        size: revenue,
        category,
      })),
      color: COLORS[catIndex % COLORS.length],
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

  const CustomContent = (props: any) => {
    const { x, y, width, height, name, depth, color, size } = props;
    
    if (width < 30 || height < 20) return null;
    
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: depth === 1 ? color : `${color}cc`,
            stroke: 'hsl(var(--background))',
            strokeWidth: 2,
            strokeOpacity: 1,
          }}
        />
        {width > 50 && height > 30 && (
          <text
            x={x + width / 2}
            y={y + height / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{
              fontSize: depth === 1 ? 12 : 10,
              fill: 'white',
              fontWeight: depth === 1 ? 600 : 400,
            }}
          >
            {name?.length > 10 ? `${name.slice(0, 10)}...` : name}
          </text>
        )}
      </g>
    );
  };

  return (
    <div className="chart-container h-[300px]">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Category Breakdown</h3>
        <p className="text-sm text-muted-foreground">Revenue contribution by category & product</p>
      </div>
      
      <ResponsiveContainer width="100%" height="80%">
        <RechartsTreemap
          data={treemapData}
          dataKey="size"
          aspectRatio={4 / 3}
          stroke="hsl(var(--background))"
          content={<CustomContent />}
        >
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="glass-card rounded-lg p-3 shadow-lg border border-border/50">
                    <p className="font-medium text-foreground">{data.name}</p>
                    {data.category && (
                      <p className="text-xs text-muted-foreground">{data.category}</p>
                    )}
                    <p className="text-sm text-primary">{formatCurrency(data.size || 0)}</p>
                  </div>
                );
              }
              return null;
            }}
          />
        </RechartsTreemap>
      </ResponsiveContainer>
    </div>
  );
}
