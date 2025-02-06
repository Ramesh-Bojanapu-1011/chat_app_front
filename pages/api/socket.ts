import { NextApiRequest, NextApiResponse } from 'next';
import { Server as ServerIO } from 'socket.io';
import { Server as NetServer } from 'http';
// import Message from "../../models/Message";
// import { connectDB } from "../../lib/mongodb";
import mongoose from 'mongoose';
import { connectDB } from '@/data/lib/mongodb';
import Message from '@/data/models/Message';

type SocketUser = { userId: string; socketId: string };

let onlineUsers: SocketUser[] = [];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!res.socket) return res.status(500).json({ error: 'Socket not found' });

  if (!(res.socket as any).server.io) {
    console.log('Initializing Socket.IO...');

    const httpServer: NetServer = (res.socket as any).server;
    const io = new ServerIO(httpServer, {
      path: '/api/socket',
      cors: { origin: '*', methods: ['GET', 'POST'] },
    });

    (res.socket as any).server.io = io;

    io.on('connection', (socket) => {
      console.log('🔵 User Connected:', socket.id);

      // Register user as online
      socket.on('userOnline', (userId) => {
        if (!onlineUsers.find((user) => user.userId === userId)) {
          onlineUsers.push({ userId, socketId: socket.id });
        }
        console.log('✅ Online Users:', onlineUsers);
      });

      // Send message event
      socket.on('sendMessage', async (data) => {
        try {
          await connectDB();
          const { senderId, receiverId, message, fileUrl } = data;
          console.log('📩 Message Received:', data);

          const newMessage = new Message({
            senderId: new mongoose.Types.ObjectId(senderId),
            receiverId: new mongoose.Types.ObjectId(receiverId),
            message: message?.trim() || '',
            fileUrl: fileUrl || null,
          });

          console.log(
            onlineUsers.find((user) => user.userId === receiverId)?.userId
          );

          const receiverSocket = onlineUsers.find(
            (user) => user.userId === receiverId
          )?.socketId;

          if (receiverSocket) {
            console.log('receiverId', receiverSocket);
            console.log('📨 Sending to Receiver:', receiverSocket);
            io.to(receiverSocket).emit('receiveMessage', newMessage);
          } else {
            console.log('🚫 Receiver Not Online');
          }
        } catch (error) {
          console.error('❌ Error sending message:', error);
        }
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        console.log('🔴 User Disconnected:', socket.id);
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
        console.log('Updated Online Users:', onlineUsers);
      });
    });
  }

  res.end();
}
