import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Film, Search, Bell, User, LogOut, Settings, Heart,
  Ticket, ChevronDown, Menu, X, Star, Shield, Globe
} from 'lucide-react'
import { logout } from '../../slices/authSlice'
import { setSearchQuery } from '../../slices/moviesSlice'
import { openModal, setLanguage } from '../../slices/uiSlice'
import { useI18n } from '../../context/I18nContext'
import styles from './Navbar.module.css'

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated } = useSelector(s => s.auth)
  const { searchQuery } = useSelector(s => s.movies)
  const { language } = useSelector(s => s.ui)
  const { t } = useI18n()

  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const searchRef = useRef()
  const dropdownRef = useRef()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => dispatch(setSearchQuery(searchVal)), 300)
    return () => clearTimeout(timer)
  }, [searchVal, dispatch])

  useEffect(() => {
    setMobileOpen(false)
    setDropdownOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  const navLinks = [
    { label: t('movies'), path: '/movies' },
    { label: t('nowShowing'), path: '/movies?cat=now_showing' },
    { label: t('comingSoon'), path: '/movies?cat=coming_soon' },
  ]

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <Film size={22} strokeWidth={2.5} className={styles.logoIcon} />
          <span className={styles.logoText}>
            <span className={styles.logoHighlight}>CINE</span>MAX
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className={styles.navLinks}>
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`${styles.navLink} ${location.pathname === link.path ? styles.active : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Controls */}
        <div className={styles.controls}>
          {/* Search */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 240, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className={styles.searchBox}
              >
                <Search size={16} className={styles.searchIcon} />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder={t('search')}
                  value={searchVal}
                  onChange={e => setSearchVal(e.target.value)}
                  className={styles.searchInput}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      navigate('/movies')
                      setSearchOpen(false)
                    }
                  }}
                  autoFocus
                />
                {searchVal && (
                  <button onClick={() => { setSearchVal(''); dispatch(setSearchQuery('')) }} className={styles.searchClear}>
                    <X size={14} />
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          <button
            className={styles.iconBtn}
            onClick={() => {
              setSearchOpen(v => !v)
              if (!searchOpen) setTimeout(() => searchRef.current?.focus(), 100)
            }}
            title="Search"
          >
            {searchOpen ? <X size={18} /> : <Search size={18} />}
          </button>

          {/* Language */}
          <button
            className={styles.iconBtn}
            onClick={() => dispatch(setLanguage(language === 'en' ? 'ar' : 'en'))}
            title="Toggle Language"
          >
            <Globe size={18} />
          </button>

          {/* Auth */}
          {isAuthenticated ? (
            <div className={styles.userMenu} ref={dropdownRef}>
              <button
                className={styles.userBtn}
                onClick={() => setDropdownOpen(v => !v)}
              >
                <div className={styles.avatar}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className={styles.userName}>{user?.name?.split(' ')[0]}</span>
                <ChevronDown size={14} className={dropdownOpen ? styles.chevronUp : ''} />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className={styles.dropdown}
                  >
                    <div className={styles.dropdownHeader}>
                      <div className={styles.dropdownAvatar}>{user?.name?.charAt(0).toUpperCase()}</div>
                      <div>
                        <div className={styles.dropdownName}>{user?.name}</div>
                        <div className={styles.dropdownEmail}>{user?.email}</div>
                        {user?.role === 'admin' && (
                          <span className="badge badge-crimson" style={{ fontSize: 10 }}>Admin</span>
                        )}
                      </div>
                    </div>
                    <div className={styles.dropdownDivider} />
                    <Link to="/profile" className={styles.dropdownItem}>
                      <User size={15} /> {t('myProfile')}
                    </Link>
                    <Link to="/bookings" className={styles.dropdownItem}>
                      <Ticket size={15} /> {t('myBookings')}
                    </Link>
                    <Link to="/wishlist" className={styles.dropdownItem}>
                      <Heart size={15} /> {t('myWishlist')}
                    </Link>
                    {user?.role === 'admin' && (
                      <>
                        <div className={styles.dropdownDivider} />
                        <Link to="/admin" className={styles.dropdownItem}>
                          <Shield size={15} /> {t('adminPanel')}
                        </Link>
                      </>
                    )}
                    <div className={styles.dropdownDivider} />
                    <button className={`${styles.dropdownItem} ${styles.logoutItem}`} onClick={handleLogout}>
                      <LogOut size={15} /> {t('signOut')}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className={styles.authBtns}>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/login')}>{t('signIn')}</button>
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/register')}>{t('joinNow')}</button>
            </div>
          )}

          {/* Mobile Toggle */}
          <button className={`${styles.iconBtn} ${styles.mobileToggle}`} onClick={() => setMobileOpen(v => !v)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={styles.mobileMenu}
          >
            {navLinks.map(link => (
              <Link key={link.path} to={link.path} className={styles.mobileLink}>
                {link.label}
              </Link>
            ))}
            {!isAuthenticated ? (
              <div className={styles.mobileAuth}>
                <button className="btn btn-outline btn-sm" onClick={() => navigate('/login')}>{t('signIn')}</button>
                <button className="btn btn-primary btn-sm" onClick={() => navigate('/register')}>{t('joinNow')}</button>
              </div>
            ) : (
              <button className={`${styles.mobileLink} ${styles.logoutMobile}`} onClick={handleLogout}>
                <LogOut size={16} /> {t('signOut')}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
