import { useMemo } from 'react';
import React from 'react';
import { MarketingRecord } from '@/types/marketing';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ScatterChart, Scatter, ZAxis, FunnelChart, Funnel, LabelList,
  PieChart, Pie, Cell
} from 'recharts';

interface ChartProps {
  data: MarketingRecord[];
}

export function RevenueVsSpendChart({ data }: ChartProps) {
  const chartData = useMemo(() => {
    const daily: Record<string, { date: string; revenue: number; spend: number }> = {};
    data.forEach(r => {
      const date = r.campaign_start_date;
      if (!daily[date]) daily[date] = { date, revenue: 0, spend: 0 };
      daily[date].revenue += r.revenue_generated;
      daily[date].spend += r.total_campaign_cost;
    });
    return Object.values(daily).sort((a, b) => a.date.localeCompare(b.date)).slice(-30);
  }, [data]);

  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Revenue vs Spend Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2E6F40" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#2E6F40" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#68BA7F" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#68BA7F" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => v.slice(5)} />
          <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`} />
          <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
          <Legend />
          <Line type="monotone" dataKey="revenue" stroke="#2E6F40" strokeWidth={2} dot={false} name="Revenue" fill="url(#revenueGradient)" fillOpacity={1} />
          <Line type="monotone" dataKey="spend" stroke="#68BA7F" strokeWidth={2} dot={false} name="Spend" fill="url(#spendGradient)" fillOpacity={1} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ROITrendChart({ data }: ChartProps) {
  const chartData = useMemo(() => {
    const daily: Record<string, { date: string; revenue: number; spend: number }> = {};
    data.forEach(r => {
      const date = r.campaign_start_date;
      if (!daily[date]) daily[date] = { date, revenue: 0, spend: 0 };
      daily[date].revenue += r.revenue_generated;
      daily[date].spend += r.total_campaign_cost;
    });
    return Object.values(daily)
      .map(d => ({ ...d, roi: d.spend === 0 ? 0 : ((d.revenue - d.spend) / d.spend) * 100 }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30);
  }, [data]);

  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="text-lg font-semibold mb-4 text-foreground">ROI Trend Over Time</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData}>
          <defs>
            <linearGradient id="roiGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2E6F40" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#2E6F40" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => v.slice(5)} />
          <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${v}%`} />
          <Tooltip formatter={(v: number) => `${v.toFixed(1)}%`} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
          <Line type="monotone" dataKey="roi" stroke="#2E6F40" strokeWidth={2} dot={false} name="ROI %" fill="url(#roiGradient)" fillOpacity={1} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ChannelGrowthEfficiencyMap({ data }: ChartProps) {
  const chartData = useMemo(() => {
    const channels: Record<string, { revenue: number; spend: number; conversions: number; clicks: number }> = {};
    data.forEach(r => {
      if (!channels[r.marketing_channel]) {
        channels[r.marketing_channel] = { revenue: 0, spend: 0, conversions: 0, clicks: 0 };
      }
      channels[r.marketing_channel].revenue += r.revenue_generated;
      channels[r.marketing_channel].spend += r.total_campaign_cost;
      channels[r.marketing_channel].conversions += r.conversions;
      channels[r.marketing_channel].clicks += r.clicks;
    });
    
    const colors = {
      'Social': '#2E6F40',
      'Search': '#68BA7F',
      'Email': '#4A8B5C',
      'Display': '#CFFFDC',
      'Video': '#253D2C'
    };
    
    return Object.entries(channels).map(([channel, v]) => ({
      channel,
      conversionRate: v.clicks === 0 ? 0 : (v.conversions / v.clicks) * 100,
      roi: v.spend === 0 ? 0 : ((v.revenue - v.spend) / v.spend) * 100,
      spend: v.spend,
      fill: colors[channel as keyof typeof colors] || '#68BA7F'
    }));
  }, [data]);

  const medianCR = chartData.length > 0 ? chartData.sort((a, b) => a.conversionRate - b.conversionRate)[Math.floor(chartData.length / 2)].conversionRate : 0;
  const medianROI = chartData.length > 0 ? chartData.sort((a, b) => a.roi - b.roi)[Math.floor(chartData.length / 2)].roi : 0;

  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Channel Growth vs Efficiency Map</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis 
            dataKey="conversionRate" 
            name="Conversion Rate" 
            tick={{ fontSize: 11 }} 
            stroke="hsl(var(--muted-foreground))" 
            tickFormatter={(v) => `${v.toFixed(1)}%`}
            label={{ value: 'Conversion Rate (%)', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle', fontSize: '12px' } }}
          />
          <YAxis 
            dataKey="roi" 
            name="ROI" 
            tick={{ fontSize: 11 }} 
            stroke="hsl(var(--muted-foreground))" 
            tickFormatter={(v) => `${v.toFixed(0)}%`}
            label={{ value: 'ROI (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '12px' } }}
          />
          <ZAxis dataKey="spend" range={[50, 300]} name="Total Spend" />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                const quadrant = data.conversionRate > medianCR && data.roi > medianROI ? 'SCALE' :
                               data.conversionRate > medianCR && data.roi <= medianROI ? 'REDUCE COST' :
                               data.conversionRate <= medianCR && data.roi > medianROI ? 'OPTIMIZE FUNNEL' :
                               'PAUSE CHANNEL';
                return (
                  <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                    <p className="font-medium text-foreground mb-2">{data.channel}</p>
                    <p className="text-sm text-muted-foreground">Conv Rate: {data.conversionRate.toFixed(1)}%</p>
                    <p className="text-sm text-muted-foreground">ROI: {data.roi.toFixed(0)}%</p>
                    <p className="text-sm text-muted-foreground">Spend: ${data.spend.toLocaleString()}</p>
                    <p className="text-sm font-medium text-foreground mt-2">Action: {quadrant}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Scatter data={chartData} fill="#2E6F40" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PlatformROIChart({ data }: ChartProps) {
  const chartData = useMemo(() => {
    const platforms: Record<string, { revenue: number; spend: number }> = {};
    data.forEach(r => {
      if (!platforms[r.platform_name]) platforms[r.platform_name] = { revenue: 0, spend: 0 };
      platforms[r.platform_name].revenue += r.revenue_generated;
      platforms[r.platform_name].spend += r.total_campaign_cost;
    });
    const colors = ['#2E6F40', '#68BA7F', '#4A8B5C', '#CFFFDC', '#253D2C'];
    return Object.entries(platforms)
      .map(([platform, v], index) => ({ 
        platform, 
        roi: v.spend === 0 ? 0 : ((v.revenue - v.spend) / v.spend) * 100,
        fill: colors[index % colors.length]
      }))
      .sort((a, b) => b.roi - a.roi);
  }, [data]);

  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="text-lg font-semibold mb-4 text-foreground">ROI by Platform</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie 
            data={chartData} 
            dataKey="roi" 
            nameKey="platform" 
            cx="50%" 
            cy="50%" 
            outerRadius={80}
            paddingAngle={2}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
            <LabelList 
              dataKey="roi" 
              position="outside" 
              formatter={(value: number) => `${value.toFixed(0)}%`}
              style={{ fontSize: '12px', fill: 'hsl(var(--foreground))' }}
            />
          </Pie>
          <Tooltip formatter={(v: number) => `${v.toFixed(1)}%`} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CampaignEfficiencyQuadrant({ data }: ChartProps) {
  const chartData = useMemo(() => {
    const typeColors = {
      'Search': '#2E6F40',
      'Display': '#68BA7F', 
      'Social': '#4A8B5C',
      'Video': '#CFFFDC',
      'Email': '#253D2C'
    };
    return data.slice(0, 50).map(r => ({
      cost: r.total_campaign_cost,
      revenue: r.revenue_generated,
      conversions: r.conversions,
      type: r.campaign_type,
      name: r.campaign_name.slice(0, 15),
      fill: typeColors[r.campaign_type as keyof typeof typeColors] || '#68BA7F'
    }));
  }, [data]);

  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Campaign Efficiency Quadrant</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis 
            dataKey="cost" 
            name="Campaign Cost" 
            tick={{ fontSize: 11 }} 
            stroke="hsl(var(--muted-foreground))" 
            tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`}
            label={{ value: 'Campaign Cost', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle', fontSize: '12px' } }}
          />
          <YAxis 
            dataKey="revenue" 
            name="Revenue Generated" 
            tick={{ fontSize: 11 }} 
            stroke="hsl(var(--muted-foreground))" 
            tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`}
            label={{ value: 'Revenue Generated', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '12px' } }}
          />
          <ZAxis dataKey="conversions" range={[20, 200]} name="Conversions" />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                    <p className="font-medium text-foreground mb-2">{data.name}</p>
                    <p className="text-sm text-muted-foreground">Type: {data.type}</p>
                    <p className="text-sm text-muted-foreground">Cost: ${data.cost.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Revenue: ${data.revenue.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Conversions: {data.conversions.toLocaleString()}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Scatter data={chartData} fill="#2E6F40" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ConversionByTypeChart({ data }: ChartProps) {
  const chartData = useMemo(() => {
    const types: Record<string, { conversions: number; clicks: number }> = {};
    data.forEach(r => {
      if (!types[r.campaign_type]) types[r.campaign_type] = { conversions: 0, clicks: 0 };
      types[r.campaign_type].conversions += r.conversions;
      types[r.campaign_type].clicks += r.clicks;
    });
    return Object.entries(types)
      .map(([type, v]) => ({ type, rate: v.clicks === 0 ? 0 : (v.conversions / v.clicks) * 100 }))
      .sort((a, b) => b.rate - a.rate);
  }, [data]);

  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Conversion Rate by Type</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis dataKey="type" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
          <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${v}%`} />
          <Tooltip formatter={(v: number) => `${v.toFixed(2)}%`} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
          <Bar dataKey="rate" fill="#68BA7F" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RegionPerformanceHeatmap({ data }: ChartProps) {
  const chartData = useMemo(() => {
    const regions: Record<string, { revenue: number; spend: number; clicks: number; impressions: number; conversions: number; bounces: number; sessions: number }> = {};
    data.forEach(r => {
      if (!regions[r.target_region]) {
        regions[r.target_region] = { revenue: 0, spend: 0, clicks: 0, impressions: 0, conversions: 0, bounces: 0, sessions: 0 };
      }
      regions[r.target_region].revenue += r.revenue_generated;
      regions[r.target_region].spend += r.total_campaign_cost;
      regions[r.target_region].clicks += r.clicks;
      regions[r.target_region].impressions += r.impressions;
      regions[r.target_region].conversions += r.conversions;
      regions[r.target_region].bounces += r.bounce_rate;
      regions[r.target_region].sessions += 1;
    });
    
    return Object.entries(regions).map(([region, v]) => ({
      region,
      CTR: v.impressions === 0 ? 0 : (v.clicks / v.impressions) * 100,
      'Conv Rate': v.clicks === 0 ? 0 : (v.conversions / v.clicks) * 100,
      'Bounce Rate': v.sessions === 0 ? 0 : v.bounces / v.sessions,
      ROI: v.spend === 0 ? 0 : ((v.revenue - v.spend) / v.spend) * 100
    }));
  }, [data]);

  const metrics = ['CTR', 'Conv Rate', 'Bounce Rate', 'ROI'];

  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Region × Performance Heatmap</h3>
      <div className="grid grid-cols-5 gap-2 text-xs">
        <div className="font-medium text-muted-foreground">Region</div>
        {metrics.map(metric => (
          <div key={metric} className="font-medium text-muted-foreground text-center">{metric}</div>
        ))}
        {chartData.map(row => (
          <React.Fragment key={row.region}>
            <div className="font-medium text-foreground py-2">{row.region}</div>
            {metrics.map(metric => {
              const value = row[metric as keyof typeof row] as number;
              const isGood = metric === 'CTR' ? value > 2 :
                           metric === 'Conv Rate' ? value > 2 :
                           metric === 'Bounce Rate' ? value < 50 :
                           value > 50; // ROI
              return (
                <div key={metric} className={`text-center py-2 rounded text-xs font-medium ${
                  isGood ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {metric.includes('Rate') || metric === 'CTR' ? `${value.toFixed(1)}%` :
                   metric === 'ROI' ? `${value.toFixed(0)}%` :
                   value.toFixed(1)}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export function CityConversionsChart({ data }: ChartProps) {
  const chartData = useMemo(() => {
    const cities: Record<string, number> = {};
    data.forEach(r => {
      cities[r.target_city] = (cities[r.target_city] || 0) + r.conversions;
    });
    return Object.entries(cities)
      .map(([city, conversions]) => ({ city, conversions }))
      .sort((a, b) => b.conversions - a.conversions)
      .slice(0, 8);
  }, [data]);

  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Top Cities by Conversions</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
          <YAxis dataKey="city" type="category" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" width={70} />
          <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
          <Bar dataKey="conversions" fill="#68BA7F" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MarketingFunnelChart({ data }: ChartProps) {
  const funnelData = useMemo(() => {
    const impressions = data.reduce((s, r) => s + r.impressions, 0);
    const clicks = data.reduce((s, r) => s + r.clicks, 0);
    const leads = data.reduce((s, r) => s + r.leads_generated, 0);
    const conversions = data.reduce((s, r) => s + r.conversions, 0);
    return [
      { name: 'Impressions', value: impressions, fill: '#CFFFDC' },
      { name: 'Clicks', value: clicks, fill: '#68BA7F' },
      { name: 'Leads', value: leads, fill: '#4A8B5C' },
      { name: 'Conversions', value: conversions, fill: '#2E6F40' },
    ];
  }, [data]);

  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Marketing Funnel</h3>
      <ResponsiveContainer width="100%" height={280}>
        <FunnelChart>
          <Tooltip formatter={(v: number) => v.toLocaleString()} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
          <Funnel dataKey="value" data={funnelData} isAnimationActive>
            <LabelList position="right" fill="hsl(var(--foreground))" stroke="none" dataKey="name" fontSize={12} />
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CPCvsConversionScatter({ data }: ChartProps) {
  const chartData = useMemo(() => {
    return data.slice(0, 100).map(r => ({
      cpc: r.cost_per_click,
      convRate: r.conversion_rate,
      name: r.campaign_name.slice(0, 15),
    }));
  }, [data]);

  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="text-lg font-semibold mb-4 text-foreground">CPC vs Conversion Rate</h3>
      <ResponsiveContainer width="100%" height={250}>
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis dataKey="cpc" name="CPC" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `$${v.toFixed(1)}`} />
          <YAxis dataKey="convRate" name="Conv %" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${v.toFixed(1)}%`} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
          <Scatter data={chartData} fill="#2E6F40" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CPLvsROIScatter({ data }: ChartProps) {
  const chartData = useMemo(() => {
    return data.slice(0, 100)
      .filter(r => r.roi_percent > -500 && r.roi_percent < 5000) // Filter extreme outliers
      .map(r => ({
        cpl: r.cost_per_lead,
        roi: r.roi_percent,
        name: r.campaign_name.slice(0, 15),
      }));
  }, [data]);

  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="text-lg font-semibold mb-4 text-foreground">CPL vs ROI</h3>
      <ResponsiveContainer width="100%" height={250}>
        <ScatterChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis 
            dataKey="cpl" 
            name="CPL" 
            tick={{ fontSize: 11 }} 
            stroke="hsl(var(--muted-foreground))" 
            tickFormatter={(v) => `$${v.toFixed(0)}`} 
            domain={['dataMin', 'dataMax']}
          />
          <YAxis 
            dataKey="roi" 
            name="ROI %" 
            tick={{ fontSize: 11 }} 
            stroke="hsl(var(--muted-foreground))" 
            tickFormatter={(v) => `${v.toFixed(0)}%`}
            domain={[-100, 'dataMax']}
          />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
          <Scatter data={chartData} fill="#68BA7F" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BounceRateChart({ data }: ChartProps) {
  const chartData = useMemo(() => {
    const pages: Record<string, { total: number; count: number }> = {};
    data.forEach(r => {
      const page = r.landing_page_url.split('/').pop() || 'unknown';
      if (!pages[page]) pages[page] = { total: 0, count: 0 };
      pages[page].total += r.bounce_rate;
      pages[page].count += 1;
    });
    return Object.entries(pages)
      .map(([page, v]) => ({ page: page.slice(0, 15), bounceRate: v.total / v.count }))
      .sort((a, b) => b.bounceRate - a.bounceRate)
      .slice(0, 8);
  }, [data]);

  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Bounce Rate by Landing Page</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${v.toFixed(0)}%`} />
          <YAxis dataKey="page" type="category" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" width={80} />
          <Tooltip formatter={(v: number) => `${v.toFixed(1)}%`} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
          <Bar dataKey="bounceRate" fill="#4A8B5C" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SessionDurationChart({ data }: ChartProps) {
  const chartData = useMemo(() => {
    const campaigns: Record<string, { total: number; count: number }> = {};
    data.forEach(r => {
      if (!campaigns[r.campaign_name]) campaigns[r.campaign_name] = { total: 0, count: 0 };
      campaigns[r.campaign_name].total += r.avg_session_duration;
      campaigns[r.campaign_name].count += 1;
    });
    return Object.entries(campaigns)
      .map(([name, v]) => ({ name: name.slice(0, 18), duration: v.total / v.count }))
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 8);
  }, [data]);

  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Avg Session Duration by Campaign</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${(v/60).toFixed(1)}m`} />
          <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" width={100} />
          <Tooltip formatter={(v: number) => `${(v/60).toFixed(1)} min`} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
          <Bar dataKey="duration" fill="#2E6F40" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
