/**
 * AJ ECODRIVE — DYNAMIC DATA-DRIVEN BRANCH AUTHORIZATION & SCOPING ARCHITECTURE
 * 
 * Provides defense-in-depth authorization primitives across:
 * - Layer 1: Navigation / Router Guards
 * - Layer 2: Store Data Lookup & Scoped Getters
 * - Layer 3: Store Mutation Entry Points & Business Actions
 * 
 * Key Architectural Guarantees:
 * 1. Zero hardcoded 4-branch maps: Branch resolution is dynamic against the active branch registry.
 * 2. Survives new branch creation & branch renaming without code changes.
 * 3. Exact Canonical Precedence: Authoritative branch_id / branch strictly wins over forbidden secondary fields (e.g. city, location, destination).
 * 4. Fail-closed: Unknown branch, missing branch, or branchless user strictly denies branch-scoped access.
 * 5. Role normalization without role invention.
 */

// Central Entity Ownership Specification with explicit forbidden non-owner properties
export const ENTITY_OWNERSHIP_SPEC = {
  actionQueue: {
    canonical: 'global',
    authoritative: ['branch_id', 'branchId', 'branch'],
    forbidden: []
  },
  announcements: {
    canonical: 'global',
    authoritative: [],
    forbidden: []
  },
  auditLogs: {
    canonical: 'branch_id',
    authoritative: ['branch_id', 'branchId', 'branch'],
    forbidden: []
  },
  branches: {
    canonical: 'global',
    authoritative: [],
    forbidden: []
  },
  cases: {
    canonical: 'branch_id',
    authoritative: ['branch_id', 'branchId', 'branch'],
    forbidden: ['customerCity', 'incidentLocation']
  },
  categories: {
    canonical: 'global',
    authoritative: [],
    forbidden: []
  },
  conversations: {
    canonical: 'branch_id',
    authoritative: ['branch_id', 'branchId', 'branch'],
    forbidden: []
  },
  customOrders: {
    canonical: 'branch_id',
    authoritative: ['branch_id', 'branchId', 'branch'],
    forbidden: ['city', 'deliveryCity']
  },
  customers: {
    canonical: 'branch_id',
    authoritative: ['branch_id', 'branchId', 'branch', 'branchName'],
    forbidden: ['city', 'address', 'residenceCity']
  },
  deliveries: {
    canonical: 'branch_id',
    authoritative: ['branch_id', 'branchId', 'branch'],
    forbidden: ['deliveryAddress', 'dropoffCity']
  },
  expenses: {
    canonical: 'branch_id',
    authoritative: ['branch_id', 'branchId', 'branch'],
    forbidden: ['vendorLocation', 'payeeCity']
  },
  followUps: {
    canonical: 'branch_id',
    authoritative: ['branch_id', 'branchId', 'branch'],
    forbidden: ['customerCity']
  },
  invoices: {
    canonical: 'branch_id',
    authoritative: ['branch_id', 'branchId', 'branch'],
    forbidden: ['customerCity', 'billingCity']
  },
  leads: {
    canonical: 'branch_id',
    authoritative: ['branch_id', 'branchId', 'branch'],
    forbidden: ['city', 'preferredBranch']
  },
  notifications: {
    canonical: 'branch_id',
    authoritative: ['branch_id', 'branchId', 'branch'],
    forbidden: []
  },
  orders: {
    canonical: 'branch_id',
    authoritative: ['branch_id', 'branchId', 'branch', 'branchName'],
    forbidden: ['shippingCity', 'billingCity', 'deliveryLocation']
  },
  ownerships: {
    canonical: 'branch_id',
    authoritative: ['branch_id', 'branchId', 'branch'],
    forbidden: ['customerCity']
  },
  payments: {
    canonical: 'branch_id',
    authoritative: ['branch_id', 'branchId', 'branch'],
    forbidden: ['bankBranch', 'depositCity']
  },
  products: {
    canonical: 'global',
    authoritative: [],
    forbidden: ['branch', 'branch_id']
  },
  pricingRules: {
    canonical: 'global',
    authoritative: [],
    forbidden: ['branch', 'branch_id']
  },
  productRequests: {
    canonical: 'branch_id',
    authoritative: ['branch_id', 'branchId', 'branch'],
    forbidden: []
  },
  purchaseOrders: {
    canonical: 'branch_id',
    authoritative: ['branch_id', 'branchId', 'branch'],
    forbidden: ['destination']
  },
  purchaseReturns: {
    canonical: 'branch_id',
    authoritative: ['branch_id', 'branchId', 'branch'],
    forbidden: ['supplierCountry', 'portOfExit']
  },
  quotations: {
    canonical: 'branch_id',
    authoritative: ['branch_id', 'branchId', 'branch'],
    forbidden: ['customerCity']
  },
  receipts: {
    canonical: 'branch_id',
    authoritative: ['branch_id', 'branchId', 'branch'],
    forbidden: ['customerCity']
  },
  repairs: {
    canonical: 'branch_id',
    authoritative: ['branch_id', 'branchId', 'branch'],
    forbidden: ['workshopBay', 'customerCity']
  },
  salesReturns: {
    canonical: 'branch_id',
    authoritative: ['branch_id', 'branchId', 'branch'],
    forbidden: ['customerCity', 'inspectionBay']
  },
  serializedUnits: {
    canonical: 'branch_id',
    authoritative: ['branch_id', 'branchId', 'branch', 'assignedBranch'],
    forbidden: ['location', 'warehouseLocation', 'bayNumber']
  },
  stockAdjustments: {
    canonical: 'branch_id',
    authoritative: ['branch_id', 'branchId', 'branch'],
    forbidden: ['countedLocation', 'binNumber']
  },
  stockRequests: {
    canonical: 'branch_id',
    authoritative: ['branch_id', 'branchId', 'branch'],
    forbidden: ['fulfillingHub', 'transitLocation']
  },
  suppliers: {
    canonical: 'global',
    authoritative: [],
    forbidden: ['branch', 'branch_id']
  },
  transfers: {
    canonical: 'from_to',
    authoritative: ['from', 'to', 'fromBranchId', 'toBranchId', 'fromBranch_id', 'toBranch_id'],
    forbidden: ['transitHub', 'currentRouteLocation']
  },
  users: {
    canonical: 'branch_id',
    authoritative: ['branch_id', 'branchId', 'branch'],
    forbidden: []
  },
  warranties: {
    canonical: 'branch_id',
    authoritative: ['branch_id', 'branchId', 'branch'],
    forbidden: ['customerCity']
  }
}

