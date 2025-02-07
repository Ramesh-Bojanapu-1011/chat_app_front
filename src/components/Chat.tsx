'use client';
import { getSocket } from '@/data/utils/socket';
import { useEffect, useState } from 'react';

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
  const [file, setFile] = useState<File>();
  const [fileUrl, setFileUrl] = useState('');

  const [friend, setFriend] = useState('');

  const socket = getSocket();

  console.log(socket)

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch(
        `/api/messages/get?senderId=${userId}&receiverId=${friendId}`
      );
      const data = await res.json();
      console.log(data.messages);
      setMessages(data.messages);
      if (data.messages == 0) {
        setFriend(friendId);
        return;
      }

      setFriend(data.messages[0].receiverId.username);
    };

    console.log(friend);

    fetchMessages();
  }, [friendId]);

  useEffect(() => {
    console.log('Connecting to socket...');

    socket.on('connect', () => {
      console.log('Socket Connected:', socket.id);
    });
    socket.emit('userOnline', userId); // Register user as online
    console.log('🔵 User Online:', userId);

    socket.on('receiveMessage', (message) => {
      console.log('Received Message:', message);
      setMessages((prev) => [...prev, message[0]]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [userId]);

  useEffect(() => {
    const uploadFile = async () => {
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const upload = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const fileUrl = await upload.json();
        setFileUrl(fileUrl);
      }
    };

    uploadFile();
  }, [file]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    if (file || newMessage) {
      const res = await fetch('/api/messages/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderId: userId,
          receiverId: friendId,
          message: newMessage,
          fileUrl: fileUrl,
        }),
      });

      const data = await res.json();

      console.log('📤 Sending Message:', data.data);

      socket.emit('sendMessage', data.data[0]);

      setMessages((prev) => [...prev, data.data[0]]);
    }
  };

  // console.log(messages)

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-2">Chat {friend}</h2>
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
            <strong>{msg.senderId.username}:</strong>
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
        onChange={(e) =>
          setFile(e.target.files ? e.target.files[0] : undefined)
        }
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
