import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Ticket, Clock, MapPin, X, Download, QrCode, Filter } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { cancelBooking } from '../slices/bookingSlice'
import toast from 'react-hot-toast'
import styles from './Bookings.module.css'

const Bookings = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector(s => s.auth)
  const { bookings } = useSelector(s => s.booking)
  const [filter, setFilter] = useState('all')
  const [selectedBooking, setSelectedBooking] = useState(null)

  const userBookings = bookings.filter(b => b.userId === user?.id)
  const filtered = filter === 'all' ? userBookings : userBookings.filter(b => b.status === filter)

  const handleCancel = (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      dispatch(cancelBooking(id))
      toast.success('Booking cancelled')
    }
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>My Bookings</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>
              {filtered.length} booking{filtered.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className={styles.tabs}>
          {[
            { value: 'all', label: 'All' },
            { value: 'confirmed', label: '✓ Confirmed' },
            { value: 'cancelled', label: '✗ Cancelled' },
          ].map(tab => (
            <button
              key={tab.value}
              className={`${styles.tab} ${filter === tab.value ? styles.tabActive : ''}`}
              onClick={() => setFilter(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <Ticket size={48} style={{ color: 'var(--color-text-secondary)', marginBottom: 12 }} />
            <h3>No bookings found</h3>
            <p>Time to book your first movie!</p>
            <button className="btn btn-primary" onClick={() => navigate('/movies')}>Browse Movies</button>
          </div>
        ) : (
          <div className={styles.list}>
            {filtered.map((booking, i) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className={`${styles.card} ${booking.status === 'cancelled' ? styles.cardCancelled : ''}`}
              >
                <div className={styles.cardLeft}>
                  {booking.poster && (
                    <img
                      src={booking.poster}
                      alt={booking.movieTitle}
                      className={styles.poster}
                      onError={e => { e.target.src = `https://placehold.co/70x100/1a1a2e/dc2626?text=${booking.movieTitle[0]}` }}
                    />
                  )}
                  <div className={styles.cardInfo}>
                    <div className={styles.cardTitle}>{booking.movieTitle}</div>
                    <div className={styles.cardMeta}>
                      <div><Clock size={13} /> {booking.date} — {booking.showtime}</div>
                      <div><MapPin size={13} /> {booking.cinema}</div>
                      <div><Ticket size={13} /> Seats: {booking.seats?.join(', ')}</div>
                    </div>
                    <div className={styles.cardId}>Ref: {booking.id}</div>
                  </div>
                </div>
                <div className={styles.cardRight}>
                  <span className={`badge ${booking.status === 'confirmed' ? 'badge-green' : 'badge-crimson'}`}>
                    {booking.status}
                  </span>
                  <div className={styles.cardPrice}>EGP {booking.totalPrice}</div>
                  <div className={styles.cardActions}>
                    {booking.status === 'confirmed' && (
                      <>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => setSelectedBooking(booking)}
                          title="View QR"
                        >
                          <QrCode size={15} /> QR
                        </button>
                        <button
                          className="btn btn-outline btn-sm"
                          style={{ color: 'var(--color-crimson-light)', borderColor: 'rgba(220,38,38,0.3)' }}
                          onClick={() => handleCancel(booking.id)}
                        >
                          <X size={14} /> Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* QR Modal */}
      {selectedBooking && (
        <div
          className="overlay"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 'var(--z-modal)' }}
          onClick={() => setSelectedBooking(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={e => e.stopPropagation()}
            style={{
              background: 'rgba(12,12,22,0.98)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              padding: '32px',
              maxWidth: '340px',
              width: '90vw',
              textAlign: 'center',
            }}
          >
            <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: 8 }}>{selectedBooking.movieTitle}</h3>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 20 }}>
              {selectedBooking.date} — {selectedBooking.showtime}
            </p>
            <div style={{ display: 'inline-block', padding: 16, background: 'white', borderRadius: 12 }}>
              <QRCodeSVG value={selectedBooking.qrCode || selectedBooking.id} size={160} />
            </div>
            <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 16 }}>
              Seats: {selectedBooking.seats?.join(', ')} — EGP {selectedBooking.totalPrice}
            </p>
            <button className="btn btn-ghost btn-sm" style={{ marginTop: 16 }} onClick={() => setSelectedBooking(null)}>
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Bookings
