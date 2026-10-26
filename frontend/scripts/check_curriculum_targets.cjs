const fs = require('fs');
const content = fs.readFileSync('src/tour/curriculumTargets.js', 'utf8');

const targets = [
  'sa.inventory.units.table',
  'sa.inventory.adjustments.table',
  'sa.service.cases.table',
  'sa.finance.bills.table',
  'sa.analytics.sales.chart'
];

for (const t of targets) {
  const idx = content.indexOf(`"targetId": "${t}"`);
  if (idx !== -1) {
    console.log(content.substring(idx - 5, idx + 250));
  } else {
    console.log(t, 'NOT FOUND IN curriculumTargets.js');
  }
}
