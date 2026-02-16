import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { SaleRecord, DashboardFilters, KPIData } from '@/types/sales';
import { dataCache } from '@/lib/dataCache';

const SHEET_ID = '1v-imyFcNfNR-Mr6gH9vccr2QaQc7oLSUc7ozPLoGgxQ';
const SHEET_GID = '643477074';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${SHEET_GID}`;
const CACHE_KEY = 'sales_data';

export function useSalesData() {
  // Initialize from cache for instant display
  const cachedData = dataCache.get<SaleRecord[]>(CACHE_KEY);
  const [rawData, setRawData] = useState<SaleRecord[]>(cachedData || []);
  const [loading, setLoading] = useState(!cachedData);
  const [error, setError] = useState<string | null>(null);
  const [isUsingLiveData, setIsUsingLiveData] = useState(!!cachedData);
  const [filters, setFilters] = useState<DashboardFilters>({
    dateRange: { start: null, end: null },
    regions: [],
    categories: [],
    agents: [],
    paymentMethods: [],
    subscriptionTypes: [],
    searchQuery: '',
    selectedProduct: null,
  });
  
  const isFetching = useRef(false);
  const lastFetchTime = useRef(0);

  const fetchData = useCallback(async (isInitial = false) => {
    // Prevent concurrent fetches
    if (isFetching.current) return;
    
    // Throttle fetches to every 30 seconds
    const now = Date.now();
    if (now - lastFetchTime.current < 30000 && !isInitial) return;
    
    isFetching.current = true;
    lastFetchTime.current = now;
    
    // Only show loading on initial load without cache
    if (isInitial && !cachedData) {
      setLoading(true);
    }
    
    try {
      const response = await fetch(SHEET_URL);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const csvText = await response.text();
      
      if (!csvText || csvText.includes('<!DOCTYPE') || csvText.includes('<html')) {
        throw new Error('Invalid response');
      }
      
      const parsed = parseCSV(csvText);
      
      if (parsed.length > 0) {
        setRawData(parsed);
        dataCache.set(CACHE_KEY, parsed);
        setIsUsingLiveData(true);
        setError(null);
        setLoading(false);
      } else {
        throw new Error('No data parsed');
      }
    } catch (err) {
      console.error('Google Sheets fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
      setLoading(false);
    } finally {
      isFetching.current = false;
    }
  }, []);

  useEffect(() => {
    fetchData(true);
    const interval = setInterval(() => fetchData(false), 300000); // Every 5 minutes
    return () => clearInterval(interval);
  }, [fetchData]);

  const parseCSV = (csv: string): SaleRecord[] => {
    const lines = csv.trim().split('\n');
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    return lines.slice(1).map(line => {
      const values = parseCSVLine(line);
      const record: Record<string, any> = {};
      
      headers.forEach((header, index) => {
        record[header] = values[index]?.trim().replace(/"/g, '') || '';
      });

      const unitPrice = parseFloat(record.unit_price) || 0;
      const quantity = parseInt(record.quantity) || 0;
      const totalRevenue = parseFloat(record.total_revenue) || 0;
      const grossSales = unitPrice * quantity;

      return {
        sale_id: record.sale_id,
        date: record.date,
        customer_id: record.customer_id,
        customer_region: record.customer_region,
        product_id: record.product_id,
        product_category: record.product_category,
        unit_price: unitPrice,
        quantity: quantity,
        discount_percent: parseFloat(record.discount_percent) || 0,
        sales_agent: record.sales_agent,
        payment_method: record.payment_method,
        subscription_type: record.subscription_type,
        renewal_status: record.renewal_status,
        total_revenue: totalRevenue,
        gross_sales: grossSales,
        discount_amount: grossSales - totalRevenue,
        discount_pct_row: grossSales === 0 ? 0 : (grossSales - totalRevenue) / grossSales,
        revenue_per_unit: quantity === 0 ? 0 : totalRevenue / quantity,
      } as SaleRecord;
    }).filter(r => r.sale_id);
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
        const recordDate = new Date(record.date);
        if (filters.dateRange.start && recordDate < filters.dateRange.start) return false;
        if (filters.dateRange.end && recordDate > filters.dateRange.end) return false;
      }

      if (filters.regions.length > 0 && !filters.regions.includes(record.customer_region)) return false;
      if (filters.categories.length > 0 && !filters.categories.includes(record.product_category)) return false;
      if (filters.agents.length > 0 && !filters.agents.includes(record.sales_agent)) return false;
      if (filters.paymentMethods.length > 0 && !filters.paymentMethods.includes(record.payment_method)) return false;
      if (filters.subscriptionTypes.length > 0 && !filters.subscriptionTypes.includes(record.subscription_type)) return false;
      if (filters.selectedProduct && record.product_id !== filters.selectedProduct) return false;

      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        return (
          record.sale_id.toLowerCase().includes(query) ||
          record.customer_id.toLowerCase().includes(query) ||
          record.product_id.toLowerCase().includes(query) ||
          record.sales_agent.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [rawData, filters]);

  const kpis = useMemo((): KPIData => {
    const data = filteredData;
    const totalRevenue = data.reduce((sum, r) => sum + r.total_revenue, 0);
    const grossSales = data.reduce((sum, r) => sum + r.gross_sales, 0);
    const totalDiscount = grossSales - totalRevenue;
    const uniqueOrders = new Set(data.map(r => r.sale_id)).size;
    const uniqueCustomers = new Set(data.map(r => r.customer_id)).size;
    const renewedCount = data.filter(r => r.renewal_status === 'Renewed').length;
    const expiredCount = data.filter(r => r.renewal_status === 'Expired').length;

    return {
      totalRevenue,
      totalOrders: uniqueOrders,
      aov: uniqueOrders === 0 ? 0 : totalRevenue / uniqueOrders,
      totalQuantity: data.reduce((sum, r) => sum + r.quantity, 0),
      grossSales,
      totalDiscount,
      discountPct: grossSales === 0 ? 0 : totalDiscount / grossSales,
      uniqueCustomers,
      renewalRate: data.length === 0 ? 0 : renewedCount / data.length,
      churnRate: data.length === 0 ? 0 : expiredCount / data.length,
    };
  }, [filteredData]);

  const filterOptions = useMemo(() => ({
    regions: [...new Set(rawData.map(r => r.customer_region))].filter(Boolean).sort(),
    categories: [...new Set(rawData.map(r => r.product_category))].filter(Boolean).sort(),
    agents: [...new Set(rawData.map(r => r.sales_agent))].filter(Boolean).sort(),
    paymentMethods: [...new Set(rawData.map(r => r.payment_method))].filter(Boolean).sort(),
    subscriptionTypes: [...new Set(rawData.map(r => r.subscription_type))].filter(Boolean).sort(),
  }), [rawData]);

  const refetch = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  return {
    data: filteredData,
    rawData,
    loading,
    error,
    filters,
    setFilters,
    kpis,
    filterOptions,
    refetch,
    isUsingLiveData,
  };
}
