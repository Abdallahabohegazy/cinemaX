import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { CreditCard, Smartphone, Wallet, ChevronLeft, Lock, Shield } from 'lucide-react'
import { confirmBooking } from '../../slices/bookingSlice'
import toast from 'react-hot-toast'
import styles from './Checkout.module.css'

const PAYMENT_METHODS = [
  { id: 'visa', label: 'Visa / Mastercard', icon: CreditCard, hint: '4111 1111 1111 1111' },
  { id: 'applepay', label: 'Apple Pay', icon: Smartphone, hint: 'Pay with Face ID or Touch ID' },
  { id: 'wallet', label: 'CineMax Wallet', icon: Wallet, hint: 'Balance: EGP 500.00' },
]

const Checkout = ({ movie, booking, userId, onBack }) => {
  const dispatch = useDispatch()
  const [method, setMethod] = useState('visa')
  const [cardNum, setCardNum] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [loading, setLoading] = useState(false)

  const formatCard = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
  const formatExpiry = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 4)
    return d.length >= 2 ? d.slice(0, 2) + '/' + d.slice(2) : d
  }

  const handlePay = () => {
    if (method === 'visa') {
      if (cardNum.replace(/\s/g, '').length !== 16) { toast.error('Enter valid 16-digit card number'); return }
      if (!expiry.match(/^\d{2}\/\d{2}$/)) { toast.error('Enter valid expiry (MM/YY)'); return }
      if (cvv.length !== 3) { toast.error('Enter valid 3-digit CVV'); return }
    }
    setLoading(true)
    setTimeout(() => {
      dispatch(confirmBooking({ userId, paymentMethod: method }))
      setLoading(false)
    }, 1500)
  }

  return (
    <div className={styles.checkout}>
      <div className={styles.grid}>
        {/* Payment Form */}
        <div className={styles.form}>
          <h3 className={styles.title}>Payment Details</h3>

          {/* Payment Method Selection */}
          <div className={styles.methods}>
            {PAYMENT_METHODS.map(pm => (
              <button
                key={pm.id}
                className={`${styles.methodBtn} ${method === pm.id ? styles.methodActive : ''}`}
                onClick={() => setMethod(pm.id)}
              >
                <pm.icon size={20} />
                <div>
                  <div className={styles.methodLabel}>{pm.label}</div>
                  <div className={styles.methodHint}>{pm.hint}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Card Form */}
          {method === 'visa' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={styles.cardForm}
            >
              <div className="form-group">
                <label className="form-label">Card Number</label>
                <input
                  className="form-input"
                  placeholder="4111 1111 1111 1111"
                  value={cardNum}
                  onChange={e => setCardNum(formatCard(e.target.value))}
                />
              </div>
              <div className={styles.cardRow}>
                <div className="form-group">
                  <label className="form-label">Expiry Date</label>
                  <input
                    className="form-input"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={e => setExpiry(formatExpiry(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">CVV</label>
                  <input
                    className="form-input"
                    placeholder="123"
                    maxLength={3}
                    value={cvv}
                    onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {method === 'applepay' && (
            <div className={styles.applePayBox}>
              <Smartphone size={40} />
              <p>Hold your device near the reader or use Face ID to complete payment</p>
            </div>
          )}

          {method === 'wallet' && (
            <div className={styles.walletBox}>
              <Wallet size={40} />
              <p>Your CineMax Wallet will be charged</p>
              <div className={styles.walletBalance}>Balance: <strong style={{ color: 'var(--color-gold)' }}>EGP 500.00</strong></div>
            </div>
          )}

          {/* Security Note */}
          <div className={styles.securityNote}>
            <Shield size={14} className={styles.secIcon} />
            <span>Secured with 256-bit SSL encryption. Your payment info is never stored.</span>
          </div>
        </div>

        {/* Order Summary */}
        <div className={styles.summary}>
          <h3 className={styles.summaryTitle}>Order Summary</h3>

          <div className={styles.summaryMovie}>
            <img
              src={movie.poster}
              alt={movie.title}
              className={styles.summaryPoster}
              onError={e => { e.target.src = `https://placehold.co/80x120/1a1a2e/dc2626?text=${movie.title[0]}` }}
            />
            <div>
              <div className={styles.summaryMovieTitle}>{movie.title}</div>
              <div className={styles.summaryDate}>{booking.date} — {booking.showtime}</div>
              <div className={styles.summaryCinema}>{booking.cinema?.name || 'CineMax Grand Hall'}</div>
            </div>
          </div>

          <div className={styles.divider} />

          {/* Seats */}
          <div className={styles.seatsRow}>
            <span className={styles.summaryLabel}>Seats</span>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              {booking.seats.map(s => (
                <span key={s.id} className={styles.seatTag}>{s.id}</span>
              ))}
            </div>
          </div>

          {/* Price breakdown */}
          <div className={styles.priceRows}>
            {booking.seats.map(s => (
              <div key={s.id} className={styles.priceRow}>
                <span>{s.id} ({s.type})</span>
                <span>EGP {movie.price?.[s.type] || movie.price?.standard}</span>
              </div>
            ))}
          </div>

          <div className={styles.divider} />

          <div className={styles.totalRow}>
            <span>Total</span>
            <span className={styles.total}>EGP {booking.totalPrice}</span>
          </div>

          {/* Pay Button */}
          <button className={`btn btn-primary btn-lg ${styles.payBtn}`} onClick={handlePay} disabled={loading}>
            {loading ? (
              <><span className="spinner" /> Processing...</>
            ) : (
              <><Lock size={16} /> Pay EGP {booking.totalPrice}</>
            )}
          </button>

          <button className="btn btn-ghost btn-sm" style={{ width: '100%', marginTop: 8 }} onClick={onBack}>
            <ChevronLeft size={14} /> Change Seats
          </button>
        </div>
      </div>
    </div>
  )
}

export default Checkout
