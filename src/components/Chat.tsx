"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io({
  path: "/api/socket", // Ensure this matches backend's path
});

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/messages")
      .then((res) => res.json())
      .then((data) => setMessages(data.map((m: { text: string }) => m.text)));

    socket.on("message", (msg: string) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("message", message);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-md p-4 border rounded-lg shadow-md bg-white">
        <h2 className="text-lg font-semibold text-center mb-3">
          Chat Application
        </h2>
        <div className="h-64 overflow-y-auto border-b mb-4 p-2 bg-gray-50 rounded-md">
          {messages.map((msg, i) => (
            <div key={i} className="p-2 mb-1 bg-blue-100 rounded-md">
              {msg}
            </div>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 p-2 border rounded-l-lg focus:outline-none"
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
