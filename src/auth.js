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
// "password"    -> "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8"
// "password123" -> "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f"
// "peshawar123" -> "615b1399438d01d4a070ebfb4aa366cb4b6b69b4e78dbf14545ba7dd0346067b"
// "admin"       -> "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918"
// "admin123"    -> "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9"
const HASH_PASSWORD = '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'
const HASH_PASSWORD123 = 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f'
const HASH_PESHAWAR123 = '615b1399438d01d4a070ebfb4aa366cb4b6b69b4e78dbf14545ba7dd0346067b'
const HASH_ADMIN = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918'
const HASH_ADMIN123 = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'

export const BRANCH_ACCOUNTS = [
  {
    branchCode: 'PEW-01',
    aliases: ['PEW-01', 'PESHAWAR', 'PEW', 'pew-01', 'peshawar'],
    branchName: 'Peshawar',
    role: 'Branch Manager',
    managerName: 'Ahsan Khan',
    email: 'pew@ajecodrive.com',
    allowedHashes: [HASH_PASSWORD, HASH_PASSWORD123, HASH_PESHAWAR123],
    isSuperAdmin: false
  },
  {
    branchCode: 'ISB-01',
    aliases: ['ISB-01', 'ISLAMABAD', 'ISB', 'isb-01', 'islamabad'],
    branchName: 'Islamabad',
    role: 'Branch Manager',
    managerName: 'Hassan Ali',
    email: 'isb@ajecodrive.com',
    allowedHashes: [HASH_PASSWORD, HASH_PASSWORD123],
    isSuperAdmin: false
  },
  {
    branchCode: 'LHE-01',
    aliases: ['LHE-01', 'LAHORE', 'LHE', 'lhe-01', 'lahore'],
    branchName: 'Lahore',
    role: 'Branch Manager',
    managerName: 'Sami Ullah',
    email: 'lhe@ajecodrive.com',
    allowedHashes: [HASH_PASSWORD, HASH_PASSWORD123],
    isSuperAdmin: false
  },
  {
    branchCode: 'RWP-01',
    aliases: ['RWP-01', 'RAWALPINDI', 'RWP', 'rwp-01', 'rawalpindi'],
    branchName: 'Rawalpindi',
    role: 'Branch Manager',
    managerName: 'Usman Tariq',
    email: 'rwp@ajecodrive.com',
    allowedHashes: [HASH_PASSWORD, HASH_PASSWORD123],
    isSuperAdmin: false
  },
  {
    branchCode: 'ADMIN',
    aliases: ['ADMIN', 'SUPERADMIN', 'admin@ajecodrive.com', 'admin', 'superadmin'],
    branchName: 'All Branches',
    role: 'Super Admin',
    managerName: 'Super Admin',
    email: 'admin@ajecodrive.com',
    allowedHashes: [HASH_PASSWORD, HASH_PASSWORD123, HASH_ADMIN, HASH_ADMIN123],
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

// --- Password Reset Flow (Mock) ---
const otpStore = new Map()

export async function generateResetOtp(email) {
  if (!email) throw new Error('Email is required.')
  const cleanEmail = email.trim().toLowerCase()
  
  // Requirement 14: Do not reveal if email exists.
  // We generate an OTP and store it, regardless of if the email exists in our DB,
  // so an attacker can't use timing or errors to guess emails.
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  const expiresAt = Date.now() + 10 * 60 * 1000 // 10 mins expiration
  
  otpStore.set(cleanEmail, { otp, expiresAt })
  
  // Mock sending email - output to console for easy testing
  console.log(`[MOCK EMAIL] Password reset requested for ${cleanEmail}. Your OTP is: ${otp}`)
  
  return true
}

export async function verifyResetOtp(email, otp) {
  if (!email || !otp) throw new Error('Email and code are required.')
  
  const cleanEmail = email.trim().toLowerCase()
  const record = otpStore.get(cleanEmail)
  
  if (!record) {
    throw new Error('Invalid or expired verification code.')
  }
  
  if (Date.now() > record.expiresAt) {
    otpStore.delete(cleanEmail)
    throw new Error('Verification code has expired.')
  }
  
  if (record.otp !== otp.trim()) {
    throw new Error('Invalid verification code.')
  }
  
  // OTP valid. Generate a temporary token for the next step.
  const tempToken = crypto.randomUUID()
  record.tempToken = tempToken
  
  return tempToken
}

export async function resetPassword(email, tempToken, newPassword) {
  if (!email || !tempToken || !newPassword) throw new Error('Missing required fields.')
  
  const cleanEmail = email.trim().toLowerCase()
  const record = otpStore.get(cleanEmail)
  
  // Validate token to prevent unauthorized resets
  if (!record || record.tempToken !== tempToken) {
    throw new Error('Unauthorized or expired session. Please start the reset process again.')
  }
  
  const account = BRANCH_ACCOUNTS.find(acc => acc.email.toLowerCase() === cleanEmail)
  if (account) {
    // Hash and store the new password securely
    const newHash = await hashPassword(newPassword.trim())
    
    // Add the new hash to the branch's allowed hashes
    account.allowedHashes.push(newHash)
  }
  
  // Cleanup the OTP/token record
  otpStore.delete(cleanEmail)
  return true
}
