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
 import org.springframework.web.bind.annotation.RequestParam;
 
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
      * @param movieService The service that provides movie data.
      */
     public MovieController(MovieService movieService) {
         this.movieService = movieService;
     }
 
     /**
      * Endpoint to retrieve all movies sorted alphabetically.
      * @return List of all movies (A to Z).
      */
     @GetMapping("/api/movies/all")
     public List<Movie> getAllMovies() {
         return movieService.getAllMovies();
     }
 
     /**
      * Endpoint to retrieve a movie by its ID.
      * @param id The movie ID.
      * @return The movie details if found.
      */
     @GetMapping("/api/movies/{id}")
     public Movie getMovieById(@PathVariable int id) {
         return movieService.getMovieById(id);
     }
 
     /**
      * Endpoint to retrieve all distinct streaming services.
      * @return List of streaming service names.
      */
     @GetMapping("/api/streaming-services")
     public List<String> getStreamingServices() {
         return movieService.getStreamingServices();
     }

     /**
     * Returns the list of movies filtered by the provided query parameters.
     * 
     * @param services (optional) comma-separated streaming services
     * @param genres (optional) comma-separated genres
     * @param min (optional) minimum vote_average (default: 0)
     * @param max (optional) maximum vote_average (default: 10)
     * @param sort (optional) sort option: alphabetical, rating, or popularity (default: alphabetical)
     * @return List of filtered and sorted movies.
     */
    @GetMapping("/api/movies/filtered")
    public List<Movie> getFilteredMovies(
            @RequestParam(required = false) String services,
            @RequestParam(required = false) String genres,
            @RequestParam(defaultValue = "0") double min,
            @RequestParam(defaultValue = "10") double max,
            @RequestParam(defaultValue = "alphabetical") String sort
    ) {
        return movieService.getFilteredMovies(services, genres, min, max, sort);
    }
 }