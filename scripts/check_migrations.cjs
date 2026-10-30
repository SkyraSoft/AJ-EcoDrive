const fs = require('fs');
const content = fs.readFileSync('backend/src/db/migrations.js', 'utf8');
const regex = /CREATE TABLE IF NOT EXISTS [\\`'"]?(\w+)[\\`'"]?/gi;
const list = [];
let m;
while ((m = regex.exec(content)) !== null) {
  list.push(m[1]);
}
console.log('Tables declared in migrations.js:', list);
