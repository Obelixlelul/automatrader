/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */

import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";

import { db } from "@/server/db";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // EmailProvider({
    //   server: {
    //     host: process.env.EMAIL_SERVER || "https://localhost:3000",
    //     port: 587,
    //     auth: {
    //       user: "apikey",
    //       pass: process.env.EMAIL_PASSWORD || "",
    //     },
    //   },
    //   from: process.env.EMAIL_FROM || "default@default.com",
    //   ...(process.env.NODE_ENV !== "production"
    //     ? {
    //         sendVerificationRequest({ url }) {
    //           console.log("LOGIN LINK", url);
    //         },
    //       }
    //     : {}),
    // }),
  ],
  session: {
    maxAge: 30 * 24 * 60 * 60,
  },
};

export const getServerAuthSession = () => getServerSession(authOptions);
