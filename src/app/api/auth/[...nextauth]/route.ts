import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import dbConnect from "@/lib/DBConnect";
import User from "@/model/User";

/**
 * Extend NextAuth session type
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    /**
     * GOOGLE LOGIN
     */
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    /**
     * EMAIL + PASSWORD LOGIN
     */
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        await dbConnect();

        const user = await User.findOne({
          email: credentials?.email,
        });

        if (!user) throw new Error("User not found");

        const isMatch = await bcrypt.compare(
          credentials!.password,
          user.password,
        );

        if (!isMatch) throw new Error("Wrong password");

        return {
          id: user._id.toString(), // ✅ IMPORTANT
          name: user.fullName,
          email: user.email,
        };
      },
    }),
  ],

  callbacks: {
    /**
     * SIGN IN (Google fix)
     */
    async signIn({ user, account }) {
      await dbConnect();

      if (account?.provider === "google") {
        let dbUser = await User.findOne({
          email: user.email,
        });

        // Create user if not exists
        if (!dbUser) {
          dbUser = await User.create({
            fullName: user.name,
            email: user.email,
            password: "",
            provider: "google",
            accountType: "INDIVIDUAL",
          });
        }

        // 🔥 CRITICAL FIX → attach MongoDB _id
        user.id = dbUser._id.toString();
      }

      return true;
    },

    /**
     * JWT CALLBACK
     */
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
      }
      return token;
    },

    /**
     * SESSION CALLBACK
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

/**
 * NextAuth handler
 */
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
