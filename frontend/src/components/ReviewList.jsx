import StarRating from './StarRating';
import '../styles/components/ReviewList.css';

function ReviewList({ reviews = [] }) {
  if (!reviews.length) {
    return <p className="no-reviews">No reviews yet.</p>;
  }

  return (
    <ul className="review-list">
      {reviews.map((review) => (
        <li key={review.id} className="review-item">
          <div className="review-header">
            <strong className="review-author">{review.author}</strong>
            <StarRating score={review.score} />
          </div>
          <p className="review-comment">{review.comment}</p>
        </li>
      ))}
    </ul>
  );
}

export default ReviewList;
