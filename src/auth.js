// Authentication and Cryptographic Security Module for AJ ECODRIVE Multi-Branch System

/**
 * Computes SHA-256 hash of a string using Web Crypto API.
 * Ensures passwords are never processed or compared as plain text in storage.
 */
export async function hashPassword(plainTextPassword) {
  const encoder = new TextEncoder()
  const data = encoder.encode(plainTextPassword)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// Pre-computed SHA-256 hash for default branch passwords:
// "password123" -> "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f"
// "peshawar123" -> "615b1399438d01d4a070ebfb4aa366cb4b6b69b4e78dbf14545ba7dd0346067b"
// "admin123"    -> "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9"
const HASH_PASSWORD123 = 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f'
const HASH_PESHAWAR123 = '615b1399438d01d4a070ebfb4aa366cb4b6b69b4e78dbf14545ba7dd0346067b'
const HASH_ADMIN123 = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'

export const BRANCH_ACCOUNTS = [
  {
    branchCode: 'PEW-01',
    aliases: ['PEW-01', 'PESHAWAR', 'PEW', 'pew-01', 'peshawar'],
    branchName: 'Peshawar',
    role: 'Branch Manager',
    managerName: 'Ahsan Khan',
    email: 'pew@ajecodrive.com',
    allowedHashes: [HASH_PASSWORD123, HASH_PESHAWAR123],
    isSuperAdmin: false
  },
  {
    branchCode: 'ISB-01',
    aliases: ['ISB-01', 'ISLAMABAD', 'ISB', 'isb-01', 'islamabad'],
    branchName: 'Islamabad',
    role: 'Branch Manager',
    managerName: 'Hassan Ali',
    email: 'isb@ajecodrive.com',
    allowedHashes: [HASH_PASSWORD123],
    isSuperAdmin: false
  },
  {
    branchCode: 'LHE-01',
    aliases: ['LHE-01', 'LAHORE', 'LHE', 'lhe-01', 'lahore'],
    branchName: 'Lahore',
    role: 'Branch Manager',
    managerName: 'Sami Ullah',
    email: 'lhe@ajecodrive.com',
    allowedHashes: [HASH_PASSWORD123],
    isSuperAdmin: false
  },
  {
    branchCode: 'RWP-01',
    aliases: ['RWP-01', 'RAWALPINDI', 'RWP', 'rwp-01', 'rawalpindi'],
    branchName: 'Rawalpindi',
    role: 'Branch Manager',
    managerName: 'Usman Tariq',
    email: 'rwp@ajecodrive.com',
    allowedHashes: [HASH_PASSWORD123],
    isSuperAdmin: false
  },
  {
    branchCode: 'ADMIN',
    aliases: ['ADMIN', 'SUPERADMIN', 'admin@ajecodrive.com', 'admin', 'superadmin'],
    branchName: 'All Branches',
    role: 'Super Admin',
    managerName: 'Super Admin',
    email: 'admin@ajecodrive.com',
    allowedHashes: [HASH_PASSWORD123, HASH_ADMIN123],
    isSuperAdmin: true
  }
]

/**
 * Authenticates credentials against the branch accounts registry using SHA-256 hashing.
 * Returns the authenticated user session or throws an error.
 */
export async function authenticateBranch(branchCodeOrIdentifier, plainPassword) {
  if (!branchCodeOrIdentifier || !plainPassword) {
    throw new Error('Please enter both Branch Code and Password.')
  }

  const cleanIdentifier = branchCodeOrIdentifier.trim().toLowerCase()
  const account = BRANCH_ACCOUNTS.find(acc => 
    acc.aliases.some(alias => alias.toLowerCase() === cleanIdentifier)
  )

  if (!account) {
    throw new Error('Invalid Branch Code or Username. Please check and try again.')
  }

  const inputHash = await hashPassword(plainPassword.trim())

  if (!account.allowedHashes.includes(inputHash)) {
    throw new Error('Incorrect Password for ' + account.branchName + ' branch. Please try again.')
  }

  // Authentication successful - create session object
  return {
    isAuthenticated: true,
    branchCode: account.branchCode,
    branchName: account.branchName,
    role: account.role,
    name: account.managerName,
    email: account.email,
    isSuperAdmin: account.isSuperAdmin,
    loginTimestamp: new Date().toISOString()
  }
}
