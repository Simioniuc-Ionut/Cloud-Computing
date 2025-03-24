package Backend_Java.spring_boot.service;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import java.util.Map;

@Service
public class AuthServiceRecomm {

  private final WebClient webClient;
  private String jwtToken = null; // Variable to store the JWT token

  public AuthServiceRecomm(WebClient.Builder webClientBuilder) {
    this.webClient = webClientBuilder.baseUrl("http://127.0.0.1:8000").build();
  }

  // ✅ Authenticate with FastAPI to obtain the JWT token
  public String authenticate() {
    if (jwtToken != null) {
      return jwtToken; // If we already have a token, return it
    }

    Map<String, String> credentials = Map.of("username", "admin", "password", "password123");

    Mono<Map> responseMono = webClient.post()
        .uri("/auth/login")
        .bodyValue(credentials)
        .retrieve()
        .bodyToMono(Map.class);

    Map<String, String> response = responseMono.block(); // Synchronous for simplicity
    if (response != null && response.containsKey("token")) {
      jwtToken = response.get("token");
      System.out.println("✅ JWT Token received: " + jwtToken);
    } else {
      System.err.println("❌ Authentication failed! Token not received.");
    }
    return jwtToken;
  }

  // ✅ Function to retrieve the saved token
  public String getToken() {
    return jwtToken;
  }
}
