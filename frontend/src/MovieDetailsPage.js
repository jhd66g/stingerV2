import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './MovieDetailsPage.css';

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

      {/* Show streaming service(s) */}
      <p>Available on {movie.streaming_service}</p>

      {/* Show genres */}
      <p>Genres: {movie.genres.join(', ')}</p>

      {/* Show studio */}
      <p>Studio: {movie.studio.join(', ')}</p>

      {/* Show director(s) */}
      <p>Director: {movie.director.join(', ')}</p>

      {/* Show cast */}
      <p>Cast: {movie.cast.join(', ')}</p>

      {/* Show overview */}
      <p>{movie.overview}</p>

      {/* Show release date */}
      <p>Release date: {movie.release_date}</p>

      {/* Show runtime */}
      <p>Runtime: {movie.runtime} minutes</p>

      {/* Show rating (vote_average) */}
      <p>Rating: {movie.vote_average}</p>
    </div>
  );
}

export default MovieDetailsPage;