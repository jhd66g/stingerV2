/**
 * backend/src/main.java/com/example/myapp/MovieService.java
 * 
 * manages Movie objects
 */

 package com.example.myapp;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;
import java.util.Set;

/**
 * Service class for loading and processing movie data.
 */
@Service
public class MovieService {

    private List<Movie> movies;

    /**
     * Constructor that loads movies from the JSON file.
     */
    public MovieService() {
        loadMovies();
    }

    /**
     * Loads movie data from Movies2.json located in the classpath.
     */
    private void loadMovies() {
        ObjectMapper mapper = new ObjectMapper();
        TypeReference<List<Movie>> typeRef = new TypeReference<List<Movie>>() {};
        InputStream inputStream = getClass().getResourceAsStream("/Movies2.json");
        if (inputStream == null) {
            throw new IllegalStateException("Movies2.json not found in the classpath. Please place it in src/main/resources.");
        }
        try {
            movies = mapper.readValue(inputStream, typeRef);
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to load movie data", e);
        }
    }

    /**
      * Retrieves all movies sorted alphabetically by title.
      * @return List of movies sorted from A to Z.
      */
      public List<Movie> getAllMovies() {
        return movies.stream()
                .sorted(Comparator.comparing(Movie::getTitle))
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a movie by its ID.
     * @param id The movie ID.
     * @return The movie if found; otherwise, null.
     */
    public Movie getMovieById(int id) {
        Optional<Movie> result = movies.stream()
                .filter(movie -> movie.getId() == id)
                .findFirst();
        return result.orElse(null);
    }

    /**
      * Retrieves a list of unique streaming services from the movie data.
      * @return List of distinct streaming service names.
      */
      public List<String> getStreamingServices() {
        return movies.stream()
                .flatMap(movie -> movie.getStreaming_services().stream())
                .distinct()
                .sorted(String::compareToIgnoreCase)
                .collect(Collectors.toList());
    }

    /**
     * Returns a list of movies filtered by streaming services, genres, and rating range,
     * then sorted by the given sort option.
     *
     * Filtering logic:
     *   (movie.streaming_service is in (service1 OR service2 OR ...))
     *   AND (movie.genres contains at least one of (genre1 OR genre2 OR ...))
     *   AND (movie.vote_average is between minRating and maxRating)
     *
     * @param services a comma-separated list of streaming services (e.g., "Hulu,Max")
     * @param genres a comma-separated list of genres (e.g., "Action,War")
     * @param minRating the minimum vote_average
     * @param maxRating the maximum vote_average
     * @param sortOption the sort order: "alphabetical", "rating", or "popularity"
     * @return a list of filtered and sorted movies.
     */
    public List<Movie> getFilteredMovies(String services, String genres, double minRating, double maxRating, String sortOption) {
        List<Movie> filtered = movies.stream()
            // Filter by streaming services
            .filter(movie -> {
                if (services != null && !services.isEmpty()) {
                    List<String> svcFilter = Arrays.asList(services.split(","));
                    return movie.getStreaming_services().stream().anyMatch(svcFilter::contains);
                }
                return true;
            })
            // Filter by genres (at least one match)
            .filter(movie -> {
                if (genres != null && !genres.isEmpty()) {
                    List<String> genreFilter = Arrays.asList(genres.split(","));
                    return movie.getGenres().stream().anyMatch(genreFilter::contains);
                }
                return true;
            })
            // Filter by rating (vote_average)
            .filter(movie -> movie.getVote_average() >= minRating && movie.getVote_average() <= maxRating)
            .collect(Collectors.toList());
        
        return sortMovies(filtered, sortOption);
    }

    /**
     * Sorts the given list of movies based on the provided sort option.
     *
     * @param movies the list of movies to sort.
     * @param sortOption the sort order: "alphabetical", "rating", or "popularity"
     * @return the sorted list of movies.
     */
    private List<Movie> sortMovies(List<Movie> movies, String sortOption) {
        if ("alphabetical".equalsIgnoreCase(sortOption)) {
            movies.sort(Comparator.comparing(movie -> movie.getTitle().toLowerCase()));
        } else if ("rating".equalsIgnoreCase(sortOption)) {
            movies.sort((a, b) -> Double.compare(b.getVote_average(), a.getVote_average()));
        } else if ("popularity".equalsIgnoreCase(sortOption)) {
            movies.sort((a, b) -> Double.compare(b.getPopularity(), a.getPopularity()));
        }
        return movies;
    }
}