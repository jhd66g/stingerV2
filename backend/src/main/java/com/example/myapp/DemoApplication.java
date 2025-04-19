/**
 * backend/src/main.java/com/example/myapp/DemoApplication.java
 * 
 * enables cross site
 */

import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class DemoApplication {

  public static void main(String[] args) {
    SpringApplication.run(DemoApplication.class, args);
  }

  @Bean
  public WebMvcConfigurer corsConfigurer() {
    return new WebMvcConfigurer() {
      @Override
      public void addCorsMappings(CorsRegistry registry) {
        registry
          .addMapping("/api/**")
          .allowedOrigins("*")     // or lock it down to your Pages domain
          .allowedMethods("GET","POST","PUT","DELETE","OPTIONS");
      }
    };
  }
}