"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io({ path: "/api/socket" });

export default function Chat() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { sender: string; text: string; read: boolean }[]
  >([]);
  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    socket.on("users", (onlineUsers: string[]) => {
      setUsers(onlineUsers.filter((u) => u !== username));
    });

    socket.on("privateMessage", (msg: { sender: string; text: string }) => {
      if (msg.sender === recipient || msg.sender === username) {
        setMessages((prev) => [...prev, { ...msg, read: false }]);
      }
    });

    return () => {
      socket.off("privateMessage");
      socket.off("users");
    };
  }, [recipient]);

  const registerUser = () => {
    if (username && email && password) {
      socket.emit("register", { username, email, password });
    }
  };

  const fetchMessages = async (selectedUser: string) => {
    setRecipient(selectedUser);
    if (!username || !selectedUser) return;

    // Fetch chat history
    const res = await fetch(
      `/api/messages?sender=${username}&recipient=${selectedUser}`
    );
    const data = await res.json();
    setMessages(data);

    // Mark messages as read
    await fetch(`/api/read-messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sender: selectedUser, recipient: username }),
    });

    // Update local state to reflect read status
    setMessages((prev) => prev.map((msg) => ({ ...msg, read: true })));
  };

  const sendMessage = () => {
    if (message.trim() && recipient) {
      const msg = { sender: username, recipient, text: message, read: false };
      socket.emit("privateMessage", msg);
      setMessages((prev) => [...prev, msg]);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-md p-4 border rounded-lg shadow-md bg-white">
        <h2 className="text-lg font-semibold text-center mb-3">Chat App</h2>

        {/* Registration Form */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 border rounded mb-2"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded mb-2"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded mb-2"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={registerUser}
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Register
          </button>
        </div>

        {/* Online Users */}
        <div className="mb-3">
          <select
            value={recipient}
            onChange={(e) => fetchMessages(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select a friend</option>
            {users.map((user) => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </select>
        </div>

        {/* Chat Messages */}
        <div className="h-64 overflow-y-auto border-b mb-4 p-2 bg-gray-50 rounded-md">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-2 mb-1 rounded-md ${
                msg.sender === username
                  ? "bg-blue-200 text-right"
                  : "bg-gray-200 text-left"
              }`}
            >
              <strong>{msg.sender}:</strong> {msg.text}
              {msg.sender === username && (
                <span className="text-xs ml-2">
                  {msg.read ? "✅ Read" : "⏳ Sent"}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Send Message */}
        <div className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 p-2 border rounded-l"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white p-2 rounded-r"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
