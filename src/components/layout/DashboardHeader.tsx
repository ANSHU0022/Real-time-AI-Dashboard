import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  isUsingLiveData: boolean;
  recordCount: number;
  onRefresh?: () => void;
}

export function DashboardHeader({ title, subtitle, isUsingLiveData, recordCount, onRefresh }: DashboardHeaderProps) {
  return (
    <header className="mb-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              {title}
            </h1>
            <p className="text-muted-foreground mt-1">
              {subtitle}
            </p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1.5 ${isUsingLiveData ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'} text-sm font-medium rounded-full flex items-center gap-2`}>
              <span className={`w-2 h-2 ${isUsingLiveData ? 'bg-success' : 'bg-warning'} rounded-full animate-pulse`} />
              {isUsingLiveData ? 'Live Data' : 'Sample Data'}
            </div>
            <span className="text-sm text-muted-foreground">
              {recordCount.toLocaleString()} records
            </span>
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                className="h-8"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
