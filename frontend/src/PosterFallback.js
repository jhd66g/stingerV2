import { useState, useCallback } from 'react';

const PosterFallback = ({
  posterPath,
  alt,
  sizes = ['original','w342','w780','w500','w185','w154','w92'],
  baseUrl = 'https://image.tmdb.org/t/p',
  placeholder = '/placeholder.png',
}) => {
  const [idx, setIdx] = useState(0);

  // Build the URL for the current size index
  const src = posterPath
    ? `${baseUrl}/${sizes[idx]}${posterPath}`
    : placeholder;

  // When an error fires, try the next size (if any)
  const handleError = useCallback((e) => {
    if (idx < sizes.length - 1) {
      setIdx(i => i + 1);
    } else {
      // no more sizes → use placeholder and remove error handler
      e.currentTarget.onerror = null;
      e.currentTarget.src = placeholder;
    }
  }, [idx, sizes.length, placeholder]);

  return (
    <img
      src={src}
      alt={alt}
      onError={handleError}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  );
};

export default PosterFallback;