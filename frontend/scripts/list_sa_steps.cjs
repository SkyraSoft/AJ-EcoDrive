const fs = require('fs');

async function main() {
  const { superAdminMissions } = await import('../src/tour/content/superAdmin/superAdminMissions.js');
  
  for (const m of superAdminMissions) {
    console.log(`\n=== ${m.code}: ${m.title} (Route: ${m.route}) ===`);
    for (const s of m.steps) {
      console.log(`  Step ${s.stepNumber} [${s.id}]: "${s.title}" -> targetId: "${s.targetId}" (Route: ${s.route})`);
    }
  }
}

main();
