const WebSocket = require("ws");

let WSS;

class WebSocketServer {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Map();

    this.wss.on("connection", (ws) => {
      console.log("Client connected");

      ws.on("message", (message) => {
        const data = JSON.parse(message);

        if (data.type === "login") {
          const userId = data.userId;
          this.addClient(userId, ws);
          console.log(`User ${userId} logged in`);
        }
      });

      ws.on("close", () => {
        this.removeClient(ws);
        console.log("Client disconnected");
      });

      ws.send(JSON.stringify({ message: "Welcome to the WebSocket server!" }));
    });
  }

  addClient(userId, client) {
    this.clients.set(userId, client);
  }

  removeClient(client) {
    for (let [userId, ws] of this.clients.entries()) {
      if (ws === client) {
        this.clients.delete(userId);
        break;
      }
    }
  }

  broadcast(message) {
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }

  getClients() {
    return Array.from(this.clients.keys()); // Returns array of user IDs
  }

  sendToClient(userId, message) {
    const client = this.clients.get(userId);
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  }

  close() {
    this.wss.close();
  }
}

function initWebSocket(server) {
  WSS = new WebSocketServer(server);
}

function getWSS() {
  return WSS;
}

module.exports = { initWebSocket, getWSS };
