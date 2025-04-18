import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RatingSlider from './RatingSlider';
import PosterFallback from './PosterFallback';
import './HomePage.css';

/**
 * HomePage component:
 * - Fetches and applies filters via backend on "update"
 * - Persists filters in localStorage
 * - Header includes search box styled like SearchResultsPage
 */
function HomePage() {
  // sidebar collapsability
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // state of Streaming Service and Genre
  const [showServices, setShowServices] = useState(true);
  const [showGenres,  setShowGenres]  = useState(true);
  const [showRating, setShowRating] = useState(true);

  // Streaming services state
  const [streamingServices, setStreamingServices] = useState([]);
  const [activeServices, setActiveServices] = useState(() => {
    const stored = localStorage.getItem("activeServices");
    return stored ? JSON.parse(stored) : {};
  });
  
  // Movies state (filtered results)
  const [filteredMovies, setFilteredMovies] = useState([]);

  // Genres state
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState(() => {
    const stored = localStorage.getItem("selectedGenres");
    return stored ? JSON.parse(stored) : {};
  });

  // Rating range state
  const [minRating, setMinRating] = useState(() => {
    const stored = localStorage.getItem("minRating");
    return stored ? parseFloat(stored) : 0;
  });
  const [maxRating, setMaxRating] = useState(() => {
    const stored = localStorage.getItem("maxRating");
    return stored ? parseFloat(stored) : 10;
  });

  // Sort option state
  const [sortOption, setSortOption] = useState(() => {
    const stored = localStorage.getItem("sortOption");
    return stored || "alphabetical";
  });

  // Search input state
  const [searchInput, setSearchInput] = useState("");

  // On mount: load services & genres, then initial fetch
  useEffect(() => {
    fetch('/api/streaming-services')
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a, b) => a.localeCompare(b));
        setStreamingServices(sorted);
        if (!Object.keys(activeServices).length) {
          const defaults = {};
          sorted.forEach(svc => defaults[svc] = true);
          setActiveServices(defaults);
          localStorage.setItem("activeServices", JSON.stringify(defaults));
        }
      });

    fetch('/api/movies/all')
      .then(res => res.json())
      .then(data => {
        const setG = new Set();
        data.forEach(m => m.genres.forEach(g => setG.add(g)));
        const arr = [...setG].sort((a, b) => a.localeCompare(b));
        setGenres(arr);
        if (!Object.keys(selectedGenres).length) {
          const defaults = {};
          arr.forEach(g => defaults[g] = true);
          setSelectedGenres(defaults);
          localStorage.setItem("selectedGenres", JSON.stringify(defaults));
        }
        updateFilteredMovies();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply filters via backend
  const updateFilteredMovies = () => {
    const svcParam = Object.entries(activeServices)
      .filter(([_, v]) => v)
      .map(([s]) => s).join(',');
    const genreParam = Object.entries(selectedGenres)
      .filter(([_, v]) => v)
      .map(([g]) => g).join(',');
    const params = new URLSearchParams({
      sort: sortOption,
      min: minRating,
      max: maxRating,
      services: svcParam,
      genres: genreParam
    });
    localStorage.setItem("sortOption", sortOption);
    localStorage.setItem("minRating", minRating);
    localStorage.setItem("maxRating", maxRating);
    localStorage.setItem("activeServices", JSON.stringify(activeServices));
    localStorage.setItem("selectedGenres", JSON.stringify(selectedGenres));

    fetch(`/api/movies/filtered?${params}`)
      .then(r => r.json())
      .then(data => setFilteredMovies(data));
  };

  // Instant sort
  useEffect(() => {
    const arr = [...filteredMovies];
    if (sortOption === 'alphabetical') arr.sort((a,b)=>a.title.localeCompare(b.title));
    if (sortOption === 'rating')       arr.sort((a,b)=>b.vote_average - a.vote_average);
    if (sortOption === 'popularity')   arr.sort((a,b)=>b.popularity - a.popularity);
    setFilteredMovies(arr);
    localStorage.setItem("sortOption", sortOption);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortOption]);

  const handleServiceToggle = svc => {
    const next = {...activeServices, [svc]: !activeServices[svc]};
    setActiveServices(next);
    localStorage.setItem("activeServices", JSON.stringify(next));
  };
  const handleGenreToggle = g => {
    const next = {...selectedGenres, [g]: !selectedGenres[g]};
    setSelectedGenres(next);
    localStorage.setItem("selectedGenres", JSON.stringify(next));
  };
  const clearStreamingServices = () => {
    const cleared = {};
    streamingServices.forEach(svc => cleared[svc]=false);
    setActiveServices(cleared);
    localStorage.setItem("activeServices", JSON.stringify(cleared));
  };
  const clearGenres = () => {
    const cleared = {};
    genres.forEach(g => cleared[g]=false);
    setSelectedGenres(cleared);
    localStorage.setItem("selectedGenres", JSON.stringify(cleared));
  };

  const renderResultsMessage = () => (
    <div className="results-message">
      {filteredMovies.length} results found
    </div>
  );

  const handleSearch = () => {
    window.location.href = `/search?q=${encodeURIComponent(searchInput)}`;
  };

  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <div className="header-left"><h1>STINGER</h1></div>
        <div className="header-right">
        <div className="sort-dropdown">
          <select
            className="sort-select"
            value={sortOption}
            onChange={e => setSortOption(e.target.value)}
          >
            <option value="alphabetical">a to z</option>
            <option value="rating">rating</option>
            <option value="popularity">popularity</option>
          </select>
        </div>
          <div className="search-bar-container">
          <input
            type="text"
            className="search-input"
            placeholder="search movies ..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
        </div>
        </div>
      </header>

      <div className="homepage-body">
      <nav className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <button
              className="sidebar-collapse-btn"
              onClick={() => setSidebarCollapsed(s => !s)}
              aria-label={sidebarCollapsed ? 'Expand filters' : 'Collapse filters'}
            />
      {/* SERVICES */}
      <h4
        className={`sidebar-toggle ${showServices ? '' : 'collapsed'}`}
        onClick={() => setShowServices(s => !s)}
      >
        Streaming Service
        <span className="toggle-arrow">▼</span>
      </h4>
      <div className={`sidebar-section ${showServices ? 'expanded' : ''}`}>
        {streamingServices.map(svc => (
          <div key={svc}>
            <label>
              <input
                type="checkbox"
                checked={activeServices[svc] || false}
                onChange={() => handleServiceToggle(svc)}
              />
              <span className="filter-pill">{svc}</span>
            </label>
          </div>
        ))}
        <button className="btn" onClick={clearStreamingServices}>
          clear
        </button>
      </div>

      {/* GENRES */}
      <h4
        className={`sidebar-toggle ${showGenres ? '' : 'collapsed'}`}
        onClick={() => setShowGenres(s => !s)}
      >
        Genre
        <span className="toggle-arrow">▼</span>
      </h4>
      <div className={`sidebar-section ${showGenres ? 'expanded' : ''}`}>
        {genres.map(g => (
          <div key={g}>
            <label>
              <input
                type="checkbox"
                checked={selectedGenres[g] || false}
                onChange={() => handleGenreToggle(g)}
              />
              <span className="filter-pill">{g}</span>
            </label>
          </div>
        ))}
        <button className="btn" onClick={clearGenres}>
          clear
        </button>
      </div>

      {/* RATING */}
      <h4
        className={`sidebar-toggle ${showRating ? '' : 'collapsed'}`}
        onClick={() => setShowRating(r => !r)}
      >
        Rating
        <span className="toggle-arrow">▼</span>
      </h4>
      <div className={`sidebar-section ${showRating ? 'expanded' : ''}`}>
        <RatingSlider
          minRating={minRating}
          maxRating={maxRating}
          setMinRating={setMinRating}
          setMaxRating={setMaxRating}
        />
      </div>

         <button className="btn" onClick={updateFilteredMovies}>
          update
         </button>
        </nav>

        <main className="catalog">
          {renderResultsMessage()}

          <div className="movie-grid">
            {filteredMovies.map(movie => (
              <Link key={movie.id} to={`/movie/${movie.id}`} className="movie-card">
                <div className="poster-container">
                  <PosterFallback
                    posterPath={movie.poster_path}
                    alt={movie.title}
                  />
                </div>
                <div className="movie-title">{movie.title}</div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default HomePage;