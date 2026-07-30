function ReviewList({ reviews = [] }) {
  if (!reviews.length) {
    return <p>No reviews yet.</p>;
  }

  return (
    <ul>
      {reviews.map((review) => (
        <li key={review.id}>
          <strong>{review.author}</strong>
          <div>{review.score}/5</div>
          <p>{review.comment}</p>
        </li>
      ))}
    </ul>
  );
}

export default ReviewList;
