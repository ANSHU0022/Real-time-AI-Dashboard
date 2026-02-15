export interface FinanceRecord {
  finance_id: string;
  transaction_date: string;
  month: string;
  quarter: string;
  financial_year: string;
  department_name: string;
  cost_center: string;
  project_name: string;
  revenue_type: string;
  customer_id: string;
  customer_region: string;
  gross_revenue: number;
  discount_amount: number;
  net_revenue: number;
  expense_type: string;
  expense_category: string;
  vendor_name: string;
  expense_amount: number;
  gst_rate: number;
  gst_amount: number;
  taxable_amount: number;
  payment_mode: string;
  payment_status: string;
  cash_inflow: number;
  cash_outflow: number;
  net_cash_flow: number;
  total_cost: number;
  gross_profit: number;
  profit_margin_percent: number;
  budget_allocated: number;
  budget_used: number;
  budget_variance: number;
  forecasted_revenue: number;
  approval_status: string;
  risk_flag: string;
  created_at: string;
  updated_at: string;
}

export interface FinanceFilters {
  dateRange: { from: Date | null; to: Date | null };
  financialYears: string[];
  quarters: string[];
  months: string[];
  departments: string[];
  costCenters: string[];
  projects: string[];
  revenueTypes: string[];
  expenseTypes: string[];
  expenseCategories: string[];
  vendors: string[];
  customerRegions: string[];
  paymentModes: string[];
  paymentStatuses: string[];
  approvalStatuses: string[];
  riskFlags: string[];
  searchQuery: string;
}

export interface FinanceKPIData {
  grossRevenue: number;
  netRevenue: number;
  totalExpenses: number;
  grossProfit: number;
  profitMargin: number;
  netCashFlow: number;
  budgetUtilization: number;
  budgetVariance: number;
  forecastAccuracy: number;
  highRiskTransactions: number;
}
