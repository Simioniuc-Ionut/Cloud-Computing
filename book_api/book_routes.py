import json
from book_controller import get_books, create_book, update_book,update_book_by_title,update_book_by_author,patch_book,head_book, delete_book
from urllib.parse import urlparse, parse_qs
def handle_request(handler, method):
    path = handler.path
    response = {}

    try:
        if path.startswith("/books"):
            query_params = parse_qs(urlparse(path).query)  #  Extract query parameters

            if method == "GET":
                if path.startswith("/books"):
                    filters = {}
                    if "author" in query_params:
                        filters["author"] = query_params["author"][0]

                    sort_by = query_params.get("sort", [None])[0]
                    response = get_books(filters, sort_by)

            elif method == "POST":
                length = int(handler.headers.get('Content-Length', 0))
                if length == 0:
                    response = {"status": 400, "data": {"error": "Bad Request - Missing data"}}
                else:
                    post_data = json.loads(handler.rfile.read(length))
                    response = create_book(post_data)

            elif method == "PUT":
                length = int(handler.headers.get('Content-Length', 0))
                if length == 0:
                    response = {"status": 400, "data": {"error": "Bad Request - Missing data"}}
                else:
                    put_data = json.loads(handler.rfile.read(length))
                    if "id" in put_data:
                        response = update_book(put_data["id"], put_data)
                    elif "title" in put_data:
                        response = update_book_by_title(put_data["title"], put_data)
                    elif "author" in put_data:
                        response = update_book_by_author(put_data["author"], put_data)
                    else:
                        response = {"status": 400, "data": {"error": "Bad Request - Missing fields"}}
            elif method == "PATCH":
                length = int(handler.headers.get('Content-Length', 0))
                if length == 0:
                    response = {"status": 400, "data": {"error": "Bad Request - Missing data"}}
                else:
                    patch_data = json.loads(handler.rfile.read(length))
                    book_id = path.split("/")[-1]
                    response = patch_book(book_id, patch_data)


            elif method == "HEAD":
                book_id = path.split("/")[-1]
                response = head_book(book_id)
                handler.send_response(response["status"])
                handler.send_header('Content-Type', 'application/json')
                handler.end_headers()
                return  # Do not write body for HEAD requests

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
    if method != "HEAD":
        handler.wfile.write(json.dumps(response["data"]).encode())