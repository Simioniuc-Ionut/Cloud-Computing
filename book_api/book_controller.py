from book_model import BookModel
books = BookModel()

def get_books():
    return {"status": 200,"data": books.get_all()}

def get_book(book_id):
    book = books.get(book_id)
    if book:
        return {"status": 200, "data": book}
    return {"status": 404, "data": {"error": "Book not found"}}

def create_book(data):
    books.add(data)
    return {"status": 201, "data": {"message": "Book created"}}

def update_book(book_id, data):
    if books.update(book_id, data):
        return {"status": 200, "data": {"message": "Book updated"}}
    return {"status": 404, "data": {"error": "Book not found"}}

def delete_book(book_id):
    if books.delete(book_id):
        return {"status": 200, "data": {"message": "Book deleted"}}
    return {"status": 404, "data": {"error": "Book not found"}}
