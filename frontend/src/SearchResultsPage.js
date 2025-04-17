import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './SearchResultsPage.css';

/** grab the “q” param from the URL */
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResultsPage() {
  const navigate = useNavigate();
  const query = useQuery();
  const searchQuery = query.get("q") || "";

  // rename state to match your inputs
  const [movies, setMovies] = useState([]);
  const [searchInput, setSearchInput] = useState(searchQuery);

  useEffect(() => {
    if (searchQuery) {
      fetch(`/api/movies/search?q=${encodeURIComponent(searchQuery)}`)
        .then(res => res.json())
        .then(data => setMovies(data))
        .catch(err => console.error('Error fetching search results:', err));
    }
  }, [searchQuery]);

  const handleSearch = () => {
    navigate(`/search?q=${encodeURIComponent(searchInput)}`);
  };

  return (
    <div className="search-results-page">
      <header className="search-header">
        <button className="btn-back" onClick={() => navigate('/')}>
          ← back
        </button>
        <div className="search-bar-container">
          <input
            type="text"
            className="search-input"
            placeholder="search movies…"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleSearch();
            }}
          />
        </div>
      </header>

      <h2>Search Results for “{searchQuery}”</h2>

      {movies.length === 0 ? (
        <p>No matching movies found :(</p>
      ) : (
        <ul className="results-list">
          {movies.map(movie => (
            <li key={movie.id}>
              <Link to={`/movie/${movie.id}`}>{movie.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchResultsPage;