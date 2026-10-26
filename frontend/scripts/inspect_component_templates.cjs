const fs = require('fs');
const path = require('path');

const parsedRoutesFile = path.join(__dirname, '../scratch/parsed_bm_routes.json');
const bmRoutes = JSON.parse(fs.readFileSync(parsedRoutesFile, 'utf8'));

// Map of unique components
const uniqueComps = [...new Set(bmRoutes.map(r => r.component))];

console.log(`Inspecting templates of ${uniqueComps.length} unique components...`);

const componentAudits = {};

for (const compPath of uniqueComps) {
  const fullPath = path.join(__dirname, '..', compPath);
  if (!fs.existsSync(fullPath)) {
    componentAudits[compPath] = { error: 'File not found' };
    continue;
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  const templateMatch = content.match(/<template>([\s\S]*?)<\/template>/);
  const template = templateMatch ? templateMatch[1] : '';

  // 1. Identify Inputs & Controls with exact tag and attributes
  const inputs = [];
  // Match input, select, textarea, BaseInput, etc.
  const tagRegex = /<(input|select|textarea|BaseInput|BaseSelect|BaseTextarea)([^>]*?)>/gi;
  let match;
  while ((match = tagRegex.exec(template)) !== null) {
    const tagName = match[1];
    const attrs = match[2];

    const isReadonly = /readonly/i.test(attrs) || /:readonly\s*=\s*['"]true['"]/i.test(attrs);
    const isDisabled = /disabled/i.test(attrs) || /:disabled\s*=\s*['"]true['"]/i.test(attrs);
    const isSearch = /type\s*=\s*['"]search['"]/i.test(attrs) || 
                     /placeholder\s*=\s*['"][^'"]*(?:search|filter)[^'"]*['"]/i.test(attrs) ||
                     /class\s*=\s*['"][^'"]*filter[^'"]*['"]/i.test(attrs);

    let classification = 'editable';
    if (isReadonly || isDisabled) {
      classification = 'readOnlyComputed';
    } else if (isSearch) {
      classification = 'searchFilter';
    }

    const vModelMatch = attrs.match(/v-model(?:\.number|\.trim)?\s*=\s*['"]([^'"]+)['"]/i);
    const nameMatch = attrs.match(/name\s*=\s*['"]([^'"]+)['"]/i);
    const placeholderMatch = attrs.match(/placeholder\s*=\s*['"]([^'"]+)['"]/i);
    const labelMatch = attrs.match(/label\s*=\s*['"]([^'"]+)['"]/i);
    const dataTourMatch = attrs.match(/data-tour\s*=\s*['"]([^'"]+)['"]/i);

    const identifier = vModelMatch ? vModelMatch[1] : (nameMatch ? nameMatch[1] : (labelMatch ? labelMatch[1] : (placeholderMatch ? placeholderMatch[1] : 'unnamed_field')));

    inputs.push({
      tagName: tagName.toLowerCase(),
      identifier,
      classification,
      isReadonly,
      isDisabled,
      dataTour: dataTourMatch ? dataTourMatch[1] : null,
      rawAttrs: attrs.trim()
    });
  }

  // 2. Identify Tables & Per-Table Row Actions
  const tables = [];
  const tableBlockRegex = /<table([\s\S]*?)<\/table>/gi;
  let tblMatch;
  let tblIndex = 0;
  while ((tblMatch = tableBlockRegex.exec(template)) !== null) {
    tblIndex++;
    const tblHtml = tblMatch[0];
    
    // TH columns
    const columns = [];
    const thRegex = /<th[^>]*?>([\s\S]*?)<\/th>/gi;
    let thMatch;
    while ((thMatch = thRegex.exec(tblHtml)) !== null) {
      const colText = thMatch[1].replace(/<[^>]+>/g, '').trim();
      if (colText && colText.length < 40 && !colText.includes('{{')) {
        columns.push(colText);
      }
    }

    // Inspect TBODY for real row actions
    const detectedActions = new Set();
    if (/(?:view|details|open|eye)/i.test(tblHtml)) detectedActions.add('View Details');
    if (/(?:edit|modify|pencil)/i.test(tblHtml)) detectedActions.add('Edit');
    if (/(?:approve|accept|check)/i.test(tblHtml)) detectedActions.add('Approve');
    if (/(?:delete|trash|remove)/i.test(tblHtml)) detectedActions.add('Delete');
    if (/(?:cancel|reject|cross)/i.test(tblHtml)) detectedActions.add('Reject/Cancel');
    if (/(?:dispatch|send|truck)/i.test(tblHtml)) detectedActions.add('Dispatch');
    if (/(?:receive|download)/i.test(tblHtml)) detectedActions.add('Receive');
    if (/(?:print|download|receipt)/i.test(tblHtml)) detectedActions.add('Print/Export');

    tables.push({
      index: tblIndex,
      columnsCount: columns.length,
      columns,
      rowActions: Array.from(detectedActions)
    });
  }

  componentAudits[compPath] = {
    inputsCount: inputs.length,
    inputs,
    tablesCount: tables.length,
    tables
  };
}

fs.writeFileSync(path.join(__dirname, '../scratch/template_inspections.json'), JSON.stringify(componentAudits, null, 2), 'utf8');
console.log('Template inspections written to scratch/template_inspections.json');

// Summarize classifications across all components
let totalInputs = 0;
let editableCount = 0;
let searchFilterCount = 0;
let readOnlyCount = 0;
let totalTables = 0;
let totalCols = 0;

for (const [comp, audit] of Object.entries(componentAudits)) {
  if (audit.inputs) {
    totalInputs += audit.inputs.length;
    for (const inp of audit.inputs) {
      if (inp.classification === 'editable') editableCount++;
      else if (inp.classification === 'searchFilter') searchFilterCount++;
      else readOnlyCount++;
    }
  }
  if (audit.tables) {
    totalTables += audit.tables.length;
    for (const t of audit.tables) {
      totalCols += t.columnsCount;
    }
  }
}

console.log('\n--- TEMPLATE SOURCE AUDIT SUMMARY ---');
console.log(`Total Form Input Tags Found in SFC Templates: ${totalInputs}`);
console.log(`  - Editable Inputs: ${editableCount}`);
console.log(`  - Search & Filter Controls: ${searchFilterCount}`);
console.log(`  - Read-Only / Disabled Controls: ${readOnlyCount}`);
console.log(`Total Table Elements Found in SFC Templates: ${totalTables}`);
console.log(`Total Columns Found in SFC Templates: ${totalCols}`);
