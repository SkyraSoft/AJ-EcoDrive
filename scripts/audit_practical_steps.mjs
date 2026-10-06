import { superAdminMissions } from '../src/tour/content/superAdmin/superAdminMissions.js';
import { branchManagerMissions } from '../src/tour/content/branchManager/branchManagerMissions.js';
import { crossRoleScenarios } from '../src/tour/content/scenarios/crossRoleScenarios.js';

console.log('=== PRACTICAL / INTERACTIVE STEPS AUDIT ===');

function analyzeSteps(missions, source) {
  const steps = [];
  for (const m of missions) {
    if (m.steps) {
      for (const s of m.steps) {
        steps.push({ ...s, missionId: m.id || m.code, missionTitle: m.title, source });
      }
    }
    // Also scenarios might have stages or segments
    if (m.stages) {
      for (const st of m.stages) {
        if (st.steps) {
          for (const s of st.steps) {
            steps.push({ ...s, missionId: m.id || m.code, missionTitle: m.title, stageId: st.id, source });
          }
        }
      }
    }
    if (m.segments) {
      for (const seg of m.segments) {
        steps.push({ ...seg, missionId: m.id || m.code, missionTitle: m.title, source });
      }
    }
  }
  return steps;
}

const saSteps = analyzeSteps(superAdminMissions, 'Super Admin');
const bmSteps = analyzeSteps(branchManagerMissions, 'Branch Manager');
const scSteps = analyzeSteps(crossRoleScenarios, 'Cross-Role Scenarios');

const allSteps = [...saSteps, ...bmSteps, ...scSteps];

console.log(`Total Steps Scanned: ${allSteps.length} (SA: ${saSteps.length}, BM: ${bmSteps.length}, Scenarios: ${scSteps.length})`);

// Identify practical steps
const practicalSteps = allSteps.filter(s => {
  const isPractice = s.mode === 'PRACTICE' || s.trainingType === 'practice' || s.trainingType === 'input-practice';
  const hasAction = s.action || s.expectedAction || s.actionType;
  const isActionVerb = /click|type|select|choose|enter|open|submit|approve|toggle|create/i.test(s.instruction || '');
  return isPractice || hasAction;
});

console.log(`Total Practical Steps Found: ${practicalSteps.length}`);

for (const p of practicalSteps) {
  console.log(`- [${p.source}] ${p.missionId} | Step ${p.id || p.stepNumber}: "${p.title}" | Target: ${p.targetId} | Route: ${p.route} | Mode: ${p.mode} | TrainingType: ${p.trainingType} | Risk: ${p.mutationRisk || 'N/A'}`);
  console.log(`  Instruction: "${p.instruction}"`);
}
