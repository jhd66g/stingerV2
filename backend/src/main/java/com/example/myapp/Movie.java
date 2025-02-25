/**
 * backend/src/main.java/com/example/myapp/Movie.java
 * 
 * the Movie object
 */

 package com.example.myapp;

 import java.util.List;
 
 /**
  * Model representing a movie and its details.
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
     private String streaming_service;
 
     // Getters and setters
 
     public int getId() {
         return id;
     }
 
     public void setId(int id) {
         this.id = id;
     }
 
     public String getLanguage() {
         return language;
     }
 
     public void setLanguage(String language) {
         this.language = language;
     }
 
     public String getTitle() {
         return title;
     }
 
     public void setTitle(String title) {
         this.title = title;
     }
 
     public String getOverview() {
         return overview;
     }
 
     public void setOverview(String overview) {
         this.overview = overview;
     }
 
     public double getVote_average() {
         return vote_average;
     }
 
     public void setVote_average(double vote_average) {
         this.vote_average = vote_average;
     }
 
     public double getPopularity() {
         return popularity;
     }
 
     public void setPopularity(double popularity) {
         this.popularity = popularity;
     }
 
     public String getRelease_date() {
         return release_date;
     }
 
     public void setRelease_date(String release_date) {
         this.release_date = release_date;
     }
 
     public String getPoster_path() {
         return poster_path;
     }
 
     public void setPoster_path(String poster_path) {
         this.poster_path = poster_path;
     }
 
     public List<String> getKeywords() {
         return keywords;
     }
 
     public void setKeywords(List<String> keywords) {
         this.keywords = keywords;
     }
 
     public int getRuntime() {
         return runtime;
     }
 
     public void setRuntime(int runtime) {
         this.runtime = runtime;
     }
 
     public List<String> getGenres() {
         return genres;
     }
 
     public void setGenres(List<String> genres) {
         this.genres = genres;
     }
 
     public List<String> getCast() {
         return cast;
     }
 
     public void setCast(List<String> cast) {
         this.cast = cast;
     }
 
     public List<String> getDirector() {
         return director;
     }
 
     public void setDirector(List<String> director) {
         this.director = director;
     }
 
     public List<String> getStudio() {
         return studio;
     }
 
     public void setStudio(List<String> studio) {
         this.studio = studio;
     }
 
     public String getStreaming_service() {
         return streaming_service;
     }
 
     public void setStreaming_service(String streaming_service) {
         this.streaming_service = streaming_service;
     }
 }