import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import "./envConfig.js";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOST_NAME || "localhost";
const port = process.env.PORT || 3003;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

const gracefulShutdown = (signal, io, httpServer) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  io.close(() => {
    console.log("Socket.IO server closed.");
    httpServer.close(() => {
      console.log("HTTP server closed.");
      process.exit(0);
    });
  });
};

app
  .prepare()
  .then(() => {
    const httpServer = createServer(handler);

    const io = new Server(httpServer);

    let waitingUser = null;
    let room;

    io.on("connection", (socket) => {
      console.log("New client connected:", socket.id);

      socket.on("join", ({ name }) => {
        socket.username = name;

        if (waitingUser && waitingUser.connected) {
          // Pair with the waiting user
          room = `${waitingUser.id}-${socket.id}`;
          console.log("room:", room);
          socket.join(room);
          waitingUser.join(room);

          io.to(room).emit(
            "connectionMsg",
            `${waitingUser.username} and ${socket.username} are not connected`
          );
          waitingUser = null;
        } else {
          console.log("setting waiting user: ", socket.id);
          waitingUser = socket;
        }
      });

      socket.on("chatMessage", (message) => {
        console.log("message triggered: ", message);

        if (room) {
          console.log("message in room triggered: ", room);
          io.to(room).emit("chatMessage", `${socket.username}: ${message}`);
        } else {
          console.log("nothing inside room variable");
        }
      });

      // Handle socket events safely
      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
        if (waitingUser?.id === socket.id) {
          waitingUser = null;
        }
      });
    });

    httpServer
      .once("error", (err) => {
        console.error("Server error: ", err);
        process.exit(1);
      })
      .listen(port, () => {
        console.log(`> Ready on http://${hostname}:${port}`);
      });

    // Register signal handlers for graceful shutdown
    process.on("SIGINT", () => gracefulShutdown("SIGINT", io, httpServer));
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM", io, httpServer));
  })
  .catch((err) => {
    console.error("Failed to prepare Next.js app:", err);
    process.exit(1);
  });
