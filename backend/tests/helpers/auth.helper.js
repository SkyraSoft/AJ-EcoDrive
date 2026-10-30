import { generateToken } from '../../src/utils/token.js'

/**
 * Creates a valid test JWT token for Super Admin
 */
export function getAdminAuthHeader() {
  const token = generateToken({
    id: 'USR-ADMIN',
    username: 'admin',
    email: 'admin@ajecodrive.com',
    name: 'Super Admin',
    role: 'Super Admin',
    role_id: 'ROLE-ADMIN',
    branch_id: null,
    branch_name: 'All Branches',
    branch_code: 'ADMIN',
    isSuperAdmin: true,
    permissions: ['admin.all']
  })
  return { Authorization: `Bearer ${token}` }
}

/**
 * Creates a valid test JWT token for Branch Manager
 */
export function getBranchManagerAuthHeader(branchId = 'BR-01', branchName = 'Peshawar') {
  const token = generateToken({
    id: `USR-${branchId}`,
    username: `${branchId.toLowerCase()}-manager`,
    email: `${branchId.toLowerCase()}@ajecodrive.com`,
    name: `${branchName} Manager`,
    role: 'Branch Manager',
    role_id: 'ROLE-BM',
    branch_id: branchId,
    branch_name: branchName,
    branch_code: branchId === 'BR-01' ? 'PEW-01' : (branchId === 'BR-02' ? 'ISB-01' : 'LHE-01'),
    isSuperAdmin: false,
    permissions: [
      'customers.read', 'customers.write',
      'quotations.read', 'quotations.write',
      'orders.read', 'orders.write',
      'invoices.read', 'invoices.write',
      'inventory.read', 'inventory.write',
      'procurement.read', 'procurement.write',
      'finance.read', 'finance.write', 'finance.approve',
      'after_sales.read', 'after_sales.write', 'after_sales.warranty_approve',
      'leads.read', 'leads.write', 'leads.convert'
    ]
  })
  return { Authorization: `Bearer ${token}` }
}

/**
 * Creates a valid test JWT token for Technician
 */
export function getTechnicianAuthHeader(branchId = 'BR-01', branchName = 'Peshawar') {
  const token = generateToken({
    id: `USR-TECH-${branchId}`,
    username: `${branchId.toLowerCase()}-tech`,
    email: `tech-${branchId.toLowerCase()}@ajecodrive.com`,
    name: `${branchName} Technician`,
    role: 'Technician',
    role_id: 'ROLE-TECH',
    branch_id: branchId,
    branch_name: branchName,
    branch_code: branchId === 'BR-01' ? 'PEW-01' : (branchId === 'BR-02' ? 'ISB-01' : 'LHE-01'),
    isSuperAdmin: false,
    permissions: [
      'after_sales.read', 'after_sales.write'
    ]
  })
  return { Authorization: `Bearer ${token}` }
}

/**
 * Creates a valid test JWT token for Procurement Read-Only Auditor
 */
export function getReadOnlyProcurementAuthHeader(branchId = 'BR-01', branchName = 'Peshawar') {
  const token = generateToken({
    id: `USR-AUDITOR-${branchId}`,
    username: `${branchId.toLowerCase()}-auditor`,
    email: `auditor-${branchId.toLowerCase()}@ajecodrive.com`,
    name: `${branchName} Auditor`,
    role: 'Auditor',
    role_id: 'ROLE-AUDITOR',
    branch_id: branchId,
    branch_name: branchName,
    branch_code: branchId === 'BR-01' ? 'PEW-01' : (branchId === 'BR-02' ? 'ISB-01' : 'LHE-01'),
    isSuperAdmin: false,
    permissions: [
      'procurement.read'
    ]
  })
  return { Authorization: `Bearer ${token}` }
}

