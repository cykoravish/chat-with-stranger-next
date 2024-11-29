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
    let rooms = {};
    const users = {};

    io.on("connection", (socket) => {
      console.log("New client connected:", socket.id, socket.username);
      // Log the total number of active connections
      console.log("Total Active Sockets:", io.sockets.sockets.size);
      socket.on("join", ({ name }) => {
        socket.username = name;
        users[socket.id] = { id: socket.id, username: name };
        console.log("join trigger");
        // Notify everyone about the new connection
        io.emit("userList", Object.values(users));

        if (waitingUser && waitingUser.connected) {
          // Pair with the waiting user
          const room = `${waitingUser.id}-${socket.id}`;
          socket.join(room);
          waitingUser.join(room);

          rooms[room] = [waitingUser.id, socket.id];

          io.to(room).emit(
            "connectionMsg",
            `${waitingUser.username} and ${socket.username} are now connected`
          );
          waitingUser = null;
        } else {
          console.log("setting waiting user: ", socket.id);
          waitingUser = socket;
        }
        console.log("users: ", users);
        console.log("rooms: ", rooms);
        console.log("waitingUser: ", waitingUser?.id || waitingUser);
      });

      socket.on("chatMessage", (message) => {
        const userRoom = Object.keys(rooms).find((room) =>
          rooms[room].includes(socket.id)
        );

        if (userRoom) {
          io.to(userRoom).emit("chatMessage", `${socket.username}: ${message}`);
        } else {
          console.log("user not in the room");
        }
      });

      // Handle socket events safely
      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);

        if (users[socket.id]) {
          delete users[socket.id];
        }

        // Notify all clients about the updated user list
        io.emit("userList", Object.values(users));

        const userRoom = Object.keys(rooms).find((room) =>
          rooms[room].includes(socket.id)
        );

        if (userRoom) {
          const remainingUserId = rooms[userRoom].find(
            (id) => id !== socket.id
          );
          const remainingSocket = io.sockets.sockets.get(remainingUserId);

          if (remainingSocket) {
            remainingSocket.emit(
              "connectionMsg",
              "Your partner has disconnected. The room is closed now."
            );
            remainingSocket.leave(userRoom);
          }
          // Clean up room
          delete rooms[userRoom];
          console.log(`Room ${userRoom} destroyed.`);
        }

        if (waitingUser?.id === socket.id) {
          waitingUser = null;
        }

        console.log("users after disconnection: ", users);
        console.log("rooms after disconnection: ", rooms);
        console.log(
          "waitingUser after disconnection: ",
          waitingUser?.id || waitingUser
        );

        // Log the total number of active connections
        console.log(
          "Total Active Sockets after disconnection:",
          io.sockets.sockets.size
        );
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
