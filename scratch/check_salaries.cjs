const fs = require('fs');
const raw = fs.readFileSync('./data/hr-data.json', 'utf-8');
const data = JSON.parse(raw);

const users = data.users || [];
const withSalary = users.filter(u => u.salary && u.salary > 0);
const withoutSalary = users.filter(u => !u.salary || u.salary === 0);

console.log("=== USERS SALARY BREAKDOWN ===");
console.log(`Total Users: ${users.length}`);
console.log(`Users WITH salary (>0): ${withSalary.length}`);
console.log(`Users WITHOUT salary (0/null): ${withoutSalary.length}`);

console.log("\nUsers WITH salary (>0):", withSalary.map(u => ({ id: u.id, name: `${u.firstName} ${u.lastName}`, salary: u.salary })));
