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
}