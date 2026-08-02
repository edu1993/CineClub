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
  const [currentUser, setCurrentUser] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('cineclub_user') || 'Guest';
    }
    return 'Guest';
  });
  const [reviewedMovies, setReviewedMovies] = useState([]);

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
    setView('search');
    localStorage.removeItem('cineclub_user');
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('cineclub_user');
    if (savedUser) {
      setCurrentUser(savedUser);
    } else if (!currentUser) {
      setCurrentUser('Guest');
    }
  }, [currentUser]);

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

  const handleGoBack = () => {
    setSelectedMovie(null);
    setView('search');
  };

  if (!currentUser && currentUser !== 'Guest') {
    return <LoginView onLogin={handleLogin} />;
  }

  const categories = ['Trending', 'Top Rated', 'New Releases', 'Action', 'Drama', 'Sci-Fi'];

  return (
    <div className="search-view-container">
      <UserHeader username={currentUser} onLogout={handleLogout} />
      
      <div className="search-view-content">
        <section className="hero-panel">
          <div>
            <p className="hero-kicker">CINECLUB</p>
            <h2>Search movies and point what you want to watch</h2>
            <p className="hero-copy">Find a film, open its details, and leave your score so your picks are always organized.</p>
          </div>
          <div className="hero-stats">
            <div>
              <strong>{reviewedMovies.length}</strong>
              <span>Movies pointed</span>
            </div>
            <div>
              <strong>Live</strong>
              <span>Search and rate instantly</span>
            </div>
          </div>
        </section>

        <div className="category-bar" aria-label="Movie categories">
          {categories.map((category) => (
            <button key={category} type="button" className="category-pill">
              {category}
            </button>
          ))}
        </div>

        <section className="featured-strip">
          <div>
            <p className="featured-label">YOUR WATCHLIST</p>
            <h3>Point and remember your favorites</h3>
          </div>
          <div className="featured-tags">
            <span>🎯 Point movies</span>
            <span>⭐ Leave ratings</span>
            <span>📝 Save your picks</span>
          </div>
        </section>

        <section className="cover-card">
          <div className="cover-content">
            <p className="cover-label">START HERE</p>
            <h3>Search a movie and make it yours</h3>
            <p>Use the search bar to find films, open the detail view, and point the ones you want to watch.</p>
          </div>
        </section>

        <SearchBar onSearch={handleSearch} />
        
        <div className="action-buttons">
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
