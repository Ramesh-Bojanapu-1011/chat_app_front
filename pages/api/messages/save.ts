import { connectDB } from '@/data/lib/mongodb';
import Message from '@/data/models/Message';
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

    return res
      .status(201)
      .json({ message: 'Message stored', data: newMessage });
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: error.message || 'Internal Server Error' });
  }
}
