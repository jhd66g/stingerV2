import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './MovieDetailsPage.css';

function MovieDetailsPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  // Fetch the movie details by ID
  useEffect(() => {
    fetch(`/api/movies/${id}`)
      .then((res) => res.json())
      .then((data) => setMovie(data))
      .catch((err) => console.error("Error fetching movie details:", err));
  }, [id]);

  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <div className="movie-details">
      <Link to="/">← Back to Catalog</Link>
      <h1>{movie.title}</h1>

      {/* Streaming Service(s) */}
      <p>{movie.streaming_service}</p>

      {/* Genre(s) */}
      <p>{movie.genres.join(', ')}</p>

      {/* Studio */}
      <p>Studio: {movie.studio.join(', ')}</p>

      {/* Director */}
      <p>Director: {movie.director.join(', ')}</p>

      {/* Cast */}
      <p>Cast: {movie.cast.join(', ')}</p>

      {/* Overview */}
      <p>{movie.overview}</p>

      {/* Release date */}
      <p>Release date: {movie.release_date}</p>

      {/* Runtime */}
      <p>Runtime: {movie.runtime} minutes</p>
    </div>
  );
}

export default MovieDetailsPage;