import ReviewList from './ReviewList';

function MovieDetail({ movie }) {
  if (!movie) {
    return null;
  }

  return (
    <section aria-label="movie detail">
      <h2>{movie.title}</h2>
      <p>{movie.overview}</p>
      <p>{movie.release_date}</p>
      <ReviewList reviews={movie.reviews || []} />
    </section>
  );
}

export default MovieDetail;
