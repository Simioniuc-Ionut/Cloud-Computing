import axios from "axios";

const BACKEND_BASE_URL = "http://127.0.0.1:8084";

export const searchOpenLibraryBooks = async (title, page = 1) => {
  try {
    const response = await axios.get(`${BACKEND_BASE_URL}/api/open-library/search`, {
      params: { title, page },
    });
    console.log("Backend Open Library response:", response.data); // Log the response
    return { status: response.status, data: response.data.books }; // Return the list of books
  } catch (error) {
    console.error("Error searching Open Library via backend:", error); // Log the error
    return { status: error.response?.status || 500, data: error.message };
  }
};