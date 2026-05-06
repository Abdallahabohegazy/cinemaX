# CineX - Cinema Booking App

CineX is a React-based cinema booking platform with user and admin flows:
- Explore movies with posters, trailers, and ratings
- Book seats and complete checkout
- Manage wishlist/favorites
- Admin dashboard for movies, users, bookings, and analytics

## Tech Stack

- React + Vite
- Redux Toolkit
- React Router
- Framer Motion
- Recharts

## Quick Start

```bash
npm install
npm run dev
```

Add OMDb API key for movie posters:

```bash
# .env
VITE_OMDB_API_KEY=your_omdb_api_key
```

Build for production:

```bash
npm run build
npm run preview
```

## Project Structure

```text
src/
  components/     UI and feature components
  pages/          route pages
  layouts/        application layouts
  slices/         Redux state slices
  data/           app seed/movie data
  services/       API-like service helpers
  hooks/          custom hooks
  utils/          utility helpers
```

## Movie Images API Handling

Movie images are now handled through a centralized service:

- `src/services/imageService.js`
  - TMDB image endpoint builder (`https://image.tmdb.org/t/p/...`)
  - OMDb poster endpoint (`http://img.omdbapi.com/?apikey=...&i=...`)
  - YouTube trailer thumbnail fallback (`https://img.youtube.com/vi/...`)
  - broken-link recovery per movie ID
- `src/data/movies.js`
  - uses `resolveMovieImages()` to normalize poster/backdrop for every movie
- `src/components/movies/HeroCarousel.jsx`
  - uses `backdrop` first and falls back to `poster` on image error

This gives stable image rendering even when external poster links expire.

## Notes

- The project currently uses local mocked data and local storage.
- `src/services/apiService.js` is structured to be replaced with real backend APIs later.
