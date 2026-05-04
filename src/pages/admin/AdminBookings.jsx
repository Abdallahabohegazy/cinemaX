import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { Search, X, Ticket, CheckCircle, XCircle, Eye } from 'lucide-react'
import { cancelBooking } from '../../slices/bookingSlice'
import toast from 'react-hot-toast'
import styles from './Admin.module.css'

const AdminBookings = () => {
  const dispatch = useDispatch()
  const { bookings } = useSelector(s => s.booking)
  const { users } = useSelector(s => s.auth)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected] = useState(null)

  const filtered = bookings.filter(b => {
    const matchSearch =
      b.movieTitle?.toLowerCase().includes(search.toLowerCase()) ||
      b.id?.toLowerCase().includes(search.toLowerCase()) ||
      b.cinema?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || b.status === statusFilter
    return matchSearch && matchStatus
  })

  const getUserName = (userId) => {
    const u = users.find(u => u.id === userId)
    return u ? u.name : userId
  }

  const totalRevenue = filtered.filter(b => b.status === 'confirmed').reduce((s, b) => s + b.totalPrice, 0)

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Bookings Management</h1>
          <p className={styles.pageSubtitle}>
            {filtered.length} bookings — Revenue: <span style={{ color: 'var(--color-gold)', fontWeight: 700 }}>EGP {totalRevenue.toLocaleString()}</span>
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className={styles.controlBar}>
        <div className={styles.searchWrap}>
          <Search size={15} className={styles.searchIcon} />
          <input className={styles.searchInput} placeholder="Search by movie, ID, cinema..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className={styles.select} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>User</th>
              <th>Movie</th>
              <th>Date & Time</th>
              <th>Seats</th>
              <th>Cinema</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b, i) => (
              <motion.tr key={b.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                <td className={styles.mono}>#{b.id.slice(-8)}</td>
                <td className={styles.bold}>{getUserName(b.userId)}</td>
                <td>{b.movieTitle}</td>
                <td style={{ fontSize: 12 }}>{b.date}<br />{b.showtime}</td>
                <td style={{ fontSize: 12 }}>{b.seats?.join(', ')}</td>
                <td style={{ fontSize: 12 }}>{b.cinema}</td>
                <td style={{ color: 'var(--color-gold)', fontWeight: 700 }}>EGP {b.totalPrice}</td>
                <td>
                  <span className={`badge ${b.status === 'confirmed' ? 'badge-green' : 'badge-crimson'}`}>
                    {b.status === 'confirmed' ? <CheckCircle size={11} /> : <XCircle size={11} />}
                    {' '}{b.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button className="btn btn-ghost btn-icon" title="Details" onClick={() => setSelected(b)}>
                      <Eye size={15} />
                    </button>
                    {b.status === 'confirmed' && (
                      <button
                        className="btn btn-ghost btn-icon"
                        title="Cancel"
                        style={{ color: 'var(--color-crimson-light)' }}
                        onClick={() => { dispatch(cancelBooking(b.id)); toast.success('Booking cancelled') }}
                      >
                        <X size={15} />
                      </button>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>No bookings found.</div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className={styles.modal} onClick={() => setSelected(null)}>
          <motion.div
            className={styles.modalBox}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={e => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Booking Details</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setSelected(null)}><X size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                ['Booking ID', selected.id],
                ['User', getUserName(selected.userId)],
                ['Movie', selected.movieTitle],
                ['Date', selected.date],
                ['Showtime', selected.showtime],
                ['Seats', selected.seats?.join(', ')],
                ['Cinema', selected.cinema],
                ['Hall', selected.hall],
                ['Payment', selected.paymentMethod],
                ['Total', `EGP ${selected.totalPrice}`],
                ['Status', selected.status],
                ['Booked At', new Date(selected.bookingDate).toLocaleString()],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
                  <span style={{ fontWeight: 600, color: label === 'Total' ? 'var(--color-gold)' : 'var(--color-text-primary)' }}>{value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default AdminBookings
