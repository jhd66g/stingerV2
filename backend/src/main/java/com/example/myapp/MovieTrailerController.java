/**
 * backend/src/main.java/com/example/myapp/MovieTrailerController.java
 * 
 * fetches trailer from movie title and release year
 */

package com.example.myapp;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.jsoup.Jsoup;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/movies")
public class MovieTrailerController {

    private final MovieService movieService;

    public MovieTrailerController(MovieService movieService) {
        this.movieService = movieService;
    }

    /**
     * Proxies a YouTube search for "<title> <year> trailer" and returns the first videoId.
     */
    @GetMapping("/{id}/trailer")
    public Map<String,String> getTrailer(@PathVariable int id) throws IOException {
        // **Use your service’s lookup method here**
        Movie movie = movieService.getMovieById(id);
        String year = "";
        if (movie.getRelease_date() != null && movie.getRelease_date().length() >= 4) {
            year = movie.getRelease_date().substring(0, 4);
        }

        String query = URLEncoder.encode(
            movie.getTitle() + " " + year + " trailer",
            StandardCharsets.UTF_8
        );
        String youtubeSearchUrl = "https://www.youtube.com/results?search_query=" + query;

        // Fetch the raw HTML as text
        String html = Jsoup.connect(youtubeSearchUrl)
                           .userAgent("Mozilla/5.0")
                           .ignoreContentType(true)
                           .execute()
                           .body();

        // Find the very first "videoId":"XXXXXXXXXXX" in the HTML
        Matcher m = Pattern.compile("\"videoId\":\"([^\"]+)\"").matcher(html);
        String videoId = m.find() ? m.group(1) : "";

        return Collections.singletonMap("videoId", videoId);
    }
}