const fs = require('fs');
const path = require('path');

const storePath = path.resolve(__dirname, '../src/store.js');
let code = fs.readFileSync(storePath, 'utf-8');

// 1. Add import for branchAuth at the top
if (!code.includes("from './utils/branchAuth.js'")) {
  code = code.replace(
    "import { reactive } from 'vue'",
    "import { reactive } from 'vue'\nimport { normalizeRole, isSuperAdmin, isBranchUser, matchBranch, canReadRecord, canMutateRecord, assertRecordMutationAccess, getRecordBranchIdentity, ENTITY_BRANCH_PROPERTY_MAP } from './utils/branchAuth.js'"
  );
}

// 2. Add central authorization methods to store object after setSession / logout / isBranchUser
const targetSearch = `  // Helper to check if current user is a Branch Manager / branch-scoped user
  isBranchUser() {
    return !!(this.currentUser && this.currentUser.isAuthenticated && !this.currentUser.isSuperAdmin)
  },`;

const authPrims = `  // Centralized Authorization & Scoping Primitives
  isSuperAdminUser(user = this.currentUser) {
    return isSuperAdmin(user)
  },

  isBranchUser(user = this.currentUser) {
    return isBranchUser(user)
  },

  canReadRecord(user = this.currentUser, entityType, record) {
    return canReadRecord(user, entityType, record)
  },

  canMutateRecord(user = this.currentUser, entityType, record, operation = 'update') {
    return canMutateRecord(user, entityType, record, operation)
  },

  assertRecordMutationAccess(entityType, record, operation = 'update', user = this.currentUser) {
    assertRecordMutationAccess(user, entityType, record, operation, this.addAuditLog.bind(this))
  },

  getScopedRecordById(entityType, id, user = this.currentUser) {
    if (!id) return null
    const target = String(id).toLowerCase().trim()
    const collection = this[entityType] || []
    const record = collection.find(item => {
      if (!item) return false
      return (
        (item.id && String(item.id).toLowerCase().trim() === target) ||
        (item.code && String(item.code).toLowerCase().trim() === target) ||
        (item.orderNo && String(item.orderNo).toLowerCase().trim() === target) ||
        (item.invoiceNo && String(item.invoiceNo).toLowerCase().trim() === target) ||
        (item.paymentNo && String(item.paymentNo).toLowerCase().trim() === target) ||
        (item.leadNo && String(item.leadNo).toLowerCase().trim() === target) ||
        (item.quote && String(item.quote).toLowerCase().trim() === target) ||
        (item.po && String(item.po).toLowerCase().trim() === target) ||
        (item.returnNo && String(item.returnNo).toLowerCase().trim() === target) ||
        (item.caseId && String(item.caseId).toLowerCase().trim() === target) ||
        (item.jobId && String(item.jobId).toLowerCase().trim() === target) ||
        (item.serial && String(item.serial).toLowerCase().trim() === target) ||
        (item.vin && String(item.vin).toLowerCase().trim() === target) ||
        (item.chassisNumber && String(item.chassisNumber).toLowerCase().trim() === target) ||
        (item.chassis && String(item.chassis).toLowerCase().trim() === target) ||
        (item.name && String(item.name).toLowerCase().trim() === target)
      )
    })
    if (!record) return null
    if (!this.canReadRecord(user, entityType, record)) {
      return null
    }
    return record
  },`;

if (!code.includes('assertRecordMutationAccess(entityType,')) {
  code = code.replace(targetSearch, authPrims);
}

// 3. Update isBranchAllowed to use matchBranch
const oldIsBranchAllowed = `  // Helper to check if record matches current user's branch
  isBranchAllowed(recordBranch) {
    if (!this.isBranchUser()) return true
    if (!recordBranch) return true
    const userBranch = this.getActiveBranch().toLowerCase()
    return recordBranch.toLowerCase() === userBranch || recordBranch.toLowerCase() === 'all branches' || recordBranch.toLowerCase() === 'all'
  },`;

const newIsBranchAllowed = `  // Helper to check if record matches current user's branch
  isBranchAllowed(recordBranch) {
    if (!this.isBranchUser()) return true
    if (!recordBranch) return false
    return matchBranch(recordBranch, this.getActiveBranch())
  },`;

if (code.includes(oldIsBranchAllowed)) {
  code = code.replace(oldIsBranchAllowed, newIsBranchAllowed);
}

fs.writeFileSync(storePath, code);
console.log('Successfully patched central branch auth primitives into src/store.js');
