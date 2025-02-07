import mongoose from 'mongoose';

const MONGODB_URI =
  'mongodb+srv://Lovelyram:c8HAOr0SfWnTIVAN@cluster0.83s8v4s.mongodb.net/?retryWrites=true&w=majority&appName=cluster0';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {})
      .then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
