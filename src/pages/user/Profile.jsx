import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  User, Mail, Phone, Calendar, Ticket, Heart, Star, Settings,
  Edit, Shield, BookOpen, Clock
} from 'lucide-react'
import styles from './Profile.module.css'

const Profile = () => {
  const { user } = useSelector(s => s.auth)
  const { bookings } = useSelector(s => s.booking)
  const { movies } = useSelector(s => s.movies)
  const navigate = useNavigate()

  const userBookings = bookings.filter(b => b.userId === user?.id)
  const confirmedBookings = userBookings.filter(b => b.status === 'confirmed')
  const wishlistMovies = movies.filter(m => user?.wishlist?.includes(m.id))
  const totalSpent = confirmedBookings.reduce((sum, b) => sum + b.totalPrice, 0)

  const stats = [
    { icon: Ticket, label: 'Total Bookings', value: userBookings.length, color: 'var(--color-crimson)' },
    { icon: Star, label: 'Confirmed', value: confirmedBookings.length, color: '#4ade80' },
    { icon: Heart, label: 'Wishlist', value: wishlistMovies.length, color: 'var(--color-gold)' },
    { icon: BookOpen, label: 'Total Spent', value: `EGP ${totalSpent}`, color: '#a78bfa' },
  ]

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.headerCard}
        >
          <div className={styles.avatarWrap}>
            <div className={styles.avatar}>{user?.name?.charAt(0).toUpperCase()}</div>
          </div>
          <div className={styles.userInfo}>
            <h1 className={styles.name}>{user?.name}</h1>
            <div className={styles.email}>{user?.email}</div>
            <div className={styles.badges}>
              <span className={`badge ${user?.role === 'admin' ? 'badge-crimson' : 'badge-blue'}`}>
                {user?.role === 'admin' ? '🛡️ Administrator' : '🎬 Movie Lover'}
              </span>
              <span className="badge badge-green">✓ Verified</span>
            </div>
          </div>
          <div className={styles.headerActions}>
            <button className="btn btn-outline btn-sm">
              <Edit size={14} /> Edit Profile
            </button>
            {user?.role === 'admin' && (
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/admin')}>
                <Shield size={14} /> Admin Panel
              </button>
            )}
          </div>
        </motion.div>

        {/* Stats */}
        <div className={styles.statsGrid}>
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`glass-card ${styles.statCard}`}
            >
              <div className={styles.statIcon} style={{ background: `${stat.color}22`, color: stat.color }}>
                <stat.icon size={22} />
              </div>
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className={styles.grid}>
          {/* Account Info */}
          <div className={`glass-card ${styles.infoCard}`}>
            <h2 className={styles.sectionTitle}>Account Details</h2>
            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}><User size={15} /> Full Name</div>
                <div className={styles.infoValue}>{user?.name}</div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}><Mail size={15} /> Email</div>
                <div className={styles.infoValue}>{user?.email}</div>
              </div>
              {user?.phone && (
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}><Phone size={15} /> Phone</div>
                  <div className={styles.infoValue}>{user.phone}</div>
                </div>
              )}
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}><Calendar size={15} /> Member Since</div>
                <div className={styles.infoValue}>{user?.joinDate}</div>
              </div>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className={`glass-card ${styles.bookingsCard}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 className={styles.sectionTitle} style={{ marginBottom: 0 }}>Recent Bookings</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/bookings')}>View All</button>
            </div>
            {userBookings.length === 0 ? (
              <div className={styles.emptyState}>
                <Ticket size={32} />
                <p>No bookings yet</p>
                <button className="btn btn-primary btn-sm" onClick={() => navigate('/movies')}>Browse Movies</button>
              </div>
            ) : (
              <div className={styles.bookingsList}>
                {userBookings.slice(0, 4).map(b => (
                  <div key={b.id} className={styles.bookingItem}>
                    <div className={styles.bookingInfo}>
                      <div className={styles.bookingTitle}>{b.movieTitle}</div>
                      <div className={styles.bookingMeta}>
                        <Clock size={12} /> {b.date} — {b.showtime}
                      </div>
                      <div className={styles.bookingSeats}>
                        Seats: {b.seats?.join(', ')}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className={`badge ${b.status === 'confirmed' ? 'badge-green' : 'badge-crimson'}`}>
                        {b.status}
                      </span>
                      <div style={{ marginTop: 6, fontSize: 15, fontWeight: 700, color: 'var(--color-gold)' }}>
                        EGP {b.totalPrice}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Wishlist */}
        {wishlistMovies.length > 0 && (
          <div className={`glass-card ${styles.wishlistCard}`}>
            <h2 className={styles.sectionTitle}>My Wishlist</h2>
            <div className={styles.wishlistGrid}>
              {wishlistMovies.map(movie => (
                <div
                  key={movie.id}
                  className={styles.wishlistItem}
                  onClick={() => navigate(`/movie/${movie.id}`)}
                >
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className={styles.wishlistPoster}
                    onError={e => { e.target.src = `https://placehold.co/80x120/1a1a2e/dc2626?text=${movie.title[0]}` }}
                  />
                  <div className={styles.wishlistInfo}>
                    <div className={styles.wishlistTitle}>{movie.title}</div>
                    <div className={styles.wishlistMeta}>⭐ {movie.rating}</div>
                    <button className="btn btn-primary btn-sm" style={{ marginTop: 8 }}
                      onClick={e => { e.stopPropagation(); navigate(`/movie/${movie.id}`) }}>
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
