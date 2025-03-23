package Backend_Java.spring_boot.controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import org.springframework.core.ParameterizedTypeReference;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/recommend")
public class RecommendationController {

    private final WebClient webClient;

    public RecommendationController(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("http://127.0.0.1:8000").build();
    }

    @GetMapping("/{id}")
    public Mono<List<Map<String, Object>>> getRecommendations(@PathVariable String id) {
        return webClient.get()
                .uri("/recommendById/{id}", id)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {});
    }
}