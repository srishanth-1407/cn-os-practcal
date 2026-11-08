# Server Side Socket Programming (TCP)
# Tested and optimized for Operating Systems & Computer Networks Practicals

import socket

def run_server():
    # 1. Create a socket object (AF_INET = IPv4, SOCK_STREAM = TCP)
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    server_ip = "127.0.0.1"
    port = 8000

    # 2. Bind the socket to IP address and port
    server.bind((server_ip, port))

    # 3. Listen for incoming connections
    server.listen(0)
    print(f"[*] Server listening on {server_ip}:{port}")

    # 4. Accept incoming connection (blocking call)
    client_socket, client_address = server.accept()
    print(f"[+] Accepted connection from {client_address[0]}:{client_address[1]}")

    # 5. Receive and respond to data from client
    while True:
        request = client_socket.recv(1024)
        request = request.decode("utf-8") # convert bytes to string

        # If we receive "close" from client, acknowledge and break
        if request.lower() == "close":
            client_socket.send("closed".encode("utf-8"))
            break

        print(f"Received: {request}")

        response = "accepted".encode("utf-8") # convert string to bytes
        client_socket.send(response)

    # 6. Close connection socket with client
    client_socket.close()
    print("Connection to client closed")

    # 7. Close server socket
    server.close()
    print("Server shutdown cleanly")

if __name__ == "__main__":
    run_server()

