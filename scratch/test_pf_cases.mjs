import { calculatePayrollBreakdown } from '../client/src/lib/payroll-calculator.js';

console.log("=== PF SPECIFICATION TEST SUITE ===");

const cases = [
  { basic: 10000, monthlyCTC: 20000, expectedPF: 1200 },
  { basic: 15000, monthlyCTC: 30000, expectedPF: 1800 },
  { basic: 20000, monthlyCTC: 40000, expectedPF: 1800 },
  { basic: 47500, monthlyCTC: 95000, expectedPF: 1800 },
  { basic: 125000, monthlyCTC: 250000, expectedPF: 1800 },
];

for (const c of cases) {
  const breakdown = calculatePayrollBreakdown(c.monthlyCTC, {
    basicSalaryPercentage: 50,
    epfPercentage: 12,
  });

  console.log(`Basic Salary: ₹${breakdown.basicSalary} | Calculated EPF: ₹${breakdown.epf} | Expected: ₹${c.expectedPF}`);
  if (breakdown.epf !== c.expectedPF) {
    console.error(`❌ FAILED for Basic ₹${c.basic}: expected ₹${c.expectedPF}, got ₹${breakdown.epf}`);
    process.exit(1);
  }
}

console.log("✅ ALL PF TEST CASES PASSED SUCCESSFULLY!");
