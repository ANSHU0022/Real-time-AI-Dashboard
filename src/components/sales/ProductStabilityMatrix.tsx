import { useMemo } from 'react';
import { ResponsiveContainer, Cell } from 'recharts';
import { SaleRecord } from '@/types/sales';

interface ProductStabilityMatrixProps {
  data: SaleRecord[];
}

export function ProductStabilityMatrix({ data }: ProductStabilityMatrixProps) {
  const matrixData = useMemo(() => {
    const matrix: Record<string, Record<string, number>> = {};
    const renewalStatuses = new Set<string>();
    
    data.forEach(record => {
      if (!matrix[record.product_id]) {
        matrix[record.product_id] = {};
      }
      if (!matrix[record.product_id][record.renewal_status]) {
        matrix[record.product_id][record.renewal_status] = 0;
      }
      matrix[record.product_id][record.renewal_status] += record.total_revenue;
      renewalStatuses.add(record.renewal_status);
    });

    const products = Object.keys(matrix).slice(0, 6);
    const statuses = Array.from(renewalStatuses);
    
    const maxRevenue = Math.max(
      ...products.flatMap(product => 
        statuses.map(status => matrix[product]?.[status] || 0)
      )
    );

    return { products, statuses, matrix, maxRevenue };
  }, [data]);

  const getIntensityColor = (revenue: number, maxRevenue: number) => {
    const intensity = revenue / maxRevenue;
    if (intensity > 0.8) return '#253D2C';
    if (intensity > 0.6) return '#2E6F40';
    if (intensity > 0.4) return '#4A8B5C';
    if (intensity > 0.2) return '#68BA7F';
    if (intensity > 0) return '#CFFFDC';
    return '#F8F9FA';
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  };

  return (
    <div className="chart-container h-[350px]">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Product Revenue Stability Matrix</h3>
        <p className="text-sm text-muted-foreground">Revenue by product and renewal status</p>
      </div>
      
      <div className="h-[280px]">
        <div className="w-full">
          {/* Header */}
          <div className="grid grid-cols-[80px_repeat(auto-fit,minmax(60px,1fr))] gap-1 mb-1">
            <div className="text-xs font-medium text-muted-foreground p-1">Product</div>
            {matrixData.statuses.map(status => (
              <div key={status} className="text-xs font-medium text-muted-foreground p-1 text-center">
                {status.slice(0, 8)}
              </div>
            ))}
          </div>
          
          {/* Matrix Rows */}
          {matrixData.products.map(product => (
            <div key={product} className="grid grid-cols-[80px_repeat(auto-fit,minmax(60px,1fr))] gap-1 mb-1">
              <div className="text-xs font-medium text-foreground p-1 truncate bg-muted/20 rounded">
                {product.slice(0, 8)}
              </div>
              {matrixData.statuses.map(status => {
                const revenue = matrixData.matrix[product]?.[status] || 0;
                const color = getIntensityColor(revenue, matrixData.maxRevenue);
                
                return (
                  <div
                    key={`${product}-${status}`}
                    className="relative group cursor-pointer rounded transition-all duration-200 hover:scale-105 hover:shadow-md"
                    style={{ backgroundColor: color }}
                  >
                    <div className="p-1 h-8 flex items-center justify-center">
                      <span className="text-xs font-medium text-white drop-shadow-sm">
                        {revenue > 0 ? formatCurrency(revenue) : '—'}
                      </span>
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                      {product} - {status}: {formatCurrency(revenue)}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
          
          {/* Legend */}
          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <span>Intensity:</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded" style={{ backgroundColor: '#F8F9FA' }}></div>
              <span>Low</span>
            </div>
            <div className="w-2 h-2 rounded" style={{ backgroundColor: '#CFFFDC' }}></div>
            <div className="w-2 h-2 rounded" style={{ backgroundColor: '#68BA7F' }}></div>
            <div className="w-2 h-2 rounded" style={{ backgroundColor: '#2E6F40' }}></div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded" style={{ backgroundColor: '#253D2C' }}></div>
              <span>High</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}