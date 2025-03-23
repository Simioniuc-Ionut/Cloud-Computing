package Backend_Java.spring_boot.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/OldBookServer/**").permitAll() // Permite accesul fără autentificare la /books
                .requestMatchers("/api/open-library/**").permitAll() // Allow unauthenticated access to Open Library API
                .requestMatchers("/api/recommend/**").permitAll() // Allow unauthenticated access to Recommend API
                .anyRequest().authenticated()); // Alte rute necesită autentificare
        return http.build();
    }
}