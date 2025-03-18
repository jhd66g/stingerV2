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
 * - Fetches streaming services and all movies once on mount.
 * - Maintains filter state (streaming services, genres, rating range) and sort option.
 * - Only applies the filters (by calling the backend) when the user clicks "Update Filters."
 * - Sorts the currently displayed movies instantly when the sort option changes.
 * - Provides clear buttons for streaming services and genres.
 */
function HomePage() {
  // URL query parameters
  const [searchParams, setSearchParams] = useSearchParams();

  // Streaming services state
  const [streamingServices, setStreamingServices] = useState([]);
  const [activeServices, setActiveServices] = useState({});

  // Movies state (filtered movies returned from the backend)
  const [filteredMovies, setFilteredMovies] = useState([]);

  // Genres state
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState({});

  // Rating range state (using vote_average)
  const [minRating, setMinRating] = useState(() => parseFloat(searchParams.get('min')) || 0);
  const [maxRating, setMaxRating] = useState(() => parseFloat(searchParams.get('max')) || 10);

  // Sort option state
  const [sortOption, setSortOption] = useState(() => searchParams.get('sort') || 'alphabetical');

  // On mount, fetch streaming services and all movies (for deriving genres).
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
          // Default: all streaming services are checked.
          sortedServices.forEach(svc => { active[svc] = true; });
        }
        setActiveServices(active);
      })
      .catch(err => console.error('Error fetching streaming services:', err));

    // Fetch all movies only for deriving genres.
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
        // Initially, fetch filtered movies using the current (or default) filters.
        updateFilteredMovies(activeServices, selected, minRating, maxRating, sortOption);
      })
      .catch(err => console.error('Error fetching movies:', err));
  }, []); // run only once

  /**
   * Calls the backend filtering endpoint with the current filter state.
   * This function is called only when the user clicks "Update Filters."
   */
  const updateFilteredMovies = (active = activeServices, selected = selectedGenres, min = minRating, max = maxRating, sort = sortOption) => {
    const svcActive = Object.entries(active)
      .filter(([_, isActive]) => isActive)
      .map(([svc]) => svc)
      .join(',');
    const genreActive = Object.entries(selected)
      .filter(([_, isActive]) => isActive)
      .map(([genre]) => genre)
      .join(',');
    const params = new URLSearchParams({
      sort: sort,
      min: min,
      max: max,
      services: svcActive,
      genres: genreActive
    });
    // Update the URL.
    setSearchParams(params);
    // Fetch filtered movies from the backend.
    fetch(`/api/movies/filtered?${params.toString()}`)
      .then(res => res.json())
      .then(data => setFilteredMovies(data))
      .catch(err => console.error('Error fetching filtered movies:', err));
  };

  /**
   * When the sort option changes, sort the currently displayed movies immediately.
   */
  useEffect(() => {
    const sortedMovies = [...filteredMovies];
    if (sortOption === 'alphabetical') {
      sortedMovies.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === 'rating') {
      sortedMovies.sort((a, b) => b.vote_average - a.vote_average);
    } else if (sortOption === 'popularity') {
      sortedMovies.sort((a, b) => b.popularity - a.popularity);
    }
    setFilteredMovies(sortedMovies);
    // Also update URL with the new sort option.
    setSearchParams(prev => {
      prev.set('sort', sortOption);
      return prev;
    });
  }, [sortOption]); // triggers instantly on sort option change

  /**
   * Toggle a streaming service.
   */
  const handleServiceToggle = (service) => {
    setActiveServices(prev => ({
      ...prev,
      [service]: !prev[service]
    }));
  };

  /**
   * Toggle a genre.
   */
  const handleGenreToggle = (genre) => {
    setSelectedGenres(prev => ({
      ...prev,
      [genre]: !prev[genre]
    }));
  };

  /**
   * Clears all streaming service filters.
   */
  const clearStreamingServices = () => {
    const cleared = {};
    streamingServices.forEach(svc => {
      cleared[svc] = false;
    });
    setActiveServices(cleared);
  };

  /**
   * Clears all genre filters.
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
      .filter(([_, isActive]) => isActive)
      .map(([svc]) => svc);
    const activeGenreFilters = Object.entries(selectedGenres)
      .filter(([_, isActive]) => isActive)
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
          <button onClick={clearStreamingServices}>clear</button>

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
          <button onClick={clearGenres}>clear</button>

          {/* Rating slider */}
          <RatingSlider
            minRating={minRating}
            maxRating={maxRating}
            setMinRating={setMinRating}
            setMaxRating={setMaxRating}
          />

          {/* Update Filters Button */}
          <button onClick={() => updateFilteredMovies()}>update</button>
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