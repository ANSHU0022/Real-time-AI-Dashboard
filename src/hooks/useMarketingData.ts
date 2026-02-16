import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { MarketingRecord, MarketingFilters, MarketingKPIData } from '@/types/marketing';
import { dataCache } from '@/lib/dataCache';

const SHEET_ID = '1v-imyFcNfNR-Mr6gH9vccr2QaQc7oLSUc7ozPLoGgxQ';
const SHEET_GID = '872851567';
const SHEET_URLS = [
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${SHEET_GID}`,
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${SHEET_GID}`,
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/pub?output=csv&gid=${SHEET_GID}`,
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&usp=sharing`
];
const CACHE_KEY = 'marketing_data';

export function useMarketingData() {
  const cachedData = dataCache.get<MarketingRecord[]>(CACHE_KEY);
  const [rawData, setRawData] = useState<MarketingRecord[]>(cachedData || []);
  const [loading, setLoading] = useState(!cachedData);
  const [error, setError] = useState<string | null>(null);
  const [isUsingLiveData, setIsUsingLiveData] = useState(!!cachedData);
  const [filters, setFilters] = useState<MarketingFilters>({
    dateRange: { start: null, end: null },
    campaignTypes: [],
    campaignStatuses: [],
    marketingChannels: [],
    platformNames: [],
    targetRegions: [],
    targetCities: [],
    targetAudiences: [],
    marketingManagers: [],
    agencyNames: [],
    roiRange: { min: null, max: null },
    cpcRange: { min: null, max: null },
    searchQuery: '',
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
      setLoading(true);
    }
    
    for (const url of SHEET_URLS) {
      try {
        const response = await fetch(url, { 
          mode: 'cors',
          headers: { 'Accept': 'text/csv' }
        });
        
        if (!response.ok) continue;
        
        const csvText = await response.text();
        if (csvText.includes('<!DOCTYPE') || csvText.includes('<html')) continue;
        
        console.log('Marketing CSV fetched, length:', csvText.length);
        console.log('First 500 chars:', csvText.substring(0, 500));
        
        const parsed = parseCSV(csvText);
        console.log('Marketing parsed records:', parsed.length);
        if (parsed.length > 0) {
          console.log('First record:', parsed[0]);
          setRawData(parsed);
          dataCache.set(CACHE_KEY, parsed);
          setIsUsingLiveData(true);
          setError(null);
          setLoading(false);
          isFetching.current = false;
          return;
        } else {
          console.log('No records parsed from CSV');
        }
      } catch (err) {
        console.log('Fetch error:', err);
        continue;
      }
    }
    
    // Generate realistic fallback data with proper values
    const fallbackData: MarketingRecord[] = [
      {
        campaign_id: 'CMP-001',
        campaign_name: 'Google Search Campaign',
        campaign_type: 'Search',
        campaign_start_date: '2024-01-01',
        campaign_end_date: '2024-01-31',
        campaign_status: 'Active',
        marketing_channel: 'Google Ads',
        platform_name: 'Google',
        ad_format: 'Text',
        target_region: 'North America',
        target_city: 'New York',
        target_audience: '25-45',
        impressions: 45000,
        clicks: 2250,
        leads_generated: 450,
        conversions: 180,
        cost_per_click: 2.50,
        cost_per_lead: 12.50,
        total_campaign_cost: 5625,
        revenue_generated: 18000,
        roi_percent: 220,
        conversion_rate: 8.0,
        click_through_rate: 5.0,
        landing_page_url: 'https://example.com/search',
        bounce_rate: 35,
        avg_session_duration: 180,
        marketing_manager: 'Sarah Johnson',
        agency_name: 'In-House',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      {
        campaign_id: 'CMP-002',
        campaign_name: 'Facebook Social Campaign',
        campaign_type: 'Social',
        campaign_start_date: '2024-01-15',
        campaign_end_date: '2024-02-15',
        campaign_status: 'Active',
        marketing_channel: 'Facebook',
        platform_name: 'Facebook',
        ad_format: 'Image',
        target_region: 'Europe',
        target_city: 'London',
        target_audience: '18-35',
        impressions: 80000,
        clicks: 1600,
        leads_generated: 320,
        conversions: 96,
        cost_per_click: 1.25,
        cost_per_lead: 6.25,
        total_campaign_cost: 2000,
        revenue_generated: 9600,
        roi_percent: 380,
        conversion_rate: 6.0,
        click_through_rate: 2.0,
        landing_page_url: 'https://example.com/social',
        bounce_rate: 45,
        avg_session_duration: 120,
        marketing_manager: 'Mike Chen',
        agency_name: 'Digital Pro',
        created_at: '2024-01-15T00:00:00Z',
        updated_at: '2024-01-15T00:00:00Z',
      },
      {
        campaign_id: 'CMP-003',
        campaign_name: 'LinkedIn B2B Campaign',
        campaign_type: 'Professional',
        campaign_start_date: '2024-02-01',
        campaign_end_date: '2024-03-01',
        campaign_status: 'Active',
        marketing_channel: 'LinkedIn',
        platform_name: 'LinkedIn',
        ad_format: 'Sponsored Content',
        target_region: 'Asia',
        target_city: 'Tokyo',
        target_audience: '30-50',
        impressions: 25000,
        clicks: 750,
        leads_generated: 150,
        conversions: 45,
        cost_per_click: 4.00,
        cost_per_lead: 20.00,
        total_campaign_cost: 3000,
        revenue_generated: 13500,
        roi_percent: 350,
        conversion_rate: 6.0,
        click_through_rate: 3.0,
        landing_page_url: 'https://example.com/b2b',
        bounce_rate: 25,
        avg_session_duration: 240,
        marketing_manager: 'Lisa Rodriguez',
        agency_name: 'Marketing Plus',
        created_at: '2024-02-01T00:00:00Z',
        updated_at: '2024-02-01T00:00:00Z',
      }
    ];
    
    setRawData(fallbackData);
    setIsUsingLiveData(false);
    setError(null);
    setLoading(false);
    isFetching.current = false;
  }, [cachedData]);

  useEffect(() => {
    fetchData(true);
    const interval = setInterval(() => fetchData(false), 2000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const parseCSV = (csv: string): MarketingRecord[] => {
    const lines = csv.trim().split('\n');
    console.log('Total CSV lines:', lines.length);
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, '').toLowerCase());
    console.log('Headers:', headers);
    
    const records = lines.slice(1).map((line, idx) => {
      const values = parseCSVLine(line);
      const record: Record<string, any> = {};
      
      headers.forEach((header, index) => {
        record[header] = values[index]?.trim().replace(/"/g, '') || '';
      });

      if (idx === 0) {
        console.log('First data row raw:', record);
      }

      // Parse numeric values - remove commas and convert
      const impressions = parseInt(String(record.impressions || '0').replace(/,/g, '')) || 0;
      const clicks = parseInt(String(record.clicks || '0').replace(/,/g, '')) || 0;
      const leads = parseInt(String(record.leads_generated || '0').replace(/,/g, '')) || 0;
      const conversions = parseInt(String(record.conversions || '0').replace(/,/g, '')) || 0;
      const cost = parseFloat(String(record.total_campaign_cost || '0').replace(/[$,]/g, '')) || 0;
      const revenue = parseFloat(String(record.revenue_generated || '0').replace(/[$,]/g, '')) || 0;
      const cpc = parseFloat(String(record.cost_per_click || '0').replace(/[$,]/g, '')) || 0;
      const cpl = parseFloat(String(record.cost_per_lead || '0').replace(/[$,]/g, '')) || 0;
      const roi = parseFloat(String(record.roi_percent || '0').replace(/[%,]/g, '')) || 0;
      const convRate = parseFloat(String(record.conversion_rate || '0').replace(/[%,]/g, '')) || 0;
      const ctr = parseFloat(String(record.click_through_rate || '0').replace(/[%,]/g, '')) || 0;
      
      if (idx === 0) {
        console.log('Parsed numbers - cost:', cost, 'revenue:', revenue, 'clicks:', clicks, 'cpc:', cpc);
      }

      return {
        campaign_id: record.campaign_id || `CMP-${String(idx + 1).padStart(3, '0')}`,
        campaign_name: record.campaign_name || `Campaign ${idx + 1}`,
        campaign_type: record.campaign_type || 'Unknown',
        campaign_start_date: record.campaign_start_date || '',
        campaign_end_date: record.campaign_end_date || '',
        campaign_status: record.campaign_status || 'Unknown',
        marketing_channel: record.marketing_channel || 'Unknown',
        platform_name: record.platform_name || 'Unknown',
        ad_format: record.ad_format || 'Unknown',
        target_region: record.target_region || 'Unknown',
        target_city: record.target_city || '',
        target_audience: record.target_audience || 'Unknown',
        impressions,
        clicks,
        leads_generated: leads,
        conversions,
        cost_per_click: cpc || (clicks > 0 ? cost / clicks : 0),
        cost_per_lead: cpl || (leads > 0 ? cost / leads : 0),
        total_campaign_cost: cost,
        revenue_generated: revenue,
        roi_percent: roi || (cost > 0 ? ((revenue - cost) / cost) * 100 : 0),
        conversion_rate: convRate || (clicks > 0 ? (conversions / clicks) * 100 : 0),
        click_through_rate: ctr || (impressions > 0 ? (clicks / impressions) * 100 : 0),
        landing_page_url: record.landing_page_url || '',
        bounce_rate: parseFloat(String(record.bounce_rate || '0').replace(/[%,]/g, '')) || 0,
        avg_session_duration: parseFloat(String(record.avg_session_duration || '0').replace(/,/g, '')) || 0,
        marketing_manager: record.marketing_manager || 'Unknown',
        agency_name: record.agency_name || 'Unknown',
        created_at: record.created_at || new Date().toISOString(),
        updated_at: record.updated_at || new Date().toISOString(),
      } as MarketingRecord;
    });
    
    const filtered = records.filter(r => r.campaign_id);
    console.log('Total records after filter:', filtered.length);
    if (filtered.length > 0) {
      console.log('Sample record:', filtered[0]);
    }
    return filtered;
  };

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  };

  const filteredData = useMemo(() => {
    return rawData.filter(record => {
      if (filters.dateRange.start || filters.dateRange.end) {
        const recordDate = new Date(record.campaign_start_date);
        if (filters.dateRange.start && recordDate < filters.dateRange.start) return false;
        if (filters.dateRange.end && recordDate > filters.dateRange.end) return false;
      }

      if (filters.campaignTypes.length > 0 && !filters.campaignTypes.includes(record.campaign_type)) return false;
      if (filters.campaignStatuses.length > 0 && !filters.campaignStatuses.includes(record.campaign_status)) return false;
      if (filters.marketingChannels.length > 0 && !filters.marketingChannels.includes(record.marketing_channel)) return false;
      if (filters.platformNames.length > 0 && !filters.platformNames.includes(record.platform_name)) return false;
      if (filters.targetRegions.length > 0 && !filters.targetRegions.includes(record.target_region)) return false;
      if (filters.targetCities.length > 0 && !filters.targetCities.includes(record.target_city)) return false;
      if (filters.targetAudiences.length > 0 && !filters.targetAudiences.includes(record.target_audience)) return false;
      if (filters.marketingManagers.length > 0 && !filters.marketingManagers.includes(record.marketing_manager)) return false;
      if (filters.agencyNames.length > 0 && !filters.agencyNames.includes(record.agency_name)) return false;

      if (filters.roiRange.min !== null && record.roi_percent < filters.roiRange.min) return false;
      if (filters.roiRange.max !== null && record.roi_percent > filters.roiRange.max) return false;
      if (filters.cpcRange.min !== null && record.cost_per_click < filters.cpcRange.min) return false;
      if (filters.cpcRange.max !== null && record.cost_per_click > filters.cpcRange.max) return false;

      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        return (
          record.campaign_id.toLowerCase().includes(query) ||
          record.campaign_name.toLowerCase().includes(query) ||
          record.marketing_manager.toLowerCase().includes(query) ||
          record.agency_name.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [rawData, filters]);

  const kpis = useMemo((): MarketingKPIData => {
    const data = filteredData;
    const totalSpend = data.reduce((sum, r) => sum + r.total_campaign_cost, 0);
    const totalRevenue = data.reduce((sum, r) => sum + r.revenue_generated, 0);
    const totalClicks = data.reduce((sum, r) => sum + r.clicks, 0);
    const totalLeads = data.reduce((sum, r) => sum + r.leads_generated, 0);
    const totalConversions = data.reduce((sum, r) => sum + r.conversions, 0);
    const totalImpressions = data.reduce((sum, r) => sum + r.impressions, 0);

    return {
      totalCampaignSpend: totalSpend,
      totalRevenue,
      overallROI: totalSpend === 0 ? 0 : (totalRevenue - totalSpend) / totalSpend,
      avgCPC: totalClicks === 0 ? 0 : totalSpend / totalClicks,
      avgCPL: totalLeads === 0 ? 0 : totalSpend / totalLeads,
      totalLeads,
      totalConversions,
      conversionRate: totalClicks === 0 ? 0 : totalConversions / totalClicks,
      avgCTR: totalImpressions === 0 ? 0 : totalClicks / totalImpressions,
    };
  }, [filteredData]);

  const filterOptions = useMemo(() => ({
    campaignTypes: [...new Set(rawData.map(r => r.campaign_type))].filter(Boolean).sort(),
    campaignStatuses: [...new Set(rawData.map(r => r.campaign_status))].filter(Boolean).sort(),
    marketingChannels: [...new Set(rawData.map(r => r.marketing_channel))].filter(Boolean).sort(),
    platformNames: [...new Set(rawData.map(r => r.platform_name))].filter(Boolean).sort(),
    targetRegions: [...new Set(rawData.map(r => r.target_region))].filter(Boolean).sort(),
    targetCities: [...new Set(rawData.map(r => r.target_city))].filter(Boolean).sort(),
    targetAudiences: [...new Set(rawData.map(r => r.target_audience))].filter(Boolean).sort(),
    marketingManagers: [...new Set(rawData.map(r => r.marketing_manager))].filter(Boolean).sort(),
    agencyNames: [...new Set(rawData.map(r => r.agency_name))].filter(Boolean).sort(),
  }), [rawData]);

  const insights = useMemo(() => {
    if (filteredData.length === 0) return [];
    
    const insightsList: string[] = [];
    
    const bestROI = [...filteredData].sort((a, b) => b.roi_percent - a.roi_percent)[0];
    if (bestROI) {
      insightsList.push(`🏆 Highest ROI: "${bestROI.campaign_name}" with ${bestROI.roi_percent.toFixed(1)}% ROI`);
    }

    const channelRevenue: Record<string, number> = {};
    filteredData.forEach(r => {
      channelRevenue[r.marketing_channel] = (channelRevenue[r.marketing_channel] || 0) + r.revenue_generated;
    });
    const bestChannel = Object.entries(channelRevenue).sort(([,a], [,b]) => b - a)[0];
    if (bestChannel) {
      insightsList.push(`📢 Best Channel: ${bestChannel[0]} generating $${(bestChannel[1] / 1000).toFixed(0)}K revenue`);
    }

    return insightsList;
  }, [filteredData]);

  return {
    data: filteredData,
    rawData,
    loading,
    error,
    filters,
    setFilters,
    kpis,
    filterOptions,
    refetch: fetchData,
    isUsingLiveData,
    insights,
  };
}
