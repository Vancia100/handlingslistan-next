import { prisma as db } from "@hndl/database"
import { publicPrecidure } from "../trpc.js"
import { z } from "zod/v4"
export default publicPrecidure.input(z.string()).query(async (opts) => {
  const name = opts.input
  const users = await db.user.findMany({
    where: {
      OR: [
        {
          name: {
            contains: name,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: name,
            mode: "insensitive",
          },
        },
      ],
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  })
  return users
})
