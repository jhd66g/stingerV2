import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Range } from 'react-range';
import './HomePage.css';

/**
 * A sub-component that renders a double-ended slider for rating range (0–10).
 * Uses the `react-range` library.
 */
function RatingSlider({ minRating, maxRating, setMinRating, setMaxRating }) {
  const STEP = 0.1;
  const MIN = 0;
  const MAX = 10;
  const values = [minRating, maxRating];

  const handleChange = (newValues) => {
    setMinRating(newValues[0]);
    setMaxRating(newValues[1]);
  };

  return (
    <div style={{ margin: '1rem 0' }}>
      <label style={{ display: 'block', marginBottom: '0.5rem' }}>
        Rating: {minRating.toFixed(1)} — {maxRating.toFixed(1)}
      </label>
      <Range
        step={STEP}
        min={MIN}
        max={MAX}
        values={values}
        onChange={handleChange}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            style={{
              height: '6px',
              background: '#ccc',
              margin: '1rem 0',
              position: 'relative'
            }}
          >
            {children}
          </div>
        )}
        renderThumb={({ props }) => (
          <div
            {...props}
            style={{
              height: '20px',
              width: '20px',
              backgroundColor: '#999',
              borderRadius: '50%',
              boxShadow: '0 0 2px #666'
            }}
          />
        )}
      />
    </div>
  );
}

/**
 * HomePage component:
 * - Fetches streaming services and all movies from the backend once.
 * - Stores filter state (streaming services, genres, rating range, sort option).
 * - When "Update Filters" is clicked, builds a query string and fetches filtered movies from the backend.
 * - Provides Clear buttons to uncheck streaming service and genre filters.
 */
