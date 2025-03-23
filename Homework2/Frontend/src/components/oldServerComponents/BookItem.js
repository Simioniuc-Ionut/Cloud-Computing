import React from "react";
import { deleteBook, patchBook } from "../../api/OldServerApi";

function BookItem({ book, onBookDeleted }) {
  // Handle book deletion
  const handleDelete = async () => {
    try {
      const response = await deleteBook(book.id); // Send DELETE request to the backend
      console.log("Response from deleteBook:", response); // Log the response
  
      if (response.status === 200) {
        onBookDeleted(book.id); // Notify parent component to remove the book from the list
      } else {
        alert(`Failed to delete the book: ${response.status}`);
      }
    } catch (error) {
      console.error("Error in handleDelete:", error); // Log the error
      alert("An error occurred while deleting the book. Please try again later.");
    }
  };

  // Handle book update
  const handleUpdate = async () => {
    const updatedTitle = prompt("Enter the new title:", book.title);
    if (!updatedTitle) return;

    const updatedData = { title: updatedTitle };
    try {
      const response = await patchBook(book.id, updatedData); // Send PATCH request to the backend
      console.log("Response from patchBook:", response); // Log the response

      if (response.status === 200 && response.data) {
        const result = response.data.data || response.data; // Handle nested data or fallback to response.data
        console.log("Update result:", result); // Log the result
        alert("The title has been updated successfully!");
      } else {
        alert(`Failed to update the book: ${response.status}`);
      }
    } catch (error) {
      console.error("Error in handleUpdate:", error); // Log the error
      alert("An error occurred while updating the book. Please try again later.");
    }
  };

  return (
    <li>
      <strong>{book.title}</strong> - {book.author}
      <button onClick={handleUpdate}>✏️ Edit</button>
      <button onClick={handleDelete}>🗑️ Delete</button>
    </li>
  );
}

export default BookItem;