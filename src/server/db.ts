import { PrismaClient } from "@prisma/client"
import { Pool } from "pg"
import { env } from "@/env"
import { PrismaPg } from "@prisma/adapter-pg"

const createPrismaClient = () => {
  return new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db
