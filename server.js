import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import "./envConfig.js";

const dev = process.env.NEXT_PUBLIC_NODE_ENV !== "production";
const hostname = process.env.NEXT_PUBLIC_HOST_NAME;
const port = process.env.NEXT_PUBLIC_PORT;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    // ...
    console.log("socket", socket);
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
