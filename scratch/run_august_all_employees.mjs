import { FileStorage } from '../server/file-storage.ts';

function calculateBreakdown(monthlyCTC, daysWorked = 31, totalDaysInMonth = 31) {
  const grossSalary = Math.round((monthlyCTC / totalDaysInMonth) * daysWorked);
  const basicSalary = Math.round(grossSalary * 0.50);
  const da = Math.round(basicSalary * 0.10);
  const hra = Math.round(basicSalary * 0.50);
  const conveyance = Math.round((1900 / totalDaysInMonth) * daysWorked);
  const medical = Math.round((1250 / totalDaysInMonth) * daysWorked);
  const specialAllowance = Math.max(0, grossSalary - (basicSalary + da + hra + conveyance + medical));
  const epf = Math.min(1800, Math.round(basicSalary * 0.12));
  const esic = grossSalary <= 21000 ? Math.round(grossSalary * 0.0075) : 0;
  const professionalTax = grossSalary > 10000 ? 200 : 0;
  const totalDeductions = epf + esic + professionalTax;
  const netSalary = Math.max(0, grossSalary - totalDeductions);

  return {
    grossSalary, basicSalary, da, hra, conveyance, medical, specialAllowance,
    epf, esic, professionalTax, totalDeductions, netSalary
  };
}

async function runAugustForAll() {
  const storage = new FileStorage('data/hr-data.json');
  await storage.initialize();

  const allUsers = storage.data.users || [];
  const employees = allUsers.filter(u => u.salary && u.salary > 0);

  console.log(`Processing August 2026 payroll for ${employees.length} employees...`);

  const month = "Aug 2026";
  let createdCount = 0;
  let updatedCount = 0;

  for (const emp of employees) {
    const b = calculateBreakdown(emp.salary, 31, 31);
    
    // Check if record exists for this employee & month
    const existing = storage.data.paymentRecords.find(r => r.employeeId === emp.id && (r.month === month || r.month === "August 2026"));

    if (existing) {
      await storage.updatePaymentRecord(existing.id, {
        month,
        daysWorked: 31,
        totalDaysInMonth: 31,
        grossSalary: b.grossSalary,
        basicSalary: b.basicSalary,
        hra: b.hra,
        da: b.da,
        specialAllowance: b.specialAllowance,
        conveyance: b.conveyance,
        medical: b.medical,
        epf: b.epf,
        esic: b.esic,
        professionalTax: b.professionalTax,
        totalDeductions: b.totalDeductions,
        amount: b.netSalary,
        paymentStatus: 'paid'
      });
      updatedCount++;
    } else {
      await storage.createPaymentRecord({
        employeeId: emp.id,
        month,
        daysWorked: 31,
        totalDaysInMonth: 31,
        grossSalary: b.grossSalary,
        basicSalary: b.basicSalary,
        hra: b.hra,
        da: b.da,
        specialAllowance: b.specialAllowance,
        conveyance: b.conveyance,
        medical: b.medical,
        epf: b.epf,
        esic: b.esic,
        professionalTax: b.professionalTax,
        totalDeductions: b.totalDeductions,
        amount: b.netSalary,
        paymentStatus: 'paid',
        paymentDate: new Date(),
        paymentMode: 'bank_transfer'
      });
      createdCount++;
    }
  }

  console.log(`August 2026 Payroll Run Finished: ${updatedCount} updated, ${createdCount} created.`);
}

runAugustForAll();
