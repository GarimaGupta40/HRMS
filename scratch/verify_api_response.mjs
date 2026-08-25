import { FileStorage } from '../server/file-storage.ts';

async function test() {
  const storage = new FileStorage('data/hr-data.json');
  await storage.initialize();

  const ganeshRecords = await storage.getPaymentRecordsByEmployee(3);
  const augRecord = ganeshRecords.find(r => r.month === 'Aug 2026');

  console.log("=== API STORAGE VERIFICATION FOR GANESH KALE AUG 2026 ===");
  console.log("Record found:", JSON.stringify(augRecord, null, 2));

  if (augRecord && augRecord.amount === 43000 && augRecord.grossSalary === 45000 && augRecord.totalDeductions === 2000) {
    console.log("\nVERIFICATION PASSED ✅: Ganesh Kale August 2026 has Gross = ₹45,000, Total Deductions = ₹2,000, Net Salary = ₹43,000 in storage!");
  } else {
    console.error("\nVERIFICATION FAILED ❌");
    process.exit(1);
  }
}

test();
