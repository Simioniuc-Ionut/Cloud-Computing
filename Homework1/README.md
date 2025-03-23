# Cloud-Computing

📚 Book API

Book API is a RESTful API for managing a collection of books. It allows users to create, retrieve, update, and delete books, as well as filter and sort them. The API supports JSON responses and includes integration with Google Books API for retrieving book details by ISBN.

🚀 Features

CRUD Operations: Add, retrieve, update, and delete books.

Filtering & Sorting: Retrieve books by author and sort by title or author.

ISBN Lookup: Automatically fetch book details from Google Books API.

Multiple HTTP Methods: Supports GET, POST, PUT, PATCH, DELETE, and HEAD.

📌 Installation & Setup

1️⃣ Clone the Repository

git clone https://github.com/yourusername/book-api.git
cd book-api

2️⃣ Run the Server

python server.py

The API will start on http://localhost:8081.

📂 API Endpoints

| Method | Endpoint            | Description                          |
|--------|---------------------|--------------------------------------|
| GET    | /books              | Get all books                        |
| GET    | /books/{id}         | Get a specific book by ID            |
| GET    | /books?sort=title   | Get all books sorted by title        |
| GET    | /books?sort=author  | Get all books sorted by author       |
| POST   | /books              | Add a new book (with or without an ID)|
| POST   | /books              | Add a book with ISBN                 |
| PUT    | /books/{id}         | Update a book (replace all fields)   |
| PATCH  | /books/{id}         | Update specific fields of a book     |
| DELETE | /books/{id}         | Remove a book by ID                  |
| HEAD   | /books/{id}         | Check if a book exists               |
🔍 Filtering & Sorting

🔹 Filter by Author

GET /books?author=Robert%20C.%20Martin

🔹 Sort by Title

GET /books?sort=title

🔹 Sort by Author

GET /books?sort=author

📖 Example Request (POST /books)

{
    "title": "Refactoring",
    "author": "Martin Fowler"
}

Response:

{
    "message": "Book added successfully",
    "book": {
        "id": "3",
        "title": "Refactoring",
        "author": "Martin Fowler"
    }
}

📮 Import Postman Collection

To test the API in Postman:

Open Postman.

Click Import.

Select postman_collection.json from this repository.

Run the requests.

🛠 Dependencies

Python 3.x

requests (for Google Books API integration)

📌 Notes

Ensure the storage/books.xml file exists before running the server.

If a book with an existing ISBN is added, the API returns 409 Conflict.

Use HEAD /books/{id} to check if a book exists without fetching data.
