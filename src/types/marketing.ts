export interface MarketingRecord {
  campaign_id: string;
  campaign_name: string;
  campaign_type: string;
  campaign_start_date: string;
  campaign_end_date: string;
  campaign_status: string;
  marketing_channel: string;
  platform_name: string;
  ad_format: string;
  target_region: string;
  target_city: string;
  target_audience: string;
  impressions: number;
  clicks: number;
  leads_generated: number;
  conversions: number;
  cost_per_click: number;
  cost_per_lead: number;
  total_campaign_cost: number;
  revenue_generated: number;
  roi_percent: number;
  conversion_rate: number;
  click_through_rate: number;
  landing_page_url: string;
  bounce_rate: number;
  avg_session_duration: number;
  marketing_manager: string;
  agency_name: string;
  created_at: string;
  updated_at: string;
}

export interface MarketingFilters {
  dateRange: { start: Date | null; end: Date | null };
  campaignTypes: string[];
  campaignStatuses: string[];
  marketingChannels: string[];
  platformNames: string[];
  targetRegions: string[];
  targetCities: string[];
  targetAudiences: string[];
  marketingManagers: string[];
  agencyNames: string[];
  roiRange: { min: number | null; max: number | null };
  cpcRange: { min: number | null; max: number | null };
  searchQuery: string;
}

export interface MarketingKPIData {
  totalCampaignSpend: number;
  totalRevenue: number;
  overallROI: number;
  avgCPC: number;
  avgCPL: number;
  totalLeads: number;
  totalConversions: number;
  conversionRate: number;
  avgCTR: number;
}
