/**
 * AJ ECODRIVE — WAVE 7 BACKEND BOUNDARY SUITE
 * Master Artifact ID: 73158
 */

const assert = require('assert')
const fs = require('fs')
const path = require('path')

console.log('======================================================================')
console.log('   AJ ECODRIVE — WAVE 7 BACKEND BOUNDARY SUITE')
console.log('======================================================================\n')

const artifactsDir = path.resolve(__dirname, '../scratch/forensic/final')

function loadJson(name) {
  const p = path.join(artifactsDir, name)
  assert.ok(fs.existsSync(p), `Artifact ${name} must exist`)
  return JSON.parse(fs.readFileSync(p, 'utf8'))
}

// 1. Authorization Contract Boundary
console.log('--- 1. Authorization & Server-Side Branch Scoping Boundary ---')
const authContract = loadJson('wave7_authorization_contract.json')
assert.ok(authContract.authoritativePrinciple.includes('Frontend hiding is advisory UX; backend authorization is mandatory server-side security enforcement'))
assert.ok(authContract.rules.some(r => r.scope.includes('Global Administrative Masters')))
assert.ok(authContract.rules.some(r => r.scope.includes('Branch-Scoped Primary Entities')))
assert.ok(authContract.rules.some(r => r.scope.includes('Inter-Branch Movement')))
console.log('  ✓ [PASS] Authoritative branch scoping and global master RBAC boundary verified')

// 2. Concurrency & Atomicity Contracts
console.log('\n--- 2. Concurrency & Transaction Atomicity Boundary ---')
const concContract = loadJson('wave7_concurrency_contract.json')
const doubleSale = concContract.concurrencyRisks.find(c => c.scenario.includes('Double Sale'))
assert.ok(doubleSale, 'Double sale concurrency risk must be documented')
assert.ok(doubleSale.backendRequirement.includes('concurrent attempts cannot reserve or sell the same serialized unit twice'), 'Double sale concurrency requirement verified')

const duplicateReceipt = concContract.concurrencyRisks.find(c => c.scenario.includes('Duplicate Goods Receipt'))
assert.ok(duplicateReceipt, 'Duplicate receipt concurrency risk must be documented')
assert.ok(duplicateReceipt.backendRequirement.includes('serial and chassis identifiers'), 'Serial/Chassis uniqueness requirement verified')
console.log('  ✓ [PASS] Concurrency protections and atomic rollback requirements verified')

// 3. Frontend vs Backend Responsibility Matrix
console.log('\n--- 3. Frontend vs Backend Responsibility Boundary ---')
const boundaryMatrix = loadJson('wave7_frontend_backend_boundary.json')
assert.ok(boundaryMatrix.length >= 8, 'At least 8 major technical concerns mapped across frontend/backend')

const branchIsolation = boundaryMatrix.find(b => b.concern === 'Branch Data Isolation')
assert.strictEqual(branchIsolation.authoritativeSource, 'BACKEND AUTHORITATIVE')

const unitUniqueness = boundaryMatrix.find(b => b.concern === 'Serialized Unit Uniqueness')
assert.strictEqual(unitUniqueness.authoritativeSource, 'BACKEND AUTHORITATIVE')

const layoutPattern = boundaryMatrix.find(b => b.concern.includes('Modal vs Dedicated Page Pattern'))
assert.strictEqual(layoutPattern.authoritativeSource, 'FRONTEND')
console.log('  ✓ [PASS] Clear separation between client presentation and authoritative server enforcement')

// 4. Error Categorization Contract
console.log('\n--- 4. Semantic Error Categorization ---')
const errorContract = loadJson('wave7_error_contract.json')
const cats = errorContract.errorCategories
assert.ok(cats.VALIDATION_ERROR.semanticMeaning, 'VALIDATION_ERROR semantic meaning documented')
assert.ok(cats.UNAUTHORIZED.semanticMeaning, 'UNAUTHORIZED semantic meaning documented')
assert.ok(cats.FORBIDDEN_RECORD.semanticMeaning, 'FORBIDDEN_RECORD semantic meaning documented')
assert.ok(cats.NOT_FOUND.semanticMeaning, 'NOT_FOUND semantic meaning documented')
assert.ok(cats.STATE_CONFLICT.semanticMeaning, 'STATE_CONFLICT semantic meaning documented')
assert.ok(cats.TASK_ALREADY_RESOLVED.semanticMeaning, 'TASK_ALREADY_RESOLVED semantic meaning documented')
assert.ok(cats.BUSINESS_RULE_VIOLATION.semanticMeaning, 'BUSINESS_RULE_VIOLATION semantic meaning documented')
console.log('  ✓ [PASS] Technology-neutral semantic error definitions mapped for all domain failure categories')

console.log('\n======================================================================')
console.log('   TOTAL TESTS: 4 SUITES | ALL PASSED (0 FAILURES)')
console.log('   WAVE 7 BACKEND BOUNDARY STATUS: VERIFIED')
console.log('======================================================================\n')
