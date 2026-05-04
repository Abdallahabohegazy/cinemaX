/**
 * CineMax - Input sanitization & helper utilities
 */

/** Sanitize plain text inputs (strip HTML tags) */
export const sanitizeText = (str = '') =>
  String(str).replace(/<[^>]*>/g, '').trim()

/** Format currency */
export const formatCurrency = (amount, currency = 'EGP') =>
  `${currency} ${Number(amount).toLocaleString()}`

/** Format date to readable string */
export const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

/** Truncate long strings */
export const truncate = (str = '', maxLen = 100) =>
  str.length > maxLen ? str.slice(0, maxLen) + '…' : str

/** Generate unique ID */
export const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

/** Debounce function */
export const debounce = (fn, delay) => {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

/** Clamp a number between min and max */
export const clamp = (val, min, max) => Math.min(Math.max(val, min), max)

/** Format runtime duration */
export const formatDuration = (minutes) => {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

/** Simple email validator */
export const isValidEmail = (email = '') =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

/** Password strength checker - returns 0-4 */
export const passwordStrength = (password = '') => {
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return score
}

/** Stars array from rating (out of 5) */
export const getRatingStars = (rating, maxRating = 10) => {
  const outOf5 = (rating / maxRating) * 5
  return Array.from({ length: 5 }, (_, i) => {
    if (i < Math.floor(outOf5)) return 'full'
    if (i < outOf5) return 'half'
    return 'empty'
  })
}

/** Get today + N days as ISO date strings */
export const getNextNDates = (n = 7) =>
  Array.from({ length: n }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return d.toISOString().split('T')[0]
  })
