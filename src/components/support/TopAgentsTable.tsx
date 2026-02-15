import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award } from 'lucide-react';
import { SupportRecord } from '@/types/support';

interface TopAgentsTableProps {
  data: SupportRecord[];
}

interface AgentPerformance {
  agent_id: string;
  agent_name: string;
  agent_team: string;
  tickets_handled: number;
  avg_resolution_time: number;
  sla_compliance_percent: number;
  avg_csat: number;
}

export function TopAgentsTable({ data }: TopAgentsTableProps) {
  const topAgents = useMemo((): AgentPerformance[] => {
    const agentMap = new Map<string, {
      agent_id: string;
      agent_name: string;
      agent_team: string;
      tickets: number;
      totalResTime: number;
      slaCompliant: number;
      totalCSAT: number;
      csatCount: number;
    }>();

    data.forEach(record => {
      if (!record.agent_name) return;
      
      const existing = agentMap.get(record.agent_name) || {
        agent_id: record.agent_id,
        agent_name: record.agent_name,
        agent_team: record.agent_team,
        tickets: 0,
        totalResTime: 0,
        slaCompliant: 0,
        totalCSAT: 0,
        csatCount: 0,
      };

      existing.tickets++;
      existing.totalResTime += record.resolution_time_minutes;
      if (record.sla_breached_flag === 'No') existing.slaCompliant++;
      if (record.customer_satisfaction_score > 0) {
        existing.totalCSAT += record.customer_satisfaction_score;
        existing.csatCount++;
      }

      agentMap.set(record.agent_name, existing);
    });

    return Array.from(agentMap.values())
      .map(agent => ({
        agent_id: agent.agent_id,
        agent_name: agent.agent_name,
        agent_team: agent.agent_team,
        tickets_handled: agent.tickets,
        avg_resolution_time: agent.tickets > 0 ? Math.round(agent.totalResTime / agent.tickets) : 0,
        sla_compliance_percent: agent.tickets > 0 ? (agent.slaCompliant / agent.tickets) * 100 : 0,
        avg_csat: agent.csatCount > 0 ? agent.totalCSAT / agent.csatCount : 0,
      }))
      .sort((a, b) => {
        // Sort by SLA compliance (DESC), then resolution time (ASC), then CSAT (DESC)
        if (b.sla_compliance_percent !== a.sla_compliance_percent) {
          return b.sla_compliance_percent - a.sla_compliance_percent;
        }
        if (a.avg_resolution_time !== b.avg_resolution_time) {
          return a.avg_resolution_time - b.avg_resolution_time;
        }
        return b.avg_csat - a.avg_csat;
      })
      .slice(0, 10);
  }, [data]);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 1: return <Medal className="w-5 h-5 text-gray-400" />;
      case 2: return <Award className="w-5 h-5 text-amber-600" />;
      default: return <span className="w-5 text-center font-medium text-muted-foreground">{index + 1}</span>;
    }
  };

  const getSLABadgeColor = (percentage: number) => {
    if (percentage >= 95) return 'bg-green-100 text-green-800';
    if (percentage >= 80) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Top Performing Support Agents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Rank</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Team</TableHead>
              <TableHead className="text-right">Tickets</TableHead>
              <TableHead className="text-right">Avg Res. Time</TableHead>
              <TableHead className="text-right">SLA Compliance</TableHead>
              <TableHead className="text-right">Avg CSAT</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topAgents.map((agent, index) => (
              <TableRow key={agent.agent_id || agent.agent_name}>
                <TableCell>{getRankIcon(index)}</TableCell>
                <TableCell className="font-medium">{agent.agent_name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{agent.agent_team}</Badge>
                </TableCell>
                <TableCell className="text-right">{agent.tickets_handled}</TableCell>
                <TableCell className="text-right">{agent.avg_resolution_time} min</TableCell>
                <TableCell className="text-right">
                  <Badge className={getSLABadgeColor(agent.sla_compliance_percent)}>
                    {agent.sla_compliance_percent.toFixed(1)}%
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <span className="flex items-center justify-end gap-1">
                    {agent.avg_csat.toFixed(1)}
                    <span className="text-yellow-500">★</span>
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
