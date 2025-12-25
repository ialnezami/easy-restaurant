import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectDB from './mongodb';
import User from '@/models/User';

// Validate required environment variables
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error(
    'NEXTAUTH_SECRET is not set. Please set it in your environment variables.'
  );
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please provide email and password');
        }

        try {
          await connectDB();

          // Normalize email to lowercase to match how it's stored in the database
          const normalizedEmail = credentials.email.toLowerCase().trim();

          const user = await User.findOne({ email: normalizedEmail }).select(
            '+password'
          );

          if (!user) {
            throw new Error('Invalid email or password');
          }

          const isPasswordValid = await user.comparePassword(credentials.password);

          if (!isPasswordValid) {
            throw new Error('Invalid email or password');
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role || 'owner',
          };
        } catch (error: any) {
          // Log the error for debugging (but don't expose sensitive info to client)
          console.error('Authentication error:', error.message);
          
          // Re-throw authentication errors as-is
          if (error.message === 'Invalid email or password') {
            throw error;
          }
          
          // For other errors (like DB connection), throw a generic error
          throw new Error('Authentication failed. Please try again.');
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  // Explicitly set the URL for production
  ...(process.env.NEXTAUTH_URL && { url: process.env.NEXTAUTH_URL }),
};


