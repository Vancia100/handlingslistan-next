import { betterAuth } from "better-auth"
import { customSession } from "better-auth/plugins"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "@hndl/database"

export const auth = betterAuth({
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
