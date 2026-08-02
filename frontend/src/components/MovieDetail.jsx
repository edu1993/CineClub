import { useState } from 'react';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import '../styles/components/MovieDetail.css';

function MovieDetail({ movie, onReviewSubmit, onGoBack, currentUser }) {
  const [posterLoaded, setPosterLoaded] = useState(false);

  if (!movie) {
    return null;
  }

  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  const avgScore = movie.avgScore || (movie.reviews?.length > 0
    ? Math.round((movie.reviews.reduce((sum, r) => sum + r.score, 0) / movie.reviews.length) * 10) / 10
    : 0);

  return (
    <section id="reviews" aria-label="movie detail" className="movie-detail">
      <div 
        className="detail-header"
        style={{
          backgroundImage: posterLoaded ? `linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%), url(${posterUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <button onClick={onGoBack} className="back-button" aria-label="Go back">
          ← Back
        </button>
        
        <div className="detail-content">
          <div className="poster-container">
            <img 
              src={posterUrl}
              alt={movie.title}
              className="movie-poster"
              onLoad={() => setPosterLoaded(true)}
            />
          </div>
          
          <div className="movie-info">
            <h2 className="movie-title">{movie.title}</h2>
            <p className="movie-release">{new Date(movie.release_date).getFullYear()}</p>
            
            {avgScore > 0 && (
              <div className="movie-score">
                <span className="score-label">Average Score:</span>
                <span className="score-value">{avgScore}/5 ⭐</span>
              </div>
            )}
            
            <p className="movie-overview">{movie.overview}</p>
          </div>
        </div>
      </div>

      <div className="detail-reviews">
        <h3>Reviews</h3>
        <ReviewForm 
          movieId={movie.id} 
          onSubmit={onReviewSubmit}
          author={currentUser}
        />
        <ReviewList reviews={movie.reviews || []} />
      </div>
    </section>
  );
}

export default MovieDetail;
