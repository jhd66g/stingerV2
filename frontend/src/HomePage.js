import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Range } from 'react-range';
import './HomePage.css';

/**
 * A sub-component that renders a double-ended slider for rating range (0–10).
 * This uses the `react-range` library.
 */
function RatingSlider({ minRating, maxRating, setMinRating, setMaxRating }) {
  const STEP = 0.1;
  const MIN = 0;
  const MAX = 10;

  // We store the current slider values as [min, max].
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
 * - Fetches streaming services and all movies from the backend.
 * - Lets users filter by streaming service, genre, and rating range.
 * - Lets users sort by title, rating, or popularity.
 * - Displays the filtered/sorted list of movies.
 */
function HomePage() {
  // Streaming services
  const [streamingServices, setStreamingServices] = useState([]);
  const [activeServices, setActiveServices] = useState({});

  // Movie data
  const [allMovies, setAllMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);

  // Genres
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState({});

  // Rating range (min, max)
  const [minRating, setMinRating] = useState(0);
  const [maxRating, setMaxRating] = useState(10);

  // Sort option
  const [sortOption, setSortOption] = useState('alphabetical');

  /**
   * On mount, fetch streaming services and all movies.
   */
  useEffect(() => {
    // Fetch streaming services
    fetch('/api/streaming-services')
      .then(res => res.json())
      .then(data => {
        setStreamingServices(data);
        // Default: all services are active
        const active = {};
        data.forEach(svc => { active[svc] = true; });
        setActiveServices(active);
      })
      .catch(err => console.error('Error fetching streaming services:', err));

    // Fetch all movies
    fetch('/api/movies/all')
      .then(res => res.json())
      .then(data => {
        setAllMovies(data);

        // Derive distinct genres from the movie list
        const genreSet = new Set();
        data.forEach(movie => {
          movie.genres.forEach(g => genreSet.add(g));
        });
        const genreArr = Array.from(genreSet);
        setGenres(genreArr);

        // Default: no genres selected
        const selected = {};
        genreArr.forEach(g => { selected[g] = false; });
        setSelectedGenres(selected);

        // Initialize filteredMovies as everything, sorted A–Z
        const sorted = [...data].sort((a, b) => a.title.localeCompare(b.title));
        setFilteredMovies(sorted);
      })
      .catch(err => console.error('Error fetching movies:', err));
  }, []);

  /**
   * updateFilteredMovies:
   * Filters by streaming service, rating range, and selected genres,
   * then sorts according to the chosen sort option.
   */
  const updateFilteredMovies = () => {
    let movies = [...allMovies];

    // 1) Filter by streaming services
    movies = movies.filter(movie => activeServices[movie.streaming_service]);

    // 2) Filter by rating range
    movies = movies.filter(movie => (
      movie.vote_average >= minRating && movie.vote_average <= maxRating
    ));

    // 3) Filter by selected genres
    const activeGenres = Object.keys(selectedGenres).filter(g => selectedGenres[g]);
    if (activeGenres.length > 0) {
      movies = movies.filter(movie =>
        movie.genres.some(genre => activeGenres.includes(genre))
      );
    }

    // 4) Sort
    if (sortOption === 'alphabetical') {
      movies.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === 'rating') {
      movies.sort((a, b) => b.vote_average - a.vote_average);
    } else if (sortOption === 'popularity') {
      movies.sort((a, b) => b.popularity - a.popularity);
    }

    setFilteredMovies(movies);
  };

  // Whenever any filter or sort state changes, recalculate filteredMovies
  useEffect(() => {
    updateFilteredMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeServices, selectedGenres, minRating, maxRating, sortOption, allMovies]);

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
            <label key={service}>
              <input
                type="checkbox"
                checked={activeServices[service] || false}
                onChange={() => handleServiceToggle(service)}
              />
              {service}
            </label>
          ))}

          <h4>Genre</h4>
          {genres.map(genre => (
            <label key={genre}>
              <input
                type="checkbox"
                checked={selectedGenres[genre] || false}
                onChange={() => handleGenreToggle(genre)}
              />
              {genre}
            </label>
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
          <h2>MOVIES</h2>
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