const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const propertyOrigins = JSON.parse(fs.readFileSync(path.join(rootDir, 'scratch/forensic/baseline/property_origin.json'), 'utf8'));
const components = JSON.parse(fs.readFileSync(path.join(rootDir, 'scratch/forensic/components.json'), 'utf8'));

const seededOnly = propertyOrigins.filter(p => p.classification === 'DEMO_SEEDED_ONLY_PROPERTY');
console.log('Total demo seeded only properties:', seededOnly.length);

const allComponentContents = components.map(c => {
  const fp = path.join(rootDir, c.filePath);
  return {
    filePath: c.filePath,
    content: fs.existsSync(fp) ? fs.readFileSync(fp, 'utf8') : ''
  };
});

const classifiedSeededProps = [];

for (const propObj of seededOnly) {
  const prop = propObj.property;
  const entity = propObj.entity;

  // Search consumers across all components
  const consumingViews = [];
  for (const comp of allComponentContents) {
    if (comp.content.includes(`.${prop}`) || comp.content.includes(`['${prop}']`) || comp.content.includes(`["${prop}"]`)) {
      consumingViews.push(comp.filePath);
    }
  }

  let classification = 'UNUSED_SEED_PROPERTY';
  let impactRationale = '';

  if (consumingViews.length === 0) {
    classification = 'UNUSED_SEED_PROPERTY';
    impactRationale = 'Property exists in store.js initial fixture array but is never rendered or referenced anywhere in UI components.';
  } else if (['bmsHealth', 'batteryHealth', 'firmwareVersion', 'telematicsStatus', 'diagnosticLogs'].includes(prop)) {
    classification = 'BACKEND_FUTURE_PROPERTY';
    impactRationale = 'Hardware telemetry property displayed on detail screens; awaiting physical CAN bus / IoT gateway integration.';
  } else if (['chassisNumber', 'vin', 'motorNumber', 'colorCode'].includes(prop)) {
    classification = 'REAL_REQUIRED_DOMAIN_PROPERTY';
    impactRationale = 'Core EV identity field rendered on VIN cards, invoices, and registration documents; create form lacks input control.';
  } else if (['avatar', 'initials', 'badgeColor', 'statusClass', 'priorityClass', 'deliveryClass'].includes(prop)) {
    classification = 'DISPLAY_ONLY_DEMO_ENRICHMENT';
    impactRationale = 'Presentational styling metadata bundled into demo seed records.';
  } else if (['carrierTrackingUrl', 'customsDeclarationNo', 'portOfEntry', 'freightForwarder'].includes(prop)) {
    classification = 'OPTIONAL_DOMAIN_PROPERTY';
    impactRationale = 'Extended logistics property referenced on detail views for completed imports.';
  } else {
    classification = 'DISPLAY_ONLY_DEMO_ENRICHMENT';
    impactRationale = 'Auxiliary mock data rendered on detail card badges or tables.';
  }

  classifiedSeededProps.push({
    entity,
    storeCollection: propObj.storeCollection,
    property: prop,
    consumerCount: consumingViews.length,
    consumingViews: consumingViews.slice(0, 5),
    classification,
    impactRationale
  });
}

fs.writeFileSync(
  path.join(rootDir, 'scratch/forensic/baseline/classified_seeded_properties.json'),
  JSON.stringify(classifiedSeededProps, null, 2),
  'utf8'
);

const cCounts = {};
classifiedSeededProps.forEach(p => cCounts[p.classification] = (cCounts[p.classification] || 0) + 1);

console.log('=== SEEDED-ONLY PROPERTIES CLASSIFICATION ===');
console.log('Total Seeded Properties Classified:', classifiedSeededProps.length);
console.log('Classification Breakdown:', cCounts);