function HomePage() {
  // Use searchParams from React Router v6.
  const [searchParams, setSearchParams] = useSearchParams();

  // Streaming services
  const [streamingServices, setStreamingServices] = useState([]);
  const [activeServices, setActiveServices] = useState({});

  // Movies
  const [filteredMovies, setFilteredMovies] = useState([]);

  // Genres
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState({});

  // Rating range state (using vote_average)
  const [minRating, setMinRating] = useState(() => parseFloat(searchParams.get('min')) || 0);
  const [maxRating, setMaxRating] = useState(() => parseFloat(searchParams.get('max')) || 10);

  // Sort option state
  const [sortOption, setSortOption] = useState(() => searchParams.get('sort') || 'alphabetical');

  // Fetch streaming services and movies once on mount.
  useEffect(() => {
    // Fetch streaming services.
    fetch('/api/streaming-services')
      .then(res => res.json())
      .then(data => {
        const sortedServices = data.sort((a, b) => a.localeCompare(b));
        setStreamingServices(sortedServices);
        const svcParam = searchParams.get('services');
        let active = {};
        if (svcParam) {
          const svcArray = svcParam.split(',');
          sortedServices.forEach(svc => { active[svc] = svcArray.includes(svc); });
        } else {
          sortedServices.forEach(svc => { active[svc] = true; });
        }
        setActiveServices(active);
      })
      .catch(err => console.error('Error fetching streaming services:', err));

    // Fetch all movies to derive the genres.
    fetch('/api/movies/all')
      .then(res => res.json())
      .then(data => {
        const genreSet = new Set();
        data.forEach(movie => {
          movie.genres.forEach(g => genreSet.add(g));
        });
        const genreArr = Array.from(genreSet).sort((a, b) => a.localeCompare(b));
        setGenres(genreArr);
        const genreParam = searchParams.get('genres');
        let selected = {};
        if (genreParam) {
          const genreArray = genreParam.split(',');
          genreArr.forEach(g => { selected[g] = genreArray.includes(g); });
        } else {
          // Default: all genres are checked.
          genreArr.forEach(g => { selected[g] = true; });
        }
        setSelectedGenres(selected);
        // Initially fetch filtered movies using the current (or default) filters.
        updateFilteredMovies(activeServices, selected, minRating, maxRating, sortOption);
      })
      .catch(err => console.error('Error fetching movies:', err));
  }, []); // run once on mount

  /**
   * Calls the backend filtering endpoint with the current filter state.
   */
  const updateFilteredMovies = (active = activeServices, selected = selectedGenres, min = minRating, max = maxRating, sort = sortOption) => {
    const svcActive = Object.entries(active)
      .filter(([_, active]) => active)
      .map(([svc]) => svc)
      .join(',');
    const genreActive = Object.entries(selected)
      .filter(([_, active]) => active)
      .map(([genre]) => genre)
      .join(',');
    const params = new URLSearchParams({
      sort: sort,
      min: min,
      max: max,
      services: svcActive,
      genres: genreActive
    });
    // Update the URL query parameters.
    setSearchParams(params);

    // Fetch filtered movies from the backend.
    fetch(`/api/movies/filtered?${params.toString()}`)
      .then(res => res.json())
      .then(data => setFilteredMovies(data))
      .catch(err => console.error('Error fetching filtered movies:', err));
  };

  /**
   * Toggle a streaming service on/off.
   */
  const handleServiceToggle = (service) => {
    setActiveServices(prev => ({
      ...prev,
      [service]: !prev[service]
    }));
  };

  /**
   * Toggle a genre on/off.
   */
  const handleGenreToggle = (genre) => {
    setSelectedGenres(prev => ({
      ...prev,
      [genre]: !prev[genre]
    }));
  };

  /**
   * Clears all streaming service filters (unchecks all).
   */
  const clearStreamingServices = () => {
    const cleared = {};
    streamingServices.forEach(svc => {
      cleared[svc] = false;
    });
    setActiveServices(cleared);
  };

  /**
   * Clears all genre filters (unchecks all).
   */
  const clearGenres = () => {
    const cleared = {};
    genres.forEach(g => {
      cleared[g] = false;
    });
    setSelectedGenres(cleared);
  };

  /**
   * Renders active filters as a stack of tags.
   */
  const renderActiveFilters = () => {
    const activeServiceFilters = Object.entries(activeServices)
      .filter(([_, active]) => active)
      .map(([svc]) => svc);
    const activeGenreFilters = Object.entries(selectedGenres)
      .filter(([_, active]) => active)
      .map(([genre]) => genre);
    return (
      <div className="active-filters">
        {activeServiceFilters.map(filter => (
          <span key={`svc-${filter}`} className="filter-tag">{filter}</span>
        ))}
        {activeGenreFilters.map(filter => (
          <span key={`genre-${filter}`} className="filter-tag">{filter}</span>
        ))}
        <span className="filter-tag">
          Rating: {minRating.toFixed(1)} — {maxRating.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <div className="homepage-container">
      {/* Header */}
      <header className="homepage-header">
        <div className="header-left">
          <h1>Stinger</h1>
        </div>
        <div className="header-right">
          <div className="sort-options">
            <label>Sort by: </label>
            <select
              value={sortOption}
              onChange={e => setSortOption(e.target.value)}
            >
              <option value="alphabetical">A to Z</option>
              <option value="rating">By Rating</option>
              <option value="popularity">By Popularity</option>
            </select>
          </div>
          <div className="search-bar">search</div>
        </div>
      </header>

      {/* Two-column layout */}
      <div className="homepage-body">
        {/* Sidebar (left column) */}
        <nav className="sidebar">
          <h4>Streaming Service</h4>
          {streamingServices.map(service => (
            <div key={service}>
              <label>
                <input
                  type="checkbox"
                  checked={activeServices[service] || false}
                  onChange={() => handleServiceToggle(service)}
                />
                {service}
              </label>
            </div>
          ))}
          <button onClick={clearStreamingServices}>Clear Streaming Services</button>

          <h4>Genre</h4>
          {genres.map(genre => (
            <div key={genre}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedGenres[genre] || false}
                  onChange={() => handleGenreToggle(genre)}
                />
                {genre}
              </label>
            </div>
          ))}
          <button onClick={clearGenres}>Clear Genres</button>

          {/* Rating slider */}
          <RatingSlider
            minRating={minRating}
            maxRating={maxRating}
            setMinRating={setMinRating}
            setMaxRating={setMaxRating}
          />

          {/* Update Filters Button */}
          <button onClick={() => updateFilteredMovies()}>Update Filters</button>
        </nav>

        {/* Catalog (right column) */}
        <main className="catalog">
          <h3>Movies</h3>
          {renderActiveFilters()}
          <ul>
            {filteredMovies.map(movie => (
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