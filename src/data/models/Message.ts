import mongoose from "mongoose";

// Message schema with ObjectId references
const MessageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: { type: String },
    fileUrl: { type: String, default: null },
    isRead: { type: Boolean, default: false },
    isReadAt: { type: Date, default: null }, // Store when the message was read
  },
  { timestamps: true },
);

export default mongoose.models.Message ||
  mongoose.model("Message", MessageSchema);
