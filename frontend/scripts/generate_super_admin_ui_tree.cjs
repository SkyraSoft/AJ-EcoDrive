const fs = require('fs');
const path = require('path');

const parsedRoutesFile = path.join(__dirname, '../scratch/parsed_all_system_routes.json');
const allRoutes = JSON.parse(fs.readFileSync(parsedRoutesFile, 'utf8')).routes;

// Filter for Super Admin accessible routes
const saRoutes = allRoutes.filter(r => 
  r.roles.includes('SuperAdmin') || 
  r.roles.includes('Super Admin') || 
  r.roles.includes('Public') ||
  r.roles.length === 0
);

console.log(`Extracting Super Admin UI Tree across ${saRoutes.length} routes...`);

function cleanText(txt) {
  return txt.replace(/\{\{[\s\S]*?\}\}/g, '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

const mappedRoutes = [];

for (const r of saRoutes) {
  if (!r.component) continue;
  const relPath = r.component.replace('@/', 'src/');
  const fullPath = path.resolve(__dirname, '..', relPath);

  let templateStr = '';
  let scriptStr = '';

  if (fs.existsSync(fullPath)) {
    const fileContent = fs.readFileSync(fullPath, 'utf8');
    const tMatch = fileContent.match(/<template>([\s\S]*?)<\/template>/);
    const sMatch = fileContent.match(/<script[\s\S]*?>([\s\S]*?)<\/script>/);
    templateStr = tMatch ? tMatch[1] : '';
    scriptStr = sMatch ? sMatch[1] : '';
  }

  // 1. Headers
  const headers = [];
  const hMatches = templateStr.matchAll(/<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/gi);
  for (const hm of hMatches) {
    const txt = cleanText(hm[1]);
    if (txt && txt.length > 1 && !headers.includes(txt)) headers.push(txt);
  }
  const titleMatches = templateStr.matchAll(/class=["'][^"']*title[^"']*["'][^>]*>([\s\S]*?)<\/(?:span|div|p|h\d)>/gi);
  for (const tm of titleMatches) {
    const txt = cleanText(tm[1]);
    if (txt && txt.length > 1 && !headers.includes(txt)) headers.push(txt);
  }

  // 2. Explanatory & Business Instruction Text
  const instructionalText = [];
  const pMatches = templateStr.matchAll(/<(?:p|span|div)[^>]*(?:text-sm|text-xs|text-gray|text-slate|description|subtitle|instruction|notice|help)[^>]*>([\s\S]*?)<\/(?:p|span|div)>/gi);
  for (const pm of pMatches) {
    const txt = cleanText(pm[1]);
    if (txt && txt.length > 5 && txt.length < 250 && !instructionalText.includes(txt) && !headers.includes(txt)) {
      instructionalText.push(txt);
    }
  }

  // 3. Navigation Tabs, Pills & Steps
  const tabs = [];
  const tabMatches = templateStr.matchAll(/(?:@click|v-model|class)=["'][^"']*(?:activeTab|currentTab|tab|filter|step)[^"']*["'][^>]*>([\s\S]*?)<\/(?:button|a|div|span)>/gi);
  for (const tm of tabMatches) {
    const txt = cleanText(tm[1]);
    if (txt && txt.length > 1 && txt.length < 50 && !tabs.includes(txt)) tabs.push(txt);
  }

  // 4. KPI & Summary Metrics
  const kpis = [];
  const kpiMatches = templateStr.matchAll(/(?:kpi|metric|card|stat|summary|total|balance)[^>]*>([\s\S]*?)<\/(?:div|article|section)>/gi);
  for (const km of kpiMatches) {
    const txt = cleanText(km[1]);
    if (txt && txt.length > 2 && txt.length < 80 && !kpis.includes(txt)) kpis.push(txt);
  }

  // 5. Data Tables & Grid Columns
  const tables = [];
  const thMatches = [...templateStr.matchAll(/<th[^>]*>([\s\S]*?)<\/th>/gi)];
  if (thMatches.length > 0) {
    const cols = thMatches.map(m => cleanText(m[1])).filter(c => c && c.length > 0);
    if (cols.length > 0) tables.push(cols);
  }

  // 6. Form Fields
  const fields = [];
  const inputMatches = templateStr.matchAll(/<(?:input|select|textarea)[^>]*(?:v-model|name|placeholder|data-tour)=["']([^"']+)["'][^>]*>/gi);
  for (const im of inputMatches) {
    if (im[1] && !fields.includes(im[1])) fields.push(im[1]);
  }
  const labelMatches = templateStr.matchAll(/<label[^>]*>([\s\S]*?)<\/label>/gi);
  for (const lm of labelMatches) {
    const txt = cleanText(lm[1]);
    if (txt && txt.length > 1 && !fields.includes(txt)) fields.push(txt);
  }

  // 7. Actions & Buttons
  const buttons = [];
  const btnMatches = templateStr.matchAll(/<button[^>]*>([\s\S]*?)<\/button>/gi);
  for (const bm of btnMatches) {
    const txt = cleanText(bm[1]);
    if (txt && txt.length > 1 && txt.length < 60 && !buttons.includes(txt)) buttons.push(txt);
  }

  // 8. Secondary UI States (Modals / Drawers)
  const secondaryStates = [];
  const modalMatches = templateStr.matchAll(/(?:v-if|v-show)=["']([^"']*(?:show|modal|drawer|dialog|popup|confirm)[^"']*)["']/gi);
  for (const mm of modalMatches) {
    if (mm[1] && !secondaryStates.includes(mm[1])) secondaryStates.push(mm[1]);
  }

  const isSaOnly = r.roles.includes('SuperAdmin') || r.roles.includes('Super Admin') ? (!r.roles.includes('BranchManager') && !r.roles.includes('Branch Manager')) : false;

  mappedRoutes.push({
    path: r.path,
    name: r.name || r.path,
    component: relPath,
    rbac: isSaOnly ? 'Super Admin Restricted (Global System Scope)' : 'Shared Operational Access (Super Admin + Branch Manager)',
    isSaOnly,
    headers,
    instructionalText,
    tabs,
    kpis,
    tables,
    fields,
    buttons,
    secondaryStates
  });
}

console.log(`Successfully mapped ${mappedRoutes.length} Super Admin routes.`);

fs.writeFileSync(path.join(__dirname, '../scratch/super_admin_ui_mapping.json'), JSON.stringify(mappedRoutes, null, 2), 'utf8');
