import { connectDB } from '@/data/lib/mongodb';
import User from '@/data/models/User';
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

    const { userId, friendEmail } = req.body;

    if (!userId || !friendEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const friend = await User.findOne({ email: friendEmail });
    if (!friend) return res.status(404).json({ error: 'User not found' });

    if (userId == friend._id) {
      return res.status(400).json({
        error: 'You cannot send a friend request to yourself',
        senderId: userId,
        receiverId: friend._id,
      });
    }

    // Check if already friends or request sent
    if (
      friend.friends.includes(userId) ||
      friend.friendRequests.includes(userId)
    ) {
      return res.status(400).json({
        error: 'Already friends or request sent',
        senderId: userId,
        receiverId: friend._id,
      });
    }

    // Add friend request
    friend.friendRequests.push(userId);
    await friend.save();

    return res.status(200).json({
      message: 'Friend request sent!',
      senderId: userId,
      receiverId: friend._id,
    });
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: error.message || 'Internal Server Error' });
  }
}