// Backward-compatible alias for existing consumers
export const ENTITY_BRANCH_PROPERTY_MAP = Object.fromEntries(
  Object.entries(ENTITY_OWNERSHIP_SPEC).map(([k, v]) => [k, v.authoritative.length ? v.authoritative : null])
)

let _activeBranchRegistry = null

export function setActiveBranchRegistry(registry) {
  _activeBranchRegistry = registry
}

export function getActiveBranchRegistry() {
  if (_activeBranchRegistry && Array.isArray(_activeBranchRegistry)) {
    return _activeBranchRegistry
  }
  if (typeof globalThis !== 'undefined' && globalThis.store?.branches) {
    return globalThis.store.branches
  }
  return null
}

/**
 * Dynamically resolves any branch input (ID, code, or name) to a canonical immutable Branch ID (e.g. "BR-01").
 * Uses dynamic branch registry passed in, or active store branches registry.
 * Zero hardcoded branch lists!
 */
export function resolveCanonicalBranchId(branchInput, branchesRegistry = null) {
  if (branchInput === undefined || branchInput === null || branchInput === '') return null
  const inputStr = String(branchInput).trim()
  const lower = inputStr.toLowerCase()

  // Global indicator for administrative/cross-branch scopes
  if (lower === 'all' || lower === 'all branches' || lower === 'global') {
    return 'ALL'
  }

  // If a dynamic registry is provided or available
  const registry = Array.isArray(branchesRegistry) ? branchesRegistry : getActiveBranchRegistry()

  if (registry && Array.isArray(registry) && registry.length > 0) {
    // 1. Direct ID match
    const byId = registry.find(b => (b.id && String(b.id).toLowerCase() === lower) || (b.branch_id && String(b.branch_id).toLowerCase() === lower))
    if (byId) return byId.id || byId.branch_id

    // 2. Name match (case-insensitive)
    const byName = registry.find(b => b.name && String(b.name).toLowerCase() === lower)
    if (byName) return byName.id || byName.branch_id

    // 3. Short code match (e.g. PEW, ISB)
    const byCode = registry.find(b => b.code && String(b.code).toLowerCase() === lower)
    if (byCode) return byCode.id || byCode.branch_id

    // If registry is active and branch is not found: FAIL CLOSED!
    return null
  }

  // Fallback only when registry not yet initialized/hydrated
  if (/^BR-[-_a-zA-Z0-9]+$/i.test(inputStr)) {
    return inputStr.toUpperCase()
  }

  // If not resolvable against registry: FAIL CLOSED!
  return null
}

