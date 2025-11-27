import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/prisma/prisma";
import authConfig from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  trustHost: true,
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
    async jwt({ token, account, profile, user }) {
      if (user) {
        if (user.id) token.id = user.id as string;
        token.role = user.role ?? "CANDIDATE"; // Default to CANDIDATE if role is undefined
      }
      return token;
    },
    async session({ session, token, user }) {
      if (session && token?.sub) {
        session.user.id = token.sub;
        session.user.role = token.role ?? "CANDIDATE"; // Default to CANDIDATE if role is undefined
      }
      return session;
    },
  },
});
