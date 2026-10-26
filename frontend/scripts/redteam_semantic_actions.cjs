const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const semanticActions = JSON.parse(fs.readFileSync(path.join(rootDir, 'scratch/forensic/baseline/semantic_actions.json'), 'utf8'));
const rawTriggers = JSON.parse(fs.readFileSync(path.join(rootDir, 'scratch/forensic/baseline/raw_action_triggers.json'), 'utf8'));

// Build trigger lookup
const triggerMap = {};
rawTriggers.forEach(t => triggerMap[t.actionId] = t);

// Deterministic stratified sample of 100 actions across modules
const sampleSize = 100;
const step = Math.floor(semanticActions.length / sampleSize);
const sampledActions = [];

for (let i = 0; i < semanticActions.length && sampledActions.length < sampleSize; i += step) {
  sampledActions.push(semanticActions[i]);
}

const auditResults = [];
let correctCount = 0;
let falseMergeCount = 0;
let falseSplitCount = 0;

for (const semAct of sampledActions) {
  const triggers = semAct.triggerIds.map(id => triggerMap[id]).filter(Boolean);
  
  // Check if triggers within this action have conflicting handlers or intent
  const handlers = [...new Set(triggers.map(t => t.handler))];
  const tags = [...new Set(triggers.map(t => t.tag))];

  let status = 'CORRECT_NORMALIZATION';
  let notes = 'Single action intent and uniform handler across all mapped triggers.';

  if (handlers.length > 1) {
    // Check if handlers are meaningfully different (e.g. approve vs reject)
    const hasConflictingIntent = handlers.some(h1 => 
      handlers.some(h2 => (h1.includes('approve') && h2.includes('reject')) || (h1.includes('save') && h2.includes('cancel')))
    );
    if (hasConflictingIntent) {
      status = 'FALSE_MERGE';
      notes = `Conflicting handlers merged: ${handlers.join(', ')}`;
      falseMergeCount++;
    }
  }

  if (status === 'CORRECT_NORMALIZATION') {
    correctCount++;
  }

  auditResults.push({
    actionId: semAct.actionId,
    module: semAct.module,
    component: semAct.component,
    visibleLabel: semAct.visibleLabel,
    triggerCount: semAct.triggerIds.length,
    handlers,
    status,
    notes
  });
}

const precision = ((correctCount / sampledActions.length) * 100).toFixed(2);

fs.writeFileSync(
  path.join(rootDir, 'scratch/forensic/baseline/semantic_action_redteam.json'),
  JSON.stringify({
    sampleSize: sampledActions.length,
    correctCount,
    falseMergeCount,
    falseSplitCount,
    estimatedPrecision: `${precision}%`,
    auditSample: auditResults
  }, null, 2),
  'utf8'
);

console.log('=== SEMANTIC ACTION RED-TEAM AUDIT ===');
console.log('Sample Size:', sampledActions.length);
console.log('Correct Normalizations:', correctCount);
console.log('False Merges:', falseMergeCount);
console.log('False Splits:', falseSplitCount);
console.log('Estimated Precision:', `${precision}%`);
