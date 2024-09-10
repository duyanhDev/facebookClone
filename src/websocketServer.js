// websocketServer.js
const WebSocket = require("ws");
const wss = new WebSocket.Server({ noServer: true }); // Không khởi động một server WebSocket riêng biệt
console.log("WebSocket server is running on ws://localhost:8888");
wss.on("connection", (ws) => {
  console.log("New WebSocket connection established.");

  ws.on("message", (message) => {
    console.log("Received:", message);
    ws.send(JSON.stringify({ type: "UPDATE_STATUS" }));
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed.");
  });
});

module.exports = wss;