/**
 * Normalizes user role string without inventing non-existent roles.
 */
export function normalizeRole(role) {
  if (!role) return ''
  const clean = String(role).toLowerCase().replace(/[\s_-]+/g, '')
  if (clean === 'superadmin' || clean === 'admin') return 'Super Admin'
  if (clean === 'branchmanager' || clean === 'manager') return 'Branch Manager'
  if (clean === 'salesrepresentative' || clean === 'salesrep' || clean === 'sales') return 'Sales Representative'
  if (clean === 'technician') return 'Technician'
  if (clean === 'inventorycontroller' || clean === 'inventory') return 'Inventory Controller'
  return role
}

/**
 * Check if user is Super Admin
 */
export function isSuperAdmin(user) {
  if (!user || !user.isAuthenticated) return false
  if (user.isSuperAdmin === true) return true
  return normalizeRole(user.role) === 'Super Admin'
}

/**
 * Check if user is a branch-scoped operational user
 */
export function isBranchUser(user) {
  if (!user || !user.isAuthenticated) return false
  return !isSuperAdmin(user)
}

/**
 * Dynamically compares two branch representations using canonical branch ID resolution.
 * Fails closed if either branch cannot be resolved.
 */
export function matchBranch(recordBranchInput, userBranchInput, branchesRegistry = null) {
  if (!recordBranchInput || !userBranchInput) return false

  const recCanon = resolveCanonicalBranchId(recordBranchInput, branchesRegistry)
  const userCanon = resolveCanonicalBranchId(userBranchInput, branchesRegistry)

  if (recCanon === 'ALL') return true
  if (!recCanon || !userCanon) return false

  return recCanon === userCanon
}

/**
 * Extracts authoritative branch identity from a record based on ENTITY_OWNERSHIP_SPEC.
 * Never guesses using forbidden secondary fields.
 */
export function getRecordBranchIdentity(record, entityType) {
  if (!record) return null
  const canonType = { units: 'serializedUnits', sales: 'orders', cycleCounts: 'stockAdjustments', quarantine: 'stockAdjustments' }[entityType] || entityType

  if (canonType === 'transfers') {
    return {
      from: record.from || record.fromBranch || record.fromBranch_id || record.fromBranchId || null,
      to: record.to || record.toBranch || record.toBranch_id || record.toBranchId || null
    }
  }

  const spec = ENTITY_OWNERSHIP_SPEC[canonType]
  const propList = spec ? spec.authoritative : ['branch_id', 'branchId', 'branch', 'branchName']

  for (const prop of propList) {
    if (record[prop] !== undefined && record[prop] !== null && record[prop] !== '') {
      return record[prop]
    }
  }
  return null
}

/**
 * Authorizes read access for a user on an entity record.
 * Supports dynamic branch registry.
 */
