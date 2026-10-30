const fs = require('fs');
const path = require('path');

function walk(dir) {
  let files = [];
  fs.readdirSync(dir).forEach(f => {
    const fp = path.join(dir, f);
    if (fs.statSync(fp).isDirectory()) files = files.concat(walk(fp));
    else if (f.endsWith('.vue')) files.push(fp);
  });
  return files;
}

const views = walk(path.join(__dirname, '../frontend/src/views'));
const catalog = [];

views.forEach(vp => {
  const rel = path.relative(path.join(__dirname, '../frontend/src/views'), vp).replace(/\\/g, '/');
  const code = fs.readFileSync(vp, 'utf8');
  
  // check for inputs or v-model
  const vmodels = Array.from(new Set(Array.from(code.matchAll(/v-model(?:\.[a-z]+)*="([^"]+)"/g)).map(m => m[1])));
  const hasForm = code.includes('<form');
  const hasSubmit = /@submit|type="submit"|submitForm|handleSubmit|handleSave|onSave|onSubmit/.test(code);
  const inputs = Array.from(new Set(Array.from(code.matchAll(/<(?:input|select|textarea)\b[^>]*>/g)).map(m => m[0])));
  
  if (vmodels.length > 0 || hasForm || hasSubmit) {
    catalog.push({
      file: rel,
      hasForm,
      hasSubmit,
      vmodelCount: vmodels.length,
      vmodels: vmodels,
      inputCount: inputs.length
    });
  }
});

console.log('Total views with forms or inputs:', catalog.length);
catalog.sort((a,b) => b.vmodelCount - a.vmodelCount);
catalog.forEach((c, idx) => {
  console.log(`${idx + 1}. [${c.file}] vmodels: ${c.vmodelCount}, inputs: ${c.inputCount}, form: ${c.hasForm}, submit: ${c.hasSubmit}`);
});

fs.writeFileSync(path.join(__dirname, 'all_views_forms_catalog.json'), JSON.stringify(catalog, null, 2));
