import { NextApiRequest, NextApiResponse } from "next";
import { Server as ServerIO } from "socket.io";
// import { connectToDatabase } from "../../lib/mongodb";
// import Message from "../../models/Message";
import { connectToDatabase } from "@/data/lib/mongodb";
import Message from "@/data/models/Message";

type NextApiResponseWithSocket = NextApiResponse & {
  socket: any;
};

export default async function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (!res.socket.server.io) {
    console.log("Initializing Socket.IO server...");
    const io = new ServerIO(res.socket.server, {
      path: "/api/socket",
      cors: { origin: "*" },
    });

    io.on("connection", (socket: { id: any; on: (event: string, listener: (msg?: string) => Promise<void> | void) => void; }) => {
      console.log("New client connected:", socket.id);

      socket.on("message", async (msg?: string) => {
        console.log("Message received:", msg);
        
        // Save message to MongoDB
        await connectToDatabase();
        const newMessage = new Message({ text: msg });
        await newMessage.save();

        io.emit("message", msg);
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });

    res.socket.server.io = io;
  } else {
    console.log("Socket.IO server already running.");
  }
  res.end();
}
