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
 }