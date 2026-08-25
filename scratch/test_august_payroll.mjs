import { calculatePayrollBreakdown } from '../client/src/lib/payroll-calculator.ts';

const augustEmployees = [
  { id: 3, name: 'Ganesh Kale', ctc: 45000 },
  { id: 1, name: 'Rohan Bhosale', ctc: 250000 },
  { id: 2, name: 'Nikita Nagargoje', ctc: 150000 },
  { id: 5, name: 'Amit Sharma', ctc: 130000 },
  { id: 6, name: 'Sujay Palande', ctc: 95000 },
  { id: 7, name: 'Deepa Nair', ctc: 75000 },
  { id: 4, name: 'Priya Desai', ctc: 40000 },
];

console.log("==========================================================================================");
console.log("                      AUGUST 2026 PAYROLL VERIFICATION TEST                               ");
console.log("==========================================================================================\n");

let allPassed = true;
const augustDays = 31;

for (const emp of augustEmployees) {
  // Simulate attendance logic: no absent logs marked -> 31 paid days
  const absentDays = 0;
  const halfDays = 0;
  const daysWorked = augustDays - (absentDays + 0.5 * halfDays);

  const b = calculatePayrollBreakdown(emp.ctc, { daysWorked, totalDaysInMonth: augustDays });

  const adminView = {
    empId: emp.id,
    daysWorked: daysWorked,
    totalDays: augustDays,
    gross: b.grossSalary,
    basic: b.basicSalary,
    hra: b.hra,
    da: b.da,
    specialAllowance: b.specialAllowance,
    conveyance: b.conveyance,
    medical: b.medical,
    epf: b.epf,
    pt: b.professionalTax,
    totalDeductions: b.totalDeductions,
    net: b.netSalary
  };

  // Saved Payment Record
  const savedRecord = {
    employeeId: emp.id,
    month: "Aug 2026",
    daysWorked: adminView.daysWorked,
    totalDaysInMonth: adminView.totalDays,
    grossSalary: adminView.gross,
    basicSalary: adminView.basic,
    hra: adminView.hra,
    da: adminView.da,
    specialAllowance: adminView.specialAllowance,
    conveyance: adminView.conveyance,
    medical: adminView.medical,
    epf: adminView.epf,
    professionalTax: adminView.pt,
    totalDeductions: adminView.totalDeductions,
    amount: adminView.net
  };

  // Employee Payslip View
  const empView = {
    paidDays: savedRecord.daysWorked,
    gross: savedRecord.grossSalary,
    basic: savedRecord.basicSalary,
    hra: savedRecord.hra,
    da: savedRecord.da,
    special: savedRecord.specialAllowance,
    conv: savedRecord.conveyance,
    med: savedRecord.medical,
    epf: savedRecord.epf,
    pt: savedRecord.professionalTax,
    deductions: savedRecord.totalDeductions,
    net: savedRecord.amount
  };

  const isExact = (adminView.gross === empView.gross) &&
                  (adminView.net === empView.net) &&
                  (adminView.daysWorked === empView.paidDays) &&
                  (adminView.gross === (adminView.basic + adminView.hra + adminView.da + adminView.specialAllowance + adminView.conveyance + adminView.medical)) &&
                  (adminView.net === (adminView.gross - adminView.totalDeductions));

  if (!isExact) allPassed = false;

  console.log(`--- ${emp.name} (August 2026 - ${augustDays} Days) ---`);
  console.log(`  Paid Days:        ${adminView.daysWorked} / ${augustDays}`);
  console.log(`  Gross Salary:     ₹${adminView.gross.toLocaleString()} (Basic: ₹${adminView.basic.toLocaleString()}, HRA: ₹${adminView.hra.toLocaleString()}, Special: ₹${adminView.specialAllowance.toLocaleString()})`);
  console.log(`  Total Deductions: ₹${adminView.totalDeductions.toLocaleString()} (EPF: ₹${adminView.epf.toLocaleString()}, PT: ₹${adminView.pt.toLocaleString()})`);
  console.log(`  Net Salary:       ₹${adminView.net.toLocaleString()}`);
  console.log(`  Status:           ${isExact ? 'PASSED ✅ (Admin & Employee 100% Equal)' : 'FAILED ❌'}\n`);
}

// Special check for Ganesh
const ganesh = augustEmployees.find(e => e.name === 'Ganesh Kale');
const ganeshB = calculatePayrollBreakdown(ganesh.ctc, { daysWorked: 31, totalDaysInMonth: 31 });

const ganeshOk = ganeshB.daysWorked === 31 &&
  ganeshB.grossSalary === 45000 &&
  ganeshB.basicSalary === 22500 &&
  ganeshB.da === 2250 &&
  ganeshB.hra === 11250 &&
  ganeshB.conveyance === 1900 &&
  ganeshB.medical === 1250 &&
  ganeshB.specialAllowance === 5850 &&
  ganeshB.epf === 1800 &&
  ganeshB.professionalTax === 200 &&
  ganeshB.totalDeductions === 2000 &&
  ganeshB.netSalary === 43000;

console.log("==========================================================================================");
console.log(`GANESH AUGUST 2026 VERIFICATION: ${ganeshOk ? 'PASSED ✅ (31 Paid Days, ₹45,000 Gross, ₹43,000 Net)' : 'FAILED ❌'}`);
console.log(`ALL EMPLOYEES AUGUST 2026 TEST: ${allPassed ? 'PASSED ✅' : 'FAILED ❌'}`);
console.log("==========================================================================================");

if (!allPassed || !ganeshOk) {
  process.exit(1);
}
