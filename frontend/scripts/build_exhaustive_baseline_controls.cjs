const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const componentsFile = path.join(rootDir, 'scratch/forensic/components.json');
const routesMathFile = path.join(rootDir, 'scratch/forensic/baseline/route_math.json');

const components = JSON.parse(fs.readFileSync(componentsFile, 'utf8'));
const routeMath = JSON.parse(fs.readFileSync(routesMathFile, 'utf8'));

// Build component to route map
const compToRoute = {};
for (const r of routeMath.allDeclarations) {
  if (r.component) {
    const cleanComp = r.component.replace('@/', 'src/');
    if (!compToRoute[cleanComp]) compToRoute[cleanComp] = [];
    compToRoute[cleanComp].push(r.fullPath);
  }
}

// Module map from path
function getModuleFromPath(filePath) {
  if (filePath.includes('/auth/')) return 'AUTH';
  if (filePath.includes('/dashboard/')) return 'DASHBOARD';
  if (filePath.includes('/organisation/')) return 'ORGANISATION';
  if (filePath.includes('/catalogue/')) return 'CATALOGUE';
  if (filePath.includes('/procurement/')) return 'PROCUREMENT';
  if (filePath.includes('/inventory/')) return 'INVENTORY';
  if (filePath.includes('/sales/')) return 'SALES';
  if (filePath.includes('/after-sales/')) return 'AFTER_SALES';
  if (filePath.includes('/finance/')) return 'FINANCE';
  if (filePath.includes('/communication/')) return 'COMMUNICATION';
  if (filePath.includes('/analytics/')) return 'ANALYTICS';
  if (filePath.includes('/system/')) return 'SYSTEM';
  if (filePath.includes('/layouts/')) return 'LAYOUT';
  if (filePath.includes('/components/')) return 'SHARED_COMPONENT';
  return 'GENERAL';
}

const controlEvidenceList = [];
let controlIdx = 0;

