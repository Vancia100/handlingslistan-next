import { PrismaClient } from "@prisma/client"
import { Pool } from "pg"
import { env } from "@/env"
import { PrismaPg } from "@prisma/adapter-pg"

const createPrismaClient = () => {
  const pool = new Pool({
    connectionString: env.DATABASE_URL,
  })
  const adapter = new PrismaPg(pool) //Does not work with schemas apparently.
  // Seems to be no workaround in postgres, so you have to use the public schema to use a adapter.
  return new PrismaClient({
    // adapter,
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db
