import { connectDB } from "@/data/lib/mongodb";
import Conversation from "@/data/models/Conversation";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await connectDB();

  const { id } = req.query; // Conversation ID

  if (req.method === "GET") {
    const conversation = await Conversation.find({ members: id })
      .populate("members")
      .sort({ createdAt: -1 });
    if (!conversation) throw new Error("Conversation not found");

    res.status(200).json(conversation);
  }
}
