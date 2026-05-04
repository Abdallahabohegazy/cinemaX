import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, MapPin, ChevronRight, Info } from 'lucide-react'
import { setShowtime, setBookingStep, toggleSeat, confirmBooking, resetBooking } from '../slices/bookingSlice'
import { setBookingMovie } from '../slices/bookingSlice'
import SeatSelector from '../components/booking/SeatSelector'
import Checkout from '../components/booking/Checkout'
import BookingConfirmation from '../components/booking/BookingConfirmation'
import { generateShowtimes } from '../data/movies'
import toast from 'react-hot-toast'
import styles from './Booking.module.css'

const STEPS = ['Choose Showtime', 'Select Seats', 'Checkout', 'Confirmation']

const getNext7Days = () => {
  const days = []
  for (let i = 0; i < 7; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i)
    days.push(d)
  }
  return days
}

const BookingPage = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { movies } = useSelector(s => s.movies)
  const { currentBooking, seatMap, success } = useSelector(s => s.booking)
  const { user } = useSelector(s => s.auth)

  const movie = movies.find(m => m.id === id)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedShowtime, setSelectedShowtime] = useState(null)
  const days = getNext7Days()

  // Initialize booking movie if not set
  React.useEffect(() => {
    if (movie && !currentBooking.movie) {
      dispatch(setBookingMovie(movie))
    }
  }, [movie])

  if (!movie) return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <h2>Movie not found</h2>
      <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/movies')}>Back to Movies</button>
    </div>
  )

  if (movie.category !== 'now_showing') return (
    <div style={{ textAlign: 'center', padding: '100px 24px' }}>
      <h2>This movie is coming soon!</h2>
      <p style={{ color: 'var(--color-text-secondary)', marginTop: 8, marginBottom: 24 }}>Tickets are not yet available for this movie.</p>
      <button className="btn btn-primary" onClick={() => navigate(`/movie/${movie.id}`)}>Back to Details</button>
    </div>
  )

  const step = currentBooking.step

  const showtimes = selectedDate
    ? generateShowtimes(movie.id, selectedDate.toISOString().split('T')[0])
    : []

  const handleShowtimeSelect = (showtime) => {
    setSelectedShowtime(showtime)
    dispatch(setShowtime({
      time: showtime.time,
      date: selectedDate.toISOString().split('T')[0],
      type: showtime.type,
      cinema: showtime.cinema,
    }))
  }

  const handleNextStep = () => {
    if (step === 1) {
      if (!selectedDate || !selectedShowtime) {
        toast.error('Please select a date and showtime')
        return
      }
      dispatch(setBookingStep(2))
    } else if (step === 2) {
      if (currentBooking.seats.length === 0) {
        toast.error('Please select at least one seat')
        return
      }
      dispatch(setBookingStep(3))
    }
  }

  const formatDay = (date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return days[date.getDay()]
  }

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Movie Header */}
        <div className={styles.movieBar}>
          <img
            src={movie.poster}
            alt={movie.title}
            className={styles.movieThumb}
            onError={e => { e.target.src = `https://placehold.co/60x90/1a1a2e/dc2626?text=${movie.title[0]}` }}
          />
          <div>
            <h2 className={styles.movieTitle}>{movie.title}</h2>
            <div className={styles.movieMeta}>
              {movie.genre.slice(0, 2).join(' • ')} • {movie.duration}m • {movie.language}
            </div>
          </div>
        </div>

        {/* Stepper */}
        <div className={styles.stepper}>
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className={`${styles.step} ${step > i + 1 ? styles.stepDone : ''} ${step === i + 1 ? styles.stepActive : ''}`}>
                <div className={styles.stepCircle}>{step > i + 1 ? '✓' : i + 1}</div>
                <span className={styles.stepLabel}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`${styles.stepLine} ${step > i + 1 ? styles.stepLineDone : ''}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {/* Step 1: Showtime */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={styles.stepContent}
            >
              <h3 className={styles.stepTitle}>Choose Date & Showtime</h3>

              {/* Date Picker */}
              <div className={styles.dateRow}>
                {days.map((day, i) => {
                  const isSelected = selectedDate?.toDateString() === day.toDateString()
                  return (
                    <button
                      key={i}
                      className={`${styles.dateCard} ${isSelected ? styles.dateActive : ''}`}
                      onClick={() => { setSelectedDate(day); setSelectedShowtime(null) }}
                    >
                      <div className={styles.dateDay}>{formatDay(day)}</div>
                      <div className={styles.dateNum}>{day.getDate()}</div>
                      <div className={styles.dateMon}>{day.toLocaleDateString('en', { month: 'short' })}</div>
                    </button>
                  )
                })}
              </div>

              {/* Showtimes */}
              {selectedDate && (
                <div>
                  <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: 'var(--color-text-secondary)' }}>
                    Available Showtimes — {selectedDate.toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </h4>
                  <div className={styles.showtimeGrid}>
                    {showtimes.map(st => {
                      const isSelected = selectedShowtime?.id === st.id
                      return (
                        <button
                          key={st.id}
                          className={`${styles.showtimeCard} ${isSelected ? styles.showtimeActive : ''} ${styles[st.type]}`}
                          onClick={() => handleShowtimeSelect(st)}
                        >
                          <div className={styles.showtimeTime}>{st.time}</div>
                          <div className={styles.showtimeType}>{st.type.toUpperCase()}</div>
                          <div className={styles.showtimeCinema}>{st.cinema.name}</div>
                          <div className={styles.showtimeSeats}>
                            <span className={st.availableSeats < 30 ? styles.lowSeats : styles.goodSeats}>
                              {st.availableSeats} seats
                            </span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Legend */}
              <div className={styles.legend}>
                <div className={styles.legendItem}><span className={styles.legendDot} style={{ background: '#2563eb' }} />Standard</div>
                <div className={styles.legendItem}><span className={styles.legendDot} style={{ background: 'var(--color-gold)' }} />VIP</div>
                <div className={styles.legendItem}><span className={styles.legendDot} style={{ background: '#7c3aed' }} />IMAX</div>
              </div>

              <div className={styles.stepActions}>
                <button className="btn btn-outline" onClick={() => navigate(`/movie/${id}`)}>
                  Back
                </button>
                <button className="btn btn-primary btn-lg" onClick={handleNextStep} disabled={!selectedShowtime}>
                  Continue to Seat Selection <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Seats */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <SeatSelector
                seatMap={seatMap}
                selectedSeats={currentBooking.seats}
                moviePrices={movie.price}
                totalPrice={currentBooking.totalPrice}
                onNext={handleNextStep}
                onBack={() => dispatch(setBookingStep(1))}
              />
            </motion.div>
          )}

          {/* Step 3: Checkout */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Checkout
                movie={movie}
                booking={currentBooking}
                userId={user?.id}
                onBack={() => dispatch(setBookingStep(2))}
              />
            </motion.div>
          )}

          {/* Step 4: Confirmation */}
          {(step === 4 || success) && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <BookingConfirmation />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default BookingPage
