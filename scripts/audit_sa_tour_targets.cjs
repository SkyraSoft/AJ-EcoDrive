const fs = require('fs');
const path = require('path');

const saMissionsPath = path.resolve('src/tour/content/superAdmin/superAdminMissions.js');
const saMissionsContent = fs.readFileSync(saMissionsPath, 'utf8');

const stepMatches = [...saMissionsContent.matchAll(/id:\s*'(sa-[0-9]{2}-[0-9]{2})'[\s\S]*?title:\s*'([^']+)'[\s\S]*?targetId:\s*'([^']+)'[\s\S]*?route:\s*'([^']+)'/g)];

console.log('Total SA steps found:', stepMatches.length);

const results = [];
for (const match of stepMatches) {
  const [full, stepId, title, targetId, route] = match;
  results.push({ stepId, title, targetId, route });
}

function getAllVueFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const p = path.join(dir, f);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      if (!p.includes('node_modules') && !p.includes('.git') && !p.includes('tour')) {
        getAllVueFiles(p, fileList);
      }
    } else if (f.endsWith('.vue')) {
      fileList.push(p);
    }
  }
  return fileList;
}

const vueFiles = getAllVueFiles(path.resolve('src'));
console.log('Found Vue files:', vueFiles.length);

const vueContents = vueFiles.map(f => ({
  file: f,
  relPath: path.relative(path.resolve('.'), f),
  content: fs.readFileSync(f, 'utf8')
}));

const report = [];

for (const r of results) {
  let matchedFile = null;
  for (const vf of vueContents) {
    if (vf.content.includes(r.targetId)) {
      matchedFile = vf.relPath;
      break;
    }
  }
  report.push({
    ...r,
    foundInDom: !!matchedFile,
    matchedFile
  });
}

const missing = report.filter(r => !r.foundInDom);
console.log(`Summary: Total SA steps: ${report.length}, Resolved in Vue: ${report.length - missing.length}, Missing in Vue: ${missing.length}`);
console.log('\nMissing targets detail:');
missing.forEach(m => {
  console.log(`- Step: ${m.stepId} ("${m.title}") | Target: ${m.targetId} | Route: ${m.route}`);
});
