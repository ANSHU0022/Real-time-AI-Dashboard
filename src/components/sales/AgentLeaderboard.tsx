import { useMemo, useState } from 'react';
import { SaleRecord } from '@/types/sales';
import { ChevronUp, ChevronDown, Trophy, Medal, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AgentLeaderboardProps {
  data: SaleRecord[];
}

type SortKey = 'revenue' | 'orders' | 'avgRevenue';
type SortOrder = 'asc' | 'desc';

export function AgentLeaderboard({ data }: AgentLeaderboardProps) {
  const [sortKey, setSortKey] = useState<SortKey>('revenue');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const agentData = useMemo(() => {
    const agents: Record<string, { revenue: number; orders: Set<string> }> = {};
    
    data.forEach(record => {
      if (!agents[record.sales_agent]) {
        agents[record.sales_agent] = { revenue: 0, orders: new Set() };
      }
      agents[record.sales_agent].revenue += record.total_revenue;
      agents[record.sales_agent].orders.add(record.sale_id);
    });

    return Object.entries(agents)
      .map(([agent, stats]) => ({
        agent,
        revenue: stats.revenue,
        orders: stats.orders.size,
        avgRevenue: stats.orders.size === 0 ? 0 : stats.revenue / stats.orders.size,
      }))
      .sort((a, b) => {
        const multiplier = sortOrder === 'desc' ? -1 : 1;
        return (a[sortKey] - b[sortKey]) * multiplier;
      });
  }, [data, sortKey, sortOrder]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const SortIcon = ({ active, order }: { active: boolean; order: SortOrder }) => {
    if (!active) return <ChevronDown className="w-4 h-4 text-muted-foreground/50" />;
    return order === 'desc' ? 
      <ChevronDown className="w-4 h-4 text-primary" /> : 
      <ChevronUp className="w-4 h-4 text-primary" />;
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-5 h-5 text-warning" />;
    if (index === 1) return <Medal className="w-5 h-5 text-muted-foreground" />;
    if (index === 2) return <Award className="w-5 h-5 text-warning/60" />;
    return <span className="w-5 text-center text-muted-foreground">{index + 1}</span>;
  };

  return (
    <div className="chart-container h-[350px]">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Sales Agent Leaderboard</h3>
      </div>
      
      <div className="overflow-auto h-[calc(100%-60px)]">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-card z-10">
            <tr className="border-b border-border">
              <th className="text-left py-2 px-2 w-8">#</th>
              <th className="text-left py-2 px-2">Agent</th>
              <th 
                className="text-right py-2 px-2 cursor-pointer hover:text-primary transition-colors"
                onClick={() => handleSort('revenue')}
              >
                <span className="flex items-center justify-end gap-1">
                  Revenue
                  <SortIcon active={sortKey === 'revenue'} order={sortOrder} />
                </span>
              </th>
              <th 
                className="text-right py-2 px-2 cursor-pointer hover:text-primary transition-colors"
                onClick={() => handleSort('orders')}
              >
                <span className="flex items-center justify-end gap-1">
                  Orders
                  <SortIcon active={sortKey === 'orders'} order={sortOrder} />
                </span>
              </th>
              <th 
                className="text-right py-2 px-2 cursor-pointer hover:text-primary transition-colors"
                onClick={() => handleSort('avgRevenue')}
              >
                <span className="flex items-center justify-end gap-1">
                  Avg
                  <SortIcon active={sortKey === 'avgRevenue'} order={sortOrder} />
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {agentData.map((agent, index) => (
              <tr 
                key={agent.agent} 
                className={cn(
                  'border-b border-border/50 transition-colors hover:bg-muted/30',
                  index < 3 && 'bg-gradient-to-r from-primary/5 to-transparent'
                )}
              >
                <td className="py-2.5 px-2">
                  {getRankIcon(index)}
                </td>
                <td className="py-2.5 px-2 font-medium">{agent.agent}</td>
                <td className="py-2.5 px-2 text-right text-success font-semibold">
                  {formatCurrency(agent.revenue)}
                </td>
                <td className="py-2.5 px-2 text-right text-muted-foreground">
                  {agent.orders}
                </td>
                <td className="py-2.5 px-2 text-right text-muted-foreground">
                  {formatCurrency(agent.avgRevenue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
