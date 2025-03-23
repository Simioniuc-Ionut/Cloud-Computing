package Backend_Java.spring_boot.controller;

import Backend_Java.spring_boot.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import jakarta.servlet.http.HttpServletRequest;
import reactor.core.publisher.Mono;
import java.util.*;

@RestController
public class OldBookServerAPIController {

    @Autowired
    private WebClient.Builder webClientBuilder;

    @Autowired
    private AuthService authService; // Inject the authentication service

    @RequestMapping(value = "/OldBookServer/**", method = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.PATCH})
    public ResponseEntity<String> proxyToOldServer(
            @RequestHeader Map<String, String> headers,
            @RequestBody(required = false) String body,
            HttpMethod method,
            HttpServletRequest request) {

        System.out.println("========== Incoming Request ==========");
        System.out.println("Method: " + method);
        System.out.println("Path: " + request.getRequestURI());
        System.out.println("Headers: " + headers);
        System.out.println("Body: " + body);
        System.out.println("======================================");

        // Obtain the JWT token
        String token = authService.authenticate();
        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("❌ Authentication failed! No token received.");
        }

        // Build the URL to the Flask API
        String queryString = request.getQueryString();
        String path = request.getRequestURI().replace("/OldBookServer", "");
        String externalUrl = "http://127.0.0.1:8081" + path + (queryString != null ? "?" + queryString : "");
        System.out.println("➡️ External URL: " + externalUrl);

        // Build the request to Flask
        WebClient.RequestBodySpec requestSpec = webClientBuilder.build()
                .method(method)
                .uri(externalUrl)
                .header("Authorization", "Bearer " + token); // Add the JWT token

        // Add all original headers (except Authorization, which is already set)
        headers.forEach((key, value) -> {
            if (!key.equalsIgnoreCase("Authorization")) {
                requestSpec.header(key, value);
            }
        });

        // Add the body if it exists
        if (body != null) {
            requestSpec.bodyValue(body);
        }

        // Send the request and handle the response
        return requestSpec.exchangeToMono(clientResponse -> {
            HttpStatus statusCode = HttpStatus.valueOf(clientResponse.statusCode().value());
        
            if (method == HttpMethod.HEAD) {
                return Mono.just(ResponseEntity.status(statusCode).<String>build());
            }
        
            return clientResponse.bodyToMono(String.class) // Convert the response body to String
                    .map(responseBody -> {
                        System.out.println("✅ Response from Flask: " + responseBody);
            
                        // Return the response body as-is (JSON format)
                        return ResponseEntity.status(statusCode).body(responseBody);
                    });
        }).onErrorResume(e -> {
            System.err.println("❌ Error processing request: " + e.getMessage());
            return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while processing the request."));
        }).block();
    }    
}
