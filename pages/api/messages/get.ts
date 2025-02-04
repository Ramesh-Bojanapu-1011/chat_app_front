import { connectDB } from '@/data/lib/mongodb';
import Message from '@/data/models/Message';
import mongoose from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    await connectDB();
    const { senderId, receiverId } = req.query;

    if (!senderId || !receiverId) {
      return res
        .status(400)
        .json({ error: 'Sender ID and Receiver ID are required' });
    }

    // Ensure senderId and receiverId are not arrays and are strings
    const senderIdStr = Array.isArray(senderId) ? senderId[0] : senderId;
    const receiverIdStr = Array.isArray(receiverId)
      ? receiverId[0]
      : receiverId;

    // Convert string IDs to ObjectId
    const senderObjectId = new mongoose.Types.ObjectId(senderIdStr);
    const receiverObjectId = new mongoose.Types.ObjectId(receiverIdStr);

    // Query messages and populate sender and receiver
    const messages = await Message.find({
      $or: [
        { senderId: senderObjectId, receiverId: receiverObjectId },
        { senderId: receiverObjectId, receiverId: senderObjectId },
      ],
    })
      .populate('senderId', 'username email') // Populate sender details
      .populate('receiverId', 'username email') // Populate receiver details
      .sort({ createdAt: 1 });

    return res.status(200).json({ messages });
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: error.message || 'Internal Server Error' });
  }
}
