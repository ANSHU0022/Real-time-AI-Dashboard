import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

interface FinanceInsightsPanelProps {
  insights: string[];
}

export function FinanceInsightsPanel({ insights }: FinanceInsightsPanelProps) {
  if (insights.length === 0) {
    return null;
  }

  return (
    <Card className="border-border/50 bg-gradient-to-br from-card to-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Lightbulb className="w-5 h-5 text-primary" />
          AI-Generated Finance Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {insights.map((insight, index) => (
            <div
              key={index}
              className="p-3 bg-background rounded-lg border border-border/50 text-sm text-foreground/90 leading-relaxed"
            >
              {insight}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
