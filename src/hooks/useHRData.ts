import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { HRRecord, HRFilters, HRKPIData } from '@/types/hr';
import { dataCache } from '@/lib/dataCache';

const SHEET_ID = '1v-imyFcNfNR-Mr6gH9vccr2QaQc7oLSUc7ozPLoGgxQ';
const SHEET_GID = '1844316831';
const SHEET_URLS = [
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${SHEET_GID}`,
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${SHEET_GID}`,
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/pub?output=csv&gid=${SHEET_GID}`
];
const CACHE_KEY = 'hr_data';

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

export function useHRData() {
  const cachedData = dataCache.get<HRRecord[]>(CACHE_KEY);
  const [rawData, setRawData] = useState<HRRecord[]>(cachedData || []);
  const [loading, setLoading] = useState(!cachedData);
  const [isUsingLiveData, setIsUsingLiveData] = useState(!!cachedData);
  const [filters, setFilters] = useState<HRFilters>({
    dateRange: { from: null, to: null },
    departments: [],
    jobLevels: [],
    managers: [],
    locations: [],
    employmentTypes: [],
    employmentStatuses: [],
    performanceCategories: [],
    promotionEligibility: [],
    attritionRiskLevels: [],
    genders: [],
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
    
    // Try each URL format until one works
    for (const url of SHEET_URLS) {
      try {
        console.log('Trying HR URL:', url);
        const response = await fetch(url, {
          mode: 'cors',
          headers: {
            'Accept': 'text/csv',
          }
        });
        
        if (!response.ok) {
          console.log(`HR URL failed with ${response.status}:`, url);
          continue;
        }
        
        const csvText = await response.text();
        console.log('HR CSV response length:', csvText.length);
        
        if (csvText.includes('<!DOCTYPE') || csvText.includes('<html')) {
          console.log('Received HTML instead of CSV from:', url);
          continue;
        }
        
        const lines = csvText.split('\n').filter(line => line.trim());
        console.log('HR CSV lines:', lines.length);
        
        if (lines.length < 2) {
          console.log('No data rows found in:', url);
          continue;
        }
        
        const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().replace(/\s+/g, '_').replace(/['"]/g, ''));
        console.log('HR headers found:', headers);
        
        const records: HRRecord[] = lines.slice(1).map((line, idx) => {
          const values = parseCSVLine(line);
          const record: Record<string, any> = {};
          
          headers.forEach((header, index) => {
            record[header] = values[index]?.replace(/^"|"$/g, '') || '';
          });
          
          // Debug first record
          if (idx === 0) {
            console.log('HR first record:', record);
          }
          
          return {
            employee_id: record.employee_id || record.emp_id || record.id || record.employee_number || `EMP-${idx + 1}`,
            employee_name: record.employee_name || record.name || record.emp_name || record.full_name || `Employee ${idx + 1}`,
            email: record.email || record.emp_email || record.email_address || '',
            gender: record.gender || record.sex || '',
            age: parseFloat(record.age || record.employee_age || '0') || 25,
            department_name: record.department_name || record.department || record.dept || record.division || 'General',
            job_title: record.job_title || record.title || record.position || record.role || 'Employee',
            job_level: record.job_level || record.level || record.grade || 'Mid',
            manager_name: record.manager_name || record.manager || record.supervisor || 'Manager',
            office_location: record.office_location || record.location || record.office || record.site || 'Main Office',
            employment_type: record.employment_type || record.emp_type || record.type || 'Full-time',
            employment_status: record.employment_status || record.status || 'Active',
            hire_date: record.hire_date || record.date_hired || record.start_date || record.joining_date || '',
            exit_date: record.exit_date || record.date_exit || record.end_date || record.termination_date || '',
            tenure_years: parseFloat(record.tenure_years || record.tenure || record.years_service || record.experience || '0') || 2,
            total_working_days: parseFloat(record.total_working_days || record.working_days || record.work_days || '250') || 250,
            days_present: parseFloat(record.days_present || record.present_days || record.attendance_days || '200') || 200,
            days_absent: parseFloat(record.days_absent || record.absent_days || record.absences || '10') || 10,
            leave_days: parseFloat(record.leave_days || record.leaves || record.vacation_days || record.pto || '15') || 15,
            attendance_rate_percent: parseFloat(record.attendance_rate_percent || record.attendance_rate || record.attendance || '85') || 85,
            total_days_not_working: parseFloat(record.total_days_not_working || record.days_not_working || '25') || 25,
            performance_rating: parseFloat(record.performance_rating || record.rating || record.performance || record.score || '3.5') || 3.5,
            last_appraisal_date: record.last_appraisal_date || record.appraisal_date || record.review_date || '',
            performance_category: record.performance_category || record.perf_category || record.category || record.performance_level || 'Good',
            promotion_eligibility: record.promotion_eligibility || record.promotion || record.eligible || record.promotion_ready || 'No',
            base_salary: parseFloat(record.base_salary || record.salary || record.base_pay || record.annual_salary || '50000') || 50000,
            bonus: parseFloat(record.bonus || record.bonus_amount || record.incentive || '5000') || 5000,
            deductions: parseFloat(record.deductions || record.deduction_amount || record.tax || '2000') || 2000,
            net_salary: parseFloat(record.net_salary || record.net_pay || record.take_home || '53000') || 53000,
            job_satisfaction_score: parseFloat(record.job_satisfaction_score || record.satisfaction || record.job_satisfaction || record.satisfaction_rating || '4') || 4,
            attrition_risk_level: record.attrition_risk_level || record.risk_level || record.attrition_risk || record.flight_risk || 'Low',
          };
        }).filter(r => r.employee_id);
        
        console.log('HR records parsed:', records.length);
        
        if (records.length > 0) {
          setRawData(records);
          dataCache.set(CACHE_KEY, records);
          setIsUsingLiveData(true);
          setLoading(false);
          console.log(`HR data loaded successfully: ${records.length} records from ${url}`);
          isFetching.current = false;
          return;
        }
      } catch (error) {
        console.log('HR URL error:', url, error);
        continue;
      }
    }
    
    // If all URLs failed
    console.log('All HR URLs failed - check if Google Sheet is public and has data');
    setLoading(false);
    isFetching.current = false;
  }, [cachedData]);

  useEffect(() => {
    fetchData(true);
    const interval = setInterval(() => fetchData(false), 2000); // Every 2 seconds
    return () => clearInterval(interval);
  }, [fetchData]);


  const filteredData = useMemo(() => {
    return rawData.filter(record => {
      if (filters.departments.length > 0 && !filters.departments.includes(record.department_name)) return false;
      if (filters.jobLevels.length > 0 && !filters.jobLevels.includes(record.job_level)) return false;
      if (filters.managers.length > 0 && !filters.managers.includes(record.manager_name)) return false;
      if (filters.locations.length > 0 && !filters.locations.includes(record.office_location)) return false;
      if (filters.employmentTypes.length > 0 && !filters.employmentTypes.includes(record.employment_type)) return false;
      if (filters.employmentStatuses.length > 0 && !filters.employmentStatuses.includes(record.employment_status)) return false;
      if (filters.performanceCategories.length > 0 && !filters.performanceCategories.includes(record.performance_category)) return false;
      if (filters.promotionEligibility.length > 0 && !filters.promotionEligibility.includes(record.promotion_eligibility)) return false;
      if (filters.attritionRiskLevels.length > 0 && !filters.attritionRiskLevels.includes(record.attrition_risk_level)) return false;
      if (filters.genders.length > 0 && !filters.genders.includes(record.gender)) return false;
      
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        return (
          record.employee_id.toLowerCase().includes(query) ||
          record.employee_name.toLowerCase().includes(query) ||
          record.department_name.toLowerCase().includes(query) ||
          record.job_title.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  }, [rawData, filters]);

  const kpis: HRKPIData = useMemo(() => {
    const total = filteredData.length;
    const active = filteredData.filter(r => r.employment_status === 'Active').length;
    const terminated = filteredData.filter(r => r.employment_status === 'Terminated').length;
    const promotionEligible = filteredData.filter(r => r.promotion_eligibility === 'Yes').length;
    const highPerformers = filteredData.filter(r => r.performance_category === 'High').length;
    
    const avgTenure = total > 0 ? filteredData.reduce((sum, r) => sum + r.tenure_years, 0) / total : 0;
    const avgAttendance = total > 0 ? filteredData.reduce((sum, r) => sum + r.attendance_rate_percent, 0) / total : 0;
    const avgAge = total > 0 ? filteredData.reduce((sum, r) => sum + r.age, 0) / total : 0;
    const avgDaysNotWorking = total > 0 ? filteredData.reduce((sum, r) => sum + r.total_days_not_working, 0) / total : 0;
    const avgSalary = total > 0 ? filteredData.reduce((sum, r) => sum + r.net_salary, 0) / total : 0;
    const avgSatisfaction = total > 0 ? filteredData.reduce((sum, r) => sum + r.job_satisfaction_score, 0) / total : 0;
    
    return {
      totalEmployees: total,
      activeEmployees: active,
      terminatedEmployees: terminated,
      attritionRate: total > 0 ? terminated / total : 0,
      averageTenure: avgTenure,
      averageAttendanceRate: total > 0 ? avgAttendance / 100 : 0,
      averageAge: avgAge,
      promotionEligible,
      highPerformers,
      averageDaysNotWorking: avgDaysNotWorking,
      averageSalary: avgSalary,
      averageJobSatisfaction: avgSatisfaction,
    };
  }, [filteredData]);

  const filterOptions = useMemo(() => ({
    departments: [...new Set(rawData.map(r => r.department_name))].filter(Boolean).sort(),
    jobLevels: [...new Set(rawData.map(r => r.job_level))].filter(Boolean).sort(),
    managers: [...new Set(rawData.map(r => r.manager_name))].filter(Boolean).sort(),
    locations: [...new Set(rawData.map(r => r.office_location))].filter(Boolean).sort(),
    employmentTypes: [...new Set(rawData.map(r => r.employment_type))].filter(Boolean).sort(),
    employmentStatuses: [...new Set(rawData.map(r => r.employment_status))].filter(Boolean).sort(),
    performanceCategories: [...new Set(rawData.map(r => r.performance_category))].filter(Boolean).sort(),
    promotionEligibility: [...new Set(rawData.map(r => r.promotion_eligibility))].filter(Boolean).sort(),
    attritionRiskLevels: [...new Set(rawData.map(r => r.attrition_risk_level))].filter(Boolean).sort(),
    genders: [...new Set(rawData.map(r => r.gender))].filter(Boolean).sort(),
  }), [rawData]);

  const insights = useMemo(() => {
    const insights: string[] = [];
    
    if (kpis.attritionRate > 0.15) {
      insights.push(`⚠️ High attrition rate of ${(kpis.attritionRate * 100).toFixed(1)}% requires immediate attention.`);
    }
    
    const deptAttrition = filteredData.reduce((acc, r) => {
      if (!acc[r.department_name]) acc[r.department_name] = { total: 0, terminated: 0 };
      acc[r.department_name].total++;
      if (r.employment_status === 'Terminated') acc[r.department_name].terminated++;
      return acc;
    }, {} as Record<string, { total: number; terminated: number }>);
    
    const highAttritionDept = Object.entries(deptAttrition)
      .map(([dept, data]) => ({ dept, rate: (data.terminated / data.total) * 100 }))
      .sort((a, b) => b.rate - a.rate)[0];
    
    if (highAttritionDept && highAttritionDept.rate > 20) {
      insights.push(`🔴 ${highAttritionDept.dept} has the highest attrition rate at ${highAttritionDept.rate.toFixed(1)}%.`);
    }
    
    if (kpis.averageAttendanceRate < 0.85) {
      insights.push(`📉 Average attendance rate is ${(kpis.averageAttendanceRate * 100).toFixed(1)}% - below target of 85%.`);
    }
    
    const highRiskCount = filteredData.filter(r => r.attrition_risk_level === 'High' && r.employment_status === 'Active').length;
    if (highRiskCount > 0) {
      insights.push(`🚨 ${highRiskCount} active employees are at high attrition risk.`);
    }
    
    if (kpis.promotionEligible > 0) {
      insights.push(`⭐ ${kpis.promotionEligible} employees are eligible for promotion.`);
    }
    
    const avgTenureTerminated = filteredData.filter(r => r.employment_status === 'Terminated');
    if (avgTenureTerminated.length > 0) {
      const avgTen = avgTenureTerminated.reduce((sum, r) => sum + r.tenure_years, 0) / avgTenureTerminated.length;
      insights.push(`📊 Average tenure of terminated employees: ${avgTen.toFixed(1)} years.`);
    }
    
    return insights;
  }, [filteredData, kpis]);

  return {
    data: filteredData,
    rawData,
    loading,
    isUsingLiveData,
    filters,
    setFilters,
    kpis,
    filterOptions,
    insights,
  };
}
