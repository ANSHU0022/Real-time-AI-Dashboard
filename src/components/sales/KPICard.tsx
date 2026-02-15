import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: number;
  format: 'currency' | 'number' | 'percent' | 'currencyShort' | 'million';
  icon: React.ReactNode;
  trend?: number;
  sparklineData?: number[];
  delay?: number;
  gradient?: 'primary' | 'secondary' | 'success' | 'warning' | 'accent' | 'info';
  change?: number; // Percentage change
}

export function KPICard({
  title,
  value,
  format,
  icon,
  trend,
  sparklineData = [],
  delay = 0,
  gradient = 'primary',
  change,
}: KPICardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!isVisible) return;
    
    const duration = 1000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value, isVisible]);

  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(val);
      case 'currencyShort':
        if (val >= 1000000) {
          return `$${(val / 1000000).toFixed(1)}M`;
        } else if (val >= 1000) {
          return `$${(val / 1000).toFixed(1)}K`;
        } else {
          return `$${val.toFixed(0)}`;
        }
      case 'million':
        if (val >= 1000000) {
          return `$${(val / 1000000).toFixed(1)}M`;
        } else if (val >= 1000) {
          return `$${(val / 1000).toFixed(1)}K`;
        } else {
          return `$${val.toFixed(0)}`;
        }
      case 'percent':
        return `${(val * 100).toFixed(1)}%`;
      case 'number':
      default:
        if (val >= 1000000) {
          return `${(val / 1000000).toFixed(1)}M`;
        } else if (val >= 1000) {
          return `${(val / 1000).toFixed(1)}K`;
        } else {
          return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: val < 100 ? 2 : 0,
          }).format(val);
        }
    }
  };

  const gradientClasses = {
    primary: 'from-primary/10 to-primary/5',
    secondary: 'from-secondary/10 to-secondary/5',
    success: 'from-success/10 to-success/5',
    warning: 'from-warning/10 to-warning/5',
    accent: 'from-accent/10 to-accent/5',
    info: 'from-info/10 to-info/5',
  };

  const iconBgClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    success: 'text-success',
    warning: 'text-warning',
    accent: 'text-accent',
    info: 'text-info',
  };

  return (
    <div
      className={cn(
        'glass-card rounded-xl p-5 transition-all duration-500 hover:shadow-card-hover hover:-translate-y-1',
        'bg-gradient-to-br',
        gradientClasses[gradient],
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      )}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className={cn('shrink-0', iconBgClasses[gradient])}>
            <div className="w-8 h-8 flex items-center justify-center">
              {icon}
            </div>
          </div>
          <div className="w-px h-12 bg-border opacity-60❌ 1. Top 10 Campaigns by Revenue (Bar)
Why it’s weak

High revenue ≠ good campaign

Completely ignores:

Cost

Duration

ROI

Conversion efficiency

This is a vanity chart.

✅ REPLACE WITH: Campaign Efficiency Quadrant

Visual
✅ Scatter / Bubble

Axes

X → total_campaign_cost

Y → revenue_generated

Bubble size → conversions

Color → campaign_type

Hidden insights

High revenue but inefficient campaigns

Low cost + high ROI hidden winners

Which campaign type actually scales

This is far more senior-level."></div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground mb-1 truncate leading-tight">{title}</p>
            <p className="text-xl font-bold text-foreground tracking-tight leading-tight">
              {formatValue(displayValue)}
            </p>
          </div>
        </div>
        {(trend !== undefined || change !== undefined) && (
          <div className={cn(
            'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full shrink-0',
            (trend || change || 0) > 0 ? 'bg-success/10 text-success' :
            (trend || change || 0) < 0 ? 'bg-destructive/10 text-destructive' :
            'bg-muted text-muted-foreground'
          )}>
            {change !== undefined ? (
              <>
                {change > 0 ? '↑' : change < 0 ? '↓' : '→'}
                {Math.abs(change).toFixed(1)}%
              </>
            ) : (
              <>
                {trend! > 0 ? <TrendingUp className="w-3 h-3" /> :
                 trend! < 0 ? <TrendingDown className="w-3 h-3" /> :
                 <Minus className="w-3 h-3" />}
                {Math.abs(trend!)}%
              </>
            )}
          </div>
        )}
      </div>

      {sparklineData.length > 0 && (
        <div className="mt-3 h-8 flex items-end gap-0.5">
          {sparklineData.slice(-20).map((val, i) => {
            const max = Math.max(...sparklineData);
            const height = max === 0 ? 0 : (val / max) * 100;
            return (
              <div
                key={i}
                className={cn(
                  'flex-1 rounded-t transition-all duration-300',
                  gradient === 'primary' ? 'bg-primary/40' :
                  gradient === 'secondary' ? 'bg-secondary/40' :
                  gradient === 'success' ? 'bg-success/40' :
                  gradient === 'warning' ? 'bg-warning/40' :
                  gradient === 'info' ? 'bg-info/40' :
                  'bg-accent/40'
                )}
                style={{ height: `${Math.max(height, 4)}%` }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
