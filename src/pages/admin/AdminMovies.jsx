import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit, Trash2, Search, X, Film, Star } from 'lucide-react'
import { addMovie, updateMovie, deleteMovie } from '../../slices/moviesSlice'
import { GENRES } from '../../data/movies'
import toast from 'react-hot-toast'
import styles from './Admin.module.css'

const EMPTY_FORM = {
  title: '', genre: [], duration: '', rating: '', description: '',
  poster: '', trailer: '', releaseDate: '', language: 'English',
  ageRating: 'PG-13', category: 'now_showing', director: '',
  price: { standard: 120, vip: 200, imax: 280 },
}

const AdminMovies = () => {
  const dispatch = useDispatch()
  const { movies } = useSelector(s => s.movies)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingMovie, setEditingMovie] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const filtered = movies.filter(m => {
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase())
    const matchCat = catFilter === 'all' || m.category === catFilter
    return matchSearch && matchCat
  })

  const openAdd = () => {
    setEditingMovie(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  const openEdit = (movie) => {
    setEditingMovie(movie)
    setForm({ ...movie, genre: [...movie.genre], price: { ...movie.price } })
    setModalOpen(true)
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (!form.title || !form.description) { toast.error('Title and description required'); return }
    const data = {
      ...form,
      id: editingMovie ? editingMovie.id : `m${Date.now()}`,
      rating: parseFloat(form.rating) || 8.0,
      duration: parseInt(form.duration) || 120,
      tags: form.tags || [],
    }
    if (editingMovie) {
      dispatch(updateMovie(data))
      toast.success('Movie updated!')
    } else {
      dispatch(addMovie(data))
      toast.success('Movie added!')
    }
    setModalOpen(false)
  }

  const handleDelete = (id) => {
    dispatch(deleteMovie(id))
    setDeleteConfirm(null)
    toast.success('Movie deleted')
  }

  const toggleGenre = (g) => {
    setForm(f => ({
      ...f,
      genre: f.genre.includes(g) ? f.genre.filter(x => x !== g) : [...f.genre, g],
    }))
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Movies Management</h1>
          <p className={styles.pageSubtitle}>{movies.length} movies total</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <Plus size={16} /> Add Movie
        </button>
      </div>

      {/* Controls */}
      <div className={styles.controlBar}>
        <div className={styles.searchWrap}>
          <Search size={15} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Search movies..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className={styles.select} value={catFilter} onChange={e => setCatFilter(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="now_showing">Now Showing</option>
          <option value="coming_soon">Coming Soon</option>
        </select>
        <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{filtered.length} results</span>
      </div>

      {/* Movies Table */}
      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Poster</th>
              <th>Title</th>
              <th>Genre</th>
              <th>Rating</th>
              <th>Duration</th>
              <th>Category</th>
              <th>Prices</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(movie => (
              <tr key={movie.id}>
                <td>
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    style={{ width: 36, height: 52, objectFit: 'cover', borderRadius: 4 }}
                    onError={e => { e.target.src = `https://placehold.co/36x52/1a1a2e/dc2626?text=${movie.title[0]}` }}
                  />
                </td>
                <td className={styles.bold}>{movie.title}</td>
                <td style={{ fontSize: 12 }}>{movie.genre.slice(0, 2).join(', ')}</td>
                <td>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-gold)', fontWeight: 600, fontSize: 13 }}>
                    <Star size={12} fill="currentColor" /> {movie.rating}
                  </span>
                </td>
                <td>{movie.duration}m</td>
                <td>
                  <span className={`badge ${movie.category === 'now_showing' ? 'badge-crimson' : 'badge-gold'}`}>
                    {movie.category === 'now_showing' ? 'Now Showing' : 'Coming Soon'}
                  </span>
                </td>
                <td style={{ fontSize: 11 }}>
                  <div>Std: EGP {movie.price?.standard}</div>
                  <div>VIP: EGP {movie.price?.vip}</div>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-ghost btn-icon" title="Edit" onClick={() => openEdit(movie)}>
                      <Edit size={15} />
                    </button>
                    <button
                      className="btn btn-ghost btn-icon"
                      title="Delete"
                      style={{ color: 'var(--color-crimson-light)' }}
                      onClick={() => setDeleteConfirm(movie.id)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>
            No movies found.
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div className={styles.modal} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              className={styles.modalBox}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>{editingMovie ? 'Edit Movie' : 'Add New Movie'}</h2>
                <button className="btn btn-ghost btn-icon" onClick={() => setModalOpen(false)}><X size={18} /></button>
              </div>
              <form onSubmit={handleSave} className={styles.modalForm}>
                <div className={styles.formRow}>
                  <div className="form-group">
                    <label className="form-label">Title *</label>
                    <input className="form-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Movie title" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Director</label>
                    <input className="form-input" value={form.director} onChange={e => setForm(f => ({ ...f, director: e.target.value }))} placeholder="Director name" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea className="form-input" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Movie description" style={{ resize: 'vertical' }} />
                </div>
                <div className={styles.formRow}>
                  <div className="form-group">
                    <label className="form-label">Duration (min)</label>
                    <input className="form-input" type="number" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="120" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Rating (0-10)</label>
                    <input className="form-input" type="number" step="0.1" min="0" max="10" value={form.rating} onChange={e => setForm(f => ({ ...f, rating: e.target.value }))} placeholder="8.5" />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                      <option value="now_showing">Now Showing</option>
                      <option value="coming_soon">Coming Soon</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Age Rating</label>
                    <select className="form-input" value={form.ageRating} onChange={e => setForm(f => ({ ...f, ageRating: e.target.value }))}>
                      {['G', 'PG', 'PG-13', 'R', 'NC-17'].map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className="form-group">
                    <label className="form-label">Poster URL</label>
                    <input className="form-input" value={form.poster} onChange={e => setForm(f => ({ ...f, poster: e.target.value }))} placeholder="https://..." />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Trailer URL</label>
                    <input className="form-input" value={form.trailer || ''} onChange={e => setForm(f => ({ ...f, trailer: e.target.value }))} placeholder="https://youtube.com/embed/..." />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className="form-group">
                    <label className="form-label">Release Date</label>
                    <input className="form-input" type="date" value={form.releaseDate} onChange={e => setForm(f => ({ ...f, releaseDate: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Language</label>
                    <input className="form-input" value={form.language} onChange={e => setForm(f => ({ ...f, language: e.target.value }))} placeholder="English" />
                  </div>
                </div>
                {/* Genre Picker */}
                <div className="form-group">
                  <label className="form-label">Genres</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                    {GENRES.filter(g => g !== 'All').map(g => (
                      <button
                        key={g} type="button"
                        onClick={() => toggleGenre(g)}
                        style={{
                          padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: 12,
                          border: '1px solid', cursor: 'pointer', fontFamily: 'var(--font-ui)',
                          background: form.genre.includes(g) ? 'rgba(220,38,38,0.2)' : 'rgba(255,255,255,0.03)',
                          borderColor: form.genre.includes(g) ? 'var(--color-crimson)' : 'var(--color-border)',
                          color: form.genre.includes(g) ? 'var(--color-crimson-light)' : 'var(--color-text-secondary)',
                        }}
                      >{g}</button>
                    ))}
                  </div>
                </div>
                {/* Prices */}
                <div className={styles.formRow} style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                  {['standard', 'vip', 'imax'].map(type => (
                    <div key={type} className="form-group">
                      <label className="form-label">{type.toUpperCase()} Price</label>
                      <input
                        className="form-input" type="number"
                        value={form.price?.[type] || ''}
                        onChange={e => setForm(f => ({ ...f, price: { ...f.price, [type]: parseInt(e.target.value) } }))}
                      />
                    </div>
                  ))}
                </div>
                <div className={styles.modalActions}>
                  <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">{editingMovie ? 'Update Movie' : 'Add Movie'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div className={styles.modal} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              className={styles.modalBox}
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              style={{ maxWidth: 380, textAlign: 'center' }}
            >
              <Trash2 size={40} style={{ color: 'var(--color-crimson)', margin: '0 auto 16px' }} />
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, marginBottom: 8 }}>Delete Movie?</h3>
              <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 24 }}>
                This action cannot be undone. The movie will be permanently removed.
              </p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                <button className="btn btn-outline" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                <button className="btn btn-primary" onClick={() => handleDelete(deleteConfirm)}>Yes, Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminMovies
