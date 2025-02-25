/**
 * backend/src/main.java/com/example/myapp/MovieController.java
 * 
 * displays Movie objects
 */

 package com.example.myapp;

 import org.springframework.web.bind.annotation.CrossOrigin;
 import org.springframework.web.bind.annotation.GetMapping;
 import org.springframework.web.bind.annotation.PathVariable;
 import org.springframework.web.bind.annotation.RestController;
 
 import java.util.List;
 
 /**
  * REST controller for movie-related endpoints.
  */
 @RestController
 @CrossOrigin(origins = "http://localhost:3000")
 public class MovieController {
 
     private final MovieService movieService;
 
     /**
      * Constructor for MovieController.
      * @param movieService The MovieService to handle movie data.
      */
     public MovieController(MovieService movieService) {
         this.movieService = movieService;
     }
 
     /**
      * Endpoint to retrieve streaming services.
      * @return List of streaming service names.
      */
     @GetMapping("/api/streaming-services")
     public List<String> getStreamingServices() {
         return movieService.getStreamingServices();
     }
 
     /**
      * Endpoint to retrieve the top 10 most popular movies.
      * @return List of top 10 movies sorted by popularity.
      */
     @GetMapping("/api/movies/popular")
     public List<Movie> getTopPopularMovies() {
         return movieService.getTop10ByPopularity();
     }
 
     /**
      * Endpoint to retrieve the top 25 movies for a given genre sorted by popularity.
      * @param genre The genre to filter movies by.
      * @return List of top 25 movies in the genre.
      */
     @GetMapping("/api/movies/genre/{genre}")
     public List<Movie> getTopMoviesByGenre(@PathVariable String genre) {
         return movieService.getTopMoviesByGenre(genre, 25);
     }
 
     /**
      * Endpoint to retrieve all movies for a given genre sorted alphabetically by title.
      * @param genre The genre to filter movies by.
      * @return List of all movies in the genre.
      */
     @GetMapping("/api/movies/genre/{genre}/all")
     public List<Movie> getAllMoviesByGenre(@PathVariable String genre) {
         return movieService.getAllMoviesByGenre(genre);
     }
 
     /**
      * Endpoint to retrieve all movies.
      * @return List of all movies.
      */
     @GetMapping("/api/movies/all")
     public List<Movie> getAllMovies() {
         return movieService.getAllMovies();
     }
 }