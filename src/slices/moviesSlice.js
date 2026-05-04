import { createSlice, current } from '@reduxjs/toolkit'
import { MOVIES } from '../data/movies'

const storedMovies = JSON.parse(localStorage.getItem('cinemax_movies_v2'))
const initialMoviesList = storedMovies && storedMovies.length > 0 ? storedMovies : MOVIES

const initialState = {
  movies: initialMoviesList,
  filteredMovies: initialMoviesList,
  searchQuery: '',
  selectedGenre: 'All',
  selectedCategory: 'all',
  loading: false,
  selectedMovie: null,
  reviews: JSON.parse(localStorage.getItem('cinemax_reviews') || '{}'),
}

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
      moviesSlice.caseReducers.applyFilters(state)
    },
    setGenreFilter: (state, action) => {
      state.selectedGenre = action.payload
      moviesSlice.caseReducers.applyFilters(state)
    },
    setCategoryFilter: (state, action) => {
      state.selectedCategory = action.payload
      moviesSlice.caseReducers.applyFilters(state)
    },
    applyFilters: (state) => {
      let result = state.movies

      if (state.searchQuery) {
        const q = state.searchQuery.toLowerCase()
        result = result.filter(m =>
          m.title.toLowerCase().includes(q) ||
          m.genre.some(g => g.toLowerCase().includes(q)) ||
          m.director?.toLowerCase().includes(q)
        )
      }

      if (state.selectedGenre !== 'All') {
        result = result.filter(m => m.genre.includes(state.selectedGenre))
      }

      if (state.selectedCategory !== 'all') {
        result = result.filter(m => m.category === state.selectedCategory)
      }

      state.filteredMovies = result
    },
    setSelectedMovie: (state, action) => {
      state.selectedMovie = action.payload
    },
    addReview: (state, action) => {
      const { movieId, review } = action.payload
      if (!state.reviews[movieId]) state.reviews[movieId] = []
      state.reviews[movieId].unshift(review)
      localStorage.setItem('cinemax_reviews', JSON.stringify(current(state.reviews)))
    },
    addMovie: (state, action) => {
      state.movies.push(action.payload)
      state.filteredMovies = state.movies
      localStorage.setItem('cinemax_movies_v2', JSON.stringify(current(state.movies)))
    },
    updateMovie: (state, action) => {
      const idx = state.movies.findIndex(m => m.id === action.payload.id)
      if (idx !== -1) {
        state.movies[idx] = action.payload
        state.filteredMovies = state.movies
        localStorage.setItem('cinemax_movies_v2', JSON.stringify(current(state.movies)))
      }
    },
    deleteMovie: (state, action) => {
      state.movies = state.movies.filter(m => m.id !== action.payload)
      state.filteredMovies = state.movies
      localStorage.setItem('cinemax_movies_v2', JSON.stringify(current(state.movies)))
    },
  },
})

export const {
  setSearchQuery, setGenreFilter, setCategoryFilter,
  applyFilters, setSelectedMovie, addReview,
  addMovie, updateMovie, deleteMovie,
} = moviesSlice.actions

export default moviesSlice.reducer
