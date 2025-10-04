import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/lib/mongodb"; // use default export (was named import)
import User from "@/models/User"; // your Mongoose User model

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET!, // ensure non-null for TS/runtime
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // 🔹 Called when user first signs in or JWT is refreshed
    async jwt({ token, user, account, profile }) {
      try {
        await connectDB();
      } catch (e) {
        // rethrow so NextAuth surfaces a helpful error
        throw e;
      }

      // When the user signs in for the first time
      if (user?.email) {
        // Check if the user already exists in MongoDB
        let dbUser = await User.findOne({ email: user.email });

        if (!dbUser) {
          dbUser = await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            provider: account?.provider,
          });
        }

        // Attach MongoDB user ID to the JWT
        (token as any).id = dbUser._id.toString();
      }

      return token;
    },

    // 🔹 Add user ID to session object
    async session({ session, token }) {
      if ((token as any)?.id) {
        // session.user may not include id in the type so cast to any
        (session.user as any).id = (token as any).id;
      }
      return session;
    },
  },
};

const handlers = NextAuth(authOptions);
export { handlers as GET, handlers as POST };
