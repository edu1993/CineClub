import { useState } from 'react';
import SearchBar from './SearchBar';
import MovieGrid from './MovieGrid';
import MovieDetail from './MovieDetail';

function SearchView() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [view, setView] = useState('search');

  const handleSearch = async (query) => {
    setLoading(true);
    setError('');
    setSelectedMovie(null);
    setView('search');

    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiBaseUrl}/api/movies/search?q=${encodeURIComponent(query)}`);

      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();
      setMovies(data.results || []);
    } catch (err) {
      setError('Error loading movies');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = async (movie) => {
    setLoading(true);
    setError('');

    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiBaseUrl}/api/movies/${movie.id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch movie detail');
      }

      const detail = await response.json();
      setSelectedMovie(detail);
      setView('detail');
    } catch (err) {
      setError('Error loading movie detail');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = (review) => {
    setSelectedMovie((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        reviews: [...(current.reviews || []), { ...review, id: Date.now() }],
      };
    });
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      {loading && <p>Loading...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && view === 'search' && movies.length > 0 && (
        <div onClick={(event) => {
          const target = event.target.closest('button[data-movie-id]');
          if (target && target.dataset.movieId) {
            const movie = movies.find((item) => item.id === Number(target.dataset.movieId));
            if (movie) {
              handleMovieClick(movie);
            }
          }
        }}>
          <MovieGrid movies={movies} />
        </div>
      )}
      {!loading && view === 'detail' && selectedMovie && <MovieDetail movie={selectedMovie} onReviewSubmit={handleReviewSubmit} />}
    </div>
  );
}

export default SearchView;
