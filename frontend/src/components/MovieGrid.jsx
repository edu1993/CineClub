import MovieCard from './MovieCard';

function MovieGrid({ movies = [] }) {
  return (
    <section className="movie-grid" aria-label="Movie grid">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </section>
  );
}

export default MovieGrid;
