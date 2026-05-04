import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Confetti from 'react-confetti'
import { QRCodeSVG } from 'qrcode.react'
import { CheckCircle, Download, Home, Ticket, Calendar, MapPin, Clock } from 'lucide-react'
import { clearSuccess } from '../../slices/bookingSlice'
import styles from './BookingConfirmation.module.css'

const BookingConfirmation = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { lastBooking } = useSelector(s => s.booking)
  const [showConfetti, setShowConfetti] = useState(true)
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight })

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  if (!lastBooking) return (
    <div style={{ textAlign: 'center', padding: '60px 24px' }}>
      <h3>No booking found</h3>
      <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/movies')}>Browse Movies</button>
    </div>
  )

  return (
    <div className={styles.confirmation}>
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
          colors={['#dc2626', '#f59e0b', '#7c3aed', '#fff', '#4ade80']}
        />
      )}

      {/* Success Header */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={styles.successIcon}
      >
        <CheckCircle size={60} style={{ color: '#4ade80' }} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={styles.successText}
      >
        <h2 className={styles.title}>Booking Confirmed! 🎉</h2>
        <p className={styles.subtitle}>Your tickets are ready. See you at the cinema!</p>
      </motion.div>

      {/* Ticket Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={styles.ticket}
      >
        {/* Ticket Header */}
        <div className={styles.ticketHeader}>
          <div className={styles.ticketLogo}>🎬 CINEMAX</div>
          <div className={styles.ticketId}>#{lastBooking.id}</div>
        </div>

        {/* Ticket Body */}
        <div className={styles.ticketBody}>
          <div className={styles.ticketLeft}>
            <h3 className={styles.movieTitle}>{lastBooking.movieTitle}</h3>

            <div className={styles.ticketDetails}>
              <div className={styles.detail}>
                <Calendar size={15} className={styles.detailIcon} />
                <div>
                  <div className={styles.detailLabel}>Date</div>
                  <div className={styles.detailValue}>{lastBooking.date}</div>
                </div>
              </div>
              <div className={styles.detail}>
                <Clock size={15} className={styles.detailIcon} />
                <div>
                  <div className={styles.detailLabel}>Time</div>
                  <div className={styles.detailValue}>{lastBooking.showtime}</div>
                </div>
              </div>
              <div className={styles.detail}>
                <MapPin size={15} className={styles.detailIcon} />
                <div>
                  <div className={styles.detailLabel}>Cinema</div>
                  <div className={styles.detailValue}>{lastBooking.cinema}</div>
                </div>
              </div>
              <div className={styles.detail}>
                <Ticket size={15} className={styles.detailIcon} />
                <div>
                  <div className={styles.detailLabel}>Seats</div>
                  <div className={styles.detailValue}>{lastBooking.seats?.join(', ')}</div>
                </div>
              </div>
            </div>

            <div className={styles.totalRow}>
              <span>Total Paid</span>
              <span className={styles.total}>EGP {lastBooking.totalPrice}</span>
            </div>
          </div>

          {/* Separator */}
          <div className={styles.separator}>
            <div className={styles.notchTop} />
            <div className={styles.dashes} />
            <div className={styles.notchBottom} />
          </div>

          {/* QR Code */}
          <div className={styles.qrSection}>
            <div className={styles.qrWrap}>
              <QRCodeSVG
                value={lastBooking.qrCode || lastBooking.id}
                size={120}
                bgColor="transparent"
                fgColor="#f0f0f5"
                level="H"
              />
            </div>
            <div className={styles.qrLabel}>Scan at entrance</div>
            <div className={styles.qrCode}>{lastBooking.qrCode?.slice(0, 16)}</div>
          </div>
        </div>

        {/* Ticket Footer */}
        <div className={styles.ticketFooter}>
          <span className="badge badge-green">✓ Confirmed</span>
          <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
            Booked on {new Date(lastBooking.bookingDate).toLocaleDateString()}
          </span>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className={styles.actions}
      >
        <button
          className="btn btn-outline"
          onClick={() => { dispatch(clearSuccess()); navigate('/bookings') }}
        >
          <Ticket size={16} /> My Bookings
        </button>
        <button
          className="btn btn-primary btn-lg"
          onClick={() => { dispatch(clearSuccess()); navigate('/') }}
        >
          <Home size={16} /> Back to Home
        </button>
      </motion.div>
    </div>
  )
}

export default BookingConfirmation
