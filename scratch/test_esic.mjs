import { calculatePayrollBreakdown } from "../client/src/lib/payroll-calculator.js";

console.log("=== ESIC TEST SUITE ===");

const test1 = calculatePayrollBreakdown(20000, { esicPercentage: 0.75 });
console.log("Test 1 (Gross 20,000): ESIC =", test1.esic, "(Expected: 150)");
if (test1.esic !== 150) throw new Error(`Test 1 Failed: expected 150, got ${test1.esic}`);

const test2 = calculatePayrollBreakdown(21000, { esicPercentage: 0.75 });
console.log("Test 2 (Gross 21,000): ESIC =", test2.esic, "(Expected: 158 or 157.5)");
if (test2.esic !== 158 && test2.esic !== 157.5) throw new Error(`Test 2 Failed: expected 158, got ${test2.esic}`);

const test3 = calculatePayrollBreakdown(21001, { esicPercentage: 0.75 });
console.log("Test 3 (Gross 21,001): ESIC =", test3.esic, "(Expected: 0)");
if (test3.esic !== 0) throw new Error(`Test 3 Failed: expected 0, got ${test3.esic}`);

const test4 = calculatePayrollBreakdown(95000, { esicPercentage: 0.75 });
console.log("Test 4 (Gross 95,000): ESIC =", test4.esic, "(Expected: 0)");
if (test4.esic !== 0) throw new Error(`Test 4 Failed: expected 0, got ${test4.esic}`);

console.log("SUCCESS: All 4 ESIC tests passed!");
