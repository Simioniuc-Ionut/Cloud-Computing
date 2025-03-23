package Backend_Java.spring_boot.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

  @Bean
  public WebMvcConfigurer corsConfigurer() {
    return new WebMvcConfigurer() {
      @Override
      public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Allows all routes
            .allowedOrigins("http://localhost:3000") // Allows requests from the frontend (change the port if different)
            .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD") // Allows HTTP methods
            .allowedHeaders("*") // Allows all headers
            .exposedHeaders("Allow")
            .allowCredentials(true); // Allows sending cookies
      }
    };
  }
}