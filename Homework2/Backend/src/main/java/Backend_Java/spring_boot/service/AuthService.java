package Backend_Java.spring_boot.service;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import java.util.Map;

@Service
public class AuthService {

    private final WebClient webClient;
    private String jwtToken = null; // Variabilă pentru stocarea token-ului

    public AuthService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("http://127.0.0.1:8081").build();
    }

    // Autentificare la Flask și stocarea token-ului JWT
    public String authenticate() {
        if (jwtToken != null) {
            return jwtToken; // Dacă avem deja un token, îl returnăm
        }

        Map<String, String> credentials = Map.of("username", "admin", "password", "password123");

        Mono<Map> responseMono = webClient.post()
                .uri("/auth/login")
                .bodyValue(credentials)
                .retrieve()
                .bodyToMono(Map.class);

        Map<String, String> response = responseMono.block(); // Sincronizare pentru simplitate
        if (response != null && response.containsKey("token")) {
            jwtToken = response.get("token");
            System.out.println("✅ JWT Token primit: " + jwtToken);
        } else {
            System.err.println("❌ Autentificare eșuată! Nu s-a primit token.");
        }
        return jwtToken;
    }
}