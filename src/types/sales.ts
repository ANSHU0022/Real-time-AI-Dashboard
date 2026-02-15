export interface SaleRecord {
  sale_id: string;
  date: string;
  customer_id: string;
  customer_region: string;
  product_id: string;
  product_category: string;
  unit_price: number;
  quantity: number;
  discount_percent: number;
  sales_agent: string;
  payment_method: string;
  subscription_type: string;
  renewal_status: string;
  total_revenue: number;
  // Calculated fields
  gross_sales: number;
  discount_amount: number;
  discount_pct_row: number;
  revenue_per_unit: number;
}

export interface DashboardFilters {
  dateRange: { start: Date | null; end: Date | null };
  regions: string[];
  categories: string[];
  agents: string[];
  paymentMethods: string[];
  subscriptionTypes: string[];
  searchQuery: string;
  selectedProduct: string | null;
}

export interface KPIData {
  totalRevenue: number;
  totalOrders: number;
  aov: number;
  totalQuantity: number;
  grossSales: number;
  totalDiscount: number;
  discountPct: number;
  uniqueCustomers: number;
  renewalRate: number;
  churnRate: number;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  rollingAvg?: number;
}

export interface RegionData {
  region: string;
  revenue: number;
  percentage: number;
}

export interface ProductData {
  product: string;
  category: string;
  revenue: number;
}

export interface AgentData {
  agent: string;
  revenue: number;
  orders: number;
  avgRevenue: number;
}
