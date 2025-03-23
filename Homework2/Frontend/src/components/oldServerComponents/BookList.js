import React, { useState } from "react";
import { fetchAllBooks, fetchBookById, fetchBooksSorted } from "../../api/OldServerApi";
import BookItem from "./BookItem";

function BookList({ onBookDeleted }) {
  const [books, setBooks] = useState([]); // Ensure books is always an array
  const [searchId, setSearchId] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // For error handling

  // 🔹 Fetch all books
  const handleFetchAll = async () => {
  try {
    const response = await fetchAllBooks();
    console.log("Response from fetchAllBooks:", response); // Log the response

    if (response.status === 200 && response.data) {
      // Extract the nested data field
      const booksArray = response.data.data; // Access the nested data field
      console.log("Books array:", booksArray); // Log the extracted books array

      setBooks(booksArray); // Set the books state with the extracted array
      setErrorMessage(""); // Reset error message
    } else {
      setBooks([]); // Fallback to an empty array
      setErrorMessage(`Failed to fetch books: ${response.status}`);
    }
  } catch (error) {
    console.error("Error in handleFetchAll:", error); // Log the error
    setBooks([]); // Fallback to an empty array
    setErrorMessage("Failed to fetch books. Please try again later.");
  }
};

  // 🔹 Fetch book by ID
  const handleFetchById = async () => {
    if (!searchId.trim()) return alert("❌ Please enter a valid ID!");
    try {
      const response = await fetchBookById(searchId);
      console.log("Response from fetchBookById:", response); // Log the response
  
      if (response.status === 200 && response.data) {
        // Extract the nested data field
        const book = response.data.data || response.data; // Handle nested data or fallback to response.data
        console.log("Fetched book:", book); // Log the fetched book
  
        setBooks([book]); // Display only the searched book
        setErrorMessage(""); // Reset error message
      } else if (response.status === 404) {
        setBooks([]); // Fallback to an empty array
        setErrorMessage("❌ Book not found (404).");
      } else {
        setBooks([]); // Fallback to an empty array
        setErrorMessage(`Failed to fetch book: ${response.status}`);
      }
    } catch (error) {
      console.error("Error in handleFetchById:", error); // Log the error
      setBooks([]); // Fallback to an empty array
      setErrorMessage("Failed to fetch book. Please try again later.");
    }
  };

  // 🔹 Fetch sorted books
  const handleFetchSorted = async (type) => {
    try {
      const response = await fetchBooksSorted(type);
      console.log("Response from fetchBooksSorted:", response); // Log the response
  
      if (response.status === 200 && response.data) {
        // Extract the nested data field
        const booksArray = response.data.data || response.data; // Handle nested data or fallback to response.data
        console.log("Sorted books array:", booksArray); // Log the sorted books array
  
        setBooks(booksArray); // Set books only if booksArray is an array
        setErrorMessage(""); // Reset error message
      } else {
        setBooks([]); // Fallback to an empty array
        setErrorMessage(`Failed to fetch sorted books: ${response.status}`);
      }
    } catch (error) {
      console.error("Error in handleFetchSorted:", error); // Log the error
      setBooks([]); // Fallback to an empty array
      setErrorMessage("Failed to fetch sorted books. Please try again later.");
    }
  };
  return (
    <div>
      <h2>📚 Book List</h2>

      {/* 🔹 Display error message if it exists */}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {/* 🔹 Buttons for each GET */}
      <button onClick={handleFetchAll}>📖 Show all books</button>

      <input
        type="text"
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
        placeholder="Search book by ID"
      />
      <button onClick={handleFetchById}>🔍 Search by ID</button>

      <button onClick={() => handleFetchSorted("title")}>🔠 Sort by Title</button>
      <button onClick={() => handleFetchSorted("author")}>✍️ Sort by Author</button>

      <ul>
        {/* 🔹 Safeguard against invalid books */}
        {Array.isArray(books) && books.map((book) => (
          <BookItem key={book.id} book={book} onBookDeleted={onBookDeleted} />
        ))}
      </ul>
    </div>
  );
}

export default BookList;