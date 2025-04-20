/**
 * backend/src/main.java/com/example/myapp/WebConfig.java
 * 
 * enables cross site
 */

 package com.example.myapp;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class WebConfig {
  
  @Bean
  public CorsFilter corsFilter() {
    CorsConfiguration config = new CorsConfiguration();
    // allow your Pages site
    config.addAllowedOrigin("https://stinger-streaming.com");
    // if you ever need www or other subdomains, add them here
    // config.addAllowedOrigin("https://www.stinger‑streaming.com");
    
    config.addAllowedMethod("*");       // GET, POST, PUT, DELETE, OPTIONS…
    config.addAllowedHeader("*");       // any request header
    config.setAllowCredentials(false);  // change to true if you ever send cookies/auth
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return new CorsFilter(source);
  }
}