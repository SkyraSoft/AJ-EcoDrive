const fs = require('fs');
const content = fs.readFileSync('frontend/src/store.js', 'utf8');

const regex = /_dispatchApiSync\(\s*['"]([^'"]+)['"]/g;
const list = new Set();
let match;
while ((match = regex.exec(content)) !== null) {
  list.add(match[1]);
}

console.log('Total unique api sync channels in store.js:', list.size);
console.log(Array.from(list).sort());
