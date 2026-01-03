import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./lib/db";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { SigninSchema } from "./lib";
import bcrypt from "bcryptjs";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,

  events: {
    async linkAccount({ user }) {
      try {
        await db.user.update({
          where: { id: user.id },
          data: { emailVerified: new Date() },
        });
      } catch (error) {
        console.error(
          "Failed to update emailVerified during linkAccount:",
          error
        );
      }
    },
  },

  callbacks: {
    // ⚡ JWT callback
    async jwt({ token, user }) {
      // First login: `user` exists
      if (user) {
        token.id = user.id;
        token.role = user.role; // ⚡ role is stored
        token.employeeId = user.employeeId;
        token.companyName = user.companyName;
        token.companyLogo = user.image; // image from user object
        token.phoneNumber = user.phoneNumber;
        token.isPasswordChanged = user.isPasswordChanged;
      }

      // Subsequent requests: token persists
      return token;
    },

    // ⚡ Session callback
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string; // ⚡ role now included
        session.user.employeeId = token.employeeId as string | undefined;
        session.user.companyName = token.companyName as string | undefined;
        session.user.image = token.companyLogo as string | null;
        session.user.phoneNumber = token.phoneNumber as string | undefined;
        session.user.isPasswordChanged = token.isPasswordChanged as boolean;
      }
      return session;
    },

    // ⚡ Sign-in callback
    async signIn({ user, account }) {
      // Google OAuth login
      if (account?.provider === "google") {
        const dbUser = await db.user.findUnique({
          where: { email: user.email! },
        });

        if (!dbUser) return false;

        if (!dbUser.emailVerified) {
          await db.user.update({
            where: { id: dbUser.id },
            data: { emailVerified: new Date() },
          });
        }

        return true;
      }

      // Credentials login
      const dbUser = await db.user.findUnique({
        where: { id: user.id },
      });

      if (!dbUser || !dbUser.emailVerified) return false;

      return true;
    },
  },

  session: { strategy: "jwt" },

  // adapter: PrismaAdapter(db),

  providers: [
    ...authConfig.providers!,

    // ⚡ Credentials provider
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const validated = SigninSchema.safeParse(credentials);
        if (!validated.success) return null;

        const { email, password } = validated.data;

        const user = await db.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        // ⚡ Return only safe user fields
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.companyLogo ?? null,
          role: user.role,
        };
      },
    }),
  ],
});
