package Backend_Java.spring_boot;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.*;


@SpringBootApplication
public class Application {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}
	@Bean
			CommandLineRunner testDatabaseConnection(JdbcTemplate jdbcTemplate) {
					return args -> {
							System.out.println("Testing database connection...");

							// Execută o interogare simplă pentru a obține datele dintr-un tabel
							List<Map<String, Object>> books = jdbcTemplate.queryForList("SELECT * FROM books");

							// Afișează rezultatele în consolă
							books.forEach(book -> System.out.println("Book: " + book));
					};
			}
	@Bean
	public WebClient.Builder webClientBuilder() {
			return WebClient.builder();
	}
}
