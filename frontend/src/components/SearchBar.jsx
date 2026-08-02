import { useState } from 'react';
import '../styles/components/SearchBar.css';

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
      <div className="search-input-wrapper">
        <input
          aria-label="Search movies"
          placeholder="Search movies"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleKeyDown}
          className="search-input"
        />
        <button type="button" onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>
    </div>
  );
}

export default SearchBar;
