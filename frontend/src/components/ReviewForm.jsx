import { useState } from 'react';

function ReviewForm({ movieId, onSubmit }) {
  const [author, setAuthor] = useState('');
  const [score, setScore] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!author.trim() || !score || !comment.trim()) {
      setError('All fields are required');
      setSubmitted(false);
      return;
    }

    setError('');

    const payload = {
      author: author.trim(),
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
      setAuthor('');
      setScore('');
      setComment('');

      if (onSubmit) {
        onSubmit(payload);
      }
    } catch (err) {
      setError('Could not submit review');
      setSubmitted(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p role="alert">{error}</p>}
      {submitted && <p>Review submitted</p>}

      <label htmlFor="author">Author</label>
      <input id="author" value={author} onChange={(event) => setAuthor(event.target.value)} />

      <label htmlFor="score">Score</label>
      <select id="score" value={score} onChange={(event) => setScore(event.target.value)}>
        <option value="">Select</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>

      <label htmlFor="comment">Comment</label>
      <textarea id="comment" value={comment} onChange={(event) => setComment(event.target.value)} />

      <button type="submit">Submit review</button>
    </form>
  );
}

export default ReviewForm;
