import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

interface HRInsightsPanelProps {
  insights: string[];
}

export function HRInsightsPanel({ insights }: HRInsightsPanelProps) {
  if (insights.length === 0) return null;

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-950/20 dark:to-teal-950/20 border-blue-200 dark:border-blue-800 mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg text-blue-700 dark:text-blue-300">
          <Lightbulb className="w-5 h-5" />
          AI-Generated HR Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {insights.map((insight, index) => (
            <li
              key={index}
              className="text-sm text-foreground/80 pl-4 border-l-2 border-blue-300 dark:border-blue-600"
            >
              {insight}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
