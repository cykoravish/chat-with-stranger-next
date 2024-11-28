"use client";
import React, { useEffect, useState, useRef } from "react";
import { socket } from "@/socket"; // Assuming socket is initialized in a separate module
import { useAppContext } from "@/context";
import { useRouter } from "next/navigation";

export default function Chat() {
  const [connectionMsg, setConnectionMsg] = useState<string>("");
  const [chatMsg, setChatMessage] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const { name } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (!name) {
      document.cookie =
        "username=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;"; // Clear cookie
      router.push("/"); // Redirect to home if no name
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  // Ref to track the socket instance
  const socketRef = useRef(socket);

  useEffect(() => {
    // Ensure socket is initialized only once
    if (!socketRef.current) {
      socketRef.current = socket; // Store socket instance in ref
    }

    const currentSocket = socketRef.current;

    // Emit the join event once when name is set or changed
    console.log("joining chat");
    currentSocket.emit("join", { name });

    // Listener for messages
    const handleConnectionMsg = (message: string) => {
      setConnectionMsg(message);
    };
    const handleChatMsg = (message: string) => {
      console.log("message triggered", message)
      setChatMessage((prev) => [...prev, message]);
    };

    currentSocket.on("connectionMsg", handleConnectionMsg);
    currentSocket.on("chatMessage", handleChatMsg);

    // Cleanup function: Remove the message listener and close the socket
    return () => {
      currentSocket.off("connectionMsg", handleConnectionMsg); // Properly remove listener
      currentSocket.off("chatMessage", handleChatMsg); // Properly remove listener
      // Optional: Close the socket if it's no longer needed when the component unmounts
      currentSocket.close(); // Uncomment if you want to close the socket connection on unmount
    };
  }, [name]); // Only re-run when `name` changes

  const sendMessage = () => {
    if (message.trim()) {
      socketRef.current.emit("chatMessage", message);
      setMessage(""); // Reset the input field after sending the message
    }
  };

  return (
    <div>
      <h1>Chatting as: {name}</h1>
      <div>{connectionMsg}</div>
      <h2>
        {chatMsg.map((e, i) => (
          <div key={i}>{e}</div>
        ))}
      </h2>
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="bg-gray-500 text-white"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
