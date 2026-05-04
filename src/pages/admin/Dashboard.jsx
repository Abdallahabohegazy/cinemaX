import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  TrendingUp, Users, Ticket, Film, DollarSign,
  ArrowUpRight, ArrowDownRight, Eye, Star, Activity
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'
import { REVENUE_DATA, GENRE_STATS } from '../../data/seedData'
import styles from './Admin.module.css'

const StatCard = ({ icon: Icon, label, value, change, color, up }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className={styles.statCard}
    style={{ borderColor: `${color}33` }}
  >
    <div className={styles.statTop}>
      <div className={styles.statIcon} style={{ background: `${color}22`, color }}>
        <Icon size={22} />
      </div>
      <span className={`${styles.statChange} ${up ? styles.changeUp : styles.changeDown}`}>
        {up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {change}
      </span>
    </div>
    <div className={styles.statValue}>{value}</div>
    <div className={styles.statLabel}>{label}</div>
  </motion.div>
)

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: 'rgba(12,12,22,0.97)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 10, padding: '10px 14px', fontSize: 13,
      }}>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 4 }}>{label}</p>
        {payload.map(p => (
          <p key={p.name} style={{ color: p.color, fontWeight: 600 }}>
            {p.name}: {typeof p.value === 'number' && p.name === 'revenue' ? `EGP ${p.value.toLocaleString()}` : p.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

const AdminDashboard = () => {
  const { stats, revenueData, genreStats } = useSelector(s => s.admin)
  const { bookings } = useSelector(s => s.booking)
  const { movies } = useSelector(s => s.movies)
  const { users } = useSelector(s => s.auth)
  const navigate = useNavigate()

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate))
    .slice(0, 6)

  const topMovies = [...movies]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5)

  // Calculate dynamic stats
  const totalRevenue = bookings.reduce((sum, b) => b.status === 'confirmed' ? sum + b.totalPrice : sum, 0)
  const totalBookings = bookings.length
  const activeUsersCount = users.length
  const moviesScreenedCount = movies.length
  const totalSeatsBooked = bookings.reduce((sum, b) => b.status === 'confirmed' ? sum + (b.seats?.length || 0) : sum, 0)
  const avgTicketPrice = totalSeatsBooked > 0 ? Math.round(totalRevenue / totalSeatsBooked) : 0
  const occupancyRate = totalBookings > 0 ? 82 : 0

  const kpiCards = [
    { icon: DollarSign, label: 'Total Revenue',   value: `EGP ${(totalRevenue/1000).toFixed(1)}K`, change: '+12.5%', color: '#f59e0b', up: true },
    { icon: Ticket,     label: 'Total Bookings',   value: totalBookings.toLocaleString(),             change: '+8.3%',  color: '#dc2626', up: true },
    { icon: Users,      label: 'Active Users',     value: activeUsersCount.toLocaleString(),          change: '+15.2%', color: '#4ade80', up: true },
    { icon: Film,       label: 'Movies Screened',  value: moviesScreenedCount,                        change: '+3',     color: '#818cf8', up: true },
    { icon: Activity,   label: 'Occupancy Rate',   value: `${occupancyRate}%`,                        change: '-2.1%',  color: '#f97316', up: false },
    { icon: Star,       label: 'Avg Ticket Price', value: `EGP ${avgTicketPrice}`,                    change: '+5.8%',  color: '#06b6d4', up: true },
  ]

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.pageSubtitle}>Welcome back! Here's what's happening at CineMax.</p>
        </div>
        <div className={styles.headerActions}>
          <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
            Last updated: {new Date().toLocaleString()}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        {kpiCards.map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <StatCard {...card} />
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className={styles.chartsRow}>
        {/* Revenue Chart */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Revenue Overview</h3>
            <span className="badge badge-green">+12.5% this month</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#dc2626" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#dc2626" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="bookGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" name="revenue" stroke="#dc2626" strokeWidth={2} fill="url(#revenueGrad)" />
              <Area type="monotone" dataKey="bookings" name="bookings" stroke="#f59e0b" strokeWidth={2} fill="url(#bookGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Genre Pie */}
        <div className={styles.chartCard} style={{ flex: '0 0 320px' }}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Genre Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={genreStats} dataKey="percentage" nameKey="genre" cx="50%" cy="50%" outerRadius={80} innerRadius={40}>
                {genreStats.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: 'rgba(12,12,22,0.97)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }} />
              <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className={styles.bottomRow}>
        {/* Recent Bookings */}
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h3 className={styles.chartTitle}>Recent Bookings</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/bookings')}>View All</button>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Movie</th>
                <th>Date</th>
                <th>Seats</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map(b => (
                <tr key={b.id}>
                  <td className={styles.mono}>#{b.id.slice(-6)}</td>
                  <td className={styles.bold}>{b.movieTitle}</td>
                  <td>{b.date}</td>
                  <td>{b.seats?.join(', ')}</td>
                  <td style={{ color: 'var(--color-gold)', fontWeight: 600 }}>EGP {b.totalPrice}</td>
                  <td>
                    <span className={`badge ${b.status === 'confirmed' ? 'badge-green' : 'badge-crimson'}`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Movies */}
        <div className={styles.topMoviesCard}>
          <div className={styles.tableHeader}>
            <h3 className={styles.chartTitle}>Top Rated Movies</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/movies')}>Manage</button>
          </div>
          <div className={styles.moviesList}>
            {topMovies.map((movie, i) => (
              <div key={movie.id} className={styles.movieRow}>
                <div className={styles.movieRank}>#{i + 1}</div>
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className={styles.movieThumb}
                  onError={e => { e.target.src = `https://placehold.co/40x60/1a1a2e/dc2626?text=${movie.title[0]}` }}
                />
                <div className={styles.movieInfo}>
                  <div className={styles.movieName}>{movie.title}</div>
                  <div className={styles.movieGenre}>{movie.genre.slice(0, 2).join(' • ')}</div>
                </div>
                <div className={styles.movieRating}>
                  <Star size={13} fill="currentColor" style={{ color: 'var(--color-gold)' }} />
                  {movie.rating}
                </div>
                <span className={`badge ${movie.category === 'now_showing' ? 'badge-crimson' : 'badge-gold'}`} style={{ fontSize: 10 }}>
                  {movie.category === 'now_showing' ? 'Live' : 'Soon'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
