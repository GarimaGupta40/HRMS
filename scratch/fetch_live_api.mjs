import http from 'http';

http.get('http://localhost:5050/api/payment-records', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log("=== LIVE HTTP GET /api/payment-records STATUS ===", res.statusCode);
    try {
      const records = JSON.parse(data);
      if (Array.isArray(records)) {
        console.log(`Total live records returned: ${records.length}`);
        const ganeshAug = records.filter(r => r.employeeId === 3 && r.month && r.month.includes('Aug'));
        console.log("Live records for Ganesh (employeeId: 3, Aug):", JSON.stringify(ganeshAug, null, 2));
      } else {
        console.log("Response data:", data.substring(0, 300));
      }
    } catch (e) {
      console.log("Error parsing JSON:", e.message, data.substring(0, 300));
    }
  });
}).on('error', (err) => {
  console.error("HTTP GET Error:", err.message);
});
