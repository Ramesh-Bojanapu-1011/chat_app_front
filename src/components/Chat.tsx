'use client';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

interface Message {
  _id: string;
  senderId: { _id: string; username: string; email: string };
  receiverId: { _id: string; username: string; email: string };
  message?: string;
  fileUrl?: string;
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
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const socket = io({ path: '/api/socket' });

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
    console.log('Connecting to socket...');

    socket.on('connect', () => {
      console.log('Socket Connected:', socket.id);
    });

    socket.on('receiveMessage', (message: Message) => {
      console.log('Received Message:', message);
      setMessages((prev) => [...prev, message]);
    });

    socket.on('disconnect', () => {
      console.log('Socket Disconnected');
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  const sendMessage = async () => {
    // if () return;
    if ((!newMessage.trim() && !file) || !newMessage.trim() || !file) return;

    const formData = new FormData();
    formData.append('file', file);
    const upload = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    const fileUrl = await upload.json();

    if (fileUrl.fileUrl || newMessage) {
      // const messageData = {
      //   senderId: userId,
      //   receiverId: friendId,
      //   message: newMessage,
      //   fileUrl: fileUrl.fileUrl,
      // };
      const res = await fetch('/api/messages/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderId: userId,
          receiverId: friendId,
          message: newMessage,
          fileUrl: fileUrl.fileUrl,
        }),
      });
      const data = await res.json();
      // const msgdata = data.messageData;
      socket.emit('sendMessage', {
        data,
      });
      console.log(data);
    }

    setFile(null);

    //     // fileUrl
    // :
    // "/uploads/5ef65faaed0da5a97bc6aded4dd1c611"
    // message
    // :
    // "hgfgdhfdg"
    // receiverId
    // :
    // "67a2109d00e78dd39be6b867"
    // senderId
    // :
    // "67a2106f00e78dd39be6b85f"

    // const res = await fetch("/api/messages/save", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     senderId: userId,
    //     receiverId: friendId,
    //     message: newMessage,
    //     // fileUrl: data.fileUrl,
    //   }),
    // });

    setNewMessage('');
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
                ? 'bg-blue-300 text-right'
                : 'bg-gray-300 text-left'
            }`}
          >
            <strong>{msg.receiverId.username}:</strong>
            {msg.fileUrl && (
              <>
                <img src={msg.fileUrl} alt={msg.fileUrl} />
              </>
            )}{' '}
            {msg.message}
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
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button
        onClick={sendMessage}
        className="w-full mt-2 bg-blue-500 text-white p-2 rounded-lg"
      >
        Send message
      </button>

      {/* <button onClick={sendFile}>Send File</button> */}
    </div>
  );
}
