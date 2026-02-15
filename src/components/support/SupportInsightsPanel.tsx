import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

interface SupportInsightsPanelProps {
  insights: string[];
}

export function SupportInsightsPanel({ insights }: SupportInsightsPanelProps) {
  if (insights.length === 0) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-cyan-800">
          <Lightbulb className="w-5 h-5" />
          AI-Generated CX Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {insights.map((insight, index) => (
            <li
              key={index}
              className="text-sm text-gray-700 bg-white/60 rounded-lg p-3 border border-cyan-100"
            >
              {insight}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
