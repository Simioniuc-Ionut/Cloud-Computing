import React, { useState, useEffect } from "react";

// apis
import ListRecommBooks from "./api/RecommendBooksApi";
// old server api
import { fetchAllBooks } from "./api/OldServerApi";
import { searchOpenLibraryBooks } from "./api/GoogleBooksApi";


import BookList from "./components/oldServerComponents/BookList";
import BookForm from "./components/oldServerComponents/BookForm";
import BookOptions from "./components/oldServerComponents/BookOptions";

function App() {
  const [books, setBooks] = useState([]);
  const [errorMessage, setErrorMessage] = useState(""); // Error message state
  const [searchTitle, setSearchTitle] = useState(""); // State for the search input

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetchAllBooks();
        console.log("Response from fetchAllBooks:", response); // Log the response

        if (response.status === 200) {
          setBooks(response.data);
        } else if (response.status === 404) {
          setErrorMessage("Books not found (404).");
        } else {
          setErrorMessage(`Unexpected error: ${response.status}`);
        }
      } catch (error) {
        setErrorMessage("Failed to fetch books. Please try again later.");
      }
    };
    fetchBooks();
  }, []);

  const handleBookAdded = (newBook) => {
    setBooks([books, newBook]);
  };

  const handleBookDeleted = (deletedBookId) => {
    setBooks((prevBooks) =>
      Array.isArray(prevBooks) ? prevBooks.filter((book) => book.id !== deletedBookId) : []
    );
    setErrorMessage(""); // Reset error message
  };

  const handleSearchOpenLibraryBooks = async () => {
    if (!searchTitle.trim()) {
      setErrorMessage("Please enter a book title to search.");
      return;
    }
  
    try {
      const response = await searchOpenLibraryBooks(searchTitle);
      if (response.status === 200) {
        console.log("Books from Open Library:", response.data); // Log the books
        setBooks(response.data); // Update the state with the books
        setErrorMessage(""); // Reset error message
      } else {
        console.error("Failed to fetch books:", response.status);
        setErrorMessage("Failed to fetch books from Open Library.");
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      setErrorMessage("An error occurred while fetching books.");
    }
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        backgroundColor: "#f0f4f8",
        minHeight: "100vh",
      }}
    >
      {/* Header Section */}
      <div
        style={{
          width: "100%",
          textAlign: "center",
          marginBottom: "20px",
          padding: "20px",
          backgroundColor: "#007BFF",
          color: "white",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1>Book Recommendations 📚</h1>
      </div>
      
        <ListRecommBooks books={books} />
  
      {/* Error Message */}
      {errorMessage && (
        <div
          style={{
            width: "80%",
            textAlign: "center",
            marginBottom: "20px",
            padding: "10px",
            backgroundColor: "#ffcccc",
            color: "#cc0000",
            borderRadius: "5px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <p>{errorMessage}</p>
        </div>
      )}
  
      {/* Book Management Section */}
      <div
        style={{
          width: "80%",
          marginBottom: "20px",
          padding: "20px",
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2>📖 Book Management</h2>
        <BookForm onBookAdded={handleBookAdded} />
        <BookList books={books} onBookDeleted={handleBookDeleted} />
        <BookOptions />
      </div>
  
      {/* Search Section */}
      <div
        style={{
          width: "80%",
          marginBottom: "20px",
          padding: "20px",
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2>Search a Book from OpenLibrary 📖</h2>
        <input
          type="text"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          placeholder="Enter book title"
          style={{
            marginBottom: "10px",
            padding: "10px",
            width: "300px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={handleSearchOpenLibraryBooks}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          🔍 Search Open Library
        </button>
      </div>
  
      {/* Search Results Section */}
      <div
        style={{
          width: "80%",
          textAlign: "center",
          backgroundColor: "#ffffff",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2>Search Results:</h2>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {books.length > 0 ? (
            books.map((book, index) => (
              <li
                key={index}
                style={{
                  marginBottom: "20px",
                  padding: "10px",
                  borderBottom: "1px solid #ccc",
                  textAlign: "left",
                }}
              >
                <strong>Title:</strong> {book.title} <br />
                <strong>Author:</strong> {book.author_name ? book.author_name.join(", ") : "Unknown"} <br />
                <strong>First Published:</strong> {book.first_publish_year || "N/A"} <br />
                <strong>Language:</strong> {book.language ? book.language.join(", ") : "N/A"} <br />
              </li>
            ))
          ) : (
            <p>No books found.</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;