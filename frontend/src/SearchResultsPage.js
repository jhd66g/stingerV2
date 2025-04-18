import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './HomePage.css';          // <-- grid + cards
import './SearchResultsPage.css'; // <-- header, overall page

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchResultsPage() {
  const navigate = useNavigate();
  const query = useQuery();
  const searchQuery = query.get("q") || "";

  const [movies, setMovies] = useState([]);
  const [searchInput, setSearchInput] = useState(searchQuery);

  useEffect(() => {
    if (searchQuery) {
      fetch(`/api/movies/search?q=${encodeURIComponent(searchQuery)}`)
        .then(res => res.json())
        .then(setMovies)
        .catch(console.error);
    }
  }, [searchQuery]);

  const handleSearch = () =>
    navigate(`/search?q=${encodeURIComponent(searchInput)}`);

  return (
    <div className="search-results-page">
      <header className="search-header">
        <button
          className="btn-back"
          onClick={() => navigate('/')}
        >← back</button>
        <div className="search-bar-container">
          <input
            type="text"
            className="search-input"
            placeholder="search movies…"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
        </div>
      </header>

      <h2>Search Results for “{searchQuery}”</h2>

      {movies.length === 0 ? (
        <p>No matching movies found :(</p>
      ) : (
        <div className="movie-grid">
          {movies.map(movie => (
            <Link
              key={movie.id}
              to={`/movie/${movie.id}`}
              className="movie-card"
            >
              <div className="poster-container">
                <img
                  src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                  alt={movie.title}
                  onError={e => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/placeholder.png';
                  }}
                />
              </div>
              <div className="movie-title">
                {movie.title}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}