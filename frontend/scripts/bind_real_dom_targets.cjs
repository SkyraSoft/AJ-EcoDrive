const fs = require('fs');
const path = require('path');

const parsedRoutesFile = path.join(__dirname, '../scratch/parsed_bm_routes.json');
const bmRoutes = JSON.parse(fs.readFileSync(parsedRoutesFile, 'utf8'));
const uniqueComps = [...new Set(bmRoutes.map(r => r.component))];

function sanitizeTourName(raw) {
  return raw
    .toLowerCase()
    .replace(/^form\./, '')
    .replace(/^formdata\./, '')
    .replace(/^actionform\./, 'action-')
    .replace(/^receivingform\./, 'recv-')
    .replace(/^profileform\./, 'profile-')
    .replace(/^preferencesform\./, 'pref-')
    .replace(/^saledata\./, 'sale-')
    .replace(/^memberform\./, 'member-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

let modifiedFiles = 0;
let totalBound = 0;

for (const compRel of uniqueComps) {
  const fullPath = path.join(__dirname, '..', compRel);
  if (!fs.existsSync(fullPath)) continue;

  let content = fs.readFileSync(fullPath, 'utf8');
  let originalContent = content;

  // Match input, select, textarea, BaseInput, BaseSelect, BaseTextarea tags without data-tour
  const tagRegex = /<(input|select|textarea|BaseInput|BaseSelect|BaseTextarea)\b(?![^>]*\bdata-tour\b)([^>]*?)(\/?>)/gi;

  content = content.replace(tagRegex, (match, tagName, attrs, close) => {
    // Extract identifier from v-model, name, id, or placeholder
    const vModelMatch = attrs.match(/v-model(?:\.[a-z]+)*\s*=\s*['"]([^'"]+)['"]/i);
    const nameMatch = attrs.match(/name\s*=\s*['"]([^'"]+)['"]/i);
    const idMatch = attrs.match(/id\s*=\s*['"]([^'"]+)['"]/i);
    const placeholderMatch = attrs.match(/placeholder\s*=\s*['"]([^'"]+)['"]/i);

    let rawId = null;
    if (vModelMatch) rawId = vModelMatch[1];
    else if (nameMatch) rawId = nameMatch[1];
    else if (idMatch) rawId = idMatch[1];
    else if (placeholderMatch) rawId = placeholderMatch[1];

    if (!rawId) return match;

    const tourName = sanitizeTourName(rawId);
    if (!tourName) return match;

    totalBound++;
    return `<${tagName} data-tour="${tourName}"${attrs}${close}`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(fullPath, content, 'utf8');
    modifiedFiles++;
    console.log(`Updated ${compRel}`);
  }
}

console.log(`\nBinding complete: Added ${totalBound} data-tour attributes across ${modifiedFiles} Vue components.`);
