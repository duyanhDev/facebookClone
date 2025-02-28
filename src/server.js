// index.js
require("dotenv").config();
const connection = require("./config/database");
const express = require("express");
const app = express();
const port = process.env.PORT || 8002;
const fileUpload = require("express-fileupload");
const routerAPI = require("./routes/api");
const path = require("path");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
// Create HTTP server
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// Middleware
app.use(express.static(path.join("./src", "public")));
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use(fileUpload());

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/v1/api/", routerAPI);
app.use(
  "/images",
  express.static(path.join(__dirname, "public/images/upload"))
);

app.set("io", io);
// Kết nối Socket.IO
// app.use((req, res, next) => {
//   req.io = io;
//   next();
// });

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", (userId) => {
    if (userId) {
      socket.join(userId);
      console.log(`User ${userId} joined room`);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start server
(async () => {
  try {
    await connection();
    server.listen(port, () => {
      console.log(`Backend zero app listening on port ${port}`);
      console.log(`WebSocket server is ready`);
    });
  } catch (error) {
    console.log(">>check error connection db", error);
  }
})();
