package Backend_Java.spring_boot.repository;
import Backend_Java.spring_boot.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository<Book, Long> {
}