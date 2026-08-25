const fs = require('fs');

const raw = fs.readFileSync('./data/hr-data.json', 'utf-8');
const data = JSON.parse(raw);

console.log("=== PAYMENT RECORDS IN hr-data.json ===");
const records = data.paymentRecords || [];
console.log(`Total records: ${records.length}`);

const ganeshRecords = records.filter(r => r.employeeId === 3 || r.userId === 3);
console.log(`Ganesh records count: ${ganeshRecords.length}`);
console.log(JSON.stringify(ganeshRecords, null, 2));
