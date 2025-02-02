import { NextApiRequest, NextApiResponse } from "next";
import { Server as ServerIO } from "socket.io";
import { connectToDatabase } from "@/data/lib/mongodb";
import Message from "@/data/models/Message";
import User from "@/data/models/User";

type NextApiResponseWithSocket = NextApiResponse & { socket: any };
const onlineUsers: Record<string, string> = {};

export default async function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (!res.socket.server.io) {
    console.log("Initializing Socket.IO server...");

   /* This code snippet is initializing a new instance of a Socket.IO server using the `Server` class
   from the `socket.io` library. Here's a breakdown of what each part of the code is doing: */
    const io = new ServerIO(res.socket.server, {
      path: "/api/socket",
      cors: { origin: "*" },
    });

    /* The code snippet you provided is handling various socket events using Socket.IO. Here's a
    breakdown of what each part of the code is doing: */
    io.on("connection", async (socket) => {
      console.log("User connected:", socket.id);

      // Register user
      socket.on("register", async ({ username, email, password }) => {
        await connectToDatabase();

        let user = await User.findOne({ username });
        if (!user) {
          user = new User({ username, email, password, socketId: socket.id });
          await user.save();
        } else {
          user.socketId = socket.id;
          await user.save();
        }

        onlineUsers[username] = socket.id;
        console.log(`${username} registered with ID: ${socket.id}`);
        io.emit("users", Object.keys(onlineUsers));
      });

      // Private messaging
      socket.on("privateMessage", async ({ sender, recipient, text }) => {
        const recipientSocketId = onlineUsers[recipient];

        // Save message to MongoDB
        await connectToDatabase();
        const newMessage = new Message({ sender, recipient, text });
        await newMessage.save();

        if (recipientSocketId) {
          io.to(recipientSocketId).emit("privateMessage", { sender, text });
        } else {
          socket.emit("error", { message: `${recipient} is offline` });
        }
      });

      // Handle disconnect
      socket.on("disconnect", async () => {
        const user = Object.keys(onlineUsers).find((key) => onlineUsers[key] === socket.id);
        if (user) {
          delete onlineUsers[user];
          await User.updateOne({ username: user }, { socketId: null });
          console.log(`${user} disconnected.`);
          io.emit("users", Object.keys(onlineUsers));
        }
      });
    });

    res.socket.server.io = io;
  } else {
    console.log("Socket.IO server already running.");
  }

  res.end();
}