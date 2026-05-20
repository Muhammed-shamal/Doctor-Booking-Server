require("dotenv").config();

const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");

const { Server } = require("socket.io");
const { corsOptions } = require("./config/common");

const server = http.createServer(app);

const io = new Server(server, {
  cors: corsOptions.socket,
});

global.io = io;

io.on("connection", (socket) => {
  console.log("Socket Connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Socket Disconnected");
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
