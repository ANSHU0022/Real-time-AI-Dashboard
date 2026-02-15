import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  LineChart,
  Line,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SupportRecord } from '@/types/support';

interface SupportChartsProps {
  data: SupportRecord[];
}

const COLORS = ['#22c55e', '#16a34a', '#15803d', '#166534', '#14532d', '#052e16'];

const formatNumber = (value: number) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};

const formatPercent = (value: number) => `${value.toFixed(1)}%`;
const formatHours = (value: number) => `${value.toFixed(1)}h`;

export function SupportCharts({ data }: SupportChartsProps) {
  // 1. Ticket Volume Trend - Essential for capacity planning
  const ticketVolumeTrend = useMemo(() => {
    const monthlyData = data.reduce((acc, record) => {
      const month = new Date(record.ticket_created_at).toISOString().slice(0, 7);
      if (!acc[month]) {
        acc[month] = { month, tickets: 0 };
      }
      acc[month].tickets++;
      return acc;
    }, {} as Record<string, any>);
    
    return Object.values(monthlyData).sort((a: any, b: any) => a.month.localeCompare(b.month));
  }, [data]);

  // 2. Tickets by Status - Simple but required
  const ticketsByStatus = useMemo(() => {
    const statusCount = data.reduce((acc, record) => {
      acc[record.ticket_status] = (acc[record.ticket_status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(statusCount).map(([status, count]) => ({ status, count }));
  }, [data]);

  // 3. SLA Compliance vs Breach by Priority - Core accountability
  const slaComplianceByPriority = useMemo(() => {
    const priorityStats = data.reduce((acc, record) => {
      if (!acc[record.priority]) {
        acc[record.priority] = { priority: record.priority, compliant: 0, breached: 0 };
      }
      if (record.sla_breached_flag === 'Yes') {
        acc[record.priority].breached++;
      } else {
        acc[record.priority].compliant++;
      }
      return acc;
    }, {} as Record<string, any>);
    
    return Object.values(priorityStats).map((item: any) => ({
      ...item,
      total: item.compliant + item.breached,
      breachRate: ((item.breached / (item.compliant + item.breached)) * 100),
    }));
  }, [data]);

  // 4. Avg Resolution Time vs SLA Target - Meeting expectations check
  const resolutionVsSLA = useMemo(() => {
    const slaTargets = { 'High': 4, 'Medium': 8, 'Low': 24 };
    const priorityStats = data.reduce((acc, record) => {
      if (!acc[record.priority]) {
        acc[record.priority] = { priority: record.priority, totalTime: 0, count: 0 };
      }
      acc[record.priority].totalTime += record.resolution_time_minutes / 60; // Convert to hours
      acc[record.priority].count++;
      return acc;
    }, {} as Record<string, any>);
    
    return Object.values(priorityStats).map((item: any) => {
      const avgTime = item.totalTime / item.count;
      const target = slaTargets[item.priority as keyof typeof slaTargets] || 8;
      return {
        priority: item.priority,
        avgTime,
        target,
        performance: avgTime <= target ? 'Meeting' : 'Missing',
        gap: avgTime - target,
      };
    });
  }, [data]);

  // 5. Agent Efficiency vs Customer Satisfaction - MOST IMPORTANT
  const agentEfficiencyVsCSAT = useMemo(() => {
    const agentStats = data.reduce((acc, record) => {
      if (!acc[record.agent_name]) {
        acc[record.agent_name] = { agent: record.agent_name, totalTime: 0, totalCSAT: 0, count: 0 };
      }
      acc[record.agent_name].totalTime += record.resolution_time_minutes / 60; // Convert to hours
      acc[record.agent_name].totalCSAT += record.customer_satisfaction_score;
      acc[record.agent_name].count++;
      return acc;
    }, {} as Record<string, any>);
    
    return Object.values(agentStats).map((item: any) => ({
      agent: item.agent,
      avgResolutionTime: item.totalTime / item.count,
      avgCSAT: item.totalCSAT / item.count,
      ticketsHandled: item.count,
    }));
  }, [data]);

  // 6. Issue Category × Resolution Pain - Resource allocation insights
  const issueCategoryPain = useMemo(() => {
    const categoryStats = data.reduce((acc, record) => {
      if (!acc[record.issue_category]) {
        acc[record.issue_category] = { category: record.issue_category, totalTime: 0, count: 0, totalEffort: 0 };
      }
      const timeHours = record.resolution_time_minutes / 60;
      acc[record.issue_category].totalTime += timeHours;
      acc[record.issue_category].count++;
      acc[record.issue_category].totalEffort += timeHours * (record.priority === 'High' ? 3 : record.priority === 'Medium' ? 2 : 1);
      return acc;
    }, {} as Record<string, any>);
    
    return Object.values(categoryStats).map((item: any) => ({
      category: item.category,
      avgResolutionTime: item.totalTime / item.count,
      totalEffort: item.totalEffort,
      ticketCount: item.count,
      painScore: (item.totalTime / item.count) * Math.log(item.count + 1), // Time × Volume complexity
    }));
  }, [data]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* 1. Ticket Volume Trend - Capacity Planning */}
      <Card className="col-span-1 lg:col-span-2 border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Ticket Volume Trend</CardTitle>
          <p className="text-xs text-muted-foreground">Is demand increasing? Do we need more agents?</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ticketVolumeTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 11 }} 
                stroke="hsl(var(--muted-foreground))"
                tickFormatter={(value) => value.slice(-2)}
              />
              <YAxis 
                tick={{ fontSize: 11 }} 
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip 
                labelFormatter={(label) => `Month: ${label}`}
                formatter={(value: number) => [value, 'Tickets']}
              />
              <Line 
                type="monotone" 
                dataKey="tickets" 
                stroke="#22c55e" 
                strokeWidth={3}
                dot={{ r: 4, fill: '#22c55e' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 2. Tickets by Status - Simple but Required */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Tickets by Status</CardTitle>
          <p className="text-xs text-muted-foreground">Are we clearing tickets or building backlog?</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={ticketsByStatus}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="count"
                label={({ status, count }) => `${status}: ${count}`}
                labelLine={false}
              >
                {ticketsByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [value, 'Tickets']} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 3. SLA Compliance vs Breach by Priority - Core Accountability */}
      <Card className="col-span-full border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">SLA Compliance vs Breach by Priority</CardTitle>
          <p className="text-xs text-muted-foreground">Where are we failing SLAs that actually matter?</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={slaComplianceByPriority}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="priority" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="glass-card rounded-lg p-3 shadow-lg border border-border/50">
                        <p className="font-medium text-foreground mb-2">{label} Priority</p>
                        <div className="space-y-1 text-sm">
                          <div>Compliant: {data.compliant}</div>
                          <div>Breached: {data.breached}</div>
                          <div>Total: {data.total}</div>
                          <div className="font-medium text-red-500">Breach Rate: {data.breachRate.toFixed(1)}%</div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Bar dataKey="compliant" stackId="a" fill="#22c55e" name="SLA Compliant" />
              <Bar dataKey="breached" stackId="a" fill="#ef4444" name="SLA Breached" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 4. Avg Resolution Time vs SLA Target */}
      <Card className="col-span-1 lg:col-span-2 border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Avg Resolution Time vs SLA Target</CardTitle>
          <p className="text-xs text-muted-foreground">Are we meeting SLA expectations or not?</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={resolutionVsSLA}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="priority" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis 
                tickFormatter={formatHours} 
                tick={{ fontSize: 11 }} 
                stroke="hsl(var(--muted-foreground))" 
              />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  if (name === 'avgTime') return [formatHours(value), 'Avg Time'];
                  if (name === 'target') return [formatHours(value), 'SLA Target'];
                  return [value, name];
                }}
              />
              <Legend />
              <Bar dataKey="target" fill="#94a3b8" name="SLA Target" />
              <Bar dataKey="avgTime" name="Avg Resolution Time">
                {resolutionVsSLA.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.performance === 'Meeting' ? '#22c55e' : '#ef4444'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 5. Agent Efficiency vs Customer Satisfaction - MOST IMPORTANT */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Agent Efficiency vs Customer Satisfaction</CardTitle>
          <p className="text-xs text-muted-foreground">Who delivers speed without hurting CX? Size = tickets handled</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                type="number" 
                dataKey="avgResolutionTime" 
                name="Avg Resolution Time" 
                unit="h"
                tick={{ fontSize: 11 }} 
                stroke="hsl(var(--muted-foreground))"
                tickFormatter={formatHours}
              />
              <YAxis 
                type="number" 
                dataKey="avgCSAT" 
                name="Avg CSAT" 
                domain={[0, 5]}
                tick={{ fontSize: 11 }} 
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="glass-card rounded-lg p-3 shadow-lg border border-border/50">
                        <p className="font-medium text-foreground mb-2">{data.agent}</p>
                        <div className="space-y-1 text-sm">
                          <div>Avg Resolution: {formatHours(data.avgResolutionTime)}</div>
                          <div>Avg CSAT: {data.avgCSAT.toFixed(1)}/5</div>
                          <div>Tickets Handled: {data.ticketsHandled}</div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter 
                data={agentEfficiencyVsCSAT} 
                fill="#22c55e"
                fillOpacity={0.7}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 6. Issue Category × Resolution Pain */}
      <Card className="col-span-full border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Issue Category × Resolution Pain</CardTitle>
          <p className="text-xs text-muted-foreground">Which issues consume the most time and effort? Size = ticket count</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                type="number" 
                dataKey="avgResolutionTime" 
                name="Avg Resolution Time" 
                unit="h"
                tick={{ fontSize: 11 }} 
                stroke="hsl(var(--muted-foreground))"
                tickFormatter={formatHours}
              />
              <YAxis 
                type="number" 
                dataKey="totalEffort" 
                name="Total Effort" 
                tick={{ fontSize: 11 }} 
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="glass-card rounded-lg p-3 shadow-lg border border-border/50">
                        <p className="font-medium text-foreground mb-2">{data.category}</p>
                        <div className="space-y-1 text-sm">
                          <div>Avg Resolution: {formatHours(data.avgResolutionTime)}</div>
                          <div>Total Effort: {data.totalEffort.toFixed(0)}</div>
                          <div>Ticket Count: {data.ticketCount}</div>
                          <div>Pain Score: {data.painScore.toFixed(1)}</div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter 
                data={issueCategoryPain} 
                fill="#22c55e"
                fillOpacity={0.7}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}