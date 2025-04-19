import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AboutPage.css';

export default function AboutPage() {
  const navigate = useNavigate();
  return (
    <div className="about-page">
      <button className="btn-back" onClick={() => navigate(-1)}>
        ← back
      </button>
      <h1 className="about-title">About</h1>
      <p className="about-text">
        <span className="about-product">STINGER</span> is a game-changing movie discovery tool built by{' '}
        <a
          href="https://www.linkedin.com/in/jack-duncan-768a38233"
          target="_blank"
          rel="noopener noreferrer"
          className="about-link"
        >
          Jack Duncan
        </a>
        . It compiles all streaming data into one easy-to-use platform, letting you filter films by streaming service, genre, and rating. Browse, search, and find what to watch next, all in one place.
      </p>
      <p className="about-text2">
        New features coming soon.
      </p>
    </div>
  );
}