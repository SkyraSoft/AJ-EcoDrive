/**
 * AJ EcoDrive — Phone Normalization & Validation Utility
 * Standardizes Pakistani mobile and landline formats to canonical E.164-compatible format:
 * Canonical: "+92 3XX XXXXXXX" (15 characters)
 */

export function normalizePhoneNumber(rawPhone) {
  if (!rawPhone || typeof rawPhone !== 'string') return ''

  const cleaned = rawPhone.trim()
  if (!cleaned) return ''

  // Extract digits only
  const digits = cleaned.replace(/\D/g, '')

  // 1. Starts with 92 and 12 digits: e.g. 923135544332 -> +92 313 5544332
  if (digits.startsWith('92') && digits.length === 12) {
    const network = digits.slice(2, 5)
    const subscriber = digits.slice(5)
    return `+92 ${network} ${subscriber}`
  }

  // 2. Starts with 03 and 11 digits: e.g. 03135544332 -> +92 313 5544332
  if (digits.startsWith('03') && digits.length === 11) {
    const network = digits.slice(1, 4)
    const subscriber = digits.slice(4)
    return `+92 ${network} ${subscriber}`
  }

  // 3. 10 digits starting with 3: e.g. 3135544332 -> +92 313 5544332
  if (digits.startsWith('3') && digits.length === 10) {
    const network = digits.slice(0, 3)
    const subscriber = digits.slice(3)
    return `+92 ${network} ${subscriber}`
  }

  // 4. Starts with 0092: e.g. 00923135544332 -> +92 313 5544332
  if (digits.startsWith('0092') && digits.length === 14) {
    const network = digits.slice(4, 7)
    const subscriber = digits.slice(7)
    return `+92 ${network} ${subscriber}`
  }

  // 5. Pakistani Landline format (e.g. 051-2999999 or 091-5812345)
  if (digits.startsWith('0') && digits.length >= 10 && digits.length <= 11) {
    const areaCode = digits.slice(1, 3)
    const number = digits.slice(3)
    return `+92 ${areaCode} ${number}`
  }

  // Fallback: If starts with plus, keep clean digits with +
  if (cleaned.startsWith('+')) {
    return `+${digits}`
  }

  return digits || cleaned
}

/**
 * Validates whether string is a plausible Pakistani phone number
 */
export function isValidPhoneNumber(rawPhone) {
  if (!rawPhone || typeof rawPhone !== 'string') return false
  const digits = rawPhone.replace(/\D/g, '')
  // Must have at least 10 digits and not more than 15
  return digits.length >= 10 && digits.length <= 15
}
