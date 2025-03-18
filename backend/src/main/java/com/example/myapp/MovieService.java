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
 import java.util.Comparator;
 import java.util.List;
 import java.util.Optional;
 import java.util.Set;
 import java.util.stream.Collectors;
 import java.util.Arrays;

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
         Set<String> services = movies.stream()
                 .map(Movie::getStreaming_service)
                 .collect(Collectors.toSet());
         return services.stream().collect(Collectors.toList());
     }

     /**
     * Returns a list of movies filtered by streaming services, genres, and rating range,
     * then sorted by the given sort option.
     * 
     * @param services A comma‑separated list of streaming services (e.g., "Hulu,Max")
     * @param genres A comma‑separated list of genres (e.g., "Action,War")
     * @param minRating The minimum vote_average
     * @param maxRating The maximum vote_average
     * @param sortOption The sort order: "alphabetical", "rating", or "popularity"
     * @return A list of filtered and sorted movies.
     */
    public List<Movie> getFilteredMovies(String services, String genres, double minRating, double maxRating, String sortOption) {
        List<Movie> filtered = movies.stream()
            // Filter by streaming service if provided.
            .filter(movie -> {
                if (services != null && !services.isEmpty()) {
                    List<String> svcList = Arrays.asList(services.split(","));
                    return svcList.contains(movie.getStreaming_service());
                }
                return true;
            })
            // Filter by genres if provided. Movie must have at least one matching genre.
            .filter(movie -> {
                if (genres != null && !genres.isEmpty()) {
                    List<String> genreList = Arrays.asList(genres.split(","));
                    return movie.getGenres().stream().anyMatch(genreList::contains);
                }
                return true;
            })
            // Filter by rating (vote_average)
            .filter(movie -> movie.getVote_average() >= minRating && movie.getVote_average() <= maxRating)
            .collect(Collectors.toList());

        // Sort the list based on sortOption
        if ("alphabetical".equalsIgnoreCase(sortOption)) {
            filtered.sort((a, b) -> a.getTitle().compareToIgnoreCase(b.getTitle()));
        } else if ("rating".equalsIgnoreCase(sortOption)) {
            filtered.sort((a, b) -> Double.compare(b.getVote_average(), a.getVote_average()));
        } else if ("popularity".equalsIgnoreCase(sortOption)) {
            filtered.sort((a, b) -> Double.compare(b.getPopularity(), a.getPopularity()));
        }

        return filtered;
    }
}