import { useState } from 'react';
import StarRating from './StarRating';
import '../styles/components/ReviewForm.css';

function ReviewForm({ movieId, onSubmit, author = 'Anonymous' }) {
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!score || !comment.trim()) {
      setError('All fields are required');
      setSubmitted(false);
      return;
    }

    setError('');

    const payload = {
      author: author.trim() || 'Anonymous',
      score: Number(score),
      comment: comment.trim(),
    };

    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || 'http://localhost:3001';
      await fetch(`${apiBaseUrl}/api/movies/${movieId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      setSubmitted(true);
      setScore(0);
      setComment('');

      setTimeout(() => setSubmitted(false), 3000);

      if (onSubmit) {
        onSubmit(payload);
      }
    } catch (err) {
      setError('Could not submit review');
      setSubmitted(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      {error && <p className="form-error" role="alert">{error}</p>}
      {submitted && <p className="form-success">Review submitted!</p>}

      <div className="form-group">
        <label className="form-label">Your rating</label>
        <StarRating score={score} interactive onChange={setScore} />
      </div>

      <div className="form-group">
        <label htmlFor="comment" className="form-label">Your comment</label>
        <textarea 
          id="comment" 
          value={comment} 
          onChange={(event) => setComment(event.target.value)}
          placeholder="Share your thoughts about this movie..."
          className="form-textarea"
        />
      </div>

      <button type="submit" className="submit-button">Submit review</button>
    </form>
  );
}

export default ReviewForm;
