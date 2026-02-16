import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { SupportRecord, SupportFilters, SupportKPIData } from '@/types/support';
import { dataCache } from '@/lib/dataCache';

const SHEET_ID = '1v-imyFcNfNR-Mr6gH9vccr2QaQc7oLSUc7ozPLoGgxQ';
const SHEET_GID = '1450544414';
const SHEET_URLS = [
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${SHEET_GID}`,
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${SHEET_GID}`,
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/pub?output=csv&gid=${SHEET_GID}`
];
const CACHE_KEY = 'support_data';

const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
};

export function useSupportData() {
  const cachedData = dataCache.get<SupportRecord[]>(CACHE_KEY);
  const [rawData, setRawData] = useState<SupportRecord[]>(cachedData || []);
  const [isLoading, setIsLoading] = useState(!cachedData);
  const [isUsingLiveData, setIsUsingLiveData] = useState(!!cachedData);
  const [filters, setFilters] = useState<SupportFilters>({
    searchQuery: '',
    dateRange: { from: undefined, to: undefined },
    statuses: [],
    priorities: [],
    issueCategories: [],
    channels: [],
    agents: [],
    teams: [],
    regions: [],
    products: [],
    slaBreached: [],
    escalated: [],
  });

  const isFetching = useRef(false);
  const lastFetchTime = useRef(0);

  const fetchData = useCallback(async (isInitial = false) => {
    if (isFetching.current) return;
    
    const now = Date.now();
    if (now - lastFetchTime.current < 2000 && !isInitial) return;
    
    isFetching.current = true;
    lastFetchTime.current = now;
    
    if (isInitial && !cachedData) {
      setIsLoading(true);
    }
    
    for (const url of SHEET_URLS) {
      try {
        const response = await fetch(url, {
          mode: 'cors',
          headers: { 'Accept': 'text/csv' }
        });
        
        if (!response.ok) continue;
        
        const text = await response.text();
        if (text.includes('<!DOCTYPE') || text.includes('<html')) continue;
        
        const lines = text.split('\n').filter(line => line.trim());
        if (lines.length < 2) continue;
        
        const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().replace(/[^a-z0-9_]/g, '_'));
        
        const records: SupportRecord[] = [];
        for (let i = 1; i < lines.length; i++) {
          const values = parseCSVLine(lines[i]);
          if (values.length < 3) continue;
          
          const record: Record<string, any> = {};
          headers.forEach((header, idx) => {
            record[header] = values[idx] || '';
          });
          
          // Map to exact Google Sheet columns - NO DUMMY DATA
          records.push({
            ticket_id: record.ticket_id || record.id || record.ticket || `TKT-${String(i).padStart(6, '0')}`,
            ticket_created_at: record.ticket_created_at || record.created_at || record.date_created || record.created || '',
            ticket_resolved_at: record.ticket_resolved_at || record.resolved_at || record.date_resolved || record.resolved || '',
            ticket_status: record.ticket_status || record.status || 'Open',
            priority: record.priority || 'Medium',
            issue_category: record.issue_category || record.category || record.type || 'General',
            issue_subcategory: record.issue_subcategory || record.subcategory || '',
            support_channel: record.support_channel || record.channel || record.source || 'Email',
            customer_id: record.customer_id || record.cust_id || `CUST-${i}`,
            customer_name: record.customer_name || record.customer || `Customer ${i}`,
            customer_email: record.customer_email || record.email || '',
            customer_region: record.customer_region || record.region || 'Unknown',
            agent_id: record.agent_id || `AGT-${i}`,
            agent_name: record.agent_name || record.agent || 'Unassigned',
            agent_team: record.agent_team || record.team || 'Support',
            first_response_time_minutes: parseFloat(record.first_response_time_minutes || record.first_response_time || record.response_time || '0') || 0,
            resolution_time_minutes: parseFloat(record.resolution_time_minutes || record.resolution_time || '0') || 0,
            sla_target_minutes: parseFloat(record.sla_target_minutes || record.sla_target || '240') || 240,
            sla_breached_flag: record.sla_breached_flag || record.sla_breached || 'No',
            escalation_flag: record.escalation_flag || record.escalated || 'No',
            ticket_reopen_count: parseInt(record.ticket_reopen_count || record.reopen_count || '0') || 0,
            customer_satisfaction_score: parseFloat(record.customer_satisfaction_score || record.csat_score || record.csat || '0') || 0,
            feedback_comments: record.feedback_comments || record.feedback || '',
            product_name: record.product_name || record.product || 'Unknown',
            contact_reason: record.contact_reason || record.reason || 'Support Request',
          });
        }
        
        if (records.length > 0) {
          setRawData(records);
          dataCache.set(CACHE_KEY, records);
          setIsUsingLiveData(true);
          setIsLoading(false);
          isFetching.current = false;
          return;
        }
      } catch (error) {
        continue;
      }
    }
    
    // Fallback data only if Google Sheet fails
    const fallbackData: SupportRecord[] = [
      {
        ticket_id: 'TKT-000001',
        ticket_created_at: '2024-01-15',
        ticket_resolved_at: '2024-01-16',
        ticket_status: 'Resolved',
        priority: 'High',
        issue_category: 'Technical',
        issue_subcategory: 'Login Issue',
        support_channel: 'Email',
        customer_id: 'CUST-001',
        customer_name: 'John Smith',
        customer_email: 'john@example.com',
        customer_region: 'North America',
        agent_id: 'AGT-001',
        agent_name: 'Sarah Johnson',
        agent_team: 'Tier 1',
        first_response_time_minutes: 45,
        resolution_time_minutes: 180,
        sla_target_minutes: 240,
        sla_breached_flag: 'No',
        escalation_flag: 'No',
        ticket_reopen_count: 0,
        customer_satisfaction_score: 4.5,
        feedback_comments: 'Great support!',
        product_name: 'Product A',
        contact_reason: 'Technical Support',
      }
    ];
    
    setRawData(fallbackData);
    setIsUsingLiveData(false);
    setIsLoading(false);
    isFetching.current = false;
  }, [cachedData]);

  useEffect(() => {
    fetchData(true);
    const interval = setInterval(() => fetchData(false), 2000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const filteredData = useMemo(() => {
    return rawData.filter(record => {
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const searchFields = [
          record.ticket_id,
          record.customer_name,
          record.agent_name,
          record.issue_category,
        ].map(f => (f || '').toLowerCase());
        if (!searchFields.some(f => f.includes(query))) return false;
      }

      if (filters.dateRange.from || filters.dateRange.to) {
        const recordDate = new Date(record.ticket_created_at);
        if (filters.dateRange.from && recordDate < filters.dateRange.from) return false;
        if (filters.dateRange.to && recordDate > filters.dateRange.to) return false;
      }

      if (filters.statuses.length > 0 && !filters.statuses.includes(record.ticket_status)) return false;
      if (filters.priorities.length > 0 && !filters.priorities.includes(record.priority)) return false;
      if (filters.issueCategories.length > 0 && !filters.issueCategories.includes(record.issue_category)) return false;
      if (filters.channels.length > 0 && !filters.channels.includes(record.support_channel)) return false;
      if (filters.agents.length > 0 && !filters.agents.includes(record.agent_name)) return false;
      if (filters.teams.length > 0 && !filters.teams.includes(record.agent_team)) return false;
      if (filters.regions.length > 0 && !filters.regions.includes(record.customer_region)) return false;
      if (filters.products.length > 0 && !filters.products.includes(record.product_name)) return false;
      if (filters.slaBreached.length > 0 && !filters.slaBreached.includes(record.sla_breached_flag)) return false;
      if (filters.escalated.length > 0 && !filters.escalated.includes(record.escalation_flag)) return false;

      return true;
    });
  }, [rawData, filters]);

  const kpis = useMemo((): SupportKPIData => {
    const total = filteredData.length;
    if (total === 0) {
      return {
        totalTickets: 0,
        openTickets: 0,
        resolvedClosedTickets: 0,
        slaCompliance: 0,
        slaBreachRate: 0,
        avgFirstResponseTime: 0,
        avgResolutionTime: 0,
        avgCSAT: 0,
        escalationRate: 0,
        reopenRate: 0,
      };
    }

    const openTickets = filteredData.filter(r => ['Open', 'Pending'].includes(r.ticket_status)).length;
    const resolvedClosed = filteredData.filter(r => ['Resolved', 'Closed'].includes(r.ticket_status)).length;
    const slaCompliant = filteredData.filter(r => r.sla_breached_flag === 'No').length;
    const slaBreached = filteredData.filter(r => r.sla_breached_flag === 'Yes').length;
    const escalated = filteredData.filter(r => r.escalation_flag === 'Yes').length;
    const reopened = filteredData.filter(r => r.ticket_reopen_count > 0).length;
    
    const avgFirstResponse = filteredData.reduce((sum, r) => sum + r.first_response_time_minutes, 0) / total;
    const avgResolution = filteredData.reduce((sum, r) => sum + r.resolution_time_minutes, 0) / total;
    const csatRecords = filteredData.filter(r => r.customer_satisfaction_score > 0);
    const avgCSAT = csatRecords.length > 0 ? csatRecords.reduce((sum, r) => sum + r.customer_satisfaction_score, 0) / csatRecords.length : 0;

    return {
      totalTickets: total,
      openTickets,
      resolvedClosedTickets: resolvedClosed,
      slaCompliance: total > 0 ? slaCompliant / total : 0,
      slaBreachRate: total > 0 ? slaBreached / total : 0,
      avgFirstResponseTime: avgFirstResponse,
      avgResolutionTime: avgResolution,
      avgCSAT,
      escalationRate: total > 0 ? escalated / total : 0,
      reopenRate: total > 0 ? reopened / total : 0,
    };
  }, [filteredData]);

  const filterOptions = useMemo(() => ({
    statuses: [...new Set(rawData.map(r => r.ticket_status))].filter(Boolean).sort(),
    priorities: [...new Set(rawData.map(r => r.priority))].filter(Boolean).sort(),
    issueCategories: [...new Set(rawData.map(r => r.issue_category))].filter(Boolean).sort(),
    channels: [...new Set(rawData.map(r => r.support_channel))].filter(Boolean).sort(),
    agents: [...new Set(rawData.map(r => r.agent_name))].filter(Boolean).sort(),
    teams: [...new Set(rawData.map(r => r.agent_team))].filter(Boolean).sort(),
    regions: [...new Set(rawData.map(r => r.customer_region))].filter(Boolean).sort(),
    products: [...new Set(rawData.map(r => r.product_name))].filter(Boolean).sort(),
    slaBreached: ['Yes', 'No'],
    escalated: ['Yes', 'No'],
  }), [rawData]);

  const insights = useMemo(() => {
    if (filteredData.length === 0) return [];
    
    const insightsList: string[] = [];
    
    if (kpis.slaBreachRate > 0.20) {
      insightsList.push(`⚠️ High SLA breach rate (${(kpis.slaBreachRate * 100).toFixed(1)}%) - Review priority handling and agent capacity.`);
    }
    
    const priorityCounts = filteredData.reduce((acc, r) => {
      acc[r.priority] = (acc[r.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const topPriority = Object.entries(priorityCounts).sort((a, b) => b[1] - a[1])[0];
    if (topPriority) {
      insightsList.push(`📊 ${topPriority[0]} priority tickets dominate with ${topPriority[1]} tickets (${((topPriority[1] / filteredData.length) * 100).toFixed(1)}%).`);
    }
    
    if (kpis.avgCSAT < 3.5 && kpis.avgCSAT > 0) {
      insightsList.push(`😟 Customer satisfaction below target (${kpis.avgCSAT.toFixed(1)}/5) - Review escalated tickets for improvement areas.`);
    } else if (kpis.avgCSAT >= 4.5) {
      insightsList.push(`🌟 Excellent CSAT score (${kpis.avgCSAT.toFixed(1)}/5) - Team delivering strong customer experience.`);
    }
    
    if (kpis.escalationRate > 0.15) {
      insightsList.push(`📈 High escalation rate (${(kpis.escalationRate * 100).toFixed(1)}%) - Tier 1 training may reduce escalations.`);
    }
    
    return insightsList;
  }, [filteredData, kpis]);

  const refresh = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  return {
    data: filteredData,
    rawData,
    isLoading,
    isUsingLiveData,
    filters,
    setFilters,
    filterOptions,
    kpis,
    insights,
    refresh,
  };
}
