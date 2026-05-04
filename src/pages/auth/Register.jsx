import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, Phone, Film, AlertCircle } from 'lucide-react'
import { registerSuccess, loginSuccess } from '../../slices/authSlice'
import toast from 'react-hot-toast'
import styles from './Auth.module.css'

const Register = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { users } = useSelector(s => s.auth)

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name || form.name.length < 2) e.name = 'Full name required (min 2 chars)'
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email format'
    else if (users.find(u => u.email === form.email)) e.email = 'Email already registered'
    if (!form.password || form.password.length < 8) e.password = 'Password must be at least 8 characters'
    else if (!/(?=.*[A-Z])(?=.*\d)/.test(form.password)) e.password = 'Must include uppercase & number'
    if (form.confirm !== form.password) e.confirm = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setTimeout(() => {
      const newUser = {
        id: `u${Date.now()}`,
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: 'user',
        avatar: null,
        joinDate: new Date().toISOString().split('T')[0],
        wishlist: [],
        favorites: [],
      }
      dispatch(registerSuccess(newUser))
      const { password, ...safeUser } = newUser
      dispatch(loginSuccess(safeUser))
      toast.success(`Welcome to CineMax, ${form.name.split(' ')[0]}! 🎉`)
      navigate('/')
      setLoading(false)
    }, 1000)
  }

  return (
    <div className={styles.authPage}>
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
        <div className={styles.header}>
          <Link to="/" className={styles.logo}>
            <Film size={28} strokeWidth={2.5} style={{ color: 'var(--color-crimson)' }} />
            <span className={styles.logoText}><span style={{ color: 'var(--color-crimson)' }}>CINE</span>MAX</span>
          </Link>
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>Join millions of cinema lovers worldwide</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.nameRow}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className={styles.inputWrap}>
                <User size={16} className={styles.inputIcon} />
                <input
                  type="text"
                  className={`form-input ${styles.inputWithIcon} ${errors.name ? 'error' : ''}`}
                  placeholder="John Doe"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Phone (Optional)</label>
              <div className={styles.inputWrap}>
                <Phone size={16} className={styles.inputIcon} />
                <input
                  type="tel"
                  className={`form-input ${styles.inputWithIcon}`}
                  placeholder="+1 555-0100"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                />
              </div>
            </div>
          </div>

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
                placeholder="Min. 8 chars with uppercase & number"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              />
              <button type="button" className={styles.inputRight} onClick={() => setShowPass(v => !v)}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div className={styles.inputWrap}>
              <Lock size={16} className={styles.inputIcon} />
              <input
                type="password"
                className={`form-input ${styles.inputWithIcon} ${errors.confirm ? 'error' : ''}`}
                placeholder="Repeat your password"
                value={form.confirm}
                onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
              />
            </div>
            {errors.confirm && <span className="form-error">{errors.confirm}</span>}
          </div>

          <button type="submit" className={`btn btn-primary btn-lg ${styles.submitBtn}`} disabled={loading}>
            {loading ? <span className="spinner" /> : 'Create Account'}
          </button>
        </form>

        <div className={styles.footer}>
          <span>Already have an account?</span>
          <Link to="/login" className={styles.switchLink}>Sign In</Link>
        </div>
      </motion.div>
    </div>
  )
}

export default Register
