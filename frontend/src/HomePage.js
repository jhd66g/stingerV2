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
 * - Lets users filter by streaming service, genre, and rating range (using vote_average).
 * - Lets users sort by title, rating, or popularity.
 * - Saves the state in the URL query parameters so that filters persist across navigation.
 */
function HomePage() {
  // Use searchParams from React Router v6.
  const [searchParams, setSearchParams] = useSearchParams();

  // Streaming services
  const [streamingServices, setStreamingServices] = useState([]);
  const [activeServices, setActiveServices] = useState({});

  // Movies
  const [allMovies, setAllMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);

  // Genres
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState({});

  // Rating range state (using vote_average)
  const [minRating, setMinRating] = useState(() => parseFloat(searchParams.get('min')) || 0);
  const [maxRating, setMaxRating] = useState(() => parseFloat(searchParams.get('max')) || 10);

  // Sort option state
  const [sortOption, setSortOption] = useState(() => searchParams.get('sort') || 'alphabetical');

  // Fetch streaming services and movies only once on mount.
  useEffect(() => {
    // Fetch streaming services and sort them alphabetically.
    fetch('/api/streaming-services')
      .then(res => res.json())
      .then(data => {
        const sortedServices = data.sort((a, b) => a.localeCompare(b));
        setStreamingServices(sortedServices);
        // Initialize active services from URL if available.
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

    // Fetch all movies.
    fetch('/api/movies/all')
      .then(res => res.json())
      .then(data => {
        setAllMovies(data);
        // Derive distinct genres from the movie list and sort them.
        const genreSet = new Set();
        data.forEach(movie => {
          movie.genres.forEach(g => genreSet.add(g));
        });
        const genreArr = Array.from(genreSet).sort((a, b) => a.localeCompare(b));
        setGenres(genreArr);

        // Initialize selected genres from URL if available.
        const genreParam = searchParams.get('genres');
        let selected = {};
        if (genreParam) {
          const genreArray = genreParam.split(',');
          genreArr.forEach(g => { selected[g] = genreArray.includes(g); });
        } else {
          genreArr.forEach(g => { selected[g] = false; });
        }
        setSelectedGenres(selected);

        // Initialize filteredMovies as everything, sorted A–Z.
        const sorted = [...data].sort((a, b) => a.title.localeCompare(b.title));
        setFilteredMovies(sorted);
      })
      .catch(err => console.error('Error fetching movies:', err));
  }, []); // run only once on mount

  /**
   * Updates filteredMovies based on active streaming services, selected genres,
   * and rating range (vote_average), then sorts by the chosen sort option.
   */
  const updateFilteredMovies = () => {
    let movies = [...allMovies];

    // Filter by active streaming services.
    movies = movies.filter(movie => activeServices[movie.streaming_service]);

    // Filter by rating range.
    movies = movies.filter(movie => 
      movie.vote_average >= minRating && movie.vote_average <= maxRating
    );

    // Filter by selected genres (if any are active).
    const activeGenreKeys = Object.keys(selectedGenres).filter(g => selectedGenres[g]);
    if (activeGenreKeys.length > 0) {
      movies = movies.filter(movie =>
        movie.genres.some(genre => activeGenreKeys.includes(genre))
      );
    }

    // Sort the movies.
    if (sortOption === 'alphabetical') {
      movies.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === 'rating') {
      movies.sort((a, b) => b.vote_average - a.vote_average);
    } else if (sortOption === 'popularity') {
      movies.sort((a, b) => b.popularity - a.popularity);
    }

    setFilteredMovies(movies);
  };

  // Update filteredMovies whenever dependencies change.
  useEffect(() => {
    updateFilteredMovies();
  }, [activeServices, selectedGenres, minRating, maxRating, sortOption, allMovies]);

  // Update URL query parameters when filter state changes.
  useEffect(() => {
    const svcActive = Object.entries(activeServices)
      .filter(([_, active]) => active)
      .map(([svc]) => svc)
      .join(',');
    const genreActive = Object.entries(selectedGenres)
      .filter(([_, active]) => active)
      .map(([genre]) => genre)
      .join(',');
    setSearchParams({
      sort: sortOption,
      min: minRating,
      max: maxRating,
      services: svcActive,
      genres: genreActive
    });
  }, [activeServices, selectedGenres, minRating, maxRating, sortOption, setSearchParams]);

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

          {/* Single double-ended rating slider */}
          <RatingSlider
            minRating={minRating}
            maxRating={maxRating}
            setMinRating={setMinRating}
            setMaxRating={setMaxRating}
          />
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