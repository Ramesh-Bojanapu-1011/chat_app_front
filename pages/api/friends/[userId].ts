import { connectDB } from '@/data/lib/mongodb';
import User from '@/data/models/User';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') return res.status(405).end();

  await connectDB();
  const { userId } = req.query;

  const user = await User.findById(userId).populate(
    'friends',
    'username email'
  );
  if (!user) return res.status(404).json({ error: 'User not found.' });

  res.status(200).json(user.friends);
}
