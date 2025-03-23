from http.server import BaseHTTPRequestHandler, HTTPServer
from book_routes import handle_request

class HttpRequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        handle_request(self, "GET")

    def do_POST(self):
        handle_request(self, "POST")

    def do_PUT(self):
        handle_request(self, "PUT")

    def do_DELETE(self):
        handle_request(self, "DELETE")

    def do_PATCH(self):
        handle_request(self, "PATCH")

    def do_HEAD(self):
        handle_request(self, "HEAD")

    def do_OPTIONS(self):  # Pentru suport CORS
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Allow', 'GET, POST, PUT, PATCH, HEAD , DELETE, OPTIONS')
        self.end_headers()



def run(server_class=HTTPServer, handler_class=HttpRequestHandler, port=8081):
    server_address = ('', port)
    https = server_class(server_address, handler_class)
    print(f"Server running on port {port}...")
    https.serve_forever()

if __name__ == "__main__":
    run()