const fs = require('fs');
const path = require('path');

const routerFile = path.join(__dirname, '../src/router/index.js');
const outputFile = path.join(__dirname, '../BRANCH_MANAGER_AND_SYSTEM_FULL_UI_TREE_MAPPING.md');

const routerContent = fs.readFileSync(routerFile, 'utf8');

// Parse route blocks
const routeBlocks = routerContent.split(/\{\s*path:\s*'/);
const routes = [];

for (let i = 1; i < routeBlocks.length; i++) {
  const block = routeBlocks[i];
  const routePath = block.substring(0, block.indexOf("'"));
  
  const nameMatch = block.match(/name:\s*['"]([^'"]+)['"]/);
  const compMatch = block.match(/component:\s*\(\)\s*=>\s*import\(['"]([^'"]+)['"]\)/);
  const rolesMatch = block.match(/roles:\s*\[([^\]]+)\]/);
  
  if (routePath && compMatch) {
    const name = nameMatch ? nameMatch[1] : routePath;
    const compPath = compMatch[1];
    let roles = [];
    if (rolesMatch) {
      roles = rolesMatch[1].split(',').map(r => r.trim().replace(/['"]/g, '')).filter(Boolean);
    }
    
    let relPath = compPath.replace(/^@\//, 'src/');
    let fullPath = path.join(__dirname, '..', relPath);
    if (!fullPath.endsWith('.vue') && !fullPath.endsWith('.js')) {
      if (fs.existsSync(fullPath + '.vue')) fullPath += '.vue';
    }
    
    let mod = 'CORE';
    if (routePath.includes('/')) {
      mod = routePath.split('/')[0].toUpperCase();
    } else if (['login', 'forgot-password', 'verify-identity', 'create-new-password', 'password-updated'].includes(routePath)) {
      mod = 'AUTH';
    } else {
      mod = routePath.toUpperCase();
    }
    
    routes.push({
      path: routePath,
      name,
      module: mod,
      componentRel: relPath,
      componentFull: fullPath,
      roles,
      isBranchManager: roles.includes('Branch Manager') || roles.length === 0
    });
  }
}

console.log(`Parsed total of ${routes.length} valid route components!`);

// Advanced Component Analyzer with deep template & script AST-like scanning
function analyzeVueComponent(filePath) {
  if (!fs.existsSync(filePath)) {
    return { error: 'File not found', exists: false };
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  
  const templateMatch = content.match(/<template>([\s\S]*?)<\/template>/);
  const scriptMatch = content.match(/<script[\s\S]*?>([\s\S]*?)<\/script>/);
  
  const template = templateMatch ? templateMatch[1] : '';
  const script = scriptMatch ? scriptMatch[1] : '';
  
  // A. Page Header / Breadcrumb / Title
  const titles = [];
  const titleMatches = template.matchAll(/<(?:h1|h2|h3|h4|span|div)[^>]*?(?:class="[^"]*?(?:title|heading|header|page-title|font-bold|text-xl|text-2xl)[^"]*?"|)[^>]*?>([^<>{}\n]+)<\/(?:h1|h2|h3|h4|span|div)>/gi);
  for (const m of titleMatches) {
    const text = m[1].trim();
    if (text && text.length > 2 && text.length < 60 && !text.includes('{{') && !text.includes('v-') && !titles.includes(text)) {
      titles.push(text);
    }
  }

  // B. Navigation Tabs & Filter Switchers
  const tabs = [];
  const tabMatches = template.matchAll(/(?:<button|<a|<div|<li)[^>]*?(?:class="[^"]*?(?:tab|nav-link|pill|filter-btn|btn-tab)[^"]*?"|@click="[^"]*?(?:activeTab|tab|currentTab|view|filter|activeFilter|selectedTab)[^"]*?")[^>]*?>([\s\S]*?)<\/(?:button|a|div|li)>/gi);
  for (const m of tabMatches) {
    const raw = m[1].replace(/<[^>]+>/g, '').trim();
    if (raw && raw.length > 1 && raw.length < 40 && !raw.includes('{{') && !tabs.includes(raw)) {
      tabs.push(raw);
    }
  }
  const scriptTabMatches = script.matchAll(/(?:tabs|tabList|navTabs|filterOptions|statusFilters|stages|types|categories)\s*=\s*\[([\s\S]*?)\]/g);
  for (const sm of scriptTabMatches) {
    const items = sm[1].matchAll(/['"`]([^'"`]+)['"`]/g);
    for (const item of items) {
      if (!tabs.includes(item[1]) && item[1].length > 1 && item[1].length < 40) tabs.push(item[1]);
    }
  }

  // C. Metric / KPI / Snapshot Summary Cards
  const kpiCards = [];
  const cardMatches = template.matchAll(/<div[^>]*?class="[^"]*?(?:card|kpi|stat|metric|summary|overview|counter|badge-stat)[^"]*?"[\s\S]*?<\/div>/gi);
  for (const cm of cardMatches) {
    const cardHtml = cm[0];
    const labelMatch = cardHtml.match(/<(?:span|p|div|label|h\d)[^>]*?class="[^"]*?(?:label|title|sub|text-muted|text-secondary|name|text-xs|text-sm)[^"]*?"[^>]*?>([^<>{}\n]+)<\/(?:span|p|div|label|h\d)>/i);
    const valueMatch = cardHtml.match(/<(?:span|p|div|h\d)[^>]*?class="[^"]*?(?:value|number|count|amount|total|digit|stat-val|text-2xl|font-bold|text-lg)[^"]*?"[^>]*?>([^<>\n]+)<\/(?:span|p|div|h\d)>/i);
    if (labelMatch || valueMatch) {
      const lbl = labelMatch ? labelMatch[1].trim() : 'Snapshot Metric';
      const val = valueMatch ? valueMatch[1].trim() : '{{ dynamic_val }}';
      if (lbl && !lbl.includes('{{') && !kpiCards.some(k => k.label === lbl)) {
        kpiCards.push({ label: lbl, value: val });
      }
    }
  }
  const scriptMetrics = script.matchAll(/(?:label|title|name):\s*['"`]([^'"`]+)['"`],\s*(?:value|count|amount|val|total):\s*([^,\n}]+)/g);
  for (const sm of scriptMetrics) {
    if (!kpiCards.some(k => k.label === sm[1]) && sm[1].length < 50) {
      kpiCards.push({ label: sm[1].trim(), value: sm[2].trim() });
    }
  }

  // D. Sections, Groups & Panels
  const sections = [];
  const sectionMatches = template.matchAll(/<(?:h2|h3|h4|h5|legend|div|span)[^>]*?(?:class="[^"]*?(?:section|card-header|panel|group|subtitle|category|border-b|form-section)[^"]*?"|)[^>]*?>([^<>{}\n]+)<\/(?:h2|h3|h4|h5|legend|div|span)>/gi);
  for (const sm of sectionMatches) {
    const text = sm[1].trim();
    if (text && text.length > 2 && text.length < 60 && !text.includes('{{') && !tabs.includes(text) && !titles.includes(text) && !sections.includes(text)) {
      sections.push(text);
    }
  }

  // E. Table Columns & Grid Headers
  const tables = [];
  const tableMatches = template.matchAll(/<table[\s\S]*?<\/table>/gi);
  for (const tm of tableMatches) {
    const ths = [];
    const thMatches = tm[0].matchAll(/<th[^>]*?>([\s\S]*?)<\/th>/gi);
    for (const th of thMatches) {
      const col = th[1].replace(/<[^>]+>/g, '').trim();
      if (col && col.length > 0 && col.length < 35 && !col.includes('{{') && !ths.includes(col)) {
        ths.push(col);
      }
    }
    if (ths.length > 0) {
      tables.push(ths);
    }
  }
  const colDefMatches = script.matchAll(/(?:columns|headers|tableColumns|cols|gridColumns)\s*=\s*\[([\s\S]*?)\]/g);
  for (const cdm of colDefMatches) {
    const colLabels = cdm[1].matchAll(/(?:label|title|header|name):\s*['"`]([^'"`]+)['"`]/g);
    const parsedCols = [];
    for (const cl of colLabels) {
      if (!parsedCols.includes(cl[1])) parsedCols.push(cl[1]);
    }
    if (parsedCols.length > 0 && tables.length === 0) {
      tables.push(parsedCols);
    }
  }

  // F. Form Inputs & Interactive Controls
  const formInputs = [];
  const inputMatches = template.matchAll(/<(?:input|select|textarea|BaseInput|BaseSelect|BaseTextarea|BaseCheckbox|BaseRadio)[^>]*?(?:placeholder="([^"]+)"|name="([^"]+)"|id="([^"]+)"|label="([^"]+)"|v-model="([^"]+)")/gi);
  for (const im of inputMatches) {
    const label = im[4] || im[1] || im[2] || im[3] || im[5];
    if (label && !formInputs.includes(label.trim())) {
      formInputs.push(label.trim());
    }
  }

  // G. Action Buttons, Triggers & Links
  const buttons = [];
  const btnMatches = template.matchAll(/<(?:button|BaseButton)[^>]*?>([\s\S]*?)<\/(?:button|BaseButton)>/gi);
  for (const bm of btnMatches) {
    const btnText = bm[1].replace(/<[^>]+>/g, '').trim();
    if (btnText && btnText.length > 1 && btnText.length < 45 && !btnText.includes('{{') && !tabs.includes(btnText) && !buttons.includes(btnText)) {
      buttons.push(btnText);
    }
  }

  // H. Modals, Drawers, Flyouts & Dialogs
  const modals = [];
  const modalMatches = template.matchAll(/(?:<div[^>]*?class="[^"]*?(?:modal|drawer|flyout|dialog|popup|sidebar)[^"]*?"|<BaseModal|<BaseDrawer)[\s\S]*?<(?:h2|h3|h4|span)[^>]*?class="[^"]*?(?:title|header)[^"]*?"[^>]*?>([^<>{}\n]+)<\/(?:h2|h3|h4|span)>/gi);
  for (const mm of modalMatches) {
    const mTitle = mm[1].trim();
    if (mTitle && !modals.includes(mTitle) && !mTitle.includes('{{')) {
      modals.push(mTitle);
    }
  }

  return {
    exists: true,
    titles: titles.slice(0, 5),
    tabs: tabs.slice(0, 12),
    kpiCards: kpiCards.slice(0, 25),
    sections: sections.slice(0, 15),
    tables: tables.slice(0, 5),
    formInputs: formInputs.slice(0, 30),
    buttons: buttons.slice(0, 20),
    modals: modals.slice(0, 8)
  };
}

// Group routes by module
const moduleGroups = {};
routes.forEach(r => {
  if (!moduleGroups[r.module]) moduleGroups[r.module] = [];
  moduleGroups[r.module].push(r);
});

let md = `# AJ ECODRIVE — COMPLETE CODE-BASED UI TREE MAPPING SPECIFICATION\n\n`;
md += `> **Source of Truth:** Codebase Route Registry (\`src/router/index.js\`) & Component Templates (\`src/views/**/*.vue\`)\n`;
md += `> **Architecture:** Pure Code-Extracted AST Tree Format (No Prose / Direct Code Extraction)\n`;
md += `> **Total Registered System Routes:** ${routes.length}\n`;
md += `> **Branch Manager Operational Routes:** ${routes.filter(r => r.isBranchManager).length}\n`;
md += `> **Restricted / Super Admin Only Routes:** ${routes.filter(r => !r.isBranchManager).length}\n\n`;

md += `## 🧭 EXECUTIVE BRANCH MANAGER OPERATIONAL MODULE INDEX\n\n`;
md += `| Module Code | Module Name | Route Count | Branch Manager Accessible | Primary Dealership Function |\n`;
md += `| :--- | :--- | :---: | :---: | :--- |\n`;
for (const [modName, modRoutes] of Object.entries(moduleGroups)) {
  const bmCount = modRoutes.filter(r => r.isBranchManager).length;
  md += `| \`${modName}\` | ${modName} Operations | ${modRoutes.length} | ${bmCount} / ${modRoutes.length} | Operational Execution & Audit |\n`;
}
md += `\n---\n\n`;

md += `## 🌳 HIERARCHICAL SYSTEM NAVIGATION & COMPONENT UI TREE\n\n`;

for (const [modName, modRoutes] of Object.entries(moduleGroups)) {
  md += `### 📁 MODULE: \`${modName}\` (${modRoutes.length} Total Routes)\n\n`;
  
  for (const r of modRoutes) {
    const analysis = analyzeVueComponent(r.componentFull);
    const bmPill = r.isBranchManager ? `🟢 **[Branch Manager Accessible]**` : `🔒 **[Role Restricted / Super Admin Only]**`;
    
    md += `#### 📍 ROUTE: \`/${r.path}\`\n`;
    md += `- **Route Name:** \`${r.name}\`\n`;
    md += `- **Source Component:** [\`${r.componentRel}\`](file:///${r.componentFull.replace(/\\/g, '/')})\n`;
    md += `- **RBAC Access:** ${bmPill} (Roles: \`${r.roles.join(', ') || 'All Authenticated'}\`)\n\n`;
    
    if (!analysis.exists) {
      md += `\`\`\`text\n/${r.path}\n└── ⚠️ Component file not found on disk\n\`\`\`\n\n`;
      continue;
    }
    
    md += `\`\`\`text\n`;
    md += `/${r.path} [${r.name}]\n`;
    md += `│\n`;
    
    // Titles
    if (analysis.titles.length > 0) {
      md += `├── 🏷️ HEADERS & TITLES\n`;
      analysis.titles.forEach((t, idx) => {
        const isLast = idx === analysis.titles.length - 1;
        md += `│   ${isLast ? '└──' : '├──'} "${t}"\n`;
      });
    }
    
    // Tabs
    if (analysis.tabs.length > 0) {
      md += `├── 📑 NAVIGATION TABS & FILTER PILLS (${analysis.tabs.length} tabs)\n`;
      analysis.tabs.forEach((tab, idx) => {
        const isLast = idx === analysis.tabs.length - 1;
        md += `│   ${isLast ? '└──' : '├──'} [TAB] "${tab}"\n`;
      });
    }
    
    // KPI Cards
    if (analysis.kpiCards.length > 0) {
      md += `├── 📊 SNAPSHOT METRICS & KPI CARDS (${analysis.kpiCards.length} cards)\n`;
      analysis.kpiCards.forEach((kpi, idx) => {
        const isLast = idx === analysis.kpiCards.length - 1;
        md += `│   ${isLast ? '└──' : '├──'} [KPI CARD] ${kpi.label} ➔ ${kpi.value}\n`;
      });
    }
    
    // Sections
    if (analysis.sections.length > 0) {
      md += `├── 📦 STRUCTURAL SECTIONS & ACCORDIONS (${analysis.sections.length} sections)\n`;
      analysis.sections.forEach((sec, idx) => {
        const isLast = idx === analysis.sections.length - 1;
        md += `│   ${isLast ? '└──' : '├──'} [SECTION] "${sec}"\n`;
      });
    }
    
    // Tables
    if (analysis.tables.length > 0) {
      md += `├── 📋 DATA TABLES & GRID COLUMNS (${analysis.tables.length} tables)\n`;
      analysis.tables.forEach((tbl, idx) => {
        md += `│   ├── [TABLE ${idx + 1}] Columns:\n`;
        tbl.forEach((col, cIdx) => {
          const isColLast = cIdx === tbl.length - 1;
          md += `│   │   ${isColLast ? '└──' : '├──'} [COL] "${col}"\n`;
        });
      });
    }
    
    // Form Inputs
    if (analysis.formInputs.length > 0) {
      md += `├── 📝 FORM FIELDS & INPUT CONTROLS (${analysis.formInputs.length} fields)\n`;
      analysis.formInputs.forEach((inp, idx) => {
        const isLast = idx === analysis.formInputs.length - 1;
        md += `│   ${isLast ? '└──' : '├──'} [FIELD] "${inp}"\n`;
      });
    }
    
    // Action Buttons
    if (analysis.buttons.length > 0) {
      md += `├── ⚡ ACTION BUTTONS & TRIGGERS (${analysis.buttons.length} buttons)\n`;
      analysis.buttons.forEach((btn, idx) => {
        const isLast = idx === analysis.buttons.length - 1;
        md += `│   ${isLast ? '└──' : '├──'} [BUTTON] "${btn}"\n`;
      });
    }
    
    // Modals
    if (analysis.modals.length > 0) {
      md += `└── 🪟 MODALS, DRAWERS & FLYOUTS (${analysis.modals.length} dialogs)\n`;
      analysis.modals.forEach((mod, idx) => {
        const isLast = idx === analysis.modals.length - 1;
        md += `    ${isLast ? '└──' : '├──'} [MODAL/DRAWER] "${mod}"\n`;
      });
    } else {
      md += `└── (No secondary dialogs)\n`;
    }
    
    md += `\`\`\`\n\n`;
  }
}

fs.writeFileSync(outputFile, md, 'utf8');
console.log(`Successfully generated complete code-based UI tree mapping in ${outputFile} (${md.length} bytes, ${routes.length} routes)`);
