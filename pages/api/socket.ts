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
            senderId: senderId,
            receiverId: receiverId,
            message: message?.trim() || '',
            fileUrl: fileUrl || null,
          });
          // Ensure senderId and receiverId are not arrays and are strings
          const senderIdStr = Array.isArray(senderId) ? senderId[0] : senderId;
          const receiverIdStr = Array.isArray(receiverId)
            ? receiverId[0]
            : receiverId;

          // Convert string IDs to ObjectId
          // const senderObjectId = new mongoose.Types.ObjectId(senderId);
          // const receiverObjectId = new mongoose.Types.ObjectId(receiverIdStr);

          const finalmsg = await Message.find({
            $or: [
              { senderId: senderId, receiverId: receiverId },
              { senderId: receiverId, receiverId: senderId },
            ],
          })
            .populate('senderId', 'username email') // Populate sender details
            .populate('receiverId', 'username email') // Populate receiver details
            .sort({ createdAt: -1 }) // Sort by creation date in descending order
            .limit(1);

          console.log('newMessage', receiverIdStr._id);

          const receiverSocket = onlineUsers.find(
            (user) => user.userId === receiverIdStr._id
          )?.socketId;

          if (receiverSocket) {
            console.log('receiverId', receiverSocket);
            console.log('📨 Sending to Receiver:', receiverSocket);
            io.to(receiverSocket).emit('receiveMessage', finalmsg);
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
