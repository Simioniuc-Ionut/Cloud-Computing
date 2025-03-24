package Backend_Java.spring_boot.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;

import Backend_Java.spring_boot.service.AuthService;
import Backend_Java.spring_boot.service.AuthServiceRecomm;
import reactor.core.publisher.Mono;
import org.springframework.core.ParameterizedTypeReference;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/recommend")
public class RecommendationController {

    private final WebClient webClient;
    private final AuthServiceRecomm authService; // Inject the authentication service

    public RecommendationController(WebClient.Builder webClientBuilder, AuthServiceRecomm authService) {
        this.webClient = webClientBuilder.baseUrl("http://127.0.0.1:8000").build();
        this.authService = authService;
    }

    @GetMapping("/{id}")
    public Mono<List<Map<String, Object>>> getRecommendations(@PathVariable String id) {
        String token = authService.authenticate(); // 🔑 Obtain the JWT token

        if (token == null) {
            return Mono.error(new RuntimeException("❌ Authentication failed! No token received."));
        }

        return webClient.get()
                .uri("/recommendById/{id}", id)
                .header("Authorization", "Bearer " + token) // ✅ Send the JWT token in the request
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {});
    }
}
