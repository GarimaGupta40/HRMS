export interface SalaryBreakdownOptions {
  daysWorked?: number;
  totalDaysInMonth?: number;
  basicSalaryPercentage?: number; // default 50%
  hraPercentage?: number; // default 50%
  epfPercentage?: number; // default 12%
  esicPercentage?: number; // default 0.75%
  professionalTax?: number; // default 200
  conveyanceAmount?: number; // default 1900
  medicalAmount?: number; // default 1250
  bonus?: number; // default 0
  overtime?: number; // default 0
  tds?: number; // default 0
  mlwfEmployee?: number; // default 0
  loanAdvance?: number; // default 0
  otherDeductions?: number; // default 0
  pfApplicable?: boolean;
  esicApplicable?: boolean;
  ptApplicable?: boolean;
}

export interface SalaryBreakdown {
  monthlyCTC: number;
  daysWorked: number;
  totalDaysInMonth: number;
  grossSalary: number;
  basicSalary: number;
  da: number;
  hra: number;
  conveyance: number;
  medical: number;
  bonus: number;
  overtime: number;
  specialAllowance: number;
  totalEarnings: number;
  epf: number;
  esic: number;
  professionalTax: number;
  tds: number;
  mlwfEmployee: number;
  mlwfEmployer: number;
  loanAdvance: number;
  otherDeductions: number;
  totalDeductions: number;
  netSalary: number;
}

/**
 * Single Source of Truth for Payroll Calculation in HRMS
 * 
 * Formulas enforced:
 * - Gross Salary = (monthlyCTC / totalDaysInMonth) * daysWorked (or monthlyCTC for full month)
 * - Basic Salary = basicSalaryPercentage % of Gross Salary (default 50%)
 * - DA = 10% of Basic Salary
 * - HRA = hraPercentage % of Basic Salary (default 50%)
 * - Conveyance = ₹1,900 / month (pro-rated by days worked if pro-rated)
 * - Medical = ₹1,250 / month (pro-rated by days worked if pro-rated)
 * - Special Allowance = Gross Salary - (Basic + DA + HRA + Conveyance + Medical + Bonus + Overtime)
 * - Total Earnings = Sum of all earnings = Gross Salary
 * - EPF = 12% of min(Basic, 15,000) if PF applicable
 * - ESIC = 0.75% of Gross if Gross <= 21,000 and ESIC applicable
 * - Professional Tax = ₹200 if Gross > 10,000 and PT applicable
 * - Total Deductions = EPF + ESIC + Professional Tax + TDS + MLWF + Loan/Advance + Other Deductions
 * - Net Salary = Gross Salary - Total Deductions
 */
export function calculatePayrollBreakdown(
  monthlyCTC: number,
  options: SalaryBreakdownOptions = {}
): SalaryBreakdown {
  const safeCTC = Math.max(0, monthlyCTC || 0);
  const daysWorked = options.daysWorked ?? 30;
  const totalDaysInMonth = options.totalDaysInMonth ?? 30;
  const isProrated = daysWorked !== totalDaysInMonth && totalDaysInMonth > 0;
  const ratio = totalDaysInMonth > 0 ? daysWorked / totalDaysInMonth : 1;

  // 1. Gross Salary
  const grossSalary = isProrated ? Math.round(safeCTC * ratio) : Math.round(safeCTC);

  // 2. Earnings components
  const basicPercentage = (options.basicSalaryPercentage ?? 50) / 100;
  const hraPercentage = (options.hraPercentage ?? 50) / 100;

  const basicSalary = Math.round(grossSalary * basicPercentage);
  const da = Math.round(basicSalary * 0.10);
  const hra = Math.round(basicSalary * hraPercentage);

  const rawConveyance = options.conveyanceAmount ?? 1900;
  const conveyance = isProrated ? Math.round(rawConveyance * ratio) : rawConveyance;

  const rawMedical = options.medicalAmount ?? 1250;
  const medical = isProrated ? Math.round(rawMedical * ratio) : rawMedical;

  const bonus = options.bonus ?? 0;
  const overtime = options.overtime ?? 0;

  // Special Allowance is the exact balancing amount so total earnings equal Gross Salary
  const nonSpecialEarnings = basicSalary + da + hra + conveyance + medical + bonus + overtime;
  const specialAllowance = Math.max(0, grossSalary - nonSpecialEarnings);

  const totalEarnings = grossSalary;

  // 3. Deductions components
  const pfApplicable = options.pfApplicable ?? true;
  const epfPercentage = (options.epfPercentage ?? 12) / 100;
  const epf = pfApplicable ? (basicSalary > 15000 ? 1800 : Math.round(basicSalary * epfPercentage)) : 0;

  const esicApplicable = options.esicApplicable ?? true;
  const esicRate = (options.esicPercentage ?? 0.75) / 100;
  const esic = (esicApplicable && grossSalary <= 21000) ? Math.round(grossSalary * esicRate) : 0;

  const ptApplicable = options.ptApplicable ?? true;
  const ptRate = options.professionalTax ?? 200;
  const professionalTax = (ptApplicable && grossSalary > 10000) ? ptRate : 0;

  const tds = options.tds ?? 0;
  const mlwfEmployee = options.mlwfEmployee ?? 0;
  const mlwfEmployer = mlwfEmployee > 0 ? 75 : 0;
  const loanAdvance = options.loanAdvance ?? 0;
  const otherDeductions = options.otherDeductions ?? 0;

  const totalDeductions = epf + esic + professionalTax + tds + mlwfEmployee + loanAdvance + otherDeductions;

  // 4. Net Salary
  const netSalary = grossSalary - totalDeductions;

  return {
    monthlyCTC: safeCTC,
    daysWorked,
    totalDaysInMonth,
    grossSalary,
    basicSalary,
    da,
    hra,
    conveyance,
    medical,
    bonus,
    overtime,
    specialAllowance,
    totalEarnings,
    epf,
    esic,
    professionalTax,
    tds,
    mlwfEmployee,
    mlwfEmployer,
    loanAdvance,
    otherDeductions,
    totalDeductions,
    netSalary,
  };
}
