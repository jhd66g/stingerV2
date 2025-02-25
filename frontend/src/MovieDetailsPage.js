import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './MovieDetailsPage.css';

/**
 * MovieDetailsPage component displays detailed information for a selected movie.
 * When a movie title is clicked on the catalog, the user is navigated here.
 */
function MovieDetailsPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  // On mount, fetch all movies and find the one that matches the given id.
  useEffect(() => {
    fetch('/api/movies/all')
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((m) => m.id === parseInt(id, 10));
        setMovie(found);
      })
      .catch((err) => console.error('Error fetching movie details:', err));
  }, [id]);

  if (!movie) return <div>Loading...</div>;

  return (
    <div className="movie-details">
      <Link to="/">← Back to Catalog</Link>
      <h1>{movie.title}</h1>
      <p><strong>Overview:</strong> {movie.overview}</p>
      <p><strong>Release Date:</strong> {movie.release_date}</p>
      <p><strong>Streaming Service:</strong> {movie.streaming_service}</p>
      <p><strong>Genres:</strong> {movie.genres.join(', ')}</p>
      <p><strong>Cast:</strong> {movie.cast.join(', ')}</p>
      <p><strong>Runtime:</strong> {movie.runtime} minutes</p>
    </div>
  );
}

export default MovieDetailsPage;