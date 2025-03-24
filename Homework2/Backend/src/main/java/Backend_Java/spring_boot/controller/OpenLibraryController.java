package Backend_Java.spring_boot.controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api/open-library")
@CrossOrigin(origins = "http://localhost:3000") // Allow requests from React frontend
public class OpenLibraryController {

    private final WebClient webClient;

    public OpenLibraryController(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://openlibrary.org").build();
    }

    @GetMapping("/search")
    public Mono<Map<String, Object>> searchBooks(@RequestParam String title) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/search.json")
                        .queryParam("title", title)
                        .build())
                .retrieve()
                .bodyToMono(Map.class)
                .map(response -> {
                    Object books = response.get("docs");
                    return Map.of("books", books != null ? books : "No books found");
                })
                .onErrorResume(e -> {
                    System.err.println("Error fetching data from Open Library API: " + e.getMessage());
                    return Mono.just(Map.of("error", "Failed to fetch books. Please try again later."));
                });
    }
}