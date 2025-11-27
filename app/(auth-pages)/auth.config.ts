import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compareHash, getUserByEmail } from "../lib/users";
import Google from "next-auth/providers/google";

export default {
  providers: [
    Credentials({
      name: "Take Interview Platform",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        try {
          const email = (credentials?.email || "").toString().trim().toLowerCase();
          const password = (credentials?.password || "").toString();
          const inputRole = (credentials?.role || "").toString().toUpperCase();

          if (!email || !password) {
            throw new Error("Missing email or password");
          }

          const user = await getUserByEmail(email);
          if (!user) {
            throw new Error("Invalid credentials");
          }

          // Check if user has a password (Google OAuth users may not)
          if (!user.password) {
            throw new Error("Account created with Google. Please sign in with Google.");
          }

          const valid = await compareHash(user.password, password);
          if (!valid) {
            throw new Error("Invalid credentials");
          }

          const userRole = String(user.role || "").toUpperCase();
          
          // Validate role match if provided
          if (inputRole && ["CANDIDATE", "HR", "ADMIN"].includes(inputRole)) {
            if (inputRole !== userRole) {
              throw new Error("Selected role does not match your account role");
            }
          }

          // Return user object
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          } as any;
        } catch (err) {
          console.error("[auth] authorize error:", err);
          // Throw error to surface it to the user
          throw err instanceof Error ? err : new Error("Authentication failed");
        }
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
} satisfies NextAuthConfig;
