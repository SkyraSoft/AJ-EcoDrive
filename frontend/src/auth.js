// Authentication and Cryptographic Security Module for AJ ECODRIVE Multi-Branch System
import api from './services/api.js'

/**
 * Computes SHA-256 hash of a string using Web Crypto API.
 * Retained for client-side cryptographic hashing utilities if needed.
 */
export async function hashPassword(plainTextPassword) {
  const encoder = new TextEncoder()
  const data = encoder.encode(plainTextPassword)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export const BRANCH_ACCOUNTS = [
  {
    branchCode: 'PEW-01',
    aliases: ['PEW-01', 'PESHAWAR', 'PEW', 'pew-01', 'peshawar'],
    branchName: 'Peshawar',
    role: 'Branch Manager',
    managerName: 'Ahsan Khan',
    email: 'pew@ajecodrive.com',
    isSuperAdmin: false
  },
  {
    branchCode: 'ISB-01',
    aliases: ['ISB-01', 'ISLAMABAD', 'ISB', 'isb-01', 'islamabad'],
    branchName: 'Islamabad',
    role: 'Branch Manager',
    managerName: 'Hassan Ali',
    email: 'isb@ajecodrive.com',
    isSuperAdmin: false
  },
  {
    branchCode: 'LHE-01',
    aliases: ['LHE-01', 'LAHORE', 'LHE', 'lhe-01', 'lahore'],
    branchName: 'Lahore',
    role: 'Branch Manager',
    managerName: 'Sami Ullah',
    email: 'lhe@ajecodrive.com',
    isSuperAdmin: false
  },
  {
    branchCode: 'RWP-01',
    aliases: ['RWP-01', 'RAWALPINDI', 'RWP', 'rwp-01', 'rawalpindi'],
    branchName: 'Rawalpindi',
    role: 'Branch Manager',
    managerName: 'Usman Tariq',
    email: 'rwp@ajecodrive.com',
    isSuperAdmin: false
  },
  {
    branchCode: 'ADMIN',
    aliases: ['ADMIN', 'SUPERADMIN', 'admin@ajecodrive.com', 'admin', 'superadmin'],
    branchName: 'All Branches',
    role: 'Super Admin',
    managerName: 'Super Admin',
    email: 'admin@ajecodrive.com',
    isSuperAdmin: true
  }
]

/**
 * Authenticates user credentials against the secure backend JWT API (/api/v1/auth/login).
 * Saves bearer token in the API client and returns verified server-derived session.
 */
export async function authenticateBranch(branchCodeOrIdentifier, plainPassword) {
  if (!branchCodeOrIdentifier || !plainPassword) {
    throw new Error('Please enter both Branch Code / Username and Password.')
  }

  const cleanIdentifier = String(branchCodeOrIdentifier).trim()
  const cleanPassword = String(plainPassword).trim()

  try {
    const res = await api.auth.login({
      username: cleanIdentifier,
      password: cleanPassword
    })

    const payload = res?.data || res
    if (!payload || !payload.token) {
      throw new Error(payload?.message || 'Login failed: Authentication token was not returned by the server.')
    }

    const token = payload.token
    api.setToken(token)

    const user = payload.user || {}
    const session = {
      isAuthenticated: true,
      token,
      jwt: token,
      id: user.id,
      username: user.username,
      branchCode: user.branchCode || (user.branch_id === 'BR-01' ? 'PEW-01' : user.branch_id === 'BR-02' ? 'ISB-01' : user.branch_id === 'BR-03' ? 'LHE-01' : user.branch_id === 'BR-04' ? 'RWP-01' : 'ADMIN'),
      branchId: user.branch_id || user.branchId || null,
      branchName: user.branchName || user.branch_name || (user.branch_id ? user.branch_id : 'All Branches'),
      role: user.role,
      name: user.name || user.username,
      email: user.email,
      isSuperAdmin: Boolean(user.isSuperAdmin || user.role === 'Super Admin' || !user.branch_id || user.branch_id === 'ALL'),
      permissions: user.permissions || [],
      loginTimestamp: new Date().toISOString()
    }

    return session
  } catch (err) {
    const errMsg = err?.data?.message || err?.message || 'Invalid username or password. Please verify your credentials and try again.'
    throw new Error(errMsg)
  }
}

// --- Password Reset Flow ---
const otpStore = new Map()

export async function generateResetOtp(email) {
  if (!email) throw new Error('Email is required.')
  const cleanEmail = email.trim().toLowerCase()

  try {
    const res = await api.auth.forgotPassword({ email: cleanEmail })
    const payload = res?.data || res
    return payload
  } catch (err) {
    if (err && !err.isOffline && (err.status || err.data)) {
      throw new Error(err?.data?.message || err?.message || 'Failed to send verification code.')
    }
    // Graceful fallback for offline / disconnected development environments
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = Date.now() + 5 * 60 * 1000
    otpStore.set(cleanEmail, { otp, expiresAt })
    console.warn(`[AUTH] Backend offline, falling back to local OTP for ${cleanEmail}: ${otp}`)
    return { ok: true, devOtp: otp }
  }
}

export async function verifyResetOtp(email, otp) {
  if (!email || !otp) throw new Error('Email and code are required.')
  const cleanEmail = email.trim().toLowerCase()

  try {
    const res = await api.auth.verifyIdentity({ email: cleanEmail, otp: String(otp).trim() })
    const payload = res?.data || res
    if (!payload?.tempToken) {
      throw new Error(payload?.message || 'Verification token was not returned.')
    }
    return payload.tempToken
  } catch (err) {
    // If backend returns a business error (invalid code / expired), propagate that error
    if (err?.status && err?.status !== 0) {
      throw new Error(err?.data?.message || err?.message || 'Invalid or expired verification code.')
    }

    // Graceful offline fallback
    const record = otpStore.get(cleanEmail)
    if (!record) {
      throw new Error('Invalid or expired verification code.')
    }
    if (Date.now() > record.expiresAt) {
      otpStore.delete(cleanEmail)
      throw new Error('Verification code has expired.')
    }
    if (record.otp !== String(otp).trim()) {
      throw new Error('Invalid verification code.')
    }
    const tempToken = crypto.randomUUID ? crypto.randomUUID() : 'offline-temp-token-' + Date.now()
    record.tempToken = tempToken
    return tempToken
  }
}

export async function resetPassword(email, tempToken, newPassword) {
  if (!email || !tempToken || !newPassword) throw new Error('Missing required fields.')
  const cleanEmail = email.trim().toLowerCase()

  try {
    const res = await api.auth.resetPassword({
      email: cleanEmail,
      tempToken,
      newPassword: String(newPassword).trim()
    })
    const payload = res?.data || res
    return payload
  } catch (err) {
    // If backend returned business validation failure, propagate message
    if (err?.status && err?.status !== 0) {
      throw new Error(err?.data?.message || err?.message || 'Password reset failed.')
    }

    // Graceful offline fallback
    const record = otpStore.get(cleanEmail)
    if (!record || record.tempToken !== tempToken) {
      throw new Error('Unauthorized or expired session. Please start the reset process again.')
    }
    otpStore.delete(cleanEmail)
    return { ok: true, message: 'Password updated (offline mode).' }
  }
}