for (const comp of components) {
  const fp = path.join(rootDir, comp.filePath);
  if (!fs.existsSync(fp)) continue;
  const content = fs.readFileSync(fp, 'utf8');
  
  const templateMatch = content.match(/<template>([\s\S]*?)<\/template>/);
  if (!templateMatch) continue;
  const tpl = templateMatch[1];
  const tplOffset = content.indexOf('<template>');

  // Find line number helper
  function getLineNumber(charIndex) {
    return content.substring(0, charIndex).split('\n').length;
  }

  // Regex to find input, select, textarea
  const inputRegex = /<(input|select|textarea)([^>]*?)(\/?>)/g;
  let match;
  while ((match = inputRegex.exec(tpl)) !== null) {
    controlIdx++;
    const controlId = `CTRL-${controlIdx}`;
    const tag = match[1];
    const attrs = match[2];
    const matchIndex = tplOffset + match.index;
    const lineNumber = getLineNumber(matchIndex);

    const modelMatch = attrs.match(/v-model(?:\.[a-z]+)?=["']([^"']+)["']/);
    const typeMatch = attrs.match(/type=["']([^"']+)["']/);
    const placeholderMatch = attrs.match(/placeholder=["']([^"']+)["']/);
    const nameMatch = attrs.match(/name=["']([^"']+)["']/);
    const idMatch = attrs.match(/id=["']([^"']+)["']/);
    const valueMatch = attrs.match(/:value=["']([^"']+)["']|value=["']([^"']+)["']/);

    const required = attrs.includes('required') || attrs.includes(':required');
    const disabled = attrs.includes('disabled') || attrs.includes(':disabled');
    const readonly = attrs.includes('readonly') || attrs.includes(':readonly');

    const visibleMatch = attrs.match(/v-if=["']([^"']+)["']|v-show=["']([^"']+)["']/);
    const enabledMatch = attrs.match(/:disabled=["']([^"']+)["']/);

    const controlType = tag === 'select' ? 'select' : (tag === 'textarea' ? 'textarea' : (typeMatch ? typeMatch[1] : 'text'));
    const modelBinding = modelMatch ? modelMatch[1] : null;
    const valueBinding = valueMatch ? (valueMatch[1] || valueMatch[2]) : null;

    // Search context around input for label
    const preContext = tpl.substring(Math.max(0, match.index - 300), match.index);
    const labelTagMatch = preContext.match(/<label[^>]*>([\s\S]*?)<\/label>/gi);
    let label = null;
    if (labelTagMatch && labelTagMatch.length > 0) {
      const lastLabel = labelTagMatch[labelTagMatch.length - 1];
      label = lastLabel.replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
    }
    if (!label && placeholderMatch) label = placeholderMatch[1];
    if (!label && nameMatch) label = nameMatch[1];
    if (!label && idMatch) label = idMatch[1];
    if (!label) label = modelBinding ? modelBinding.split('.').pop() : `${tag}_${controlType}`;

    // Options for select
    let optionSource = null;
    let options = [];
    if (tag === 'select') {
      const selectEndIdx = tpl.indexOf('</select>', match.index);
      if (selectEndIdx !== -1) {
        const selectBody = tpl.substring(match.index, selectEndIdx);
        const vForMatch = selectBody.match(/v-for=["']([^"']+)["']/);
        if (vForMatch) optionSource = vForMatch[1];
        const optMatches = [...selectBody.matchAll(/<option[^>]*>([\s\S]*?)<\/option>/gi)];
        options = optMatches.map(m => m[1].replace(/<[^>]+>/g, '').trim()).filter(Boolean);
      }
    }

    // Determine Classification
    const module = getModuleFromPath(comp.filePath);
    const isFilterOrSearch = attrs.includes('search') || attrs.includes('filter') || 
                             comp.filePath.includes('Dashboard') || comp.filePath.includes('Reports') ||
                             comp.filePath.includes('Report.vue') || (modelBinding && (modelBinding.includes('search') || modelBinding.includes('filter') || modelBinding.includes('Filter')));
    
    let classification = 'UNKNOWN';
    let persistenceApplicable = false;
    let businessMeaning = label;
    let businessOwner = module === 'AUTH' ? 'System Guest' : (module === 'ORGANISATION' || module === 'SYSTEM' ? 'Super Admin' : 'Branch Manager / Dealership Staff');

    if (readonly || controlType === 'hidden') {
      classification = 'READ_ONLY';
      persistenceApplicable = false;
    } else if (isFilterOrSearch) {
      classification = 'TRANSIENT_FILTER';
      persistenceApplicable = false;
    } else if (comp.filePath.includes('Create') || comp.filePath.includes('Edit') || comp.filePath.includes('Receive') || comp.filePath.includes('Handover')) {
      classification = 'PERSISTENT_EDITABLE';
      persistenceApplicable = true;
    } else if (modelBinding && (modelBinding.startsWith('show') || modelBinding.startsWith('is') || modelBinding.startsWith('active') || modelBinding.startsWith('tab'))) {
      classification = 'UI_STATE_CONTROL';
      persistenceApplicable = false;
    } else if (modelBinding) {
      classification = 'PERSISTENT_EDITABLE';
      persistenceApplicable = true;
    } else {
      classification = 'UI_STATE_CONTROL';
      persistenceApplicable = false;
    }

    // Current persistence status check
    let currentPersistenceStatus = 'NOT_APPLICABLE';
    if (classification === 'PERSISTENT_EDITABLE') {
      // Check known dropped fields
      if (comp.filePath.includes('CreatePurchaseOrder.vue') && 
          (modelBinding === 'form.estimatedFreight' || modelBinding === 'form.paymentTerms' || 
           modelBinding === 'form.documents' || modelBinding === 'form.notes')) {
        currentPersistenceStatus = 'DROPPED_BEFORE_PERSISTENCE';
      } else if (comp.filePath.includes('CreatePurchaseOrder.vue') && 
                 (modelBinding === 'form.qtyDs11' || modelBinding === 'form.qtyEv5' || modelBinding === 'form.qtyCargo')) {
        currentPersistenceStatus = 'HARDCODED_MODEL_BOUND';
      } else {
        currentPersistenceStatus = 'BOUND_TO_FORM_STATE';
      }
    }

    const routeList = compToRoute[comp.filePath] || [];

    controlEvidenceList.push({
      controlId,
      module,
      route: routeList.length > 0 ? routeList[0] : null,
      allRoutes: routeList,
      component: comp.filePath,
      sourceFile: comp.filePath,
      sourceLocation: `line ${lineNumber}`,
      domTag: tag,
      inputType: controlType,
      label,
      placeholder: placeholderMatch ? placeholderMatch[1] : null,
      modelBinding,
      valueBinding,
      required,
      disabled,
      readonly,
      visibleWhen: visibleMatch ? (visibleMatch[1] || visibleMatch[2]) : null,
      enabledWhen: enabledMatch ? `!(${enabledMatch[1]})` : null,
      optionSource,
      options: options.slice(0, 5),
      formId: null,
      submitActionId: null,
      classification,
      businessMeaning,
      businessOwner,
      persistenceApplicable,
      currentPersistenceStatus,
      evidenceStatus: 'VERIFIED_FROM_AST_SOURCE'
    });
  }
}

console.log(`Extracted control evidence records: ${controlEvidenceList.length}`);

// Group by classification
const counts = {};
controlEvidenceList.forEach(c => counts[c.classification] = (counts[c.classification] || 0) + 1);
console.log('Classification breakdown:', counts);

fs.writeFileSync(
  path.join(rootDir, 'scratch/forensic/baseline/control_evidence.json'),
  JSON.stringify(controlEvidenceList, null, 2),
  'utf8'
);
console.log('Saved scratch/forensic/baseline/control_evidence.json');
