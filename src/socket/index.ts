"use client";

import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io({
      transports: ["websocket"], // Use WebSocket to reduce overhead
      autoConnect: false,        // Prevent auto-connection
    });
  }
  return socket;
};
