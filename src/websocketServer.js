// websocketServer.js
const WebSocket = require("ws");
const { postMessAPi } = require("./services/messCRUD");

const WebSocketServer = new WebSocket.Server({ noServer: true });

// Store active connections
const clients = new Map();

WebSocketServer.on("connection", (ws, request) => {
  console.log("New client connected");

  // Handle new connection
  ws.on("message", async (message) => {
    try {
      const data = JSON.parse(message);
      console.log("Received message:", data);

      if (data.type === "register") {
        // Handle user registration
        ws.userId = data.userId;
        clients.set(data.userId, ws);
        console.log(`User ${data.userId} registered`);
        return;
      }

      // Handle chat message
      const savedMessage = await postMessAPi(
        data.senderId,
        data.receiverId,
        data.content,
        data.seen
      );

      // Broadcast to sender and receiver with delay
      setTimeout(() => {
        const messageData = {
          type: "new_message",
          message: {
            ...data,
            _id: savedMessage._id,
            timestamp: new Date(),
          },
        };

        // Send to sender
        const senderWs = clients.get(data.senderId);
        if (senderWs && senderWs.readyState === WebSocket.OPEN) {
          senderWs.send(JSON.stringify(messageData));
        }

        // Send to receiver
        const receiverWs = clients.get(data.receiverId);
        if (receiverWs && receiverWs.readyState === WebSocket.OPEN) {
          receiverWs.send(JSON.stringify(messageData));
        }
      }, 2000);
    } catch (error) {
      console.error("Error processing message:", error);
      ws.send(
        JSON.stringify({
          type: "error",
          message: "Error processing message",
        })
      );
    }
  });

  // Handle client disconnect
  ws.on("close", () => {
    if (ws.userId) {
      clients.delete(ws.userId);
      console.log(`User ${ws.userId} disconnected`);
    }
  });

  // Handle errors
  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

module.exports = WebSocketServer;
