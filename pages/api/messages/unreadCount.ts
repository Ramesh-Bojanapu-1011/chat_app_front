import { connectDB } from '@/data/lib/mongodb';
import Message from '@/data/models/Message';
import mongoose from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';

import { getSession } from 'next-auth/react';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET')
    return res.status(405).json({ error: 'Method Not Allowed' });

  connectDB();
  // const session = await getSession({ req });
  const { userId } = req.query;

  if (!userId) return res.status(401).json({ error: 'User not found' });

  try {
    // const userId = new mongoose.Types.ObjectId(session.user.id);

    // Aggregate unread messages grouped by senderId
    const unreadMessages = await Message.aggregate([
      { $match: { receiverId: userId, isRead: false } },
      { $group: { _id: '$senderId', count: { $sum: 1 } } },
    ]);

    const unreadCounts = unreadMessages.reduce((acc, item) => {
      acc[item._id.toString()] = item.count;
      return acc;
    }, {});

    res.status(200).json({ unreadCounts });
  } catch (error) {
    console.error('🚨 Error fetching unread count:', error);
    res.status(500).json({ error: 'Server error' });
  }
}
