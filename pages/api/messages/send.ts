import { connectDB } from "@/data/lib/mongodb";
import Message from "@/data/models/Message";
import User from "@/data/models/User";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return res.status(405).end();

  await connectDB();
  const { senderId, receiverId, message } = req.body;

  const sender = await User.findById(senderId);
  if (!sender || !sender.friends.includes(receiverId))
    return res.status(403).json({ error: "You can only message friends." });

  const newMessage = await Message.create({
    sender: senderId,
    receiver: receiverId,
    message,
  });

  res.status(201).json(newMessage);
}
