const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/hr-data.json');
const raw = fs.readFileSync(dataPath, 'utf-8');
const data = JSON.parse(raw);

const users = data.users || [];
const userMap = new Map(users.map(u => [u.id, u]));

function getBreakdown(ctc, daysWorked = 30, totalDays = 30) {
  const grossSalary = Math.round((ctc / totalDays) * daysWorked);
  const basicSalary = Math.round(grossSalary * 0.50);
  const da = Math.round(basicSalary * 0.10);
  const hra = Math.round(basicSalary * 0.50);
  const conveyance = Math.round((1900 / totalDays) * daysWorked);
  const medical = Math.round((1250 / totalDays) * daysWorked);
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

let updatedCount = 0;
const records = data.paymentRecords || [];

records.forEach(r => {
  const user = userMap.get(r.employeeId);
  const ctc = user?.salary || 45000; // default fallback if user has no salary set
  const daysWorked = r.daysWorked || (r.month && r.month.includes('Aug 2026') ? 31 : 30);
  const totalDays = r.totalDaysInMonth || (r.month && r.month.includes('Aug 2026') ? 31 : 30);

  const b = getBreakdown(ctc, daysWorked, totalDays);

  // Update breakdown fields
  r.daysWorked = daysWorked;
  r.totalDaysInMonth = totalDays;
  r.grossSalary = b.grossSalary;
  r.basicSalary = b.basicSalary;
  r.da = b.da;
  r.hra = b.hra;
  r.conveyance = b.conveyance;
  r.medical = b.medical;
  r.specialAllowance = b.specialAllowance;
  r.epf = b.epf;
  r.esic = b.esic;
  r.professionalTax = b.professionalTax;
  r.totalDeductions = b.totalDeductions;
  r.amount = b.netSalary;

  updatedCount++;
});

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');

console.log(`Successfully migrated ${updatedCount} payment records in hr-data.json.`);

// Print Ganesh Aug 2026 record specifically
const ganeshAug = records.find(r => r.employeeId === 3 && r.month === 'Aug 2026');
console.log("\n=== GANESH KALE AUGUST 2026 MIGRATED RECORD ===");
console.log(JSON.stringify(ganeshAug, null, 2));
