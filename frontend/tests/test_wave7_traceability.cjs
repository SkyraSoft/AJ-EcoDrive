/**
 * AJ ECODRIVE — WAVE 7 TRACEABILITY SUITE
 * Master Artifact ID: 73158
 */

const assert = require('assert')
const fs = require('fs')
const path = require('path')

console.log('======================================================================')
console.log('   AJ ECODRIVE — WAVE 7 TRACEABILITY SUITE')
console.log('======================================================================\n')

const matrix = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../scratch/forensic/final/wave7_traceability_matrix.json'), 'utf8'))
const storeFile = fs.readFileSync(path.resolve(__dirname, '../src/store.js'), 'utf8')

console.log(`--- Verifying Traceability for ${matrix.length} Core Business Workflows ---`)

matrix.forEach(wf => {
  console.log(`\n• Workflow [${wf.workflowId}]: ${wf.businessPurpose}`)
  
  // 1. Frontend Entry Point File Verification
  const frontendPath = path.resolve(__dirname, '..', wf.frontendEntryPoint.split(' ')[0])
  assert.ok(fs.existsSync(frontendPath), `Frontend entry point file ${frontendPath} must exist on disk`)
  console.log(`  ✓ Entry Point Exists: ${wf.frontendEntryPoint}`)

  // 2. Domain Methods Existence in store.js
  wf.domainMethods.forEach(method => {
    const fnName = method.replace('store.', '').trim()
    assert.ok(storeFile.includes(fnName), `Method ${fnName} must exist in src/store.js`)
  })
  console.log(`  ✓ Domain Methods Verified: ${wf.domainMethods.join(', ')}`)

  // 3. Test Coverage References
  assert.ok(wf.tests && wf.tests.length > 0, `Workflow ${wf.workflowId} must cite verified regression test files`)
  wf.tests.forEach(tFile => {
    const tPath = path.resolve(__dirname, tFile)
    assert.ok(fs.existsSync(tPath), `Referenced test file ${tFile} must exist on disk`)
  })
  console.log(`  ✓ Test Coverage Verified: ${wf.tests.join(', ')}`)

  // 4. Backend Safeguard Requirements
  assert.ok(wf.backendMustGuarantee && wf.backendMustGuarantee.length > 0, `Workflow ${wf.workflowId} must document backend guarantees`)
  console.log(`  ✓ Backend Requirements Defined: ${wf.backendMustGuarantee.length} rules`)
})

console.log('\n======================================================================')
console.log(`   TOTAL WORKFLOWS TRACED: ${matrix.length} | ALL PASSED (0 FAILURES)`)
console.log('   WAVE 7 TRACEABILITY STATUS: VERIFIED')
console.log('======================================================================\n')
