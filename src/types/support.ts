export interface SupportRecord {
  ticket_id: string;
  ticket_created_at: string;
  ticket_resolved_at: string;
  ticket_status: string;
  priority: string;
  issue_category: string;
  issue_subcategory: string;
  support_channel: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_region: string;
  agent_id: string;
  agent_name: string;
  agent_team: string;
  first_response_time_minutes: number;
  resolution_time_minutes: number;
  sla_target_minutes: number;
  sla_breached_flag: string;
  escalation_flag: string;
  ticket_reopen_count: number;
  customer_satisfaction_score: number;
  feedback_comments: string;
  product_name: string;
  contact_reason: string;
}

export interface SupportFilters {
  searchQuery: string;
  dateRange: { from: Date | undefined; to: Date | undefined };
  statuses: string[];
  priorities: string[];
  issueCategories: string[];
  channels: string[];
  agents: string[];
  teams: string[];
  regions: string[];
  products: string[];
  slaBreached: string[];
  escalated: string[];
}

export interface SupportKPIData {
  totalTickets: number;
  openTickets: number;
  resolvedClosedTickets: number;
  slaCompliance: number;
  slaBreachRate: number;
  avgFirstResponseTime: number;
  avgResolutionTime: number;
  avgCSAT: number;
  escalationRate: number;
  reopenRate: number;
}
