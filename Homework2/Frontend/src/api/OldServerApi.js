import axios from "axios";

const BASE_URL = "http://127.0.0.1:8084";

// 🟢 GET
// Get all books
export const fetchAllBooks = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/OldBookServer/books`);
    console.log("Backend response:", response); // Log the response
    return { status: response.status, data: response.data };
  } catch (error) {
    console.error("Error fetching books:", error); // Log the error
    return handleError(error);
  }
};
// Get book by ID
export const fetchBookById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/OldBookServer/books/${id}`);
    return { status: response.status, data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// Get books sorted by a field
export const fetchBooksSorted = async (sortBy) => {
  try {
    const response = await axios.get(`${BASE_URL}/OldBookServer/books/filters?sort=${sortBy}`);
    return { status: response.status, data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// 🔵 POST
// Add a new book
export const addBook = async (book) => {
  try {
    const response = await axios.post(`${BASE_URL}/OldBookServer/books`, book);
    console.log(response);
    return { status: response.status, data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// 🟡 PUT
// Update an existing book
export const updateBookGeneric = async (id, updatedData) => {
  try {
    const url = id ? `${BASE_URL}/OldBookServer/books/${id}` : `${BASE_URL}/OldBookServer/books`;
    const response = await axios.put(url, updatedData);
    return { status: response.status, data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// 🔴 DELETE
// Delete a book by ID
export const deleteBook = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/OldBookServer/books/${id}`);
    return { status: response.status, data: "Book deleted successfully" };
  } catch (error) {
    return handleError(error);
  }
};

// 🟣 PATCH
// Partially update a book
export const patchBook = async (id, updatedData) => {
  try {
    const response = await axios.patch(`${BASE_URL}/OldBookServer/books/${id}`, updatedData);
    return { status: response.status, data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// 🟠 OPTIONS
// Fetch available methods
export const fetchOptions = async () => {
  try {
    const response = await axios.options(`${BASE_URL}/OldBookServer`);
    return { status: response.status, data: response.headers['allow'] };
  } catch (error) {
    return handleError(error);
  }
};

// 🟡 HEAD
// Check if a book exists
export const fetchHead = async (id) => {
  try {
    const response = await axios.head(`${BASE_URL}/OldBookServer/books/${id}`);
    return { status: response.status, data: response.headers };
  } catch (error) {
    return handleError(error);
  }
};

// 🔵 Error Handling Helper
const handleError = (error) => {
  if (error.response) {
    // Server responded with a status code outside the 2xx range
    return { status: error.response.status, error: error.response.data };
  } else if (error.request) {
    // Request was made but no response received
    return { status: 0, error: "No response from server." };
  } else {
    // Other errors (e.g., misconfiguration)
    return { status: 0, error: error.message };
  }
};