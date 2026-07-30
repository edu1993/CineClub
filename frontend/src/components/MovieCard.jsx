function MovieCard({ movie }) {
  const posterUrl = movie?.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  const year = movie?.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';

  return (
    <article className="movie-card">
      <img src={posterUrl} alt={movie?.title || 'Movie poster'} />
      <h3>{movie?.title || 'Untitled movie'}</h3>
      <p>{year}</p>
      <p>Avg score: {movie?.avgScore ?? 'N/A'}</p>
    </article>
  );
}

export default MovieCard;
