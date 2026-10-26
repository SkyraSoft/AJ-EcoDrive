const fs = require('fs');
const path = require('path');

async function main() {
  const saMissionsMod = await import('../src/tour/content/superAdmin/superAdminMissions.js');
  const superAdminMissions = saMissionsMod.superAdminMissions;
  console.log('Imported missions successfully:', superAdminMissions.length);

  const routerContent = fs.readFileSync('src/router/index.js', 'utf8');

  const auditResults = [];

  for (const mission of superAdminMissions) {
    for (const step of mission.steps) {
      const stepRoute = step.route || mission.route;
      const cleanRoute = stepRoute.replace(/^\//, '');
      
      let routerMatch = null;
      let isRedirect = false;
      let redirectTo = null;
      
      // Look for route declaration
      const idx = routerContent.indexOf(`path: '${cleanRoute}'`);
      if (idx !== -1) {
        const chunk = routerContent.substring(idx, idx + 300);
        if (chunk.includes('redirect:')) {
          isRedirect = true;
          const rm = chunk.match(/redirect:\s*['"]([^'"]+)['"]/);
          redirectTo = rm ? rm[1] : 'unknown';
        } else if (chunk.includes('component:')) {
          const cm = chunk.match(/component:\s*(\(\)\s*=>\s*import\(['"]([^'"]+)['"]\)|[A-Za-z0-9_]+)/);
          routerMatch = cm ? (cm[2] || cm[1]) : 'matched';
        }
      }
      
      auditResults.push({
        missionId: mission.id,
        code: mission.code,
        missionTitle: mission.title,
        stepId: step.id,
        stepNumber: step.stepNumber,
        stepTitle: step.title,
        declaredRoute: stepRoute,
        targetId: step.targetId,
        routerMatch,
        isRedirect,
        redirectTo
      });
    }
  }

  console.log('Total steps in 20 missions:', auditResults.length);
  console.log('\nSteps with Redirect or Missing in Router:');
  const brokenRoutes = auditResults.filter(r => !r.routerMatch || r.isRedirect);
  brokenRoutes.forEach(r => {
    console.log(`[${r.code} Step ${r.stepNumber}] ${r.stepTitle} -> Route: ${r.declaredRoute} -> ${r.isRedirect ? 'REDIRECTS TO ' + r.redirectTo : 'NOT FOUND IN ROUTER'}`);
  });
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
