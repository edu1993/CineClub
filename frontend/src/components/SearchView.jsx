import { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import MovieGrid from './MovieGrid';
import MovieDetail from './MovieDetail';
import LoginView from './LoginView';
import UserHeader from './UserHeader';
import '../styles/components/SearchView.css';

function SearchView() {
  const [movies, setMovies] = useState([]);
  const [randomMovies, setRandomMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [randomLoading, setRandomLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [page, setPage] = useState('search');
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
    if (!selectedMovie) {
      return;
    }

    setSelectedMovie((current) => {
      if (!current) {
        return current;
      }

      const updated = {
        ...current,
        reviews: [...(current.reviews || []), { ...review, id: Date.now() }],
      };

      return updated;
    });

    setReviewedMovies((prev) => {
      const movieId = selectedMovie.id;
      if (prev.some((item) => item.id === movieId)) {
        return prev;
      }

      return [...prev, selectedMovie];
    });
  };

  const handleGoBack = () => {
    setSelectedMovie(null);
    setView('search');
  };

  const handleNavigate = (nextPage) => {
    setPage(nextPage);
    setSelectedMovie(null);
    setView('search');

    if (nextPage === 'random' && randomMovies.length === 0) {
      loadRandomMovies();
    }
  };

  const loadRandomMovies = async () => {
    setRandomLoading(true);
    setError('');
    setSelectedMovie(null);
    setView('search');

    try {
      const randomQuery = randomQueries[Math.floor(Math.random() * randomQueries.length)];
      const response = await fetch(`${apiBaseUrl}/api/movies/search?q=${encodeURIComponent(randomQuery)}`);

      if (!response.ok) {
        throw new Error('Failed to fetch random movies');
      }

      const data = await response.json();
      setRandomMovies(data.results || []);
    } catch (err) {
      setError('Error loading random movies');
      setRandomMovies([]);
    } finally {
      setRandomLoading(false);
    }
  };

  if (!currentUser && currentUser !== 'Guest') {
    return <LoginView onLogin={handleLogin} />;
  }

  const categories = ['Trending', 'Top Rated', 'New Releases', 'Action', 'Drama', 'Sci-Fi'];
  const randomQueries = ['action', 'drama', 'comedy', 'thriller', 'mystery', 'adventure', 'fantasy', 'animation'];

  return (
    <div className="search-view-container">
      <UserHeader username={currentUser} onLogout={handleLogout} onNavigate={handleNavigate} activePage={page} />
      
      <div className="search-view-content">
        {page === 'search' && (
          <>
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
                <span key={category} className="category-pill">
                  {category}
                </span>
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

            {!loading && view === 'search' && movies.length === 0 && (
              <div className="empty-state">
                <p>Search for a movie to get started! 🍿</p>
              </div>
            )}
          </>
        )}

        {page === 'random' && (
          <>
            <section className="hero-panel">
              <div>
                <p className="hero-kicker">RANDOM MOVIES</p>
                <h2>Discover films at random</h2>
                <p className="hero-copy">Browse a surprise collection and find a movie you didn't expect.</p>
              </div>
              <div className="hero-stats">
                <button type="button" className="refresh-button" onClick={loadRandomMovies}>Refresh picks</button>
                <span className="reviewed-count">{randomMovies.length} titles</span>
              </div>
            </section>

            {randomLoading && <p className="loading">Loading random movies...</p>}
            {error && <p className="error" role="alert">{error}</p>}

            {!randomLoading && randomMovies.length > 0 && (
              <div onClick={(event) => {
                const target = event.target.closest('button[data-movie-id]');
                if (target && target.dataset.movieId) {
                  const movie = randomMovies.find((item) => item.id === Number(target.dataset.movieId));
                  if (movie) {
                    handleMovieClick(movie);
                  }
                }
              }}>
                <MovieGrid movies={randomMovies} />
              </div>
            )}

            {!randomLoading && randomMovies.length === 0 && !error && (
              <div className="empty-state">
                <p>Click refresh to load a surprise selection of movies.</p>
              </div>
            )}
          </>
        )}

        {page === 'reviews' && (
          <>
            <section className="hero-panel">
              <div>
                <p className="hero-kicker">YOUR REVIEWS</p>
                <h2>Movies you already pointed</h2>
                <p className="hero-copy">This is the list of films you rated. Revisit your picks anytime.</p>
              </div>
              <div className="hero-stats">
                <div>
                  <strong>{reviewedMovies.length}</strong>
                  <span>Pointed movies</span>
                </div>
                <div>
                  <strong>Saved</strong>
                  <span>Your current picks</span>
                </div>
              </div>
            </section>

            {reviewedMovies.length > 0 ? (
              <div onClick={(event) => {
                const target = event.target.closest('button[data-movie-id]');
                if (target && target.dataset.movieId) {
                  const movie = reviewedMovies.find((item) => item.id === Number(target.dataset.movieId));
                  if (movie) {
                    handleMovieClick(movie);
                  }
                }
              }}>
                <MovieGrid movies={reviewedMovies} />
              </div>
            ) : (
              <div className="empty-reviews">
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 350'%3E%3Crect width='600' height='350' fill='%2310141c'/%3E%3Ccircle cx='130' cy='175' r='56' stroke='%23f5c518' stroke-width='8' fill='none'/%3E%3Ccircle cx='470' cy='175' r='56' stroke='%23f5c518' stroke-width='8' fill='none'/%3E%3Cpath d='M130 119h98M130 233h98M402 132h90M402 218h90' stroke='%23f5c518' stroke-width='8' stroke-linecap='round'/%3E%3Cline x1='360' y1='50' x2='360' y2='300' stroke='%23f5c518' stroke-width='10' stroke-linecap='round'/%3E%3Ctext x='300' y='320' font-family='Georgia,serif' font-size='26' fill='%23f5c518' text-anchor='middle'%3ENo reviews yet%3C/text%3E%3C/svg%3E" alt="Stylized film reel with no reviews yet" />
                <p>Oops, no hay nada aquí para ver. Ve a Home o Movies y comienza a puntuar películas.</p>
              </div>
            )}
          </>
        )}

        {view === 'detail' && selectedMovie && (
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
