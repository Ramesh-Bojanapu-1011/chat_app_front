import { connectToDatabase } from "@/data/lib/mongodb";
import Message from "@/data/models/Message";
import { NextApiRequest, NextApiResponse } from "next";
// import { connectToDatabase } from "../../lib/mongodb";
// import Message from "../../models/Message";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();
  const messages = await Message.find().sort({ createdAt: 1 });
  res.json(messages);
}
