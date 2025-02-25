import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

/**
 * HomePage component displays the entire movie catalog (A to Z) along with a header and menu.
 * When a menu option or sort option changes, the page reloads.
 */
function HomePage() {
  const [movies, setMovies] = useState([]);
  const [sortOption, setSortOption] = useState('alphabetical');

  // Dummy states for menu toggles (for demonstration purposes)
  const [streamingToggle, setStreamingToggle] = useState(false);
  const [genreToggle, setGenreToggle] = useState(false);
  const [popularityToggle, setPopularityToggle] = useState(false);
  const [ratingToggle, setRatingToggle] = useState(false);

  // On mount, fetch all movies from the backend and sort them A–Z by default.
  useEffect(() => {
    fetch('/api/movies/all')
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort((a, b) => a.title.localeCompare(b.title));
        setMovies(sorted);
      })
      .catch((err) => console.error('Error fetching movies:', err));
  }, []);

  /**
   * Handles changes in the sort option.
   * Reloads the page after re-sorting the movie list.
   * @param {string} option The selected sort option.
   */
  const handleSortChange = (option) => {
    setSortOption(option);
    let sortedMovies = [];
    if (option === 'alphabetical') {
      sortedMovies = [...movies].sort((a, b) => a.title.localeCompare(b.title));
    } else if (option === 'rating') {
      sortedMovies = [...movies].sort((a, b) => b.vote_average - a.vote_average);
    } else if (option === 'popularity') {
      sortedMovies = [...movies].sort((a, b) => b.popularity - a.popularity);
    }
    setMovies(sortedMovies);
    // Reload the page (or simulate a reload) when sort changes.
    window.location.reload();
  };

  /**
   * Handles a change in any of the menu toggles.
   * In this example, the page reloads to apply the change.
   */
  const handleMenuToggle = () => {
    // For now, we simply reload the page whenever a toggle is changed.
    window.location.reload();
  };

  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <div className="header-left">
          <h1>Stinger Name</h1>
        </div>
        <div className="header-right">
          <div className="search-bar">Search Bar</div>
          <div className="sort-options">
            <label>Sort by: </label>
            <select
              value={sortOption}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="alphabetical">A to Z</option>
              <option value="rating">By Rating</option>
              <option value="popularity">By Popularity</option>
            </select>
          </div>
        </div>
      </header>
      <div className="homepage-body">
        <nav className="sidebar">
          <h3>Menu</h3>
          <div className="menu-section">
            <h4>Streaming Service Toggle</h4>
            <label>
              <input
                type="checkbox"
                checked={streamingToggle}
                onChange={() => {
                  setStreamingToggle(!streamingToggle);
                  handleMenuToggle();
                }}
              />
              Netflix
            </label>
            {/* Add more streaming service toggles as needed */}
          </div>
          <div className="menu-section">
            <h4>Genre Toggle</h4>
            <label>
              <input
                type="checkbox"
                checked={genreToggle}
                onChange={() => {
                  setGenreToggle(!genreToggle);
                  handleMenuToggle();
                }}
              />
              Action
            </label>
            {/* Add additional genre toggles */}
          </div>
          <div className="menu-section">
            <h4>Popularity Toggle</h4>
            <label>
              <input
                type="checkbox"
                checked={popularityToggle}
                onChange={() => {
                  setPopularityToggle(!popularityToggle);
                  handleMenuToggle();
                }}
              />
              Enable Popularity Filter
            </label>
          </div>
          <div className="menu-section">
            <h4>Rating Toggle</h4>
            <label>
              <input
                type="checkbox"
                checked={ratingToggle}
                onChange={() => {
                  setRatingToggle(!ratingToggle);
                  handleMenuToggle();
                }}
              />
              Enable Rating Filter
            </label>
          </div>
        </nav>
        <main className="catalog">
          <h2>Movie Catalog (A to Z)</h2>
          <ul>
            {movies.map((movie) => (
              <li key={movie.id}>
                <Link to={`/movie/${movie.id}`}>{movie.title}</Link>
              </li>
            ))}
          </ul>
        </main>
      </div>
    </div>
  );
}

export default HomePage;