import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './SearchResultsPage.css';

/**
 * Custom hook to extract the "q" parameter from the URL.
 */
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

/**
 * SearchResultsPage displays the search results based on the query.
 */
function SearchResultsPage() {
  const navigate = useNavigate();
  const query = useQuery();
  const searchQuery = query.get("q") || "";
  const [movies, setMovies] = useState([]);
  const [input, setInput] = useState(searchQuery);

  useEffect(() => {
    if (searchQuery) {
      fetch(`/api/movies/search?q=${encodeURIComponent(searchQuery)}`)
        .then(res => res.json())
        .then(data => setMovies(data))
        .catch(err => console.error('Error fetching search results:', err));
    }
  }, [searchQuery]);

  const handleSearch = () => {
    // Navigate to the same page with the new query parameter.
    navigate(`/search?q=${encodeURIComponent(input)}`);
  };

  return (
    <div className="search-results-page">
      <header className="search-header">
      <button className="btn-back" onClick={() => navigate(-1)}>
        ← back
      </button>
        <div className="search-bar-container">
          <input 
            type="text"
            placeholder="Search movies..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      </header>
      <h2>Search Results for "{searchQuery}"</h2>
      {movies.length === 0 ? (
        <p>No matching movies found.</p>
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