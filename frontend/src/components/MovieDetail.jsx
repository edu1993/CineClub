import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';

function MovieDetail({ movie, onReviewSubmit }) {
  if (!movie) {
    return null;
  }

  return (
    <section aria-label="movie detail">
      <h2>{movie.title}</h2>
      <p>{movie.overview}</p>
      <p>{movie.release_date}</p>
      <ReviewForm movieId={movie.id} onSubmit={onReviewSubmit} />
      <ReviewList reviews={movie.reviews || []} />
    </section>
  );
}

export default MovieDetail;
