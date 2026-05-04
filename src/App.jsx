import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'
import PageLoader from './components/ui/PageLoader'

// Lazy-load all pages for code splitting
const Home         = lazy(() => import('./pages/Home'))
const Movies       = lazy(() => import('./pages/Movies'))
const MovieDetail  = lazy(() => import('./pages/MovieDetail'))
const BookingPage  = lazy(() => import('./pages/BookingPage'))
const Bookings     = lazy(() => import('./pages/Bookings'))
const Login        = lazy(() => import('./pages/auth/Login'))
const Register     = lazy(() => import('./pages/auth/Register'))
const Profile      = lazy(() => import('./pages/user/Profile'))
const Wishlist     = lazy(() => import('./pages/user/Wishlist'))

// Admin pages
const AdminDashboard  = lazy(() => import('./pages/admin/Dashboard'))
const AdminMovies     = lazy(() => import('./pages/admin/AdminMovies'))
const AdminBookings   = lazy(() => import('./pages/admin/AdminBookings'))
const AdminUsers      = lazy(() => import('./pages/admin/AdminUsers'))
const AdminAnalytics  = lazy(() => import('./pages/admin/AdminAnalytics'))

// Route guards
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(s => s.auth)
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector(s => s.auth)
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (user?.role !== 'admin') return <Navigate to="/" replace />
  return children
}

const GuestRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(s => s.auth)
  return !isAuthenticated ? children : <Navigate to="/" replace />
}

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes under main layout */}
        <Route element={<MainLayout />}>
          <Route path="/"            element={<Home />} />
          <Route path="/movies"      element={<Movies />} />
          <Route path="/movie/:id"   element={<MovieDetail />} />

          {/* Guest-only */}
          <Route path="/login"    element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

          {/* Protected user routes */}
          <Route path="/booking/:id" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
          <Route path="/bookings"    element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
          <Route path="/profile"     element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/wishlist"    element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index              element={<AdminDashboard />} />
          <Route path="movies"     element={<AdminMovies />} />
          <Route path="bookings"   element={<AdminBookings />} />
          <Route path="users"      element={<AdminUsers />} />
          <Route path="analytics"  element={<AdminAnalytics />} />
        </Route>

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App
