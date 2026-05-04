/**
 * CineMax - Mock API service layer
 * Ready to swap with real backend (axios / fetch)
 */
import storageService from './storageService'

const delay = (ms = 400) => new Promise(res => setTimeout(res, ms))

export const movieService = {
  getAll: async () => {
    await delay(200)
    return storageService.get('movies', [])
  },
  getById: async (id) => {
    await delay(100)
    const movies = storageService.get('movies', [])
    return movies.find(m => m.id === id) || null
  },
}

export const bookingService = {
  getAll: async () => {
    await delay(200)
    return storageService.get('bookings', [])
  },
  getByUser: async (userId) => {
    await delay(200)
    const bookings = storageService.get('bookings', [])
    return bookings.filter(b => b.userId === userId)
  },
  create: async (booking) => {
    await delay(500)
    const bookings = storageService.get('bookings', [])
    const newBooking = { ...booking, id: `bk${Date.now()}`, bookingDate: new Date().toISOString() }
    storageService.set('bookings', [newBooking, ...bookings])
    return newBooking
  },
  cancel: async (bookingId) => {
    await delay(300)
    const bookings = storageService.get('bookings', [])
    const updated = bookings.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b)
    storageService.set('bookings', updated)
    return true
  },
}

export const authService = {
  login: async (email, password) => {
    await delay(600)
    const users = storageService.get('users', [])
    const user = users.find(u => u.email === email && u.password === password)
    if (!user) throw new Error('Invalid credentials')
    const { password: _, ...safeUser } = user
    storageService.set('session', safeUser)
    return safeUser
  },
  register: async (userData) => {
    await delay(700)
    const users = storageService.get('users', [])
    if (users.find(u => u.email === userData.email)) throw new Error('Email already exists')
    const newUser = { ...userData, id: `u${Date.now()}`, role: 'user', joinDate: new Date().toISOString().split('T')[0], wishlist: [], favorites: [] }
    storageService.set('users', [...users, newUser])
    const { password: _, ...safeUser } = newUser
    storageService.set('session', safeUser)
    return safeUser
  },
  logout: async () => {
    storageService.remove('session')
  },
  getSession: () => storageService.get('session'),
}
