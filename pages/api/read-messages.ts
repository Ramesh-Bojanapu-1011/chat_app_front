import { connectToDatabase } from "@/data/lib/mongodb";
import Message from "@/data/models/Message";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });

  const { sender, recipient } = req.body;
  if (!sender || !recipient) {
    return res.status(400).json({ message: "Sender and recipient required" });
  }

  await connectToDatabase();

  // Mark unread messages as read
  await Message.updateMany(
    { sender, recipient, read: false },
    { $set: { read: true } }
  );

  res.status(200).json({ message: "Messages marked as read" });
}
