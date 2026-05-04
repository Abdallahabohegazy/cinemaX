import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Filter, Grid, List, SlidersHorizontal, X } from 'lucide-react'
import MovieCard from '../components/movies/MovieCard'
import TrailerModal from '../components/ui/TrailerModal'
import { setSearchQuery, setGenreFilter, setCategoryFilter } from '../slices/moviesSlice'
import { GENRES } from '../data/movies'
import styles from './Movies.module.css'

const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'rating_desc', label: 'Highest Rated' },
  { value: 'rating_asc', label: 'Lowest Rated' },
  { value: 'duration_desc', label: 'Longest First' },
  { value: 'title_asc', label: 'A–Z' },
  { value: 'title_desc', label: 'Z–A' },
]

const Movies = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { filteredMovies, searchQuery, selectedGenre, selectedCategory } = useSelector(s => s.movies)
  const { modalOpen, trailerUrl } = useSelector(s => s.ui)

  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('default')
  const [localSearch, setLocalSearch] = useState(searchQuery)
  const [filterOpen, setFilterOpen] = useState(false)

  // Apply category from URL param
  useEffect(() => {
    const cat = searchParams.get('cat')
    if (cat) dispatch(setCategoryFilter(cat))
    else dispatch(setCategoryFilter('all'))
  }, [searchParams])

  useEffect(() => {
    const timer = setTimeout(() => dispatch(setSearchQuery(localSearch)), 300)
    return () => clearTimeout(timer)
  }, [localSearch, dispatch])

  const sorted = [...filteredMovies].sort((a, b) => {
    switch (sortBy) {
      case 'rating_desc': return b.rating - a.rating
      case 'rating_asc': return a.rating - b.rating
      case 'duration_desc': return b.duration - a.duration
      case 'title_asc': return a.title.localeCompare(b.title)
      case 'title_desc': return b.title.localeCompare(a.title)
      default: return 0
    }
  })

  const clearFilters = () => {
    dispatch(setSearchQuery(''))
    dispatch(setGenreFilter('All'))
    dispatch(setCategoryFilter('all'))
    setLocalSearch('')
    setSortBy('default')
  }

  const hasActiveFilters = selectedGenre !== 'All' || selectedCategory !== 'all' || searchQuery

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Page Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Browse Movies</h1>
            <p className={styles.subtitle}>
              {sorted.length} movie{sorted.length !== 1 ? 's' : ''} found
              {hasActiveFilters && ' (filtered)'}
            </p>
          </div>
          {hasActiveFilters && (
            <button className="btn btn-outline btn-sm" onClick={clearFilters}>
              <X size={14} /> Clear Filters
            </button>
          )}
        </div>

        {/* Controls Bar */}
        <div className={styles.controls}>
          {/* Search */}
          <div className={styles.searchWrap}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by title, genre, director..."
              value={localSearch}
              onChange={e => setLocalSearch(e.target.value)}
              className={styles.searchInput}
            />
            {localSearch && (
              <button className={styles.searchClear} onClick={() => { setLocalSearch(''); dispatch(setSearchQuery('')) }}>
                <X size={14} />
              </button>
            )}
          </div>

          <div className={styles.rightControls}>
            {/* Sort */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className={styles.select}
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            {/* View Mode */}
            <div className={styles.viewToggle}>
              <button
                className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.viewActive : ''}`}
                onClick={() => setViewMode('grid')}
              ><Grid size={16} /></button>
              <button
                className={`${styles.viewBtn} ${viewMode === 'list' ? styles.viewActive : ''}`}
                onClick={() => setViewMode('list')}
              ><List size={16} /></button>
            </div>

            {/* Filter Toggle */}
            <button
              className={`btn btn-ghost btn-sm ${filterOpen ? styles.filterActive : ''}`}
              onClick={() => setFilterOpen(v => !v)}
            >
              <SlidersHorizontal size={15} /> Filters
            </button>
          </div>
        </div>

        {/* Genre Filters */}
        <div className={styles.genreBar}>
          {GENRES.map(genre => (
            <button
              key={genre}
              className={`${styles.genreBtn} ${selectedGenre === genre ? styles.genreActive : ''}`}
              onClick={() => dispatch(setGenreFilter(genre))}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Category Tabs */}
        <div className={styles.categoryTabs}>
          {[
            { value: 'all', label: 'All Movies' },
            { value: 'now_showing', label: '🎬 Now Showing' },
            { value: 'coming_soon', label: '⭐ Coming Soon' },
          ].map(tab => (
            <button
              key={tab.value}
              className={`${styles.tabBtn} ${selectedCategory === tab.value ? styles.tabActive : ''}`}
              onClick={() => dispatch(setCategoryFilter(tab.value))}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results */}
        {sorted.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🎬</div>
            <h3>No movies found</h3>
            <p>Try adjusting your search or filters</p>
            <button className="btn btn-primary" onClick={clearFilters}>Clear All Filters</button>
          </div>
        ) : (
          <motion.div
            className={viewMode === 'grid' ? styles.grid : styles.listView}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {sorted.map((movie, i) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
              >
                {viewMode === 'grid' ? (
                  <MovieCard movie={movie} size="md" />
                ) : (
                  <ListMovieCard movie={movie} />
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {modalOpen === 'trailer' && <TrailerModal url={trailerUrl} />}
    </div>
  )
}

const ListMovieCard = ({ movie }) => {
  const navigate = useNavigate()
  const [imgError, setImgError] = useState(false)
  return (
    <div
      className={`glass-card ${styles.listCard}`}
      onClick={() => navigate(`/movie/${movie.id}`)}
    >
      <img
        src={imgError ? `https://placehold.co/120x160/1a1a2e/dc2626?text=${encodeURIComponent(movie.title[0])}` : movie.poster}
        alt={movie.title}
        className={styles.listPoster}
        onError={() => setImgError(true)}
      />
      <div className={styles.listInfo}>
        <div>
          <div className={styles.listBadge}>
            <span className={`badge ${movie.category === 'now_showing' ? 'badge-crimson' : 'badge-gold'}`}>
              {movie.category === 'now_showing' ? 'Now Showing' : 'Coming Soon'}
            </span>
          </div>
          <h3 className={styles.listTitle}>{movie.title}</h3>
          <p className={styles.listDesc}>{movie.description}</p>
          <div className={styles.listMeta}>
            <span>⭐ {movie.rating}</span>
            <span>•</span>
            <span>🕐 {movie.duration}m</span>
            <span>•</span>
            <span>{movie.genre.join(', ')}</span>
            <span>•</span>
            <span>{movie.language}</span>
          </div>
        </div>
        <div className={styles.listActions}>
          <div className={styles.listPrice}>From <strong style={{ color: 'var(--color-gold)' }}>EGP {movie.price?.standard}</strong></div>
          <button className="btn btn-primary btn-sm" onClick={e => { e.stopPropagation(); navigate(`/movie/${movie.id}`) }}>
            Book Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default Movies
