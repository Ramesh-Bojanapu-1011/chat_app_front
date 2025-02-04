import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { connectDB } from "@/data/lib/mongodb";
import User from "@/data/models/User";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    await connectDB(); // Connect to MongoDB

    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({ message: "User registered successfully!" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}
