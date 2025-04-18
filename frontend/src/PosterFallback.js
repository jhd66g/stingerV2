// src/PosterFallback.js
import React, { useState, useCallback } from 'react';

const PosterFallback = ({
  posterPath,
  alt,
  sizes = ['original','w780','w500','w342','w185','w154','w92'],
  baseUrl = 'https://image.tmdb.org/t/p',
  placeholder = '/placeholder.png',
}) => {
  const [idx, setIdx] = useState(0);

  const src = posterPath
    ? `${baseUrl}/${sizes[idx]}${posterPath}`
    : placeholder;

  const handleError = useCallback((e) => {
    if (idx < sizes.length - 1) {
      setIdx(i => i + 1);
    } else {
      e.currentTarget.onerror = null;
      e.currentTarget.src = placeholder;
    }
  }, [idx, sizes.length, placeholder]);

  return (
    <img
      key={src}  /* force React to remount on src change */
      src={src}
      alt={alt}
      onError={handleError}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  );
};

export default PosterFallback;