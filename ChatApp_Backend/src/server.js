const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const router = require("./router/index");
const responseHandler = require("./middleware/responseHandler");
const socketServer = require("./sockets/socketServer");
const socketAuthMiddleware = require("./middleware/socket");

dotenv.config({ quiet: true });

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: ["http://localhost:5173", "https://chat-app-socket-ten.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://chat-app-socket-ten.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(responseHandler);
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Routes
app.use("/api", router);


io.use(socketAuthMiddleware)

// Initialize sockets
socketServer(io);


// Start server
server.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 Server listing on http://localhost:${PORT}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: err.message,
  });
});

module.exports = app;
