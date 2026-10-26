const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '../BRANCH_MANAGER_AND_SYSTEM_FULL_UI_TREE_MAPPING.md'), 'utf8');

// Split by route headers
const routeBlocks = content.split(/#### 📍 ROUTE:\s*/);

const parsedRoutes = [];
for (let i = 1; i < routeBlocks.length; i++) {
  const block = routeBlocks[i];
  const lines = block.split(/\r?\n/);
  const routePath = lines[0].trim().replace(/`/g, '');
  
  const nameMatch = block.match(/- \*\*Route Name:\*\* `([^`]+)`/);
  const compMatch = block.match(/- \*\*Source Component:\*\* \[?`([^`]+)`\]?/);
  const rbacMatch = block.match(/- \*\*RBAC Access:\*\* (.*?)(?:\r?\n|$)/);
  
  const isBM = rbacMatch ? rbacMatch[1].includes('Branch Manager Accessible') : false;

  // Extract all lines within the ```text ... ``` code block
  const codeBlockMatch = block.match(/```text([\s\S]*?)```/);
  const codeBlock = codeBlockMatch ? codeBlockMatch[1] : '';

  const headers = [];
  const tabs = [];
  const kpis = [];
  const sections = [];
  const tables = [];
  const fields = [];
  const buttons = [];
  const dialogs = [];

  let currentSection = null;
  let currentTable = null;

  const cbLines = codeBlock.split(/\r?\n/);
  for (const line of cbLines) {
    const trimmed = line.trim();

    if (trimmed.includes('🏷️ HEADERS & TITLES')) {
      currentSection = 'headers';
      continue;
    } else if (trimmed.includes('📑 NAVIGATION TABS')) {
      currentSection = 'tabs';
      continue;
    } else if (trimmed.includes('📊 SNAPSHOT METRICS & KPI CARDS')) {
      currentSection = 'kpis';
      continue;
    } else if (trimmed.includes('📦 STRUCTURAL SECTIONS')) {
      currentSection = 'sections';
      continue;
    } else if (trimmed.includes('📋 DATA TABLES & GRID COLUMNS')) {
      currentSection = 'tables';
      continue;
    } else if (trimmed.includes('📝 FORM FIELDS & INPUT CONTROLS')) {
      currentSection = 'fields';
      continue;
    } else if (trimmed.includes('⚡ ACTION BUTTONS & TRIGGERS')) {
      currentSection = 'buttons';
      continue;
    } else if (trimmed.includes('🪟 MODALS, DRAWERS & FLYOUTS')) {
      currentSection = 'dialogs';
      continue;
    }

    if (currentSection === 'headers') {
      const m = trimmed.match(/"([^"]+)"/);
      if (m) headers.push(m[1]);
    } else if (currentSection === 'tabs') {
      const m = trimmed.match(/\[TAB\] "([^"]+)"/);
      if (m) tabs.push(m[1]);
    } else if (currentSection === 'kpis') {
      const m = trimmed.match(/\[KPI CARD\] (.*?)(?: ➔|$)/);
      if (m) kpis.push(m[1].trim());
    } else if (currentSection === 'sections') {
      const m = trimmed.match(/\[SECTION\] "([^"]+)"/);
      if (m) sections.push(m[1]);
    } else if (currentSection === 'tables') {
      if (trimmed.includes('[TABLE')) {
        currentTable = [];
        tables.push(currentTable);
      } else if (trimmed.includes('[COL]')) {
        const m = trimmed.match(/\[COL\] "([^"]+)"/);
        if (m && currentTable) currentTable.push(m[1]);
      }
    } else if (currentSection === 'fields') {
      const m = trimmed.match(/\[FIELD\] "([^"]+)"/);
      if (m) fields.push(m[1]);
    } else if (currentSection === 'buttons') {
      const m = trimmed.match(/\[BUTTON\] "([^"]+)"/);
      if (m) buttons.push(m[1]);
    } else if (currentSection === 'dialogs') {
      const m = trimmed.match(/\[MODAL\/DRAWER\] "([^"]+)"/);
      if (m) dialogs.push(m[1]);
    }
  }

  parsedRoutes.push({
    path: routePath,
    name: nameMatch ? nameMatch[1] : routePath,
    component: compMatch ? compMatch[1] : '',
    isBM,
    rbac: rbacMatch ? rbacMatch[1] : '',
    headers,
    tabs,
    kpis,
    sections,
    tables,
    fields,
    buttons,
    dialogs
  });
}

console.log('Total routes parsed:', parsedRoutes.length);
const bmRoutes = parsedRoutes.filter(r => r.isBM);
const restrictedRoutes = parsedRoutes.filter(r => !r.isBM);
console.log('BM Accessible Routes:', bmRoutes.length);
console.log('Restricted Routes:', restrictedRoutes.length);

let totalFields = 0;
let totalKPIs = 0;
let totalButtons = 0;
let totalTabs = 0;
let totalTables = 0;
let totalDialogs = 0;
let totalHeaders = 0;
let totalSections = 0;

for (const r of bmRoutes) {
  totalFields += r.fields.length;
  totalKPIs += r.kpis.length;
  totalButtons += r.buttons.length;
  totalTabs += r.tabs.length;
  totalTables += r.tables.length;
  totalDialogs += r.dialogs.length;
  totalHeaders += r.headers.length;
  totalSections += r.sections.length;
}

console.log('--- BM Accessible Metrics ---');
console.log('Total Headers:', totalHeaders);
console.log('Total Tabs:', totalTabs);
console.log('Total KPIs:', totalKPIs);
console.log('Total Sections:', totalSections);
console.log('Total Tables:', totalTables);
console.log('Total Fields:', totalFields);
console.log('Total Buttons:', totalButtons);
console.log('Total Dialogs:', totalDialogs);

fs.writeFileSync(path.join(__dirname, '../scratch/parsed_bm_routes.json'), JSON.stringify(bmRoutes, null, 2), 'utf8');
fs.writeFileSync(path.join(__dirname, '../scratch/parsed_restricted_routes.json'), JSON.stringify(restrictedRoutes, null, 2), 'utf8');
console.log('Saved scratch/parsed_bm_routes.json and scratch/parsed_restricted_routes.json');
