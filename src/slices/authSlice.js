import { createSlice, current } from '@reduxjs/toolkit'
import { SEED_USERS } from '../data/seedData'

// Initialize localStorage with seed data if empty
const initializeUsers = () => {
  const existing = localStorage.getItem('cinemax_users')
  if (!existing) {
    localStorage.setItem('cinemax_users', JSON.stringify(SEED_USERS))
    return SEED_USERS
  }
  return JSON.parse(existing)
}

const getStoredSession = () => {
  try {
    const session = localStorage.getItem('cinemax_session')
    return session ? JSON.parse(session) : null
  } catch {
    return null
  }
}

const initialState = {
  user: getStoredSession(),
  users: initializeUsers(),
  isAuthenticated: !!getStoredSession(),
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true
      state.error = null
    },
    loginSuccess: (state, action) => {
      state.loading = false
      state.user = action.payload
      state.isAuthenticated = true
      state.error = null
      localStorage.setItem('cinemax_session', JSON.stringify(action.payload))
    },
    loginFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      localStorage.removeItem('cinemax_session')
    },
    registerSuccess: (state, action) => {
      state.users.push(action.payload)
      localStorage.setItem('cinemax_users', JSON.stringify(state.users))
    },
    updateProfile: (state, action) => {
      const idx = state.users.findIndex(u => u.id === action.payload.id)
      if (idx !== -1) {
        state.users[idx] = { ...state.users[idx], ...action.payload }
        localStorage.setItem('cinemax_users', JSON.stringify(state.users))
      }
      if (state.user?.id === action.payload.id) {
        state.user = { ...state.user, ...action.payload }
        localStorage.setItem('cinemax_session', JSON.stringify(state.user))
      }
    },
    toggleWishlist: (state, action) => {
      const movieId = action.payload
      if (!state.user) return
      const wishlist = state.user.wishlist || []
      state.user.wishlist = wishlist.includes(movieId)
        ? wishlist.filter(id => id !== movieId)
        : [...wishlist, movieId]
      localStorage.setItem('cinemax_session', JSON.stringify(current(state.user)))
      const idx = state.users.findIndex(u => u.id === state.user.id)
      if (idx !== -1) {
        state.users[idx].wishlist = state.user.wishlist
        localStorage.setItem('cinemax_users', JSON.stringify(current(state.users)))
      }
    },
    toggleFavorite: (state, action) => {
      const movieId = action.payload
      if (!state.user) return
      const favorites = state.user.favorites || []
      state.user.favorites = favorites.includes(movieId)
        ? favorites.filter(id => id !== movieId)
        : [...favorites, movieId]
      localStorage.setItem('cinemax_session', JSON.stringify(current(state.user)))
    },
    clearError: (state) => {
      state.error = null
    },
  },
})

export const {
  loginStart, loginSuccess, loginFailure, logout,
  registerSuccess, updateProfile, toggleWishlist, toggleFavorite, clearError,
} = authSlice.actions

export default authSlice.reducer
