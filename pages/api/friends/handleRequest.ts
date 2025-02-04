import { connectDB } from "@/data/lib/mongodb";
import User from "@/data/models/User";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    await connectDB();

    const { userId, friendId, action } = req.body; // action = 'accept' or 'reject'

    if (!userId || !friendId || !action) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend)
      return res.status(404).json({ error: "User not found" });

    if (action === "accept") {
      user.friends.push(friendId);
      friend.friends.push(userId);
    }

    // Remove friend request
    user.friendRequests = user.friendRequests.filter(
      (id: any) => id.toString() !== friendId
    );

    await user.save();
    await friend.save();

    return res.status(200).json({ message: `Friend request ${action}ed!` });
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
}
