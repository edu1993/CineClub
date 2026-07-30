import { useState } from 'react';

const getApiBaseUrl = () => {
  return import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || 'http://localhost:3001';
};

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    const value = query.trim();
    if (value && onSearch) {
      onSearch(value);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="search-bar">
      <input
        aria-label="Search movies"
        placeholder="Search movies"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button type="button" onClick={handleSearch}>
        Search
      </button>
      <p data-testid="api-base-url">{getApiBaseUrl()}</p>
    </div>
  );
}

export default SearchBar;
