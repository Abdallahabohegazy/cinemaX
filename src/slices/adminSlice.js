import { createSlice } from '@reduxjs/toolkit'
import { REVENUE_DATA, GENRE_STATS } from '../data/seedData'

const initialState = {
  revenueData: REVENUE_DATA,
  genreStats: GENRE_STATS,
  sidebarOpen: true,
  activeSection: 'dashboard',
  stats: {
    totalRevenue: 463100,
    totalBookings: 3366,
    activeUsers: 1247,
    moviesScreened: 20,
    occupancyRate: 78,
    avgTicketPrice: 137,
  },
}

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setActiveSection: (state, action) => {
      state.activeSection = action.payload
    },
    toggleAdminSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    updateStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload }
    },
  },
})

export const { setActiveSection, toggleAdminSidebar, updateStats } = adminSlice.actions
export default adminSlice.reducer
