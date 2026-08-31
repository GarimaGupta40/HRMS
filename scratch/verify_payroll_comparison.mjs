import { FileStorage } from '../server/file-storage.ts';
import { calculatePayrollBreakdown } from '../client/src/lib/payroll-calculator.ts';
import fs from 'fs';

async function verify() {
  const storage = new FileStorage('data/hr-data.json');
  await storage.initialize();

  const users = await storage.getUsers();
  const settingsData = fs.readFileSync('data/system-settings.json', 'utf8');
  const settings = JSON.parse(settingsData);
  const salaryComponents = settings.salaryComponents;

  console.log("=== SYSTEM SETTINGS ACTIVE IN FILE ===");
  console.log(JSON.stringify(salaryComponents, null, 2));

  console.log("\n=== COMPARING EMPLOYEES: PAYROLL TABLE vs PAYSLIP GENERATOR vs SAVED PAYMENT RECORDS ===");

  const paymentRecords = storage.data.paymentRecords || [];

  for (const emp of users) {
    if (!emp.salary || emp.salary <= 0) continue;

    // 1. Payroll Dashboard calculation
    const dashboardCalc = calculatePayrollBreakdown(emp.salary, {
      basicSalaryPercentage: salaryComponents.basicSalaryPercentage,
      hraPercentage: salaryComponents.hraPercentage,
      epfPercentage: salaryComponents.epfPercentage,
      esicPercentage: salaryComponents.esicPercentage,
      professionalTax: salaryComponents.professionalTax,
      pfApplicable: emp.pfApplicable ?? true,
      esicApplicable: emp.esicApplicable ?? true,
      ptApplicable: emp.ptApplicable ?? true,
    });

    // 2. Employee Side / Self-Service Payslip calculation
    const selfServiceCalc = calculatePayrollBreakdown(emp.salary, {
      basicSalaryPercentage: salaryComponents.basicSalaryPercentage,
      hraPercentage: salaryComponents.hraPercentage,
      epfPercentage: salaryComponents.epfPercentage,
      esicPercentage: salaryComponents.esicPercentage,
      professionalTax: salaryComponents.professionalTax,
    });

    // 3. Saved payment records for this employee
    const empRecords = paymentRecords.filter(r => r.employeeId === emp.id);
    const latestRecord = empRecords[empRecords.length - 1];

    console.log(`\n--------------------------------------------------`);
    console.log(`Employee ID: ${emp.id} | Name: ${emp.firstName} ${emp.lastName} | Monthly CTC: ₹${emp.salary}`);
    console.log(`  PF Applicable: ${emp.pfApplicable} | ESIC Applicable: ${emp.esicApplicable} | PT Applicable: ${emp.ptApplicable}`);

    console.log(`\n  Dashboard Breakdown:`);
    console.log(`    Gross: ₹${dashboardCalc.grossSalary} | Basic: ₹${dashboardCalc.basicSalary} | HRA: ₹${dashboardCalc.hra} | DA: ₹${dashboardCalc.da} | Special: ₹${dashboardCalc.specialAllowance}`);
    console.log(`    Deductions -> EPF: ₹${dashboardCalc.epf} | ESIC: ₹${dashboardCalc.esic} | PT: ₹${dashboardCalc.professionalTax} | Total Ded: ₹${dashboardCalc.totalDeductions}`);
    console.log(`    Net Salary: ₹${dashboardCalc.netSalary}`);

    console.log(`\n  Self-Service Payslip Breakdown:`);
    console.log(`    Gross: ₹${selfServiceCalc.grossSalary} | Basic: ₹${selfServiceCalc.basicSalary} | HRA: ₹${selfServiceCalc.hra} | DA: ₹${selfServiceCalc.da} | Special: ₹${selfServiceCalc.specialAllowance}`);
    console.log(`    Deductions -> EPF: ₹${selfServiceCalc.epf} | ESIC: ₹${selfServiceCalc.esic} | PT: ₹${selfServiceCalc.professionalTax} | Total Ded: ₹${selfServiceCalc.totalDeductions}`);
    console.log(`    Net Salary: ₹${selfServiceCalc.netSalary}`);

    if (latestRecord) {
      console.log(`\n  Latest Saved Payment Record (${latestRecord.month || 'N/A'}):`);
      console.log(`    Gross: ₹${latestRecord.grossSalary ?? 'N/A'} | Deductions: ₹${latestRecord.totalDeductions ?? 'N/A'} | Net: ₹${latestRecord.amount ?? 'N/A'}`);
    } else {
      console.log(`\n  Latest Saved Payment Record: None found`);
    }

    // Check for mismatches
    const mismatches = [];
    if (dashboardCalc.grossSalary !== selfServiceCalc.grossSalary) mismatches.push("Gross Salary mismatch");
    if (dashboardCalc.basicSalary !== selfServiceCalc.basicSalary) mismatches.push("Basic Salary mismatch");
    if (dashboardCalc.hra !== selfServiceCalc.hra) mismatches.push("HRA mismatch");
    if (dashboardCalc.epf !== selfServiceCalc.epf) mismatches.push("EPF mismatch");
    if (dashboardCalc.esic !== selfServiceCalc.esic) mismatches.push("ESIC mismatch");
    if (dashboardCalc.professionalTax !== selfServiceCalc.professionalTax) mismatches.push("PT mismatch");
    if (dashboardCalc.netSalary !== selfServiceCalc.netSalary) mismatches.push("Net Salary mismatch");

    if (mismatches.length > 0) {
      console.log(`  ❌ MISMATCHES FOUND: ${mismatches.join(", ")}`);
    } else {
      console.log(`  ✅ NO MISMATCHES between Dashboard & Self-Service Payslip!`);
    }
  }
}

verify();
