const fs = require('fs');
const path = require('path');

const guidePath = path.join(__dirname, '..', 'AJ_ECODRIVE_COMPLETE_CLIENT_GUIDE_QA.md');
let guideContent = fs.readFileSync(guidePath, 'utf8');

function replaceSection(startMarker, endMarker, replacementFilePath) {
  const replacementContent = fs.readFileSync(replacementFilePath, 'utf8');
  const startIdx = guideContent.indexOf(startMarker);
  if (startIdx === -1) {
    console.error(`Start marker not found: ${startMarker}`);
    return false;
  }
  
  let endIdx;
  if (endMarker) {
    endIdx = guideContent.indexOf(endMarker, startIdx);
    if (endIdx === -1) {
      console.error(`End marker not found: ${endMarker}`);
      return false;
    }
  } else {
    endIdx = guideContent.length;
  }
  
  guideContent = guideContent.substring(0, startIdx) + replacementContent.trim() + '\n\n' + guideContent.substring(endIdx);
  return true;
}

// Section II
if (fs.existsSync(path.join(__dirname, 'upgrades', 'section2.md'))) {
  replaceSection(
    '# SECTION II: CENTRAL COMMAND & COLLABORATION (THE ACTION CENTRE)',
    '# SECTION III: THE SHOWROOM SALES LIFECYCLE (WALK-IN TO DELIVERY)',
    path.join(__dirname, 'upgrades', 'section2.md')
  );
}

// Section III
if (fs.existsSync(path.join(__dirname, 'upgrades', 'section3.md'))) {
  replaceSection(
    '# SECTION III: THE SHOWROOM SALES LIFECYCLE (WALK-IN TO DELIVERY)',
    '# SECTION IV: AFTER-SALES SERVICE, WORKSHOP & WARRANTY (OWNERSHIP JOURNEY)',
    path.join(__dirname, 'upgrades', 'section3.md')
  );
}

// Section IV
if (fs.existsSync(path.join(__dirname, 'upgrades', 'section4.md'))) {
  replaceSection(
    '# SECTION IV: AFTER-SALES SERVICE, WORKSHOP & WARRANTY (OWNERSHIP JOURNEY)',
    '# SECTION V: SHOWROOM INVENTORY, TRANSFERS & QUALITY CONTROL',
    path.join(__dirname, 'upgrades', 'section4.md')
  );
}

// Section V
if (fs.existsSync(path.join(__dirname, 'upgrades', 'section5.md'))) {
  replaceSection(
    '# SECTION V: SHOWROOM INVENTORY, TRANSFERS & QUALITY CONTROL',
    '# SECTION VI: CASH PROTECTION, EXPENSES & DAY-END RECONCILIATION',
    path.join(__dirname, 'upgrades', 'section5.md')
  );
}

// Section VI
if (fs.existsSync(path.join(__dirname, 'upgrades', 'section6.md'))) {
  replaceSection(
    '# SECTION VI: CASH PROTECTION, EXPENSES & DAY-END RECONCILIATION',
    '# SECTION VII: HEAD OFFICE GOVERNANCE, PROCUREMENT & NETWORK ADMINISTRATION',
    path.join(__dirname, 'upgrades', 'section6.md')
  );
}

// Section VII
if (fs.existsSync(path.join(__dirname, 'upgrades', 'section7.md'))) {
  replaceSection(
    '# SECTION VII: HEAD OFFICE GOVERNANCE, PROCUREMENT & NETWORK ADMINISTRATION',
    '# SECTION VIII: COLLABORATION MATRIX, ARCHITECTURE & APPENDICES',
    path.join(__dirname, 'upgrades', 'section7.md')
  );
}

// Section VIII
if (fs.existsSync(path.join(__dirname, 'upgrades', 'section8.md'))) {
  replaceSection(
    '# SECTION VIII: COLLABORATION MATRIX, ARCHITECTURE & APPENDICES',
    null,
    path.join(__dirname, 'upgrades', 'section8.md')
  );
}

fs.writeFileSync(guidePath, guideContent, 'utf8');
console.log('Successfully applied all prepared section upgrades!');
