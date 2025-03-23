import React, { useState } from "react";
import { fetchOptions, fetchHead } from "../../api/OldServerApi";

function BookOptions() {
  const [bookId, setBookId] = useState("");
  const [optionsResponse, setOptionsResponse] = useState(null);
  const [headResponse, setHeadResponse] = useState(null);

  // 🔹 Call OPTIONS to see available methods
  const handleFetchOptions = async () => {
    try {
      const response = await fetchOptions(); // Send OPTIONS request to the backend
      if (response.status === 200) {
        setOptionsResponse(response.data); // Set the available methods in the state
      } else {
        alert(`Failed to fetch available methods: ${response.status}`);
      }
    } catch (error) {
      alert("An error occurred while fetching available methods. Please try again later.");
    }
  };

  // 🔹 Call HEAD to check if a book ID exists in the database
  const handleFetchHead = async () => {
    if (!bookId.trim()) return alert("❌ Please enter a valid ID!");

    try {
      const response = await fetchHead(bookId); // Send HEAD request to the backend
      if (response.status === 200) {
        setHeadResponse(`✅ The book with ID ${bookId} EXISTS in the database!`);
      } else if (response.status === 404) {
        setHeadResponse(`❌ The book with ID ${bookId} does NOT exist in the database.`);
      } else {
        setHeadResponse(`⚠️ Unexpected response: ${response.status}`);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setHeadResponse(`❌ The book with ID ${bookId} does NOT exist in the database.`);
      } else {
        setHeadResponse("⚠️ An error occurred while checking the book. Please try again later.");
      }
    }
  };

  return (
    <div>
      <h3>⚙️ Special Operations</h3>

      {/* 🔹 Button to fetch available methods */}
      <button onClick={handleFetchOptions}>📜 View available methods (OPTIONS)</button>
      {optionsResponse && <pre>{JSON.stringify(optionsResponse, null, 2)}</pre>}

      {/* 🔹 Button to check if a book exists */}
      <button onClick={handleFetchHead}>🔍 Check book existence (HEAD)</button>
      {headResponse && <p>{headResponse}</p>}

      {/* 🔹 Input field for book ID */}
      <input
        type="text"
        value={bookId}
        onChange={(e) => setBookId(e.target.value)}
        placeholder="Enter book ID"
      />
    </div>
  );
}

export default BookOptions;