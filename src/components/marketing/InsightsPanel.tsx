import { Lightbulb } from 'lucide-react';

interface InsightsPanelProps {
  insights: string[];
}

export function InsightsPanel({ insights }: InsightsPanelProps) {
  if (insights.length === 0) return null;

  return (
    <div className="glass-card rounded-xl p-5 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-warning/10 rounded-lg">
          <Lightbulb className="w-5 h-5 text-warning" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">AI-Generated Insights</h3>
      </div>
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div
            key={index}
            className="p-3 bg-muted/30 rounded-lg text-sm text-foreground border-l-2 border-primary/50"
          >
            {insight}
          </div>
        ))}
      </div>
    </div>
  );
}
