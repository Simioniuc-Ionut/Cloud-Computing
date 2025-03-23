import xml.etree.ElementTree as ET
import os

class BookModel:
    def __init__(self):
        base_dir = os.path.dirname(os.path.abspath(__file__))
        self.file_path = os.path.join(base_dir, "storage\\books.xml")

        self.tree = ET.parse(self.file_path)
        self.root = self.tree.getroot()

    def get_all(self):
        """Returns all books as a list of dictionaries."""
        books = []
        for book in self.root.findall("book"):
            books.append({
                "id": book.get("id"),
                "title": book.find("title").text,
                "author": book.find("author").text
            })
        return books

    def get(self, book_id):
        """Returns a book by ID."""
        for book in self.root.findall("book"):
            if book.get("id") == book_id:
                return {
                    "id": book.get("id"),
                    "title": book.find("title").text,
                    "author": book.find("author").text
                }
        return None

    def add(self, data):
        """Adds a new book to the XML."""
        new_book = ET.Element("book", id=str(data["id"]))
        title = ET.SubElement(new_book, "title")
        title.text = data["title"]
        author = ET.SubElement(new_book, "author")
        author.text = data["author"]

        self.root.append(new_book)
        self.tree.write(self.file_path)
        return True

    def update(self, book_id, data):
        """Updates an existing book."""
        for book in self.root.findall("book"):
            if book.get("id") == book_id:
                book.find("title").text = data["title"]
                book.find("author").text = data["author"]
                self.tree.write(self.file_path)
                return True
        return False

    def delete(self, book_id):
        """Deletes a book from the XML."""
        for book in self.root.findall("book"):
            if book.get("id") == book_id:
                self.root.remove(book)
                self.tree.write(self.file_path)
                return True
        return False

if __name__ == "__main__":
    books = BookModel()

    print("📖 All books:", books.get_all())

    print("\n➕ Adding a new book...")
    books.add({"id": "2", "title": "The Pragmatic Programmer", "author": "Andy Hunt"})

    print("📖 All books after adding:", books.get_all())

    print("\n🔍 Searching for the book with ID 2:", books.get("2"))

    print("\n✏️ Updating the book with ID 2...")
    books.update("2", {"title": "The Pragmatic Programmer - 2nd Edition", "author": "Andy Hunt & Dave Thomas"})

    print("📖 All books after update:", books.get_all())

    print("\n🗑️ Deleting the book with ID 2...")
    books.delete("2")

    print("📖 All books after deletion:", books.get_all())
