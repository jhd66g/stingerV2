import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './MovieDetailsPage.css';

/**
 * Formats an array of streaming service names into a human-readable string.
 */
function formatStreamingServices(services) {
  if (!services || services.length === 0) return "";
  if (services.length === 1) return services[0];
  if (services.length === 2) return services.join(" and ");
  const allButLast = services.slice(0, -1).join(", ");
  const last = services[services.length - 1];
  return `${allButLast}, and ${last}`;
}

export default function MovieDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [videoId, setVideoId] = useState("");

  // Fetch movie details and trailer
  useEffect(() => {
    fetch(`/api/movies/${id}`)
      .then(res => res.json())
      .then(data => setMovie(data))
      .catch(err => console.error('Error fetching movie details:', err));

    fetch(`/api/movies/${id}/trailer`)
      .then(res => res.json())
      .then(data => {
        console.log("Trailer endpoint returned:", data);
        setVideoId(data.videoId || "");
      })
      .catch(err => console.error('Error fetching trailer:', err));
  }, [id]);  // ← ← ← Close your useEffect here

  if (!movie) {
    return <div className="movie-details">Loading…</div>;
  }

  return (
    <div className="movie-details">
      <button className="btn-back" onClick={() => navigate('/')}>
        ← back
      </button>

      <h1 className="movie-title-header">{movie.title}</h1>

      <p><strong>Available on:</strong> {formatStreamingServices(movie.streaming_services)}</p>
      <p><strong>Genres:</strong> {movie.genres.join(', ')}</p>
      <p><strong>Studio:</strong> {movie.studio.join(', ')}</p>
      <p><strong>Director:</strong> {movie.director.join(', ')}</p>
      <p><strong>Cast:</strong> {movie.cast.join(', ')}</p>
      <p className="overview">{movie.overview}</p>
      <div className="trailer-container">
        {videoId ? (
          <iframe
            title="Trailer"
            src={`https://www.youtube.com/embed/${videoId}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <p className="no-trailer">No trailer available.</p>
        )}
      </div>
      <p><strong>Release date:</strong> {movie.release_date}</p>
      <p><strong>Runtime:</strong> {movie.runtime} minutes</p>
      <p><strong>Rating:</strong> {movie.vote_average}</p>
    </div>
  );
}