"use client";
import React, { useEffect, useState, useRef, FormEvent } from "react";
import { getSocket } from "@/socket";
import { useAppContext } from "@/context";
import { useRouter } from "next/navigation";
import ConnectingScreen from "@/components/ConnectingScreen";
import Image from "next/image";
import { IoSend } from "react-icons/io5";
import Sidebar from "@/components/sidebar";

interface User {
  id: string;
  username: string;
}
interface ConMsg {
  connected: boolean;
  message: string;
  otherUser: { name: string };
}
interface ChatMessage {
  username: string;
  message: string;
  avatar: string;
}

export default function Chat() {
  const [connectionMsg, setConnectionMsg] = useState<ConMsg>({
    connected: false,
    message: "in waiting area",
    otherUser: { name: "" },
  });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
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
        console.log("connectionMsg: ", msg);
      }
      // if (msg.connected === false) {
      //   setIsConnected(false);
      // }
    };

    const handleChatMessage = (msg: ChatMessage) => {
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

  const sendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim()) {
      socketRef.current.emit("chatMessage", message);
      setMessage("");
    }
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.focus();
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

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e?.target.value);

    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  return (
    <>
      {/* <div className="flex flex-col min-h-screen bg-gray-800 text-white p-4">
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
    </div> */}

      {/* ///////////////////////////////////////////////////////////////////////////////////////////////////////// */}
      {/* ///////////////////////////////////////////////////////////////////////////////////////////////////////// */}

      <div className="min-h-screen flex flex-col dark:bg-black text-gray-200">
        <div className="overflow-hidden">
          <div className="dark:bg-black text-center border-b border-gray-700 shadow-lg">
            <Sidebar/>
            <div className="flex items-center justify-center px-4"></div>         
          </div>
          
          <div className="pt-32 pb-24 overflow-y-auto px-4">
            <ul className="space-y-4">
              {chatMessages.map((msg, index) => (
                <li
                  key={index}
                  className={`flex ${
                    msg.username === name ? "flex-row-reverse" : "flex-row"
                  } items-start space-x-2`}
                >
                  <div
                    className={`relative flex-shrink-0 ${
                      msg.username === name ? "ml-2" : "mr-2"
                    }`}
                  >
                    <Image
                      src={msg.avatar || "/default.png"}
                      alt={`${msg.username}'s avatar`}
                      width={40}
                      height={40}
                      className="rounded-full border border-gray-600"
                    />
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
                        connectionMsg.otherUser.name
                          ? "bg-green-500"
                          : "bg-gray-500"
                      }`}
                    ></span>
                  </div>
                  <div
                    className={`flex-1 p-3 rounded-[0.5rem] ${
                      msg.username === name
                        ? "bg-blue-800 text-white"
                        : "bg-gray-800 text-gray-200"
                    } max-w-full overflow-hidden`}
                  >
                    <p className="text-sm font-semibold text-cyan-300">
                      {msg.username}
                    </p>
                    {msg.message && (
                      <p className="text-base break-words whitespace-pre-wrap">
                        {msg.message}
                      </p>
                    )}
                  </div>
                </li>
              ))}
              <div id="chat-end"></div>
            </ul>
          </div>

          <form
            onSubmit={sendMessage}
            className="fixed bottom-0 left-0 right-0 dark:bg-black border-t border-blue-800 flex items-center rounded-full min-h-14 px-4 overflow-hidden mb-3"
          >
            <div className="relative flex-1 h-auto flex items-center justify-between space-x-2">
              {/* Message Input */}
              <textarea
                ref={inputRef}
                value={message}
                onChange={handleInputChange}
                placeholder="Message..."
                rows={1}
                className="w-full h-full dark:bg-black text-gray-200 resize-none placeholder:text-gray-500 placeholder:font-light placeholder:text-sm focus:outline-none"
                style={{
                  padding: "0.5rem 2rem",
                  boxSizing: "border-box",
                }}
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={!message?.trim()}
                className="text-blue-600 disabled:text-gray-400 h-10 px-4 flex items-center justify-center rounded-lg font-bold transition-transform transform hover:scale-105 duration-150 ease-in-out"
              >
                <IoSend className="w-6 h-6" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