export function canReadRecord(user, entityType, record, branchesRegistry = null) {
  if (!user || !user.isAuthenticated) return false
  if (isSuperAdmin(user)) return true
  if (!record) return false

  // Global entities readable by all authenticated users
  if (['products', 'suppliers', 'branches', 'categories'].includes(entityType)) {
    return true
  }

  // Branchless Branch Manager: FAIL CLOSED!
  const userBranch = user.branchId || user.branchCode || user.branchName || user.branch
  if (!userBranch) return false

  // Inter-branch transfers are accessible to source branch, destination branch, or Super Admin
  if (entityType === 'transfers') {
    const from = record.from || record.fromBranch || record.fromBranch_id || record.fromBranchId
    const to = record.to || record.toBranch || record.toBranch_id || record.toBranchId
    return matchBranch(from, userBranch, branchesRegistry) || matchBranch(to, userBranch, branchesRegistry)
  }

  // Branch-scoped entities
  const recordBranch = getRecordBranchIdentity(record, entityType)
  if (!recordBranch) {
    // Missing/unknown branch on a branch-scoped entity: FAIL CLOSED for branch users!
    return false
  }

  return matchBranch(recordBranch, userBranch, branchesRegistry)
}

/**
 * Authorizes mutation access for a user on an entity record.
 */
export function canMutateRecord(user, entityType, record, operation = 'update', branchesRegistry = null) {
  if (!user || !user.isAuthenticated) return false
  if (isSuperAdmin(user)) return true
  if (!record) return false

  // Global administrative master entities can ONLY be modified by Super Admin
  if (['branches', 'products', 'categories', 'suppliers', 'pricingRules'].includes(entityType)) {
    return false
  }

  // Branchless Branch Manager: FAIL CLOSED!
  const userBranch = user.branchId || user.branchCode || user.branchName || user.branch
  if (!userBranch) return false

  // Transfer mutations are state and role aware
  if (entityType === 'transfers') {
    if (operation === 'dispatch') {
      return matchBranch(record.from || record.fromBranch, userBranch, branchesRegistry)
    }
    if (operation === 'receive') {
      return matchBranch(record.to || record.toBranch, userBranch, branchesRegistry)
    }
    if (operation === 'cancel' || operation === 'update') {
      return matchBranch(record.from || record.fromBranch, userBranch, branchesRegistry)
    }
    return false
  }

  // Branch-scoped entities must strictly match user's branch
  const recordBranch = getRecordBranchIdentity(record, entityType)
  if (!recordBranch) return false

  return matchBranch(recordBranch, userBranch, branchesRegistry)
}

/**
 * Asserts mutation access, throws UNAUTHORIZED_CROSS_BRANCH_MUTATION on failure,
 * and logs to structured audit logger if provided.
 */
export function assertRecordMutationAccess(user, entityType, record, operation = 'update', auditLogger = null, branchesRegistry = null) {
  if (!canMutateRecord(user, entityType, record, operation, branchesRegistry)) {
    const errorMsg = `UNAUTHORIZED_CROSS_BRANCH_MUTATION: Role ${user?.role || 'Unknown'} at branch ${user?.branchName || user?.branch || 'None'} is not authorized to perform ${operation} on ${entityType} record.`
    if (auditLogger && typeof auditLogger === 'function') {
      auditLogger({
        action: 'SECURITY_VIOLATION',
        event_type: 'UNAUTHORIZED_CROSS_BRANCH_MUTATION_ATTEMPT',
        entity_type: entityType,
        entity_id: record?.id || record?.orderNo || 'UNKNOWN',
        module: 'Security',
        branch: user?.branchName || user?.branch || 'Unknown',
        description: errorMsg,
        metadata: {
          entityType,
          operation,
          recordId: record?.id,
          user: user?.name,
          userBranch: user?.branchName || user?.branch,
          recordBranch: getRecordBranchIdentity(record, entityType)
        }
      })
    }
    throw new Error(errorMsg)
  }
}

