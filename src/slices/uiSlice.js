import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sidebarOpen: false,
  modalOpen: null, // 'login' | 'register' | 'trailer' | etc
  trailerUrl: null,
  theme: 'dark',
  language: 'en',
  isLoading: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload
    },
    openModal: (state, action) => {
      state.modalOpen = action.payload
    },
    closeModal: (state) => {
      state.modalOpen = null
      state.trailerUrl = null
    },
    openTrailer: (state, action) => {
      state.trailerUrl = action.payload
      state.modalOpen = 'trailer'
    },
    setLanguage: (state, action) => {
      state.language = action.payload
      localStorage.setItem('cinemax_lang', action.payload)
    },
    setGlobalLoading: (state, action) => {
      state.isLoading = action.payload
    },
  },
})

export const {
  toggleSidebar, setSidebarOpen, openModal, closeModal,
  openTrailer, setLanguage, setGlobalLoading,
} = uiSlice.actions

export default uiSlice.reducer
