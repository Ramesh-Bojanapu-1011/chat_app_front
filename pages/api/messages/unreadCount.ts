import { connectDB } from '@/data/lib/mongodb';
import Message from '@/data/models/Message';
import { NextApiRequest, NextApiResponse } from 'next';

import { getSession } from 'next-auth/react';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET')
    return res.status(405).json({ error: 'Method Not Allowed' });

  connectDB();
  const session = await getSession({ req });

  if (!session || !session.user?.id)
    return res.status(401).json({ error: 'Unauthorized' });

  try {
    // Count unread messages for the logged-in user
    const unreadCount = await Message.countDocuments({
      receiverId: session.user.id,
      isRead: false,
    });

    res.status(200).json({ unreadCount });
  } catch (error) {
    console.error('🚨 Error fetching unread count:', error);
    res.status(500).json({ error: 'Server error' });
  }
}
