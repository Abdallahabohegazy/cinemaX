import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Ticket, ChevronLeft, ChevronRight, Star, Clock, Info } from 'lucide-react'
import { openTrailer } from '../../slices/uiSlice'
import styles from './HeroCarousel.module.css'

const FEATURED_IDS = ['m0', 'm3', 'm1', 'm2', 'm8', 'm13']

const HeroCarousel = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { movies } = useSelector(s => s.movies)
  const featured = movies.filter(m => FEATURED_IDS.includes(m.id))

  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const [imgError, setImgError] = useState({})

  const next = useCallback(() => {
    setDirection(1)
    setCurrent(c => (c + 1) % featured.length)
  }, [featured.length])

  const prev = () => {
    setDirection(-1)
    setCurrent(c => (c - 1 + featured.length) % featured.length)
  }

  useEffect(() => {
    const interval = setInterval(next, 6000)
    return () => clearInterval(interval)
  }, [next])

  if (!featured.length) return null
  const movie = featured[current]

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  }

  return (
    <div className={styles.hero}>
      <AnimatePresence custom={direction} mode="wait">
        <motion.div
          key={movie.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className={styles.slide}
        >
          {/* Backdrop */}
          <div className={styles.backdropWrap}>
            <img
              src={movie.poster}
              alt=""
              className={styles.backdrop}
            />
            <div className={styles.backdropGradient} />
          </div>

          {/* Content */}
          <div className={styles.content}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {/* Category Badge */}
              <div className={styles.badges}>
                <span className={`badge ${movie.category === 'now_showing' ? 'badge-crimson' : 'badge-gold'}`}>
                  {movie.category === 'now_showing' ? '🎬 Now Showing' : '⭐ Coming Soon'}
                </span>
                <span className="badge badge-blue">{movie.ageRating}</span>
                {movie.tags?.[0] && <span className="badge badge-green">{movie.tags[0]}</span>}
              </div>

              {/* Title */}
              <h1 className={styles.title}>{movie.title}</h1>

              {/* Meta */}
              <div className={styles.meta}>
                <div className={styles.rating}>
                  <Star size={16} fill="currentColor" style={{ color: 'var(--color-gold)' }} />
                  <span>{movie.rating}/10</span>
                </div>
                <div className={styles.dot} />
                <div className={styles.duration}>
                  <Clock size={15} />
                  <span>{movie.duration} min</span>
                </div>
                <div className={styles.dot} />
                <span className={styles.language}>{movie.language}</span>
                <div className={styles.dot} />
                <div className={styles.genres}>
                  {movie.genre.slice(0, 3).map(g => (
                    <span key={g} className={styles.genreChip}>{g}</span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <p className={styles.description}>{movie.description}</p>

              {/* CTA Buttons */}
              <div className={styles.actions}>
                {movie.category === 'now_showing' && (
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={() => navigate(`/movie/${movie.id}`)}
                  >
                    <Ticket size={18} /> Book Tickets
                  </button>
                )}
                <button
                  className="btn btn-outline btn-lg"
                  onClick={() => dispatch(openTrailer(movie.trailer))}
                >
                  <Play size={18} fill="currentColor" /> Watch Trailer
                </button>
                <button
                  className="btn btn-ghost btn-lg"
                  onClick={() => navigate(`/movie/${movie.id}`)}
                >
                  <Info size={18} /> More Info
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <button className={`${styles.navBtn} ${styles.navPrev}`} onClick={prev}>
        <ChevronLeft size={22} />
      </button>
      <button className={`${styles.navBtn} ${styles.navNext}`} onClick={next}>
        <ChevronRight size={22} />
      </button>

      {/* Dots */}
      <div className={styles.dots}>
        {featured.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot2} ${i === current ? styles.dotActive : ''}`}
            onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i) }}
          />
        ))}
      </div>

      {/* Mini Thumbnails */}
      <div className={styles.thumbnails}>
        {featured.map((m, i) => (
          <button
            key={m.id}
            className={`${styles.thumb} ${i === current ? styles.thumbActive : ''}`}
            onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i) }}
          >
            <img
              src={m.poster}
              alt={m.title}
              className={styles.thumbImg}
              onError={e => { e.target.src = `https://placehold.co/80x120/1a1a2e/dc2626?text=${i + 1}` }}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

export default HeroCarousel
