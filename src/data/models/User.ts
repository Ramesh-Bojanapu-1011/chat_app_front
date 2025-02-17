import mongoose, { Schema, Document } from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: function (this: any) {
      return !this.isOAuth;
    },
    unique: true,
  },
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: function (this: any) {
      return !this.isOAuth;
    },
  },
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  friendRequests: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  isOnline: { type: Boolean, default: false },
  lastSeen: { type: Date, default: null },
  provider: {
    type: String,
    enum: ['credentials', 'google', 'facebook'],
    default: 'credentials',
  },
  isOAuth: { type: Boolean, default: false },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
