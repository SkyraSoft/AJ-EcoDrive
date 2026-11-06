import crypto from 'crypto'

export const PASSWORD_RULES = {
  minLength: 12,
  requireUpper: true,
  requireLower: true,
  requireNumber: true,
  requireSpecial: true
}

export const COMMON_PASSWORDS_BLACKLIST = [
  'password123',
  'password',
  'admin',
  'admin123',
  'ecodrive2026',
  'changeme123',
  'Password123!',
  'Skyrasoft@2233',
  '12345678',
  'qwertyuiop'
]

/**
 * Validates password complexity against NIST SP 800-63B standards and common password blacklists.
 * @param {string} password 
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validatePasswordComplexity(password) {
  const errors = []
  if (!password || typeof password !== 'string' || !password.trim()) {
    return { valid: false, errors: ['Password is required and cannot be empty.'] }
  }

  const trimmed = password.trim()

  if (trimmed.length < PASSWORD_RULES.minLength) {
    errors.push(`Password must be at least ${PASSWORD_RULES.minLength} characters long.`)
  }

  if (PASSWORD_RULES.requireUpper && !/[A-Z]/.test(trimmed)) {
    errors.push('Password must contain at least one uppercase letter (A-Z).')
  }

  if (PASSWORD_RULES.requireLower && !/[a-z]/.test(trimmed)) {
    errors.push('Password must contain at least one lowercase letter (a-z).')
  }

  if (PASSWORD_RULES.requireNumber && !/[0-9]/.test(trimmed)) {
    errors.push('Password must contain at least one numeric digit (0-9).')
  }

  if (PASSWORD_RULES.requireSpecial && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(trimmed)) {
    errors.push('Password must contain at least one special character.')
  }

  if (COMMON_PASSWORDS_BLACKLIST.includes(trimmed)) {
    errors.push('Password is a known common default or compromised credential and is prohibited.')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Generates a cryptographically strong NIST-compliant password.
 * @param {number} length 
 * @returns {string}
 */
export function generateStrongPassword(length = 16) {
  const uppers = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const lowers = 'abcdefghijkmnopqrstuvwxyz'
  const numbers = '23456789'
  const specials = '!@#$%^&*-_=+'

  const getRandomChar = (chars) => chars[crypto.randomInt(0, chars.length)]

  const required = [
    getRandomChar(uppers),
    getRandomChar(lowers),
    getRandomChar(numbers),
    getRandomChar(specials)
  ]

  const all = uppers + lowers + numbers + specials
  for (let i = required.length; i < length; i++) {
    required.push(getRandomChar(all))
  }

  // Fisher-Yates shuffle
  for (let i = required.length - 1; i > 0; i--) {
    const j = crypto.randomInt(0, i + 1)
    const tmp = required[i]
    required[i] = required[j]
    required[j] = tmp
  }

  return required.join('')
}
