const fs = require('fs');
const content = fs.readFileSync('AJ_ECODRIVE_COMPLETE_CLIENT_GUIDE_QA.md', 'utf8');
const lines = content.split(/\r?\n/);

console.log('Total lines:', lines.length);
let qCount = 0;
const sections = [];

lines.forEach((l, i) => {
  if (l.startsWith('# SECTION') || l.startsWith('# PART') || l.startsWith('### Q')) {
    if (l.startsWith('### Q')) {
      qCount++;
    } else {
      console.log(`Line ${i + 1}: ${l}`);
    }
  }
});
console.log(`Total questions detected: ${qCount}`);
