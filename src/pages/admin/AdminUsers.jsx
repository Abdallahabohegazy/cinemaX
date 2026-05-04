import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, UserCheck, UserX, Shield, User, Trash2 } from 'lucide-react'
import { updateProfile } from '../../slices/authSlice'
import toast from 'react-hot-toast'
import styles from './Admin.module.css'

const AdminUsers = () => {
  const dispatch = useDispatch()
  const { users, bookings } = useSelector(s => ({ users: s.auth.users, bookings: s.booking.bookings }))
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [selected, setSelected] = useState(null)

  const filtered = users.filter(u => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'all' || u.role === roleFilter
    return matchSearch && matchRole
  })

  const getUserBookings = (uid) => bookings.filter(b => b.userId === uid)
  const getUserSpend = (uid) => bookings.filter(b => b.userId === uid && b.status === 'confirmed').reduce((s, b) => s + b.totalPrice, 0)

  const toggleRole = (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin'
    dispatch(updateProfile({ ...user, role: newRole }))
    toast.success(`${user.name} is now ${newRole}`)
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>User Management</h1>
          <p className={styles.pageSubtitle}>{users.length} users registered</p>
        </div>
      </div>

      <div className={styles.controlBar}>
        <div className={styles.searchWrap}>
          <Search size={15} className={styles.searchIcon} />
          <input className={styles.searchInput} placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className={styles.select} value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
          <option value="all">All Roles</option>
          <option value="user">Users</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Bookings</th>
              <th>Total Spent</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user, i) => (
              <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                <td>
                  <div style={{
                    width: 34, height: 34, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--color-crimson), #7c3aed)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 700, color: 'white',
                  }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </td>
                <td className={styles.bold}>{user.name}</td>
                <td style={{ fontSize: 12 }}>{user.email}</td>
                <td style={{ fontSize: 12 }}>{user.phone || '—'}</td>
                <td>
                  <span className={`badge ${user.role === 'admin' ? 'badge-crimson' : 'badge-blue'}`}>
                    {user.role === 'admin' ? <Shield size={11} /> : <User size={11} />}
                    {' '}{user.role}
                  </span>
                </td>
                <td style={{ fontSize: 12 }}>{user.joinDate}</td>
                <td style={{ fontWeight: 600, textAlign: 'center' }}>{getUserBookings(user.id).length}</td>
                <td style={{ color: 'var(--color-gold)', fontWeight: 600 }}>EGP {getUserSpend(user.id)}</td>
                <td>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button
                      className="btn btn-ghost btn-icon"
                      title={user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                      onClick={() => toggleRole(user)}
                    >
                      {user.role === 'admin' ? <UserX size={15} /> : <UserCheck size={15} />}
                    </button>
                    <button
                      className="btn btn-ghost btn-icon"
                      title="View Details"
                      onClick={() => setSelected(user)}
                    >
                      <Shield size={15} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>No users found.</div>
        )}
      </div>

      {/* User Details Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div className={styles.modal} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)}>
            <motion.div
              className={styles.modalBox}
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>User Profile</h2>
                <button className="btn btn-ghost btn-icon" onClick={() => setSelected(null)}><X size={18} /></button>
              </div>
              {/* Avatar */}
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--color-crimson), #7c3aed)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 28, fontWeight: 700, color: 'white', margin: '0 auto 12px',
                }}>
                  {selected.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ fontWeight: 700, fontSize: 18 }}>{selected.name}</div>
                <span className={`badge ${selected.role === 'admin' ? 'badge-crimson' : 'badge-blue'}`} style={{ marginTop: 6 }}>{selected.role}</span>
              </div>
              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
                {[
                  { label: 'Bookings', value: getUserBookings(selected.id).length },
                  { label: 'Confirmed', value: getUserBookings(selected.id).filter(b => b.status === 'confirmed').length },
                  { label: 'Spent', value: `EGP ${getUserSpend(selected.id)}` },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-crimson-light)' }}>{s.value}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
              {[
                ['Email', selected.email],
                ['Phone', selected.phone || '—'],
                ['Member Since', selected.joinDate],
                ['Wishlist Items', selected.wishlist?.length || 0],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
                  <span style={{ fontWeight: 600 }}>{value}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminUsers
