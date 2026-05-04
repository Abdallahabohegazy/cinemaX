import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Ticket, Star, Clock, Trash2 } from 'lucide-react'
import { toggleWishlist } from '../../slices/authSlice'
import toast from 'react-hot-toast'
import styles from './Wishlist.module.css'

const Wishlist = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector(s => s.auth)
  const { movies } = useSelector(s => s.movies)

  const wishlistMovies = movies.filter(m => user?.wishlist?.includes(m.id))

  const remove = (id) => {
    dispatch(toggleWishlist(id))
    toast.success('Removed from wishlist')
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <div className={styles.headerIcon}><Heart size={28} fill="currentColor" /></div>
          <div>
            <h1 className={styles.title}>My Wishlist</h1>
            <p className={styles.subtitle}>{wishlistMovies.length} movie{wishlistMovies.length !== 1 ? 's' : ''} saved</p>
          </div>
        </div>

        {wishlistMovies.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.empty}>
            <Heart size={64} style={{ color: 'rgba(220,38,38,0.3)', marginBottom: 16 }} />
            <h3>Your wishlist is empty</h3>
            <p>Browse movies and save your favorites for later</p>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/movies')}>
              Browse Movies
            </button>
          </motion.div>
        ) : (
          <motion.div
            className={styles.grid}
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
          >
            {wishlistMovies.map(movie => (
              <motion.div
                key={movie.id}
                className={styles.card}
                variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
                whileHover={{ y: -6 }}
              >
                {/* Poster */}
                <div className={styles.posterWrap} onClick={() => navigate(`/movie/${movie.id}`)}>
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className={styles.poster}
                    onError={e => { e.target.src = `https://placehold.co/300x420/1a1a2e/dc2626?text=${encodeURIComponent(movie.title[0])}` }}
                  />
                  <div className={styles.overlay}>
                    <button className="btn btn-primary btn-sm" onClick={e => { e.stopPropagation(); navigate(`/movie/${movie.id}`) }}>
                      <Ticket size={14} /> Book Now
                    </button>
                  </div>
                  <span className={`badge ${movie.category === 'now_showing' ? 'badge-crimson' : 'badge-gold'}`} style={{ position: 'absolute', top: 10, left: 10, zIndex: 2 }}>
                    {movie.category === 'now_showing' ? 'Now Showing' : 'Coming Soon'}
                  </span>
                </div>

                {/* Info */}
                <div className={styles.info}>
                  <div className={styles.infoTop}>
                    <h3 className={styles.movieTitle} onClick={() => navigate(`/movie/${movie.id}`)}>{movie.title}</h3>
                    <button className={styles.removeBtn} onClick={() => remove(movie.id)} title="Remove from wishlist">
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <div className={styles.meta}>
                    <span><Star size={13} fill="currentColor" style={{ color: 'var(--color-gold)' }} /> {movie.rating}</span>
                    <span>•</span>
                    <span><Clock size={13} /> {movie.duration}m</span>
                    <span>•</span>
                    <span>{movie.genre[0]}</span>
                  </div>
                  <div className={styles.price}>
                    From <strong style={{ color: 'var(--color-gold)' }}>EGP {movie.price?.standard}</strong>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Wishlist
