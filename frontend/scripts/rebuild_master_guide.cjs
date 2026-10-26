const fs = require('fs');
const path = require('path');

const guidePath = path.join(__dirname, '..', 'AJ_ECODRIVE_COMPLETE_CLIENT_GUIDE_QA.md');

const section1 = fs.readFileSync(path.join(__dirname, 'upgrades', 'section1.md'), 'utf8').trim();
const section2 = fs.readFileSync(path.join(__dirname, 'upgrades', 'section2.md'), 'utf8').trim();
const section3 = fs.readFileSync(path.join(__dirname, 'upgrades', 'section3.md'), 'utf8').trim();
const section4 = fs.readFileSync(path.join(__dirname, 'upgrades', 'section4.md'), 'utf8').trim();
const section5 = fs.readFileSync(path.join(__dirname, 'upgrades', 'section5.md'), 'utf8').trim();
const section6 = fs.readFileSync(path.join(__dirname, 'upgrades', 'section6.md'), 'utf8').trim();
const section7 = fs.readFileSync(path.join(__dirname, 'upgrades', 'section7.md'), 'utf8').trim();
const section8 = fs.readFileSync(path.join(__dirname, 'upgrades', 'section8.md'), 'utf8').trim();

const masterGuide = [
  section1,
  '',
  '---',
  '',
  section2,
  '',
  '---',
  '',
  section3,
  '',
  '---',
  '',
  section4,
  '',
  '---',
  '',
  section5,
  '',
  '---',
  '',
  section6,
  '',
  '---',
  '',
  section7,
  '',
  '---',
  '',
  section8
].join('\n');

fs.writeFileSync(guidePath, masterGuide, 'utf8');
console.log('Successfully assembled master guide with all 8 sections perfectly upgraded!');
console.log('Master Guide Length:', masterGuide.length, 'bytes');
