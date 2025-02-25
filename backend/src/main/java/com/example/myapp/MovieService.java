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
 import java.util.stream.Collectors;
 
 /**
  * Service class for handling movie data operations.
  */
 @Service
 public class MovieService {
 
     private List<Movie> movies;
 
     /**
      * Constructor. Loads movie data from the JSON file.
      */
     public MovieService() {
         loadMovies();
     }
 
     /**
      * Loads movies from Movies2.json file located in the classpath.
      */
     private void loadMovies() {
         ObjectMapper mapper = new ObjectMapper();
         TypeReference<List<Movie>> typeRef = new TypeReference<List<Movie>>() {};
         InputStream inputStream = getClass().getResourceAsStream("/movies2.json");
         try {
             movies = mapper.readValue(inputStream, typeRef);
         } catch (IOException e) {
             e.printStackTrace();
             throw new RuntimeException("Failed to load movie data", e);
         }
     }
 
     /**
      * Retrieves the top 10 movies sorted by popularity (descending).
      * @return List of top 10 movies by popularity.
      */
     public List<Movie> getTop10ByPopularity() {
         return movies.stream()
                 .sorted(Comparator.comparingDouble(Movie::getPopularity).reversed())
                 .limit(10)
                 .collect(Collectors.toList());
     }
 
     /**
      * Retrieves the top movies for a given genre sorted by popularity (descending).
      * Limits the result to a specified number.
      * @param genre The genre to filter movies by.
      * @param limit The maximum number of movies to return.
      * @return List of movies in the genre sorted by popularity.
      */
     public List<Movie> getTopMoviesByGenre(String genre, int limit) {
         return movies.stream()
                 .filter(movie -> movie.getGenres().stream().anyMatch(g -> g.equalsIgnoreCase(genre)))
                 .sorted(Comparator.comparingDouble(Movie::getPopularity).reversed())
                 .limit(limit)
                 .collect(Collectors.toList());
     }
 
     /**
      * Retrieves all movies for a given genre sorted alphabetically by title.
      * @param genre The genre to filter movies by.
      * @return List of all movies in the genre sorted alphabetically.
      */
     public List<Movie> getAllMoviesByGenre(String genre) {
         return movies.stream()
                 .filter(movie -> movie.getGenres().stream().anyMatch(g -> g.equalsIgnoreCase(genre)))
                 .sorted(Comparator.comparing(Movie::getTitle))
                 .collect(Collectors.toList());
     }
 
     /**
      * Retrieves all movies.
      * @return List of all movies.
      */
     public List<Movie> getAllMovies() {
         return movies;
     }
 
     /**
      * Retrieves a distinct list of streaming services from the movie data.
      * @return List of unique streaming service names.
      */
     public List<String> getStreamingServices() {
         return movies.stream()
                 .map(Movie::getStreaming_service)
                 .distinct()
                 .collect(Collectors.toList());
     }
 }