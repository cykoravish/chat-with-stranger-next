"use client";
import React, { useEffect, useState, useRef, FormEvent } from "react";
import { getSocket } from "@/socket";
import { useAppContext } from "@/context";
import { useRouter } from "next/navigation";
import ConnectingScreen from "@/components/ConnectingScreen";
import Image from "next/image";
import { IoSend } from "react-icons/io5";
import Sidebar from "@/components/Sidebar";

export interface User {
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
  const inputRef = useRef<HTMLInputElement | null>(null);
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
      currentSocket.connect(); // Connect only if not already connected
    }

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
    };

    const handleChatMessage = (msg: ChatMessage) => {
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
      setIsConnected(false);
      socketRef.current.emit("join", { name });
    }
  };

  if (!isConnected) {
    return <ConnectingScreen />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e?.target.value);

    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <div className="overflow-hidden">
          <div className="text-center border-darkgreen border-b shadow-lg fixed w-full z-10">
            <Sidebar data={users} />
            <div className="flex items-center justify-center px-4"></div>
          </div>

          <div className="pt-24 pb-24 overflow-y-auto px-4">
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
                      className="rounded-full"
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
                        ? "bg-cyan-700 text-white"
                        : "bg-gray-800 text-gray-200"
                    } max-w-full overflow-hidden`}
                  >
                    <p className="text-sm font-bold  text-cyan-300">
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

          {!connectionMsg.connected ? (
            <div className="text-center fixed bottom-0 left-0 right-0 flex items-center rounded-full min-h-14 overflow-hidden mb-8">
              <button
                className="bg-cyan-3r00 rounded-md text-red-500 w-full h-full py-4 text-sm"
                onClick={() => reconnect()}
              >
                user disconneted! click here to find someone else
              </button>
            </div>
          ) : (
            <form
              onSubmit={sendMessage}
              className="fixed bottom-0 left-0 right-0 dark:bg-black border-t border-darkgreen flex items-center rounded-full min-h-14 px-4 overflow-hidden mb-3"
            >
              <div className="relative flex-1 h-auto flex items-center justify-between space-x-2">
                <input
                  ref={inputRef}
                  value={message}
                  onChange={handleInputChange}
                  placeholder="Message..."
                  className="w-full h-full resize-none placeholder:text-gray-500 placeholder:font-light placeholder:text-sm focus:outline-none
                  px-4 text-base rounded-lg font-mono bg-transparent text-white
                  "
                  style={{
                    padding: "0.5rem 2rem",
                    boxSizing: "border-box",
                  }}
                />

                <button
                  type="submit"
                  disabled={!message?.trim()}
                  className="text-darkgreen disabled:text-gray-400 h-10 px-4 flex items-center justify-center rounded-lg font-bold transition-transform transform hover:scale-105 duration-150 ease-in-out"
                >
                  <IoSend className="w-6 h-6" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
