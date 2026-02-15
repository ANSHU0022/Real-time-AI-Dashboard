import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  Legend,
  ReferenceLine,
} from 'recharts';
import { HRRecord } from '@/types/hr';

interface HRChartsProps {
  data: HRRecord[];
}

const COLORS = ['#2E6F40', '#CFFFDC', '#68BA7F', '#253D2C', '#4A8B5C', '#5F9A6B', '#A8E6B7', '#3A7A4A'];
const RISK_COLORS = { Low: '#22c55e', Medium: '#16a34a', High: '#15803d' };
const DEPT_COLORS = ['#2E6F40', '#68BA7F', '#4A8B5C', '#5F9A6B', '#A8E6B7', '#3A7A4A'];

export function HRCharts({ data }: HRChartsProps) {
  // 1. Attrition by Tenure (Keep - Good insight)
  const attritionByTenure = useMemo(() => {
    const buckets: Record<string, number> = { '0-1': 0, '1-3': 0, '3-5': 0, '5-7': 0, '7-10': 0, '10+': 0 };
    data.filter(r => r.employment_status === 'Terminated').forEach(r => {
      if (r.tenure_years <= 1) buckets['0-1']++;
      else if (r.tenure_years <= 3) buckets['1-3']++;
      else if (r.tenure_years <= 5) buckets['3-5']++;
      else if (r.tenure_years <= 7) buckets['5-7']++;
      else if (r.tenure_years <= 10) buckets['7-10']++;
      else buckets['10+']++;
    });
    return Object.entries(buckets).map(([tenure, count]) => ({ tenure, count }));
  }, [data]);

  // 2. Attrition by Department (Keep - Good insight)
  const attritionByDept = useMemo(() => {
    const counts: Record<string, number> = {};
    data.filter(r => r.employment_status === 'Terminated').forEach(r => {
      counts[r.department_name] = (counts[r.department_name] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [data]);

  // 3. Risk Distribution (Keep - Good insight)
  const riskDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach(r => {
      counts[r.attrition_risk_level] = (counts[r.attrition_risk_level] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [data]);

  // ✅ REPLACE 1: Attendance Risk Distribution (was Attendance Composition)
  const attendanceRiskDistribution = useMemo(() => {
    const deptRisk: Record<string, { '<70%': number; '70-85%': number; '85%+': number }> = {};
    
    data.forEach(r => {
      if (!deptRisk[r.department_name]) {
        deptRisk[r.department_name] = { '<70%': 0, '70-85%': 0, '85%+': 0 };
      }
      
      if (r.attendance_rate_percent < 70) deptRisk[r.department_name]['<70%']++;
      else if (r.attendance_rate_percent < 85) deptRisk[r.department_name]['70-85%']++;
      else deptRisk[r.department_name]['85%+']++;
    });
    
    return Object.entries(deptRisk).map(([dept, risks]) => ({
      department: dept,
      ...risks
    }));
  }, [data]);

  // ✅ REPLACE 2: Performance vs Attendance Scatter (was Performance Distribution)
  const performanceAttendanceScatter = useMemo(() => {
    const deptColors: Record<string, string> = {};
    const uniqueDepts = [...new Set(data.map(r => r.department_name))];
    uniqueDepts.forEach((dept, i) => {
      deptColors[dept] = DEPT_COLORS[i % DEPT_COLORS.length];
    });

    return data.slice(0, 300).map(r => ({
      attendance: r.attendance_rate_percent,
      performance: r.performance_rating,
      department: r.department_name,
      tenure: r.tenure_years,
      color: deptColors[r.department_name],
      name: `${r.department_name} - ${r.tenure_years}y`
    }));
  }, [data]);

  // ✅ REPLACE 3: Performance Spread by Department (was Avg Performance by Department)
  const performanceSpreadByDept = useMemo(() => {
    const deptPerf: Record<string, number[]> = {};
    
    data.forEach(r => {
      if (!deptPerf[r.department_name]) deptPerf[r.department_name] = [];
      deptPerf[r.department_name].push(r.performance_rating);
    });
    
    return Object.entries(deptPerf).map(([dept, ratings]) => {
      const sorted = ratings.sort((a, b) => a - b);
      const q1 = sorted[Math.floor(sorted.length * 0.25)];
      const median = sorted[Math.floor(sorted.length * 0.5)];
      const q3 = sorted[Math.floor(sorted.length * 0.75)];
      const min = sorted[0];
      const max = sorted[sorted.length - 1];
      
      return {
        department: dept,
        min,
        q1,
        median,
        q3,
        max,
        avg: ratings.reduce((a, b) => a + b, 0) / ratings.length
      };
    });
  }, [data]);

  // ✅ REPLACE 8: Attrition Risk Heatmap (was Attrition Overview Top 5)
  const attritionRiskHeatmap = useMemo(() => {
    const heatmapData: Record<string, Record<string, number>> = {};
    const deptJobCounts: Record<string, Record<string, number>> = {};
    
    data.forEach(r => {
      const dept = r.department_name;
      const job = r.job_level;
      
      if (!heatmapData[dept]) heatmapData[dept] = {};
      if (!deptJobCounts[dept]) deptJobCounts[dept] = {};
      
      if (!heatmapData[dept][job]) heatmapData[dept][job] = 0;
      if (!deptJobCounts[dept][job]) deptJobCounts[dept][job] = 0;
      
      deptJobCounts[dept][job]++;
      
      if (r.employment_status === 'Terminated') {
        heatmapData[dept][job]++;
      }
    });
    
    const result: Array<{
      department: string;
      jobLevel: string;
      attritionRate: number;
      count: number;
    }> = [];
    
    Object.entries(heatmapData).forEach(([dept, jobs]) => {
      Object.entries(jobs).forEach(([job, terminated]) => {
        const total = deptJobCounts[dept][job];
        const rate = total > 0 ? (terminated / total) * 100 : 0;
        result.push({
          department: dept,
          jobLevel: job,
          attritionRate: rate,
          count: total
        });
      });
    });
    
    return result;
  }, [data]);

  // Keep existing good charts
  const attritionByPerformance = useMemo(() => {
    const result: Record<string, { category: string; Active: number; Terminated: number }> = {};
    data.forEach(r => {
      if (!result[r.performance_category]) {
        result[r.performance_category] = { category: r.performance_category, Active: 0, Terminated: 0 };
      }
      result[r.performance_category][r.employment_status as 'Active' | 'Terminated']++;
    });
    return Object.values(result);
  }, [data]);

  const promotionAttrition = useMemo(() => {
    const result: Record<string, { eligibility: string; Active: number; Terminated: number }> = {};
    data.forEach(r => {
      if (!result[r.promotion_eligibility]) {
        result[r.promotion_eligibility] = { eligibility: r.promotion_eligibility, Active: 0, Terminated: 0 };
      }
      result[r.promotion_eligibility][r.employment_status as 'Active' | 'Terminated']++;
    });
    return Object.values(result);
  }, [data]);

  const attritionByManager = useMemo(() => {
    const counts: Record<string, number> = {};
    data.filter(r => r.employment_status === 'Terminated').forEach(r => {
      counts[r.manager_name] = (counts[r.manager_name] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [data]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
      {/* 1. Attrition by Tenure (Keep) */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Attrition by Tenure</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={attritionByTenure}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="tenure" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#2E6F40" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 2. Attrition by Department (Keep) */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Attrition by Department</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={attritionByDept} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={80} />
              <Tooltip />
              <Bar dataKey="value" fill="#22c55e" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 3. Risk Distribution (Keep) */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Attrition Risk Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={riskDistribution} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {riskDistribution.map((entry, index) => (
                  <Cell key={index} fill={RISK_COLORS[entry.name as keyof typeof RISK_COLORS] || COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ✅ NEW 1: Attendance Risk Distribution */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Attendance Risk Distribution</CardTitle>
          <p className="text-xs text-muted-foreground">Attendance buckets by department</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={attendanceRiskDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="department" tick={{ fontSize: 9 }} angle={-45} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="<70%" stackId="a" fill="#ef4444" name="<70% (High Risk)" />
              <Bar dataKey="70-85%" stackId="a" fill="#f59e0b" name="70-85% (Medium)" />
              <Bar dataKey="85%+" stackId="a" fill="#22c55e" name="85%+ (Good)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ✅ NEW 2: Performance vs Attendance Scatter */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Performance vs Attendance Scatter</CardTitle>
          <p className="text-xs text-muted-foreground">Color: Department | Size: Tenure</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" dataKey="attendance" name="Attendance %" tick={{ fontSize: 11 }} />
              <YAxis type="number" dataKey="performance" name="Performance" domain={[0, 5]} tick={{ fontSize: 11 }} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="Employees" data={performanceAttendanceScatter} fill="#2E6F40" />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ✅ NEW 3: Performance Spread by Department */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Performance Spread by Department</CardTitle>
          <p className="text-xs text-muted-foreground">Shows consistency vs volatility</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={performanceSpreadByDept} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 11 }} />
              <YAxis dataKey="department" type="category" tick={{ fontSize: 10 }} width={80} />
              <Tooltip formatter={(value: number) => value.toFixed(2)} />
              <Bar dataKey="avg" fill="#2E6F40" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 4. Attrition vs Performance (Keep) */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Attrition vs Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={attritionByPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="category" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Active" fill="#2E6F40" stackId="a" />
              <Bar dataKey="Terminated" fill="#68BA7F" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 5. Promotion vs Attrition (Keep) */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Promotion Eligibility vs Attrition</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={promotionAttrition}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="eligibility" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Active" fill="#2E6F40" stackId="a" />
              <Bar dataKey="Terminated" fill="#68BA7F" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 6. Attrition by Manager (Keep) */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Attrition by Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={attritionByManager} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 9 }} width={90} />
              <Tooltip />
              <Bar dataKey="value" fill="#253D2C" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ✅ NEW 8: Attrition Risk Heatmap */}
      <Card className="bg-card border-border col-span-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Attrition Risk Heatmap</CardTitle>
          <p className="text-xs text-muted-foreground">Attrition rate by Department and Job Level</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 h-[220px] overflow-y-auto">
            {attritionRiskHeatmap.map((item, index) => {
              const intensity = Math.min(item.attritionRate / 30, 1); // Normalize to 0-1
              const bgColor = `rgba(239, 68, 68, ${intensity})`; // Red with varying opacity
              
              return (
                <div
                  key={`${item.department}-${item.jobLevel}`}
                  className="relative p-2 rounded border text-center text-xs"
                  style={{ backgroundColor: bgColor }}
                  title={`${item.department} - ${item.jobLevel}: ${item.attritionRate.toFixed(1)}% attrition (${item.count} employees)`}
                >
                  <div className="font-medium truncate">{item.department}</div>
                  <div className="text-xs opacity-75">{item.jobLevel}</div>
                  <div className="font-bold">{item.attritionRate.toFixed(1)}%</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}