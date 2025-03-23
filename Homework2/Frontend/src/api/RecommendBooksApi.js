import React, { useState } from "react";
import axios from "axios";

function ListRecommendedBooksById() {
  const [id, setId] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFetchBooks = async () => {
    if (!id.trim()) {
      alert("Please enter a valid ID!");
      return;
    }

    setLoading(true);

    try {
      // Call the backend instead of the external API
      const response = await axios.get(`http://127.0.0.1:8084/api/recommend/${id}`);
      console.log("📡 Backend API Response:", response.data);

      setBooks(response.data); // Update the books state with the response
    } catch (error) {
      console.error("Error fetching data from backend:", error);
      alert("An error occurred! Please check the ID and try again.");
    }

    setLoading(false);
  };

  // 📌 Extracting the correct data
  const headerMessage = books.length > 0 ? Object.values(books[0])[0] : "";
  const searchedBook = books.length > 1 ? Object.values(books[1])[0] : "";
  const recommendedBooks = books.slice(2, 12); // Extract top 10 books
  const executionTime = books.length > 12 ? Object.values(books[12])[0] : "";

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>📖 Enter an ID to get book recommendations</h2>
      <input
        type="text"
        value={id}
        onChange={(e) => setId(e.target.value)}
        placeholder="Ex: 93"
        style={{ padding: "8px", marginRight: "10px" }}
        disabled={loading}
      />
      <button
        onClick={handleFetchBooks}
        style={{ padding: "8px 12px" }}
        disabled={loading}
      >
        {loading ? "Please wait..." : "Recommend Books"}
      </button>

      {loading && <p>🔄 Loading recommendations... Please wait.</p>}

      {!loading && books.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3 style={{ color: "blue" }}>📢 {headerMessage}</h3>
          <h3 style={{ color: "Red" }}>Searched book with ID: {id} {searchedBook}</h3>
          <h3>📚 Top 10 Recommended Books</h3>
          <ol>
            {recommendedBooks.map((book) => (
              <li key={book["Book ID"]}>
                <strong>{book.Title}</strong> (Score: {book.Score.toFixed(2)})
              </li>
            ))}
          </ol>

          <h4 style={{ color: "green" }}>⏳ Processing time: {executionTime} seconds</h4>
        </div>
      )}
    </div>
  );
}

export default ListRecommendedBooksById;