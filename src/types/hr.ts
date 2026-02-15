export interface HRRecord {
  employee_id: string;
  employee_name: string;
  email: string;
  gender: string;
  age: number;
  department_name: string;
  job_title: string;
  job_level: string;
  manager_name: string;
  office_location: string;
  employment_type: string;
  employment_status: string;
  hire_date: string;
  exit_date: string;
  tenure_years: number;
  total_working_days: number;
  days_present: number;
  days_absent: number;
  leave_days: number;
  attendance_rate_percent: number;
  total_days_not_working: number;
  performance_rating: number;
  last_appraisal_date: string;
  performance_category: string;
  promotion_eligibility: string;
  base_salary: number;
  bonus: number;
  deductions: number;
  net_salary: number;
  job_satisfaction_score: number;
  attrition_risk_level: string;
}

export interface HRFilters {
  dateRange: { from: Date | null; to: Date | null };
  departments: string[];
  jobLevels: string[];
  managers: string[];
  locations: string[];
  employmentTypes: string[];
  employmentStatuses: string[];
  performanceCategories: string[];
  promotionEligibility: string[];
  attritionRiskLevels: string[];
  genders: string[];
  searchQuery: string;
}

export interface HRKPIData {
  totalEmployees: number;
  activeEmployees: number;
  terminatedEmployees: number;
  attritionRate: number;
  averageTenure: number;
  averageAttendanceRate: number;
  averageAge: number;
  promotionEligible: number;
  highPerformers: number;
  averageDaysNotWorking: number;
  averageSalary: number;
  averageJobSatisfaction: number;
}
