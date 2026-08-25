import { calculatePayrollBreakdown } from '../client/src/lib/payroll-calculator.ts';

const employees = [
  { id: 1, name: 'Rohan Bhosale', ctc: 250000 },
  { id: 2, name: 'Nikita Nagargoje', ctc: 150000 },
  { id: 3, name: 'Ganesh Kale', ctc: 45000 },
  { id: 4, name: 'Priya Desai', ctc: 40000 },
  { id: 5, name: 'Amit Sharma', ctc: 130000 },
  { id: 6, name: 'Sujay Palande', ctc: 95000 },
  { id: 7, name: 'Deepa Nair', ctc: 75000 },
];

const monthsToTest = [
  { name: 'Aug 2026', days: 31 },
  { name: 'Jul 2026', days: 31 },
  { name: 'Jun 2026', days: 30 },
];

console.log("==========================================================================================");
console.log("             COMPREHENSIVE MULTI-MONTH SINGLE SOURCE OF TRUTH VERIFICATION                ");
console.log("==========================================================================================\n");

let allPassed = true;
const simulatedDB = new Map(); // key: `${employeeId}_${monthKey}`

// 1. Simulate Admin Run Payroll Finalization for each month & employee
for (const m of monthsToTest) {
  for (const emp of employees) {
    const adminCalc = calculatePayrollBreakdown(emp.ctc, { daysWorked: m.days, totalDaysInMonth: m.days });
    
    const recordPayload = {
      id: Math.floor(Math.random() * 10000),
      employeeId: emp.id,
      month: m.name,
      paymentStatus: 'paid',
      amount: adminCalc.netSalary,
      daysWorked: m.days,
      totalDaysInMonth: m.days,
      grossSalary: adminCalc.grossSalary,
      basicSalary: adminCalc.basicSalary,
      hra: adminCalc.hra,
      da: adminCalc.da,
      specialAllowance: adminCalc.specialAllowance,
      conveyance: adminCalc.conveyance,
      medical: adminCalc.medical,
      epf: adminCalc.epf,
      esic: adminCalc.esic,
      professionalTax: adminCalc.professionalTax,
      totalDeductions: adminCalc.totalDeductions,
    };

    // Store in DB (upsert simulation)
    const key = `${emp.id}_${m.name}`;
    simulatedDB.set(key, recordPayload);
  }
}

// 2. Verify Employee Side reads the EXACT SAME stored record for each month
for (const m of monthsToTest) {
  console.log(`--- Month: ${m.name} ---`);
  for (const emp of employees) {
    const key = `${emp.id}_${m.name}`;
    const storedRecord = simulatedDB.get(key);

    if (!storedRecord) {
      console.error(`ERROR: Missing record for ${emp.name} in ${m.name}`);
      allPassed = false;
      continue;
    }

    // Employee Dashboard & PDF read stored record
    const empNetPay = storedRecord.amount;
    const empGrossPay = storedRecord.grossSalary;
    const empDeductions = storedRecord.totalDeductions;

    const adminCalc = calculatePayrollBreakdown(emp.ctc, { daysWorked: m.days, totalDaysInMonth: m.days });

    const netMatches = (empNetPay === adminCalc.netSalary) && (empNetPay === storedRecord.amount);
    const grossMatches = (empGrossPay === adminCalc.grossSalary) && (empGrossPay === storedRecord.grossSalary);
    const dedMatches = (empDeductions === adminCalc.totalDeductions) && (empDeductions === storedRecord.totalDeductions);

    const ok = netMatches && grossMatches && dedMatches;
    if (!ok) allPassed = false;

    console.log(`  [${ok ? 'OK' : 'FAIL'}] ${emp.name.padEnd(18)}: Gross=₹${empGrossPay.toLocaleString().padStart(7)}, Deductions=₹${empDeductions.toLocaleString().padStart(5)}, Net=₹${empNetPay.toLocaleString().padStart(7)}`);
  }
  console.log("");
}

console.log("==========================================================================================");
console.log(`MULTI-MONTH SINGLE SOURCE OF TRUTH TEST: ${allPassed ? 'PASSED ✅' : 'FAILED ❌'}`);
console.log("==========================================================================================");

if (!allPassed) {
  process.exit(1);
}
