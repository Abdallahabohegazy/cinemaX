import { createSlice, current } from '@reduxjs/toolkit'
import { SEED_BOOKINGS } from '../data/seedData'
import { generateSeatMap } from '../data/movies'

const initBookings = () => {
  const stored = localStorage.getItem('cinemax_bookings')
  if (!stored) {
    localStorage.setItem('cinemax_bookings', JSON.stringify(SEED_BOOKINGS))
    return SEED_BOOKINGS
  }
  return JSON.parse(stored)
}

const initialState = {
  bookings: initBookings(),
  currentBooking: {
    movie: null,
    showtime: null,
    date: null,
    seats: [],
    seatType: null,
    cinema: null,
    totalPrice: 0,
    step: 1,
  },
  seatMap: [],
  loading: false,
  success: false,
  lastBooking: null,
}

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setBookingMovie: (state, action) => {
      state.currentBooking.movie = action.payload
      state.currentBooking.step = 1
      state.success = false
    },
    setShowtime: (state, action) => {
      state.currentBooking.showtime = action.payload.time
      state.currentBooking.date = action.payload.date
      state.currentBooking.cinema = action.payload.cinema
      state.currentBooking.seatType = action.payload.type
      // Generate seat map with some random booked seats
      const bookedSeats = generateRandomBookedSeats()
      state.seatMap = generateSeatMap(bookedSeats)
    },
    toggleSeat: (state, action) => {
      const seat = action.payload
      const selected = state.currentBooking.seats
      const exists = selected.find(s => s.id === seat.id)
      if (exists) {
        state.currentBooking.seats = selected.filter(s => s.id !== seat.id)
      } else if (selected.length < 8) {
        state.currentBooking.seats = [...selected, seat]
      }
      // Recalculate price
      const movie = state.currentBooking.movie
      if (movie) {
        state.currentBooking.totalPrice = state.currentBooking.seats.reduce((sum, s) => {
          return sum + (movie.price[s.type] || movie.price.standard)
        }, 0)
      }
    },
    setBookingStep: (state, action) => {
      state.currentBooking.step = action.payload
    },
    confirmBooking: (state, action) => {
      const { userId, paymentMethod } = action.payload
      const booking = {
        id: `bk${Date.now()}`,
        userId,
        movieId: state.currentBooking.movie.id,
        movieTitle: state.currentBooking.movie.title,
        showtime: state.currentBooking.showtime,
        date: state.currentBooking.date,
        seats: state.currentBooking.seats.map(s => s.id),
        seatType: state.currentBooking.seatType,
        cinema: state.currentBooking.cinema?.name || 'CineMax Grand Hall',
        hall: state.currentBooking.cinema?.screens?.[0] || 'Hall 1',
        totalPrice: state.currentBooking.totalPrice,
        status: 'confirmed',
        paymentMethod,
        bookingDate: new Date().toISOString(),
        qrCode: `CINEMAX-${Date.now()}`,
        poster: state.currentBooking.movie.poster,
      }
      state.bookings.unshift(booking)
      state.lastBooking = booking
      state.success = true
      localStorage.setItem('cinemax_bookings', JSON.stringify(current(state.bookings)))
      // Reset current booking
      state.currentBooking = {
        movie: null, showtime: null, date: null,
        seats: [], seatType: null, cinema: null, totalPrice: 0, step: 1,
      }
    },
    cancelBooking: (state, action) => {
      const idx = state.bookings.findIndex(b => b.id === action.payload)
      if (idx !== -1) {
        state.bookings[idx].status = 'cancelled'
        localStorage.setItem('cinemax_bookings', JSON.stringify(current(state.bookings)))
      }
    },
    resetBooking: (state) => {
      state.currentBooking = {
        movie: null, showtime: null, date: null,
        seats: [], seatType: null, cinema: null, totalPrice: 0, step: 1,
      }
      state.seatMap = []
      state.success = false
    },
    clearSuccess: (state) => {
      state.success = false
    },
  },
})

function generateRandomBookedSeats() {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  const booked = []
  const count = Math.floor(Math.random() * 30) + 20
  while (booked.length < count) {
    const row = rows[Math.floor(Math.random() * rows.length)]
    const seat = Math.floor(Math.random() * 12) + 1
    const id = `${row}${seat}`
    if (!booked.includes(id)) booked.push(id)
  }
  return booked
}

export const {
  setBookingMovie, setShowtime, toggleSeat, setBookingStep,
  confirmBooking, cancelBooking, resetBooking, clearSuccess,
} = bookingSlice.actions

export default bookingSlice.reducer
