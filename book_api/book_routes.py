import json
from book_controller import get_books, get_book, create_book, update_book, delete_book

def handle_request(handler, method):
    path = handler.path
    response = {}

    try:
        if path.startswith("/books"):
            if method == "GET":
                if path == "/books":
                    response = get_books()
                else:
                    book_id = path.split("/")[-1]
                    response = get_book(book_id)

            elif method == "POST":
                length = int(handler.headers.get('Content-Length', 0))
                if length == 0:
                    response = {"status": 400, "data": {"error": "Bad Request - Missing data"}}
                else:
                    post_data = json.loads(handler.rfile.read(length))
                    if "id" not in post_data or "title" not in post_data or "author" not in post_data:
                        response = {"status": 400, "data": {"error": "Bad Request - Missing fields"}}
                    else:
                        response = create_book(post_data)

            elif method == "PUT":
                length = int(handler.headers.get('Content-Length', 0))
                if length == 0:
                    response = {"status": 400, "data": {"error": "Bad Request - Missing data"}}
                else:
                    put_data = json.loads(handler.rfile.read(length))
                    book_id = path.split("/")[-1]
                    if "title" not in put_data or "author" not in put_data:
                        response = {"status": 400, "data": {"error": "Bad Request - Missing fields"}}
                    else:
                        response = update_book(book_id, put_data)

            elif method == "DELETE":
                book_id = path.split("/")[-1]
                response = delete_book(book_id)

            else:
                response = {"status": 405, "data": {"error": "Method Not Allowed"}}

        else:
            response = {"status": 404, "data": {"error": "Not Found"}}

    except json.JSONDecodeError:
        response = {"status": 400, "data": {"error": "Bad Request - Invalid JSON format"}}
    except Exception as e:
        response = {"status": 500, "data": {"error": "Internal Server Error", "details": str(e)}}

    # Send response
    handler.send_response(response["status"])
    handler.send_header('Content-Type', 'application/json')
    handler.end_headers()
    handler.wfile.write(json.dumps(response["data"]).encode())
