import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema({
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Conversation ||
  mongoose.model("Conversation", ConversationSchema);
