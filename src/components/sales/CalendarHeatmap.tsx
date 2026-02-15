import { useMemo } from 'react';
import { SaleRecord } from '@/types/sales';
import { format, parseISO, startOfWeek, addDays, eachDayOfInterval, subDays } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CalendarHeatmapProps {
  data: SaleRecord[];
}

export function CalendarHeatmap({ data }: CalendarHeatmapProps) {
  const { heatmapData, maxRevenue, weeks } = useMemo(() => {
    const dailyRevenue: Record<string, number> = {};
    
    data.forEach(record => {
      const date = record.date.split('T')[0];
      dailyRevenue[date] = (dailyRevenue[date] || 0) + record.total_revenue;
    });

    const dates = Object.keys(dailyRevenue).sort();
    if (dates.length === 0) {
      return { heatmapData: {}, maxRevenue: 0, weeks: [] };
    }

    const endDate = new Date();
    const startDate = subDays(endDate, 84); // 12 weeks
    
    const allDays = eachDayOfInterval({ start: startDate, end: endDate });
    
    // Group by week
    const weekMap: Record<string, { date: Date; revenue: number }[]> = {};
    
    allDays.forEach(day => {
      const weekStart = format(startOfWeek(day, { weekStartsOn: 0 }), 'yyyy-MM-dd');
      const dateStr = format(day, 'yyyy-MM-dd');
      
      if (!weekMap[weekStart]) {
        weekMap[weekStart] = [];
      }
      
      weekMap[weekStart].push({
        date: day,
        revenue: dailyRevenue[dateStr] || 0,
      });
    });

    const maxRev = Math.max(...Object.values(dailyRevenue), 1);
    
    return {
      heatmapData: dailyRevenue,
      maxRevenue: maxRev,
      weeks: Object.entries(weekMap)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([_, days]) => days),
    };
  }, [data]);

  const getColor = (revenue: number) => {
    if (revenue === 0) return 'bg-muted/50';
    const intensity = Math.min(revenue / maxRevenue, 1);
    if (intensity < 0.25) return 'bg-green-200';
    if (intensity < 0.5) return 'bg-green-400';
    if (intensity < 0.75) return 'bg-green-600';
    return 'bg-green-800';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="chart-container h-[350px]">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Revenue Heatmap</h3>
        <p className="text-sm text-muted-foreground">Last 12 weeks of daily revenue</p>
      </div>
      
      <div className="flex gap-1">
        <div className="flex flex-col gap-1 mr-2 text-xs text-muted-foreground">
          {dayLabels.map((day, i) => (
            <div key={day} className="h-4 flex items-center">
              {i % 2 === 0 && day}
            </div>
          ))}
        </div>
        
        <div className="flex gap-1 overflow-x-auto pb-2">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => (
                <Tooltip key={dayIndex}>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        'w-4 h-4 rounded-sm cursor-pointer transition-all hover:ring-2 hover:ring-ring hover:ring-offset-1',
                        getColor(day.revenue)
                      )}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-medium">{format(day.date, 'MMM d, yyyy')}</p>
                    <p className="text-sm text-primary">
                      {day.revenue === 0 ? 'No sales' : formatCurrency(day.revenue)}
                    </p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-muted/50" />
          <div className="w-3 h-3 rounded-sm bg-green-200" />
          <div className="w-3 h-3 rounded-sm bg-green-400" />
          <div className="w-3 h-3 rounded-sm bg-green-600" />
          <div className="w-3 h-3 rounded-sm bg-green-800" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
