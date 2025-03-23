import React, { useState } from "react";
import { addBook } from "../../api/OldServerApi";

function BookForm({ onBookAdded }) {
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input fields
    if (isbn && (title || author)) {
      return alert("❌ If you add an ISBN, you should not fill in other fields!");
    }

    if (!isbn && (!title || !author)) {
      return alert("❌ Please fill fields");
    }

    const newBook = { id, title, author, isbn };

    try {

      const response = await addBook(newBook); // Send POST request to the backend

      if (response.status === 201) {
        onBookAdded(response.data); // Notify parent component about the new book
        setId("");
        setTitle("");
        setAuthor("");
        setIsbn("");
        alert("Book added successfully!");
      } else {
        alert(`Failed to add the book: ${response.status}`);
        // Map error codes to custom messages
      const errorMessages = {
        400: "Bad Request: Please check the data you entered.",
        401: "Unauthorized: You are not authorized to perform this action.",
        403: "Forbidden: Connection refused.",
        404: "Not Found: The requested resource could not be found.",
        500: "Internal Server Error: Something went wrong on the server.",
      };
      const errorMessage = errorMessages[response.status] || `Unexpected error: ${response.status}`;
      alert(errorMessage);
      }
    } catch (error) {
      alert("An error occurred while adding the book. Please try again later.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      
      {/* <input
        value={id}
        onChange={(e) => setId(e.target.value)}
        placeholder="Book ID"
      /> */}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Book Title"
      />
      <input
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder="Author"
      />
      <input
        value={isbn}
        onChange={(e) => setIsbn(e.target.value)}
        placeholder="ISBN"
      />
      <button type="submit">Add Book</button>
    </form>
  );
}

export default BookForm;
