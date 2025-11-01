import { PrismaAdapter } from "@auth/prisma-adapter"
import type { DefaultSession, NextAuthConfig } from "next-auth"

import DiscordProvider from "next-auth/providers/discord"
import Credentials from "next-auth/providers/credentials"

import argon2 from "argon2"

import { tryCatch } from "@/utils/trycatch"
import { db } from "@/server/db"
import type { Role } from "@/generated/prisma/client"
import type { PrismaClient } from "@/generated/prisma/client"
/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      // ...other properties
      // role: Role
    } & DefaultSession["user"]
  }

  interface User {
    // ...other properties
    role: Role
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    DiscordProvider,
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
    Credentials({
      name: "Email & password",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "v@handla.se" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, req) {
        if (!credentials.email || !credentials.password) return null
        const user = await db.user.findUnique({
          where: {
            email: credentials.email as string,
          },
          include: {
            sessions: {
              select: {
                sessionToken: true,
              },
            },
          },
        })
        if (!user || !user.password) return null
        const authed = await tryCatch(
          argon2.verify(user.password, credentials.password as string),
        )
        if (!authed.data) return null

        console.log(user, "user")

        console.log("cookies", req.headers.getSetCookie())
        return user
      },
    }),
  ],
  adapter: PrismaAdapter(db as PrismaClient),
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        role: user.role,
      },
    }),
  },
  pages: {
    signIn: "/auth/signin",
  },
} satisfies NextAuthConfig
