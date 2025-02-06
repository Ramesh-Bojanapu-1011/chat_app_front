import { connectDB } from '@/data/lib/mongodb';
import Message from '@/data/models/Message';
import mongoose from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    await connectDB();

    const { senderId, receiverId, message, fileUrl } = req.body;
    if (!senderId || !receiverId || !message) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const newMessage = new Message({ senderId, receiverId, message, fileUrl });
    await newMessage.save();

    // Convert string IDs to ObjectId
    const senderObjectId = new mongoose.Types.ObjectId(senderId);
    const receiverObjectId = new mongoose.Types.ObjectId(receiverId);

    const finalmsg = await Message.find({
      $or: [
        { senderId: senderObjectId, receiverId: receiverObjectId },
        { senderId: receiverObjectId, receiverId: senderObjectId },
      ],
    })
      .populate('senderId', 'username email') // Populate sender details
      .populate('receiverId', 'username email') // Populate receiver details
      .sort({ createdAt: -1 }) // Sort by creation date in descending order
      .limit(1);

    return res.status(201).json({ message: 'Message stored', data: finalmsg });
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: error.message || 'Internal Server Error' });
  }
}
