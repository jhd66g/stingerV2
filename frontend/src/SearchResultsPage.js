import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './HomePage.css';
import './SearchResultsPage.css';
import { API } from './api';

export default function SearchResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // 1) seed from ?q=
  const initQ = new URLSearchParams(location.search).get('q') || '';
  const [searchInput, setSearchInput] = useState(initQ);
  const [movies, setMovies]         = useState([]);

  // 2) whenever searchInput changes, debounce + fetch + update URL (replace)
  useEffect(() => {
    const q = searchInput.trim();
    if (!q) {
      setMovies([]);
      navigate(`/search`, { replace: true });
      return;
    }

    const timer = setTimeout(() => {
      fetch(`${API}/api/movies/search?q=${encodeURIComponent(q)}`)
        .then(r => r.json())
        .then(setMovies)
        .catch(console.error);
      navigate(`/search?q=${encodeURIComponent(q)}`, { replace: true });
    }, 250);

    return () => clearTimeout(timer);
  }, [searchInput, navigate]);

  return (
    <div className="search-results-page">
      <header className="search-header">
        <button
          className="btn-back"
          onClick={() => navigate('/')}      /* go back to home or previous page */
        >
          ← back
        </button>
        <div className="search-bar-container">
          <input
            type="text"
            className="search-input"
            placeholder="search movies…"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
          />
        </div>
      </header>

      <h2>Search Results for “{searchInput}”</h2>

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
              <div className="movie-title">{movie.title}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}