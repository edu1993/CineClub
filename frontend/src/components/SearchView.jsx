import { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import MovieGrid from './MovieGrid';
import MovieDetail from './MovieDetail';
import LoginView from './LoginView';
import UserHeader from './UserHeader';
import '../styles/components/SearchView.css';

function SearchView() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [view, setView] = useState('search');
  const [currentUser, setCurrentUser] = useState(null);
  const [reviewedMovies, setReviewedMovies] = useState([]);
  const [recommendedMovie, setRecommendedMovie] = useState(null);

  const apiBaseUrl = import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || 'http://localhost:3001';

  const handleLogin = (username) => {
    setCurrentUser(username);
    setView('search');
    localStorage.setItem('cineclub_user', username);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setMovies([]);
    setSelectedMovie(null);
    setReviewedMovies([]);
    setRecommendedMovie(null);
    setView('search');
    localStorage.removeItem('cineclub_user');
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('cineclub_user');
    if (savedUser) {
      setCurrentUser(savedUser);
    }
  }, []);

  const handleSearch = async (query) => {
    setLoading(true);
    setError('');
    setSelectedMovie(null);
    setView('search');

    try {
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

      const updated = {
        ...current,
        reviews: [...(current.reviews || []), { ...review, id: Date.now() }],
      };

      // Track reviewed movies
      setReviewedMovies((prev) => {
        const movieId = current.id;
        if (!prev.includes(movieId)) {
          return [...prev, movieId];
        }
        return prev;
      });

      return updated;
    });
  };

  const handleGetRandomRecommendation = async () => {
    setLoading(true);
    setError('');

    try {
      // Popular searches to pick a random recommendation
      const searches = [
        'Action',
        'Drama',
        'Comedy',
        'Sci-Fi',
        'Horror',
        'Romance',
        'Thriller',
        'Animation',
      ];
      const randomSearch = searches[Math.floor(Math.random() * searches.length)];

      const response = await fetch(
        `${apiBaseUrl}/api/movies/search?q=${encodeURIComponent(randomSearch)}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const randomMovie = data.results[Math.floor(Math.random() * data.results.length)];
        await handleMovieClick(randomMovie);
        setRecommendedMovie(randomMovie);
      }
    } catch (err) {
      setError('Error loading recommendation');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    setSelectedMovie(null);
    setRecommendedMovie(null);
    setView('search');
  };

  if (!currentUser) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="search-view-container">
      <UserHeader username={currentUser} onLogout={handleLogout} />
      
      <div className="search-view-content">
        <SearchBar onSearch={handleSearch} />
        
        <div className="action-buttons">
          <button 
            onClick={handleGetRandomRecommendation}
            className="random-button"
            disabled={loading}
          >
            🎲 Get Random Recommendation
          </button>
          
          {reviewedMovies.length > 0 && (
            <div className="reviewed-info">
              <span className="badge">{reviewedMovies.length}</span>
              <span>Movies reviewed</span>
            </div>
          )}
        </div>

        {loading && <p className="loading">Loading...</p>}
        {error && <p className="error" role="alert">{error}</p>}
        
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

        {!loading && view === 'search' && movies.length === 0 && currentUser && (
          <div className="empty-state">
            <p>Search for a movie to get started! 🍿</p>
          </div>
        )}
        
        {!loading && view === 'detail' && selectedMovie && (
          <MovieDetail 
            movie={selectedMovie} 
            onReviewSubmit={handleReviewSubmit}
            onGoBack={handleGoBack}
            currentUser={currentUser}
          />
        )}
      </div>
    </div>
  );
}

export default SearchView;
