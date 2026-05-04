import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Star, Clock, Heart, Play, Ticket, BookmarkPlus } from 'lucide-react'
import { toggleWishlist, toggleFavorite } from '../../slices/authSlice'
import { openTrailer } from '../../slices/uiSlice'
import styles from './MovieCard.module.css'

const MovieCard = ({ movie, size = 'md' }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useSelector(s => s.auth)
  const [imgError, setImgError] = useState(false)

  const isWishlisted = user?.wishlist?.includes(movie.id)
  const isFavorite = user?.favorites?.includes(movie.id)

  const fallbackImg = `https://placehold.co/300x450/1a1a2e/dc2626?text=${encodeURIComponent(movie.title)}`

  return (
    <motion.div
      className={`${styles.card} ${styles[size]}`}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
    >
      {/* Poster */}
      <div className={styles.posterWrap} onClick={() => navigate(`/movie/${movie.id}`)} style={{ cursor: 'pointer' }}>
        <img
          src={imgError ? fallbackImg : movie.poster}
          alt={movie.title}
          className={styles.poster}
          onError={() => setImgError(true)}
          loading="lazy"
        />

        {/* Overlay on hover */}
        <div className={styles.overlay}>
          <div className={styles.overlayBtns}>
            <button
              className={styles.overlayBtn}
              onClick={(e) => { e.stopPropagation(); dispatch(openTrailer(movie.trailer)) }}
              title="Watch Trailer"
            >
              <Play size={16} fill="currentColor" />
            </button>
            {isAuthenticated && (
              <button
                className={`${styles.overlayBtn} ${isWishlisted ? styles.active : ''}`}
                onClick={(e) => { e.stopPropagation(); dispatch(toggleWishlist(movie.id)) }}
                title="Add to Wishlist"
              >
                <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
            )}
          </div>
          {movie.category === 'now_showing' ? (
            <button
              className={styles.bookBtn}
              onClick={(e) => { e.stopPropagation(); navigate(`/movie/${movie.id}`) }}
            >
              <Ticket size={14} /> Book Now
            </button>
          ) : (
            <button
              className={styles.bookBtn}
              onClick={(e) => { e.stopPropagation(); navigate(`/movie/${movie.id}`) }}
            >
              <Play size={14} /> Details
            </button>
          )}
        </div>

        {/* Badge */}
        <div className={styles.badges}>
          <span className={`badge ${movie.category === 'now_showing' ? 'badge-crimson' : 'badge-gold'}`}>
            {movie.category === 'now_showing' ? 'Now Showing' : 'Coming Soon'}
          </span>
        </div>

        {/* Age Rating */}
        <div className={styles.ageRating}>{movie.ageRating}</div>
      </div>

      {/* Info */}
      <div className={styles.info}>
        <h3 className={styles.title} onClick={() => navigate(`/movie/${movie.id}`)}>
          {movie.title}
        </h3>

        <div className={styles.meta}>
          <div className={styles.rating}>
            <Star size={13} fill="currentColor" className={styles.star} />
            <span>{movie.rating}</span>
          </div>
          <div className={styles.duration}>
            <Clock size={13} className={styles.clockIcon} />
            <span>{movie.duration}m</span>
          </div>
        </div>

        <div className={styles.genres}>
          {movie.genre.slice(0, 2).map(g => (
            <span key={g} className={styles.genreTag}>{g}</span>
          ))}
        </div>

        {size !== 'sm' && (
          <div className={styles.price}>
            From <span className={styles.priceAmount}>EGP {movie.price?.standard}</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default MovieCard
