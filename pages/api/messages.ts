import { connectToDatabase } from "@/data/lib/mongodb";
import Message from "@/data/models/Message";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method Not Allowed" });

  const { sender, recipient } = req.query;

  if (!sender || !recipient) {
    return res.status(400).json({ message: "Sender and recipient required" });
  }

  await connectToDatabase();

  // Get messages between both users
  const messages = await Message.find({
    $or: [
      { sender, recipient },
      { sender: recipient, recipient: sender },
    ],
  }).sort({ createdAt: 1 });

  res.status(200).json(messages);
}
