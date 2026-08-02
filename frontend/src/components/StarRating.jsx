import '../styles/components/StarRating.css';

function StarRating({ score, interactive = false, onChange = null }) {
  const handleClick = (index) => {
    if (interactive && onChange) {
      onChange(index + 1);
    }
  };

  return (
    <div className={`star-rating ${interactive ? 'interactive' : ''}`}>
      {[0, 1, 2, 3, 4].map((index) => (
        <button
          key={index}
          className={`star ${index < score ? 'filled' : 'empty'}`}
          onClick={() => handleClick(index)}
          type={interactive ? 'button' : 'div'}
          aria-label={`${index + 1} stars`}
          disabled={!interactive}
        >
          ★
        </button>
      ))}
      {!interactive && <span className="score-text">{score > 0 ? `${score}/5` : 'N/A'}</span>}
    </div>
  );
}

export default StarRating;
