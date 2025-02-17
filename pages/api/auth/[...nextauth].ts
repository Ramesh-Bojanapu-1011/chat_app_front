import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/data/lib/mongodb';
import User from '@/data/models/User';
import Facebook from 'next-auth/providers/facebook';

export default NextAuth({
  session: { strategy: 'jwt' },
  providers: [
    // Google Sign-In
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // Facebook Sign-In
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
        username: { label: 'username', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing email or password');
        }

        await connectDB();
        const user = await User.findOne({ email: credentials?.email });

        if (!user) {
          throw new Error('User not found');
        }

        const isValid = await bcrypt.compare(
          credentials?.password,
          user.password
        );
        if (!isValid) {
          throw new Error('Invalid credentials');
        }

        return { id: user._id, email: user.email, username: user.username };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ account, profile }) {
      await connectDB();

      if (account?.provider === 'credentials') {
        return true; // Skip for credentials
      }

      // Handle Google/Facebook sign-in
      const email = profile?.email;
      if (!email) throw new Error('Email is required');

      let user = await User.findOne({ email });
      if (!user) {
        user = new User({
          email,
          username: profile?.name || email.split('@')[0],
          provider: account?.provider,
          isOAuth: true,
          image: profile.image,
        });
        await user.save();
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        const mongoUser = await User.findOne({ email: user.email });
        token.id = mongoUser._id;
        token.email = user.email;
        token.username = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.username = token.username as string;
      }

      return session;
    },
  },
});
