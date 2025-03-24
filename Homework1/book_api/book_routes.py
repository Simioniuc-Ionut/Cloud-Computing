import json
from book_controller import get_books, get_book, create_book, update_book, update_book_by_title, update_book_by_author, patch_book, head_book, delete_book
from urllib.parse import urlparse, parse_qs
from auth import generate_token, verify_token
from http.server import BaseHTTPRequestHandler

def handle_request(handler: BaseHTTPRequestHandler, method: str):
    path = handler.path
    headers = handler.headers
    response_data = {}
    status_code = 200

    try:
        if method == "POST" and path == "/auth/login":
            length = int(headers.get("Content-Length", 0))
            body = handler.rfile.read(length).decode("utf-8")
            data = json.loads(body)

            username = data.get("username")
            password = data.get("password")

            if username in ["admin", "user"] and password == "password123":
                token = generate_token(username)
                response_data = {"token": token}
                status_code = 200
            else:
                response_data = {"error": "Invalid credentials"}
                status_code = 401
        elif path.startswith("/books"):
            auth_header = headers.get("Authorization")
            if not auth_header or not auth_header.startswith("Bearer "):
                response_data = {"error": "Token missing"}
                status_code = 403
            else:
                token = auth_header.split(" ")[1]
                username = verify_token(token)

                if not username:
                    response_data = {"error": "Invalid token"}
                    status_code = 403
                else:
                    query_params = parse_qs(urlparse(path).query)

                    if method == "GET":
                        if path == "/books":
                            response_data = get_books()
                        elif path.startswith("/books/filters"):
                            filters = {}
                            if "author" in query_params:
                                filters["author"] = query_params["author"][0]

                            sort_by = query_params.get("sort", [None])[0]
                            response_data = get_books(filters, sort_by)
                        else:
                            book_id = path.split("/")[-1]
                            response_data = get_book(book_id)
                    elif method == "POST":
                        length = int(handler.headers.get('Content-Length', 0))
                        if length == 0:
                            response_data = {"error": "Bad Request - Missing data"}
                            status_code = 400
                        else:
                            post_data = json.loads(handler.rfile.read(length))
                            print("|||",post_data)
                            response_data = create_book(post_data)
                            status_code = 201
                    elif method == "PUT":
                        length = int(handler.headers.get('Content-Length', 0))
                        if length == 0:
                            response_data = {"error": "Bad Request - Missing data"}
                            status_code = 400
                        else:
                            put_data = json.loads(handler.rfile.read(length))
                            if "id" in put_data:
                                response_data = update_book(put_data["id"], put_data)
                            elif "title" in put_data:
                                response_data = update_book_by_title(put_data["title"], put_data)
                            elif "author" in put_data:
                                response_data = update_book_by_author(put_data["author"], put_data)
                            else:
                                response_data = {"error": "Bad Request - Missing fields"}
                                status_code = 400
                    elif method == "PATCH":
                        length = int(handler.headers.get('Content-Length', 0))
                        if length == 0:
                            response_data = {"error": "Bad Request - Missing data"}
                            status_code = 400
                        else:
                            patch_data = json.loads(handler.rfile.read(length))
                            book_id = path.split("/")[-1]
                            response_data = patch_book(book_id, patch_data)
                    elif method == "HEAD":
                        book_id = path.split("/")[-1]
                        response_data = head_book(book_id)
                        handler.send_response(response_data["status"])
                        handler.send_header('Content-Type', 'application/json')
                        handler.end_headers()
                        return
                    elif method == "DELETE":
                        book_id = path.split("/")[-1]
                        response_data = delete_book(book_id)
                    else:
                        response_data = {"error": "Method Not Allowed"}
                        status_code = 405
        else:
            response_data = {"error": "Not Found"}
            status_code = 404
    except json.JSONDecodeError:
        response_data = {"error": "Bad Request - Invalid JSON format"}
        status_code = 400
    except Exception as e:
        response_data = {"error": "Internal Server Error", "details": str(e)}
        status_code = 500

    handler.send_response(status_code)
    handler.send_header('Content-Type', 'application/json')
    handler.end_headers()
    if method != "HEAD":
        handler.wfile.write(json.dumps(response_data).encode())