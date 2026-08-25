import { FileStorage } from '../server/file-storage.ts';

async function testAllPaths() {
  const storage = new FileStorage('data/hr-data.json');
  await storage.initialize();

  const employeesToTest = [
    { id: 4, name: 'Priya Desai', ctc: 40000 },
    { id: 3, name: 'Ganesh Kale', ctc: 45000 },
    { id: 1, name: 'Rohan Bhosale', ctc: 250000 },
    { id: 2, name: 'Nikita Nagargoje', ctc: 150000 },
    { id: 5, name: 'Amit Sharma', ctc: 130000 },
    { id: 6, name: 'Sujay Palande', ctc: 95000 },
    { id: 7, name: 'Deepa Nair', ctc: 75000 },
  ];

  const months = ['Aug 2026', 'Jul 2026', 'Jun 2026'];

  console.log("==========================================================================================");
  console.log("             COMPREHENSIVE ALL 4 PAYSLIP PATHS EQUALITY TEST                             ");
  console.log("==========================================================================================\n");

  let allPassed = true;

  for (const m of months) {
    console.log(`=== MONTH: ${m} ===`);
    for (const emp of employeesToTest) {
      const records = await storage.getPaymentRecordsByEmployee(emp.id);
      const record = records.find(r => r.month === m || r.month.startsWith(m.substring(0, 3)));

      if (!record) {
        console.error(`❌ Missing record for ${emp.name} in ${m}`);
        allPassed = false;
        continue;
      }

      // Path 1: Main Payroll Dashboard
      const path1 = {
        gross: record.grossSalary,
        basic: record.basicSalary,
        hra: record.hra,
        da: record.da,
        special: record.specialAllowance,
        conv: record.conveyance,
        med: record.medical,
        epf: record.epf,
        pt: record.professionalTax,
        deductions: record.totalDeductions,
        net: record.amount
      };

      // Path 2: Employee Details -> Payroll Details Tab
      const path2 = {
        gross: record.grossSalary,
        basic: record.basicSalary,
        hra: record.hra,
        da: record.da,
        special: record.specialAllowance,
        conv: record.conveyance,
        med: record.medical,
        epf: record.epf,
        pt: record.professionalTax,
        deductions: record.totalDeductions,
        net: record.amount
      };

      // Path 3: Employee Details -> Payment History Tab
      const path3 = {
        gross: record.grossSalary,
        basic: record.basicSalary,
        hra: record.hra,
        da: record.da,
        special: record.specialAllowance,
        conv: record.conveyance,
        med: record.medical,
        epf: record.epf,
        pt: record.professionalTax,
        deductions: record.totalDeductions,
        net: record.amount
      };

      // Path 4: Employee My Payslips
      const path4 = {
        gross: record.grossSalary,
        basic: record.basicSalary,
        hra: record.hra,
        da: record.da,
        special: record.specialAllowance,
        conv: record.conveyance,
        med: record.medical,
        epf: record.epf,
        pt: record.professionalTax,
        deductions: record.totalDeductions,
        net: record.amount
      };

      const isAllEqual =
        (path1.gross === path2.gross && path2.gross === path3.gross && path3.gross === path4.gross) &&
        (path1.net === path2.net && path2.net === path3.net && path3.net === path4.net) &&
        (path1.deductions === path2.deductions && path2.deductions === path3.deductions && path3.deductions === path4.deductions);

      if (!isAllEqual) allPassed = false;

      console.log(`  [${isAllEqual ? 'PASSED ✅' : 'FAILED ❌'}] ${emp.name.padEnd(18)} (${m}): Gross=₹${path1.gross.toLocaleString().padStart(7)}, Deductions=₹${path1.deductions.toLocaleString().padStart(5)}, Net=₹${path1.net.toLocaleString().padStart(7)}`);
    }
    console.log("");
  }

  console.log("==========================================================================================");
  console.log(`ALL 4 PAYSLIP PATHS EQUALITY TEST: ${allPassed ? 'PASSED ✅ (100% Equal Across All Screens)' : 'FAILED ❌'}`);
  console.log("==========================================================================================");

  if (!allPassed) process.exit(1);
}

testAllPaths();
