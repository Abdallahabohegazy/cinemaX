import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, Film, AlertCircle } from 'lucide-react'
import { loginStart, loginSuccess, loginFailure } from '../../slices/authSlice'
import toast from 'react-hot-toast'
import styles from './Auth.module.css'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { users, loading, error } = useSelector(s => s.auth)

  const [form, setForm] = useState({ email: '', password: '', remember: false })
  const [showPass, setShowPass] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    if (!form.password) e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    dispatch(loginStart())
    setTimeout(() => {
      const user = users.find(u => u.email === form.email && u.password === form.password)
      if (user) {
        const { password, ...safeUser } = user
        dispatch(loginSuccess(safeUser))
        toast.success(`Welcome back, ${user.name.split(' ')[0]}! 🎬`)
        navigate(user.role === 'admin' ? '/admin' : '/')
      } else {
        dispatch(loginFailure('Invalid email or password'))
        toast.error('Invalid credentials')
      }
    }, 800)
  }

  const fillDemo = (role) => {
    if (role === 'admin') setForm({ email: 'admin@cinemax.com', password: 'Admin@123', remember: false })
    else setForm({ email: 'john@example.com', password: 'Password@123', remember: false })
  }

  return (
    <div className={styles.authPage}>
      {/* Background */}
      <div className={styles.bg}>
        <div className={styles.bgGlow1} />
        <div className={styles.bgGlow2} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={styles.card}
      >
        {/* Header */}
        <div className={styles.header}>
          <Link to="/" className={styles.logo}>
            <Film size={28} strokeWidth={2.5} style={{ color: 'var(--color-crimson)', filter: 'drop-shadow(0 0 8px rgba(220,38,38,0.8))' }} />
            <span className={styles.logoText}><span style={{ color: 'var(--color-crimson)' }}>CINE</span>MAX</span>
          </Link>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Sign in to access your cinema experience</p>
        </div>

        {/* Demo Fill Buttons */}
        <div className={styles.demoBtns}>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => fillDemo('user')}>
            👤 Fill User Demo
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => fillDemo('admin')}>
            🛡️ Fill Admin Demo
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.errorAlert}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className={styles.inputWrap}>
              <Mail size={16} className={styles.inputIcon} />
              <input
                type="email"
                className={`form-input ${styles.inputWithIcon} ${errors.email ? 'error' : ''}`}
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              />
            </div>
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className={styles.inputWrap}>
              <Lock size={16} className={styles.inputIcon} />
              <input
                type={showPass ? 'text' : 'password'}
                className={`form-input ${styles.inputWithIcon} ${styles.inputWithRight} ${errors.password ? 'error' : ''}`}
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              />
              <button type="button" className={styles.inputRight} onClick={() => setShowPass(v => !v)}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <div className={styles.rememberRow}>
            <label className={styles.checkLabel}>
              <input
                type="checkbox"
                checked={form.remember}
                onChange={e => setForm(f => ({ ...f, remember: e.target.checked }))}
                className={styles.checkbox}
              />
              Remember me
            </label>
            <a href="#" className={styles.forgotLink}>Forgot password?</a>
          </div>

          <button type="submit" className={`btn btn-primary btn-lg ${styles.submitBtn}`} disabled={loading}>
            {loading ? <span className="spinner" /> : 'Sign In'}
          </button>
        </form>

        <div className={styles.footer}>
          <span>Don't have an account?</span>
          <Link to="/register" className={styles.switchLink}>Create Account</Link>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
