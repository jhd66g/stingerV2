/**
 * backend/src/main.java/com/example/myapp/Movie.java
 * 
 * the Movie object
 */

 package com.example.myapp;

import java.util.List;

/**
 * Model class representing a movie.
 */
public class Movie {
    private int id;
    private String language;
    private String title;
    private String overview;
    private double vote_average;
    private double popularity;
    private String release_date;
    private String poster_path;
    private List<String> keywords;
    private int runtime;
    private List<String> genres;
    private List<String> cast;
    private List<String> director;
    private List<String> studio;
    private List<String> streaming_services;

    // Transient relevance score used only for search ranking.
    private transient double relevanceScore;

    /**
     * Returns the movie ID.
     * @return movie ID.
     */
    public int getId() {
        return id;
    }

    /**
     * Sets the movie ID.
     * @param id movie ID.
     */
    public void setId(int id) {
        this.id = id;
    }

    /**
     * Returns the language.
     * @return language.
     */
    public String getLanguage() {
        return language;
    }

    /**
     * Sets the language.
     * @param language language.
     */
    public void setLanguage(String language) {
        this.language = language;
    }

    /**
     * Returns the title.
     * @return title.
     */
    public String getTitle() {
        return title;
    }

    /**
     * Sets the title.
     * @param title title.
     */
    public void setTitle(String title) {
        this.title = title;
    }

    /**
     * Returns the overview.
     * @return overview.
     */
    public String getOverview() {
        return overview;
    }

    /**
     * Sets the overview.
     * @param overview overview.
     */
    public void setOverview(String overview) {
        this.overview = overview;
    }

    /**
     * Returns the vote average.
     * @return vote average.
     */
    public double getVote_average() {
        return vote_average;
    }

    /**
     * Sets the vote average.
     * @param vote_average vote average.
     */
    public void setVote_average(double vote_average) {
        this.vote_average = vote_average;
    }

    /**
     * Returns the popularity score.
     * @return popularity.
     */
    public double getPopularity() {
        return popularity;
    }

    /**
     * Sets the popularity score.
     * @param popularity popularity.
     */
    public void setPopularity(double popularity) {
        this.popularity = popularity;
    }

    /**
     * Returns the release date.
     * @return release date.
     */
    public String getRelease_date() {
        return release_date;
    }

    /**
     * Sets the release date.
     * @param release_date release date.
     */
    public void setRelease_date(String release_date) {
        this.release_date = release_date;
    }

    /**
     * Returns the poster path.
     * @return poster path.
     */
    public String getPoster_path() {
        return poster_path;
    }

    /**
     * Sets the poster path.
     * @param poster_path poster path.
     */
    public void setPoster_path(String poster_path) {
        this.poster_path = poster_path;
    }

    /**
     * Returns the list of keywords.
     * @return list of keywords.
     */
    public List<String> getKeywords() {
        return keywords;
    }

    /**
     * Sets the list of keywords.
     * @param keywords list of keywords.
     */
    public void setKeywords(List<String> keywords) {
        this.keywords = keywords;
    }

    /**
     * Returns the runtime.
     * @return runtime in minutes.
     */
    public int getRuntime() {
        return runtime;
    }

    /**
     * Sets the runtime.
     * @param runtime runtime in minutes.
     */
    public void setRuntime(int runtime) {
        this.runtime = runtime;
    }

    /**
     * Returns the list of genres.
     * @return list of genres.
     */
    public List<String> getGenres() {
        return genres;
    }

    /**
     * Sets the list of genres.
     * @param genres list of genres.
     */
    public void setGenres(List<String> genres) {
        this.genres = genres;
    }

    /**
     * Returns the list of cast members.
     * @return list of cast.
     */
    public List<String> getCast() {
        return cast;
    }

    /**
     * Sets the list of cast members.
     * @param cast list of cast.
     */
    public void setCast(List<String> cast) {
        this.cast = cast;
    }

    /**
     * Returns the list of directors.
     * @return list of directors.
     */
    public List<String> getDirector() {
        return director;
    }

    /**
     * Sets the list of directors.
     * @param director list of directors.
     */
    public void setDirector(List<String> director) {
        this.director = director;
    }

    /**
     * Returns the list of studios.
     * @return list of studios.
     */
    public List<String> getStudio() {
        return studio;
    }

    /**
     * Sets the list of studios.
     * @param studio list of studios.
     */
    public void setStudio(List<String> studio) {
        this.studio = studio;
    }

    /**
     * Returns the streaming service.
     * @return streaming service.
     */
    public List<String> getStreaming_services() { 
        return streaming_services; 
    }
    

    /**
     * Sets the streaming service.
     * @param streaming_services streaming service.
     */
    public void setStreaming_services(List<String> streaming_services) { 
        this.streaming_services = streaming_services; 
    }

    /**
     * Returns the relevance score
     * @return relevance score
     */
    public double getRelevanceScore() { 
        return relevanceScore; 
    }

    /**
     * Sets the relevance score.
     * @param relevanceScore relevance score
     */
    public void setRelevanceScore(double relevanceScore) { this.relevanceScore = relevanceScore; }
}