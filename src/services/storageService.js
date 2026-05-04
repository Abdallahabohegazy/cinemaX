/**
 * CineMax - LocalStorage service layer
 * Provides a clean abstraction over raw localStorage with JSON serialisation
 */

const PREFIX = 'cinemax_'

const storageService = {
  /** Read a JSON value from storage */
  get: (key, fallback = null) => {
    try {
      const raw = localStorage.getItem(PREFIX + key)
      return raw ? JSON.parse(raw) : fallback
    } catch {
      return fallback
    }
  },

  /** Write a JSON value to storage */
  set: (key, value) => {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value))
      return true
    } catch {
      return false
    }
  },

  /** Remove a key */
  remove: (key) => {
    localStorage.removeItem(PREFIX + key)
  },

  /** Clear all CineMax keys */
  clear: () => {
    Object.keys(localStorage)
      .filter(k => k.startsWith(PREFIX))
      .forEach(k => localStorage.removeItem(k))
  },

  /** Check if key exists */
  has: (key) => localStorage.getItem(PREFIX + key) !== null,
}

export default storageService
