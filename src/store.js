import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import moviesReducer from './slices/moviesSlice'
import bookingReducer from './slices/bookingSlice'
import uiReducer from './slices/uiSlice'
import adminReducer from './slices/adminSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    movies: moviesReducer,
    booking: bookingReducer,
    ui: uiReducer,
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export default store
