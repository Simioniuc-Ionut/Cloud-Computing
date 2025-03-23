package Backend_Java.spring_boot.service;

import Backend_Java.spring_boot.model.Book;
import Backend_Java.spring_boot.repository.BookRepository; // Ensure the package and class name are correct

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Book saveBook(Book book) {
        return bookRepository.save(book);
    }
}