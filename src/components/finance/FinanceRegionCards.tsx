import { useMemo } from 'react';
import { FinanceRecord } from '@/types/finance';
import { Card } from '@/components/ui/card';

interface FinanceRegionCardsProps {
  data: FinanceRecord[];
}

interface RegionStats {
  region: string;
  revenue: number;
  transactions: number;
  percentChange: number;
}

export function FinanceRegionCards({ data }: FinanceRegionCardsProps) {
  const regionStats = useMemo((): RegionStats[] => {
    const regionData: Record<string, { revenue: number; transactions: number }> = {};
    
    data.forEach(record => {
      if (!regionData[record.customer_region]) {
        regionData[record.customer_region] = { revenue: 0, transactions: 0 };
      }
      regionData[record.customer_region].revenue += record.net_revenue;
      regionData[record.customer_region].transactions += 1;
    });

    const mockChanges: Record<string, number> = {
      'Middle East': -21.3,
      'North America': -29.1,
      'Australia': -29.4,
      'Europe': -36.5,
      'Asia': -37.7,
    };

    return Object.entries(regionData).map(([region, stats]) => ({
      region,
      revenue: stats.revenue,
      transactions: stats.transactions,
      percentChange: mockChanges[region] || Math.random() * -50,
    }));
  }, [data]);

  const formatRevenue = (value: number) => {
    return `$${(value / 1000000).toFixed(2)}M`;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {regionStats.slice(0, 3).map((stats) => (
          <RegionCard key={stats.region} stats={stats} formatRevenue={formatRevenue} />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {regionStats.slice(3, 5).map((stats) => (
          <RegionCard key={stats.region} stats={stats} formatRevenue={formatRevenue} />
        ))}
      </div>
    </div>
  );
}

interface RegionCardProps {
  stats: RegionStats;
  formatRevenue: (value: number) => string;
}

function RegionCard({ stats, formatRevenue }: RegionCardProps) {
  return (
    <Card className="p-4 glass-card border border-border/50 hover:border-border/80 transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-medium text-foreground">{stats.region}</h3>
        <div className="w-2 h-2 rounded-full bg-red-500"></div>
      </div>
      
      <div className="space-y-2">
        <div className="text-2xl font-bold text-red-500">
          {stats.percentChange.toFixed(1)}%
        </div>
        
        <div className="text-sm text-muted-foreground">
          Rev: {formatRevenue(stats.revenue)}
        </div>
        
        <div className="text-sm text-muted-foreground">
          {stats.transactions} txns
        </div>
      </div>
    </Card>
  );
}