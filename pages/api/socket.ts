import { NextApiRequest, NextApiResponse } from "next";
import { Server as IOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import type { Socket as NetSocket } from "net";
// import Message from "../../models/Message"; // Import Message Model
// import { connectDB } from "../../lib/mongodb";
import mongoose from "mongoose";
import { connectDB } from "@/data/lib/mongodb";
import Message from "@/data/models/Message";

interface SocketServer extends HTTPServer {
  io?: IOServer;
}

interface SocketWithServer extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithServer;
}

export default async function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (!res.socket.server.io) {
    console.log("✅ Starting Socket.IO server...");
    const io = new IOServer(res.socket.server as any, {
      path: "/api/socket",
      cors: { origin: "*" },
    });

    io.on("connection", (socket) => {
      console.log("🔹 User connected:", socket.id);

      socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
        if (!senderId || !receiverId || !message) {
          console.log("❌ Error: Missing message fields");
          return;
        }

        try {
          await connectDB();

          // Convert string IDs to ObjectId
          const senderObjectId = new mongoose.Types.ObjectId(senderId);
          const receiverObjectId = new mongoose.Types.ObjectId(receiverId);

          const newMessage = new Message({
            senderId: senderObjectId,
            receiverId: receiverObjectId,
            message,
          });

          await newMessage.save();
          console.log("✅ Message saved to DB:", newMessage);

          io.to(receiverId).emit("receiveMessage", { senderId, message });
        } catch (error) {
          console.error("❌ Error saving message:", error);
        }
      });

      socket.on("disconnect", () => {
        console.log("🔹 User disconnected:", socket.id);
      });
    });

    res.socket.server.io = io;
  }
  res.end();
}
