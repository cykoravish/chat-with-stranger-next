"use client";
import React, { useEffect, useState, useRef } from "react";
import { getSocket } from "@/socket";
import { useAppContext } from "@/context";
import { useRouter } from "next/navigation";
import ConnectingScreen from "@/components/ConnectingScreen";

interface User {
  id: string;
  username: string;
}
interface ConMsg {
  connected: boolean;
  message: string;
}

export default function Chat() {
  const [connectionMsg, setConnectionMsg] = useState<ConMsg>({
    connected: false,
    message: "in waiting area",
  });
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const { name } = useAppContext();
  const router = useRouter();

  const socketRef = useRef(getSocket());

  useEffect(() => {
    if (!name) {
      document.cookie =
        "username=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;"; // Clear cookie
      router.replace("/");
      return;
    }

    const currentSocket = socketRef.current;

    if (!currentSocket.connected) {
      //i think remove this
      console.log("Connecting to socket...");
      currentSocket.connect(); // Connect only if not already connected
    }

    console.log("joining chat");
    currentSocket.emit("join", { name });

    // Update the list of online users
    const handleUserList = (userList: User[]) => {
      setUsers(userList);
    };

    // Listener for messages
    const handleConnectionMsg = (msg: ConMsg) => {
      setConnectionMsg(msg);
      if (msg.connected === true) {
        setIsConnected(true);
      }
      // if (msg.connected === false) {
      //   setIsConnected(false);
      // }
    };

    const handleChatMessage = (msg: string) => {
      console.log("message triggered", message);
      setChatMessages((prev) => [...prev, msg]);
    };

    currentSocket.on("userList", handleUserList);
    currentSocket.on("connectionMsg", handleConnectionMsg);
    currentSocket.on("chatMessage", handleChatMessage);

    return () => {
      currentSocket.off("userList", handleUserList);
      currentSocket.off("connectionMsg", handleConnectionMsg);
      currentSocket.off("chatMessage", handleChatMessage);
      // currentSocket.close();
      if (currentSocket.connected) {
        currentSocket.disconnect();
        console.log("Socket disconnected");
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, router]);

  const sendMessage = () => {
    if (message.trim()) {
      socketRef.current.emit("chatMessage", message);
      setMessage("");
    }
  };

  const reconnect = () => {
    if (name) {
      console.log("reconnecting");
      setIsConnected(false);
      socketRef.current.emit("join", { name });
    }
  };

  if (!isConnected) {
    return <ConnectingScreen />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-800 text-white p-4">
      <h1 className="text-2xl font-semibold mb-2">Chatting as: {name}</h1>

      {connectionMsg.message && (
        <div className="bg-blue-600 text-white py-2 px-4 rounded mb-4">
          {connectionMsg.message}
        </div>
      )}
      {!connectionMsg.connected && (
        <div>
          <button
            className="bg-blue-500 text-white p-4"
            onClick={() => reconnect()}
          >
            Find someone else
          </button>
        </div>
      )}

      <div className="flex flex-col flex-grow mb-4">
        <h2 className="text-xl font-semibold mb-2">Chat Messages</h2>
        <div className="chat-messages bg-gray-700 p-4 rounded h-64 overflow-y-auto mb-4">
          {chatMessages.length > 0 ? (
            chatMessages.map((msg, index) => (
              <div key={index} className="mb-2">
                {msg}
              </div>
            ))
          ) : (
            <p className="text-gray-400">No messages yet.</p>
          )}
        </div>

        {/* Message Input and Send Button */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-grow bg-gray-600 text-white p-2 rounded outline-none"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
          >
            Send
          </button>
        </div>
      </div>

      {/* Online Users Section */}
      <div className="user-list bg-gray-700 p-4 rounded">
        <h2 className="text-xl font-semibold mb-2">Online Users</h2>
        <ul className="space-y-2">
          {users.length > 0 ? (
            users.map((user) => (
              <li
                key={user.id}
                className="flex items-center gap-2 bg-gray-600 p-2 rounded"
              >
                <span>{user.username}</span>
                <span className="text-green-400 text-sm">(Online)</span>
              </li>
            ))
          ) : (
            <p className="text-gray-400">No users online.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
