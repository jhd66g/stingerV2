/**
 * backend/src/main.java/com/example/myapp/DemoApplication.java
 * 
 * enables cross site
 */

 package com.example.myapp;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {
  @Bean
  public WebMvcConfigurer corsConfigurer() {
    return new WebMvcConfigurer() {
      @Override
      public void addCorsMappings(CorsRegistry registry) {
        registry
          .addMapping("/**")          // allow CORS on all paths
          .allowedOrigins("*")        // or your exact frontend URL
          .allowedMethods("GET","POST","PUT","DELETE","OPTIONS");
      }
    };
  }
}