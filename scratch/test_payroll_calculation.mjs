import { calculatePayrollBreakdown } from '../client/src/lib/payroll-calculator.ts';

const employees = [
  { name: 'Rohan Bhosale', salary: 250000 },
  { name: 'Nikita Nagargoje', salary: 150000 },
  { name: 'Ganesh Kale', salary: 45000 },
  { name: 'Priya Desai', salary: 40000 },
  { name: 'Amit Sharma', salary: 130000 },
  { name: 'Sujay Palande', salary: 95000 },
  { name: 'Deepa Nair', salary: 75000 },
];

console.log("==================================================================================");
console.log("                       PAYROLL CALCULATION VERIFICATION                           ");
console.log("==================================================================================\n");

let allPassed = true;

for (const emp of employees) {
  const b = calculatePayrollBreakdown(emp.salary);
  const sumEarnings = b.basicSalary + b.da + b.hra + b.conveyance + b.medical + b.specialAllowance + b.bonus + b.overtime;
  const sumDeductions = b.epf + b.esic + b.professionalTax + b.tds + b.mlwfEmployee + b.loanAdvance + b.otherDeductions;
  const computedNet = b.grossSalary - sumDeductions;

  const earningsValid = sumEarnings === b.grossSalary;
  const deductionsValid = sumDeductions === b.totalDeductions;
  const netValid = b.netSalary === computedNet;

  const isOk = earningsValid && deductionsValid && netValid;
  if (!isOk) allPassed = false;

  console.log(`--- ${emp.name} (Gross: ₹${b.grossSalary.toLocaleString()}) ---`);
  console.log(`  [Earnings] Basic: ₹${b.basicSalary.toLocaleString()} | DA: ₹${b.da.toLocaleString()} | HRA: ₹${b.hra.toLocaleString()}`);
  console.log(`             Conv: ₹${b.conveyance.toLocaleString()} | Med: ₹${b.medical.toLocaleString()} | Special: ₹${b.specialAllowance.toLocaleString()}`);
  console.log(`             Total Earnings: ₹${b.totalEarnings.toLocaleString()} (Gross: ₹${b.grossSalary.toLocaleString()}) -> ${earningsValid ? 'OK' : 'MISMATCH'}`);
  console.log(`  [Deductions] EPF: ₹${b.epf.toLocaleString()} | PT: ₹${b.professionalTax.toLocaleString()} | ESIC: ₹${b.esic.toLocaleString()}`);
  console.log(`               Total Deductions: ₹${b.totalDeductions.toLocaleString()} -> ${deductionsValid ? 'OK' : 'MISMATCH'}`);
  console.log(`  [Net Salary] Net: ₹${b.netSalary.toLocaleString()} -> ${netValid ? 'OK' : 'MISMATCH'}\n`);
}

// Special check for Nikita
const nikita = calculatePayrollBreakdown(150000);
const nikitaOk = nikita.grossSalary === 150000 &&
  nikita.basicSalary === 75000 &&
  nikita.da === 7500 &&
  nikita.hra === 37500 &&
  nikita.conveyance === 1900 &&
  nikita.medical === 1250 &&
  nikita.specialAllowance === 26850 &&
  nikita.epf === 1800 &&
  nikita.professionalTax === 200 &&
  nikita.totalDeductions === 2000 &&
  nikita.netSalary === 148000;

console.log("==================================================================================");
console.log(`NIKITA EXAMPLE EXACT VERIFICATION: ${nikitaOk ? 'PASSED ✅' : 'FAILED ❌'}`);
console.log(`ALL EMPLOYEES CONSISTENCY TEST:   ${allPassed ? 'PASSED ✅' : 'FAILED ❌'}`);
console.log("==================================================================================");

if (!allPassed || !nikitaOk) {
  process.exit(1);
}
