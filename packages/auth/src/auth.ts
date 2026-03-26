import { betterAuth } from "better-auth"
import { customSession } from "better-auth/plugins"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "@hndl/database"

// TODO: make sure that thease URL:s are not hard coded.
export const auth = betterAuth({
  user: {
    deleteUser: {
      enabled: true,
    },
    changeEmail: {
      enabled: true,
      updateEmailWithoutVerification: true,
    },
  },
  socialProviders: {
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    },
  },
  plugins: [
    customSession(async ({ user, session }) => {
      const userDb = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
      })
      return {
        session,
        user: {
          ...user,
          role: userDb?.role,
        },
      }
    }),
  ],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    process.env.BETTER_AUTH_URL ?? "",
  ],
})

export type User = typeof auth.$Infer.Session.user
export type Session = typeof auth.$Infer.Session.session
