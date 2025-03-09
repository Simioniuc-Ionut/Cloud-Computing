from book_model import BookModel
import requests
import json

books = BookModel()

def generate_unique_id():
    existing_books = books.get_all()
    if not existing_books:
        return "1"
    max_id = max(int(book["id"]) for book in existing_books)
    return str(max_id + 1)


def get_book_by_isbn(isbn):
    url = f"https://www.googleapis.com/books/v1/volumes?q=isbn:{isbn}"
    response = requests.get(url)

    if response.status_code != 200:
        return None  # could not fetch data

    data = response.json()
    if "items" not in data:
        return None  # no book found

    book_info = data["items"][0]["volumeInfo"]
    return {
        "title": book_info.get("title", "Unknown Title"),
        "author": ", ".join(book_info.get("authors", ["Unknown Author"])),
        "isbn": isbn
    }


def create_book(data):
    """Creates a book, either with an automatic ID or using ISBN."""
    if "isbn" in data:
        # Search for the book in Google Books API
        book_info = get_book_by_isbn(data["isbn"])
        if not book_info:
            return {"status": 400, "data": {"error": "Invalid ISBN or book not found"}}

        # Check if the ISBN already exists in the database
        existing_books = books.get_all()
        for book in existing_books:
            if book.get("isbn") == data["isbn"]:
                return {"status": 409, "data": {"error": "Book with this ISBN already exists"}}

        # Generate an automatic ID
        book_info["id"] = generate_unique_id()
        books.add(book_info)
        return {"status": 201, "data": {"message": "Book added successfully", "book": book_info}}

    elif "title" in data and "author" in data:
        # Check if the ID was provided
        book_id = data.get("id", generate_unique_id())

        # Check if the ID already exists
        existing_book = books.get(book_id)
        if existing_book:
            return {"status": 409, "data": {"error": "Book with this ID already exists"}}

        # Add the book
        new_book = {"id": book_id, "title": data["title"], "author": data["author"]}
        books.add(new_book)
        return {"status": 201, "data": {"message": "Book added successfully", "book": new_book}}

    return {"status": 400, "data": {"error": "Invalid request format"}}

def get_books(filters=None, sort_by=None):
    """Return all books, optionally filtered and sorted."""
    books_list = books.get_all()

    # Apply filters (filters is a dictionary) - e.g. {"author": "Rowling"} or {"title": "Harry Potter"}
    if filters and "author" in filters:
        books_list = [book for book in books_list if book["author"].lower() == filters["author"].lower()]

    # Apply sorting (sort_by is a string) - e.g. "title" or "author"
    if sort_by in ["title", "author"]:
        books_list = sorted(books_list, key=lambda x: x[sort_by].lower())

    return {"status": 200, "data": books_list}

def update_book(book_id, data):
    if books.update(book_id, data):
        return {"status": 200, "data": {"message": "Book updated"}}
    return {"status": 404, "data": {"error": "Book not found"}}

def update_book_by_title(title, data):
    books_list = books.get_all()
    for book in books_list:
        if book["title"] == title:
            if books.update(book["id"], data):
                return {"status": 200, "data": {"message": "Book updated"}}
    return {"status": 404, "data": {"error": "Book not found"}}

def update_book_by_author(author, data):
    books_list = books.get_all()
    for book in books_list:
        if book["author"] == author:
            if books.update(book["id"], data):
                return {"status": 200, "data": {"message": "Book updated"}}
    return {"status": 404, "data": {"error": "Book not found"}}

def patch_book(book_id, data):
    existing_book = books.get(book_id)
    if not existing_book:
        return {"status": 404, "data": {"error": "Book not found"}}

    # Update only the provided fields
    if "title" in data:
        existing_book["title"] = data["title"]
    if "author" in data:
        existing_book["author"] = data["author"]

    if books.update(book_id, existing_book):
        return {"status": 200, "data": {"message": "Book updated"}}
    return {"status": 500, "data": {"error": "Internal Server Error"}}


def head_book(book_id):
    if books.get(book_id):
        return {"status": 200, "data": {"message": "Book exists"}}
    return {"status": 404, "data": {"error": "Book not found"}}
def delete_book(book_id):
    if books.delete(book_id):
        return {"status": 200, "data": {"message": "Book deleted"}}
    return {"status": 404, "data": {"error": "Book not found"}}
