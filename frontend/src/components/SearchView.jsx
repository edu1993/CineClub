import { useState } from 'react';
import SearchBar from './SearchBar';
import MovieGrid from './MovieGrid';

function SearchView() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (query) => {
    setLoading(true);
    setError('');

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

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      {loading && <p>Loading...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && movies.length > 0 && <MovieGrid movies={movies} />}
    </div>
  );
}

export default SearchView;
