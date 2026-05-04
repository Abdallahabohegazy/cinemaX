import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import {
  Star, Clock, Play, Ticket, Heart, BookmarkPlus, Globe, Calendar,
  User, Film, ChevronRight, Share2, ThumbsUp
} from 'lucide-react'
import { openTrailer } from '../slices/uiSlice'
import { toggleWishlist, toggleFavorite } from '../slices/authSlice'
import { setBookingMovie } from '../slices/bookingSlice'
import { addReview } from '../slices/moviesSlice'
import TrailerModal from '../components/ui/TrailerModal'
import MovieCard from '../components/movies/MovieCard'
import styles from './MovieDetail.module.css'
import toast from 'react-hot-toast'

const MovieDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { movies, reviews } = useSelector(s => s.movies)
  const { modalOpen, trailerUrl } = useSelector(s => s.ui)
  const { user, isAuthenticated } = useSelector(s => s.auth)

  const movie = movies.find(m => m.id === id)
  const movieReviews = reviews[id] || []
  const similar = movies.filter(m => m.id !== id && m.genre.some(g => movie?.genre.includes(g))).slice(0, 5)

  const [reviewForm, setReviewForm] = useState({ rating: 5, text: '' })
  const [imgError, setImgError] = useState(false)

  if (!movie) return (
    <div style={{ textAlign: 'center', padding: '100px 24px' }}>
      <h2>Movie not found</h2>
      <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/movies')}>Browse Movies</button>
    </div>
  )

  const isWishlisted = user?.wishlist?.includes(movie.id)
  const isFavorite = user?.favorites?.includes(movie.id)

  const handleBook = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to book tickets')
      navigate('/login')
      return
    }
    dispatch(setBookingMovie(movie))
    navigate(`/booking/${movie.id}`)
  }

  const handleReview = (e) => {
    e.preventDefault()
    if (!isAuthenticated) { toast.error('Please sign in to review'); return }
    if (!reviewForm.text.trim()) { toast.error('Review cannot be empty'); return }
    dispatch(addReview({
      movieId: id,
      review: {
        id: Date.now(),
        userId: user.id,
        userName: user.name,
        rating: reviewForm.rating,
        text: reviewForm.text,
        date: new Date().toLocaleDateString(),
        likes: 0,
      },
    }))
    setReviewForm({ rating: 5, text: '' })
    toast.success('Review submitted!')
  }

  const backdropSrc = imgError ? movie.poster : (movie.backdrop || movie.poster)

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <img
          src={backdropSrc}
          alt=""
          className={styles.backdrop}
          onError={() => setImgError(true)}
        />
        <div className={styles.heroGradient} />
        <div className={styles.heroContent}>
          <div className={styles.posterWrap}>
            <img
              src={movie.poster}
              alt={movie.title}
              className={styles.poster}
              onError={e => { e.target.src = `https://placehold.co/300x450/1a1a2e/dc2626?text=${encodeURIComponent(movie.title[0])}` }}
            />
          </div>
          <div className={styles.info}>
            {/* Badges */}
            <div className={styles.badges}>
              <span className={`badge ${movie.category === 'now_showing' ? 'badge-crimson' : 'badge-gold'}`}>
                {movie.category === 'now_showing' ? 'Now Showing' : 'Coming Soon'}
              </span>
              <span className="badge badge-blue">{movie.ageRating}</span>
            </div>
            <h1 className={styles.title}>{movie.title}</h1>
            {/* Meta Row */}
            <div className={styles.meta}>
              <div className={styles.ratingBig}>
                <Star size={18} fill="currentColor" style={{ color: 'var(--color-gold)' }} />
                <span>{movie.rating}</span>
                <span className={styles.ratingMax}>/10</span>
              </div>
              <span className={styles.sep}>•</span>
              <div className={styles.metaItem}><Clock size={15} /> {movie.duration} min</div>
              <span className={styles.sep}>•</span>
              <div className={styles.metaItem}><Globe size={15} /> {movie.language}</div>
              <span className={styles.sep}>•</span>
              <div className={styles.metaItem}><Calendar size={15} /> {movie.releaseDate}</div>
            </div>
            {/* Genres */}
            <div className={styles.genres}>
              {movie.genre.map(g => <span key={g} className={styles.genreTag}>{g}</span>)}
            </div>
            {/* Description */}
            <p className={styles.description}>{movie.description}</p>
            {/* Director / Cast */}
            <div className={styles.credits}>
              {movie.director && (
                <div className={styles.credit}>
                  <span className={styles.creditLabel}>Director</span>
                  <span className={styles.creditValue}>{movie.director}</span>
                </div>
              )}
              {movie.cast?.length > 0 && (
                <div className={styles.credit}>
                  <span className={styles.creditLabel}>Cast</span>
                  <span className={styles.creditValue}>{movie.cast.join(', ')}</span>
                </div>
              )}
            </div>
            {/* Actions */}
            <div className={styles.actions}>
              {movie.category === 'now_showing' && (
                <button className="btn btn-primary btn-lg" onClick={handleBook}>
                  <Ticket size={18} /> Book Tickets
                </button>
              )}
              <button className="btn btn-outline btn-lg" onClick={() => dispatch(openTrailer(movie.trailer))}>
                <Play size={18} fill="currentColor" /> Trailer
              </button>
              {isAuthenticated && (
                <>
                  <button
                    className={`btn btn-ghost btn-icon ${isWishlisted ? styles.wishlistActive : ''}`}
                    onClick={() => { dispatch(toggleWishlist(movie.id)); toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist') }}
                    title="Wishlist"
                  >
                    <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    className={`btn btn-ghost btn-icon ${isFavorite ? styles.favoriteActive : ''}`}
                    onClick={() => { dispatch(toggleFavorite(movie.id)); toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites') }}
                    title="Favorite"
                  >
                    <BookmarkPlus size={18} />
                  </button>
                </>
              )}
            </div>

            {/* Price Info */}
            <div className={styles.prices}>
              {[
                { type: 'Standard', price: movie.price?.standard, color: '#60a5fa' },
                { type: 'VIP', price: movie.price?.vip, color: 'var(--color-gold)' },
                { type: 'IMAX', price: movie.price?.imax, color: '#a78bfa' },
              ].map(({ type, price, color }) => (
                <div key={type} className={styles.priceCard}>
                  <div className={styles.priceLabel}>{type}</div>
                  <div className={styles.priceValue} style={{ color }}>EGP {price}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="container" style={{ paddingTop: 60, paddingBottom: 60 }}>
        <div className={styles.mainContent}>
          <div className={styles.reviewsSection}>
            <h2 className={styles.sectionTitle}>Reviews</h2>

            {/* Write Review */}
            {isAuthenticated && (
              <form className={styles.reviewForm} onSubmit={handleReview}>
                <div className={styles.reviewHeader}>
                  <div className={styles.reviewAvatar}>{user.name.charAt(0)}</div>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{user.name}</span>
                </div>
                <div className={styles.ratingPicker}>
                  {[1,2,3,4,5,6,7,8,9,10].map(n => (
                    <button
                      key={n} type="button"
                      className={`${styles.ratingBtn} ${reviewForm.rating >= n ? styles.ratingBtnActive : ''}`}
                      onClick={() => setReviewForm(f => ({ ...f, rating: n }))}
                    >{n}</button>
                  ))}
                </div>
                <textarea
                  value={reviewForm.text}
                  onChange={e => setReviewForm(f => ({ ...f, text: e.target.value }))}
                  placeholder="Share your thoughts about this movie..."
                  className={styles.reviewTextarea}
                  rows={3}
                />
                <button type="submit" className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-end' }}>
                  Submit Review
                </button>
              </form>
            )}

            {/* Reviews List */}
            <div className={styles.reviewsList}>
              {movieReviews.length === 0 ? (
                <div className={styles.noReviews}>
                  <Star size={32} style={{ color: 'var(--color-text-secondary)', marginBottom: 8 }} />
                  <p>No reviews yet. Be the first!</p>
                </div>
              ) : movieReviews.map(review => (
                <div key={review.id} className={`glass-card ${styles.reviewCard}`}>
                  <div className={styles.reviewTop}>
                    <div className={styles.reviewAvatar}>{review.userName.charAt(0)}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{review.userName}</div>
                      <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{review.date}</div>
                    </div>
                    <div className={styles.reviewRating}>
                      <Star size={14} fill="currentColor" style={{ color: 'var(--color-gold)' }} />
                      <span>{review.rating}/10</span>
                    </div>
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginTop: 10, lineHeight: 1.6 }}>
                    {review.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar - Similar Movies */}
          <div className={styles.sidebar}>
            <h3 className={styles.sectionTitle} style={{ fontSize: '1.1rem' }}>Similar Movies</h3>
            <div className={styles.similarList}>
              {similar.map(m => (
                <div key={m.id} className={styles.similarCard} onClick={() => navigate(`/movie/${m.id}`)}>
                  <img
                    src={m.poster}
                    alt={m.title}
                    className={styles.similarPoster}
                    onError={e => { e.target.src = `https://placehold.co/80x120/1a1a2e/dc2626?text=${m.title[0]}` }}
                  />
                  <div className={styles.similarInfo}>
                    <div className={styles.similarTitle}>{m.title}</div>
                    <div className={styles.similarMeta}>
                      <Star size={12} fill="currentColor" style={{ color: 'var(--color-gold)' }} /> {m.rating}
                      <span>• {m.duration}m</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                      {m.genre.slice(0, 2).join(', ')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {modalOpen === 'trailer' && <TrailerModal url={trailerUrl} />}
    </div>
  )
}

export default MovieDetail
