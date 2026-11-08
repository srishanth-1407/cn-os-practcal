# Client Side Socket Programming (TCP)
# Tested and optimized for Operating Systems & Computer Networks Practicals

import socket

def run_client():
    # 1. Create a socket object
    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    server_ip = "127.0.0.1"  # Server's IP address
    server_port = 8000       # Server's port number

    # 2. Establish connection with server
    client.connect((server_ip, server_port))
    print(f"[+] Connected to server at {server_ip}:{server_port}")

    # 3. Message communication loop
    while True:
        # Input message and send to server
        msg = input("Enter message (or 'close' to disconnect): ")
        client.send(msg.encode("utf-8")[:1024])

        # Receive response from server
        response = client.recv(1024)
        response = response.decode("utf-8")

        # If server sent "closed", break loop and close socket
        if response.lower() == "closed":
            print("[*] Server acknowledged closure.")
            break

        print(f"Received: {response}")

    # 4. Close client socket
    client.close()
    print("Connection to server closed")

if __name__ == "__main__":
    run_client()

