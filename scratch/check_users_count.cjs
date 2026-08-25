const fs = require('fs');
const raw = fs.readFileSync('./data/hr-data.json', 'utf-8');
const data = JSON.parse(raw);

console.log("=== USERS COUNT IN hr-data.json ===");
console.log(`Total users: ${data.users ? data.users.length : 0}`);
if (data.users) {
  console.log("Users:", data.users.map(u => ({ id: u.id, name: `${u.firstName} ${u.lastName}`, role: u.role, status: u.status })));
}
