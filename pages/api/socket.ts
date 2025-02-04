import { NextApiRequest, NextApiResponse } from 'next';
import { Server as IOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import type { Socket as NetSocket } from 'net';
// import Message from "../../models/Message"; // Import Message Model
// import { connectDB } from "../../lib/mongodb";
import mongoose from 'mongoose';
import { connectDB } from '@/data/lib/mongodb';
import Message from '@/data/models/Message';

interface SocketServer extends HTTPServer {
  io?: IOServer;
}

interface SocketWithServer extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithServer;
}

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (!res.socket.server.io) {
    console.log('✅ Starting Socket.IO server...');
    const io = new IOServer(res.socket.server as any, {
      path: '/api/socket',
      cors: { origin: '*', methods: ['GET', 'POST'] },
    });

    io.on('connection', (socket) => {
      console.log('User Connected:', socket.id);

      socket.on('sendMessage', async (data) => {
        try {
          await connectDB();
          const { senderId, receiverId, message, fileUrl } = data;

          const newMessage = new Message({
            senderId: new mongoose.Types.ObjectId(senderId),
            receiverId: new mongoose.Types.ObjectId(receiverId),
            message: message.trim(),
            fileUrl: fileUrl || null,
          });

          await newMessage.save();

          console.log('Message Sent:', newMessage);

          io.to(receiverId).emit('receiveMessage', newMessage);
          io.to(senderId).emit('receiveMessage', newMessage);
        } catch (error) {
          console.error('Error sending message:', error);
        }
      });

      socket.on('disconnect', () => {
        console.log('User Disconnected:', socket.id);
      });
    });

    res.socket.server.io = io;
  }
  res.end();
}
