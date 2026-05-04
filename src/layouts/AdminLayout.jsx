import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Film, Users, Ticket, BarChart2,
  LogOut, Menu, X, ChevronRight, Bell, Clapperboard
} from 'lucide-react'
import { logout } from '../slices/authSlice'
import styles from './AdminLayout.module.css'

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/movies', label: 'Movies', icon: Film },
  { to: '/admin/bookings', label: 'Bookings', icon: Ticket },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart2 },
]

const AdminLayout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector(s => s.auth)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [notifOpen, setNotifOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ duration: 0.25 }}
            className={styles.sidebar}
          >
            {/* Logo */}
            <div className={styles.sidebarLogo}>
              <Clapperboard size={22} className={styles.logoIcon} />
              <span className={styles.logoText}><span style={{ color: 'var(--color-crimson)' }}>CINE</span>MAX</span>
              <span className={styles.adminBadge}>ADMIN</span>
            </div>

            {/* Nav */}
            <nav className={styles.nav}>
              {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navActive : ''}`}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </NavLink>
              ))}
            </nav>

            {/* Sidebar Footer */}
            <div className={styles.sidebarFooter}>
              <div className={styles.userInfo}>
                <div className={styles.userAvatar}>{user?.name?.charAt(0)}</div>
                <div>
                  <div className={styles.userName}>{user?.name}</div>
                  <div className={styles.userRole}>Administrator</div>
                </div>
              </div>
              <button className={styles.logoutBtn} onClick={handleLogout} title="Sign Out">
                <LogOut size={16} />
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className={`${styles.main} ${!sidebarOpen ? styles.mainFull : ''}`}>
        {/* Topbar */}
        <header className={styles.topbar}>
          <button className={styles.menuBtn} onClick={() => setSidebarOpen(v => !v)}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className={styles.breadcrumb}>
            <span>Admin</span>
            <ChevronRight size={14} />
            <span style={{ color: 'var(--color-crimson-light)' }}>Dashboard</span>
          </div>
          <div className={styles.topbarRight}>
            <div style={{ position: 'relative' }}>
              <button 
                className={styles.iconBtn} 
                title="Notifications"
                onClick={() => setNotifOpen(!notifOpen)}
              >
                <Bell size={18} />
                <span className={styles.notifBadge}>3</span>
              </button>
              
              <AnimatePresence>
                {notifOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={styles.notifDropdown}
                  >
                    <div className={styles.notifHeader}>
                      <h4 style={{ fontSize: '14px', margin: 0 }}>Notifications</h4>
                      <button className="btn btn-ghost" style={{ padding: '2px 6px', fontSize: '11px' }} onClick={() => setNotifOpen(false)}>Mark all as read</button>
                    </div>
                    <div className={styles.notifList}>
                      <div className={styles.notifItem}>
                        <div className={styles.notifDot}></div>
                        <div>
                          <p style={{ fontSize: '13px', margin: 0 }}><strong>New Booking</strong> from Ahmed</p>
                          <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>2 mins ago</span>
                        </div>
                      </div>
                      <div className={styles.notifItem}>
                        <div className={styles.notifDot}></div>
                        <div>
                          <p style={{ fontSize: '13px', margin: 0 }}><strong>Spider-Man</strong> movie added</p>
                          <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>1 hour ago</span>
                        </div>
                      </div>
                      <div className={styles.notifItem}>
                        <div className={styles.notifDot}></div>
                        <div>
                          <p style={{ fontSize: '13px', margin: 0 }}>System update completed</p>
                          <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Yesterday</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/')}>
              ← Back to Site
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
