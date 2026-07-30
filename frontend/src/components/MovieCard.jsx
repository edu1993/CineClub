function MovieCard({ movie }) {
  const posterUrl = movie?.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  const year = movie?.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';

  return (
    <button type="button" className="movie-card" data-movie-id={movie?.id} aria-label={movie?.title || 'Movie poster'}>
      <img src={posterUrl} alt={movie?.title || 'Movie poster'} />
      <h3>{movie?.title || 'Untitled movie'}</h3>
      <p>{year}</p>
      <p>Avg score: {movie?.avgScore ?? 'N/A'}</p>
    </button>
  );
}

export default MovieCard;
