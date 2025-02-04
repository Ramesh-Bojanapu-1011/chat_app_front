"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

interface Message {
  _id: string;
  senderId: { _id: string; username: string; email: string };
  receiverId: { _id: string; username: string; email: string };
  message: string;
  createdAt: string;
}

export default function Chat({
  userId,
  friendId,
}: {
  userId: string;
  friendId: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const socket = io({ path: "/api/socket" });

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch(
        `/api/messages/get?senderId=${userId}&receiverId=${friendId}`
      );
      const data = await res.json();
      console.log(data);
      setMessages(data.messages);
    };
    fetchMessages();
  }, [friendId]);

  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });
  }, []);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const res = await fetch("/api/messages/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        senderId: userId,
        receiverId: friendId,
        message: newMessage,
      }),
    });

    const data = await res.json();
    socket.emit("sendMessage", {
      data,
    });
    console.log(data);

    setNewMessage("");
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-2">Chat</h2>
      <div className="h-64 overflow-y-auto border p-2 mb-2">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`p-2 my-1 rounded-lg ${
              msg.senderId._id === userId
                ? "bg-blue-300 text-right"
                : "bg-gray-300 text-left"
            }`}
          >
            <strong>{msg.receiverId.username}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message..."
        className="w-full border p-2 rounded-lg"
      />
      <button
        onClick={sendMessage}
        className="w-full mt-2 bg-blue-500 text-white p-2 rounded-lg"
      >
        Send
      </button>
    </div>
  );
}
