import { betterAuth } from "better-auth"
import { customSession } from "better-auth/plugins"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "@hndl/database"

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
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
      redirectURL: "http://localhost:3000/settings",
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
  basePath: "/auth",
  trustedOrigins: ["http://localhost:3000"],
})

export type User = typeof auth.$Infer.Session.user
export type Session = typeof auth.$Infer.Session.session
