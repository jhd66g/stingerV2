import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [streamingServices, setStreamingServices] = useState([]);
  const [activeServices, setActiveServices] = useState({});
  const [topPopular, setTopPopular] = useState([]);
  const [genres, setGenres] = useState([]);
  const [genreMovies, setGenreMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [allMovies, setAllMovies] = useState([]);
  const [showAllFilms, setShowAllFilms] = useState(false);

  // On mount, fetch streaming services, top popular movies, and all movies (for genre extraction)
  useEffect(() => {
    // Fetch streaming services
    fetch('/api/streaming-services')
      .then(response => response.json())
      .then(data => {
        setStreamingServices(data);
        const active = {};
        data.forEach(service => { active[service] = true; });
        setActiveServices(active);
      })
      .catch(error => console.error("Error fetching streaming services:", error));

    // Fetch top 10 popular movies
    fetch('/api/movies/popular')
      .then(response => response.json())
      .then(data => setTopPopular(data))
      .catch(error => console.error("Error fetching top popular movies:", error));

    // Fetch all movies to derive the genre list
    fetch('/api/movies/all')
      .then(response => response.json())
      .then(data => {
        setAllMovies(data);
        const genreSet = new Set();
        data.forEach(movie => {
          movie.genres.forEach(g => genreSet.add(g));
        });
        setGenres(Array.from(genreSet));
      })
      .catch(error => console.error("Error fetching all movies:", error));
  }, []);

  /**
   * Filters movies based on active streaming services.
   * @param {Array} movies - List of movies to filter.
   * @returns {Array} Filtered list of movies.
   */
  const filterMoviesByService = (movies) => {
    return movies.filter(movie => activeServices[movie.streaming_service]);
  };

  /**
   * Handles toggling a streaming service on/off.
   * @param {string} service - The streaming service name.
   */
  const handleServiceToggle = (service) => {
    setActiveServices(prev => ({
      ...prev,
      [service]: !prev[service]
    }));
  };

  /**
   * Fetches the top 25 movies by the selected genre.
   * @param {string} genre - The genre to fetch.
   */
  const fetchTop25ByGenre = (genre) => {
    fetch(`/api/movies/genre/${encodeURIComponent(genre)}`)
      .then(response => response.json())
      .then(data => {
        setGenreMovies(data);
        setSelectedGenre(genre);
      })
      .catch(error => console.error("Error fetching top 25 movies by genre:", error));
  };

  /**
   * Fetches the full list of movies for a genre sorted alphabetically.
   * @param {string} genre - The genre to fetch.
   */
  const fetchFullGenreMovies = (genre) => {
    fetch(`/api/movies/genre/${encodeURIComponent(genre)}/all`)
      .then(response => response.json())
      .then(data => {
        setGenreMovies(data);
        setSelectedGenre(genre);
      })
      .catch(error => console.error("Error fetching full genre movies:", error));
  };

  /**
   * Toggles the display of all films.
   * When displayed, the movies are shown in alphabetical order.
   */
  const toggleAllFilms = () => {
    if (showAllFilms) {
      setShowAllFilms(false);
    } else {
      // Sort the existing allMovies by title alphabetically
      const sortedMovies = [...allMovies].sort((a, b) =>
        a.title.localeCompare(b.title)
      );
      setAllMovies(sortedMovies);
      setShowAllFilms(true);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Movie Catalog</h1>
        <section className="streaming-toggles">
          <h2>Toggle Streaming Services</h2>
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
        </section>

        <section className="top-popular">
          <h2>Top 10 Most Popular Movies</h2>
          {filterMoviesByService(topPopular).length === 0 ? (
            <p>Loading...</p>
          ) : (
            <ul>
              {filterMoviesByService(topPopular).map(movie => (
                <li key={movie.id}>
                  <strong>{movie.title}</strong> - Popularity: {movie.popularity}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="top-genre">
          <h2>Top 25 Movies by Genre</h2>
          <div className="genre-buttons">
            {genres.map(genre => (
              <button key={genre} onClick={() => fetchTop25ByGenre(genre)}>
                {genre}
              </button>
            ))}
          </div>
          {selectedGenre && (
            <>
              <h3>{selectedGenre} Movies</h3>
              <ul>
                {filterMoviesByService(genreMovies).map(movie => (
                  <li key={movie.id}>
                    <strong>{movie.title}</strong> - Popularity: {movie.popularity}
                  </li>
                ))}
              </ul>
              <button onClick={() => fetchFullGenreMovies(selectedGenre)}>
                See Full List for {selectedGenre} (Alphabetical)
              </button>
            </>
          )}
        </section>

        <section className="all-movies">
          <button onClick={toggleAllFilms}>Display All Films</button>
          {showAllFilms && (
            <ul>
              {filterMoviesByService(allMovies).map(movie => (
                <li key={movie.id}>
                  <strong>{movie.title}</strong>
                </li>
              ))}
            </ul>
          )}
        </section>
      </header>
    </div>
  );
}

export default App;