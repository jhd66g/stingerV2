import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Range } from 'react-range';
import './HomePage.css';

/**
 * Renders a double-ended slider for rating range (0–10) using react-range.
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
 * - On mount, fetches streaming services and movies (for deriving genres) once.
 * - Initializes filter state (active streaming services, selected genres, rating range, sort option)
 *   from localStorage if available; otherwise, uses defaults.
 * - Provides clear buttons and an "update" button that calls the backend filtering endpoint.
 * - Changing the sort option immediately re-sorts the displayed movies.
 * - Persists filter state in localStorage so that it remains when returning from a movie's details page.
 * - The header includes a search box that navigates to the search results page.
 */
function HomePage() {
  // Remove navigate since we won't use it here.
  // const navigate = useNavigate();

  // Streaming services state
  const [streamingServices, setStreamingServices] = useState([]);
  const [activeServices, setActiveServices] = useState(() => {
    const stored = localStorage.getItem("activeServices");
    return stored ? JSON.parse(stored) : {};
  });

  // Movies state (the filtered movies returned from the backend)
  const [filteredMovies, setFilteredMovies] = useState([]);

  // Genres state
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState(() => {
    const stored = localStorage.getItem("selectedGenres");
    return stored ? JSON.parse(stored) : {};
  });

  // Rating range state (using vote_average)
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

  // Search input state for header search (if used for navigation).
  const [searchInput, setSearchInput] = useState("");

  // On mount, fetch streaming services and movies (for deriving genres) only once.
  useEffect(() => {
    // Fetch streaming services.
    fetch('/api/streaming-services')
      .then(res => res.json())
      .then(data => {
        const sortedServices = data.sort((a, b) => a.localeCompare(b));
        setStreamingServices(sortedServices);
        if (Object.keys(activeServices).length === 0) {
          const defaults = {};
          sortedServices.forEach(svc => { defaults[svc] = true; });
          setActiveServices(defaults);
          localStorage.setItem("activeServices", JSON.stringify(defaults));
        }
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
        if (Object.keys(selectedGenres).length === 0) {
          const defaults = {};
          genreArr.forEach(g => { defaults[g] = true; });
          setSelectedGenres(defaults);
          localStorage.setItem("selectedGenres", JSON.stringify(defaults));
        }
        // Initially, fetch filtered movies using the current (or default) filters.
        updateFilteredMovies();
      })
      .catch(err => console.error('Error fetching movies:', err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  /**
   * Calls the backend filtering endpoint with the current filter state.
   * Called when the user clicks "update."
   */
  const updateFilteredMovies = () => {
    const svcActive = Object.entries(activeServices)
      .filter(([_, isActive]) => isActive)
      .map(([svc]) => svc)
      .join(',');
    const genreActive = Object.entries(selectedGenres)
      .filter(([_, isActive]) => isActive)
      .map(([genre]) => genre)
      .join(',');
    const params = new URLSearchParams({
      sort: sortOption,
      min: minRating,
      max: maxRating,
      services: svcActive,
      genres: genreActive
    });
    // Save filters to localStorage.
    localStorage.setItem("sortOption", sortOption);
    localStorage.setItem("minRating", minRating);
    localStorage.setItem("maxRating", maxRating);
    localStorage.setItem("activeServices", JSON.stringify(activeServices));
    localStorage.setItem("selectedGenres", JSON.stringify(selectedGenres));

    // Fetch the filtered movies from the backend.
    fetch(`/api/movies/filtered?${params.toString()}`)
      .then(res => res.json())
      .then(data => setFilteredMovies(data))
      .catch(err => console.error('Error fetching filtered movies:', err));
  };

  /**
   * When the sort option changes, re-sort the currently displayed movies immediately.
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
    localStorage.setItem("sortOption", sortOption);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortOption]);

  /**
   * Toggle a streaming service.
   */
  const handleServiceToggle = (service) => {
    setActiveServices(prev => {
      const newState = { ...prev, [service]: !prev[service] };
      localStorage.setItem("activeServices", JSON.stringify(newState));
      return newState;
    });
  };

  /**
   * Toggle a genre.
   */
  const handleGenreToggle = (genre) => {
    setSelectedGenres(prev => {
      const newState = { ...prev, [genre]: !prev[genre] };
      localStorage.setItem("selectedGenres", JSON.stringify(newState));
      return newState;
    });
  };

  /**
   * Clears all streaming service filters.
   */
  const clearStreamingServices = () => {
    const cleared = {};
    streamingServices.forEach(svc => { cleared[svc] = false; });
    setActiveServices(cleared);
    localStorage.setItem("activeServices", JSON.stringify(cleared));
  };

  /**
   * Clears all genre filters.
   */
  const clearGenres = () => {
    const cleared = {};
    genres.forEach(g => { cleared[g] = false; });
    setSelectedGenres(cleared);
    localStorage.setItem("selectedGenres", JSON.stringify(cleared));
  };

  /**
   * Renders a message showing the number of filtered movies.
   */
  const renderResultsMessage = () => {
    return (
      <div className="results-message">
        {filteredMovies.length} results found
      </div>
    );
  };

  /**
   * Handles search submission from the header search box.
   */
  const handleSearch = () => {
    // Navigate to the search results page.
    window.location.href = `/search?q=${encodeURIComponent(searchInput)}`;
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
            <label>sort by: </label>
            <select
              value={sortOption}
              onChange={e => setSortOption(e.target.value)}
            >
              <option value="alphabetical">alphabetical</option>
              <option value="rating">rating</option>
              <option value="popularity">popularity</option>
            </select>
          </div>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
          </div>
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
          <button onClick={updateFilteredMovies}>update</button>
        </nav>

        {/* Catalog (right column) */}
        <main className="catalog">
          <h3>Movies</h3>
          {renderResultsMessage()}
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