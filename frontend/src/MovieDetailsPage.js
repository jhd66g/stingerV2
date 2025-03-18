import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './MovieDetailsPage.css';

/**
 * Formats an array of streaming service names into a human-readable string.
 * For example:
 *  - [“Hulu”] => “Hulu”
 *  - [“Hulu”, “Netflix”] => “Hulu and Netflix”
 *  - [“Hulu”, “Netflix”, “Peacock Premium”] => “Hulu, Netflix, and Peacock Premium”
 *
 * @param {string[]} services - An array of streaming service names.
 * @returns {string} The formatted string.
 */
function formatStreamingServices(services) {
  if (!services || services.length === 0) return "";
  if (services.length === 1) return services[0];
  if (services.length === 2) return services.join(" and ");
  const allButLast = services.slice(0, -1).join(", ");
  const last = services[services.length - 1];
  return `${allButLast}, and ${last}`;
}

/**
 * MovieDetailsPage displays detailed information for a movie.
 * It shows the title, streaming services (formatted), genres, studio, director, cast,
 * overview, release date, runtime, and vote_average.
 */
function MovieDetailsPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    fetch(`/api/movies/${id}`)
      .then((res) => res.json())
      .then((data) => setMovie(data))
      .catch((err) => console.error('Error fetching movie details:', err));
  }, [id]);

  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <div className="movie-details">
      <Link to="/">← Back to Catalog</Link>
      <h1>{movie.title}</h1>

      {/* Format the streaming services array */}
      <p>
        Available on {formatStreamingServices(movie.streaming_services)}
      </p>

      <p>Genres: {movie.genres.join(', ')}</p>
      <p>Studio: {movie.studio.join(', ')}</p>
      <p>Director: {movie.director.join(', ')}</p>
      <p>Cast: {movie.cast.join(', ')}</p>
      <p>{movie.overview}</p>
      <p>Release date: {movie.release_date}</p>
      <p>Runtime: {movie.runtime} minutes</p>
      <p>Rating: {movie.vote_average}</p>
    </div>
  );
}

export default MovieDetailsPage;