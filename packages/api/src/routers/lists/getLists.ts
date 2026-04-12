import { prisma } from "@hndl/database"
import { authedProcidure } from "../../trpc.js"
import z from "zod/v4"

export const getLists = authedProcidure
  .input(
    z.object({
      getAmount: z.number().positive().optional(),
      timeStamp: z.number().positive(),
    }),
  )
  .query(async (opts) => {
    const user = opts.ctx.session.user
    const time = new Date(opts.input.timeStamp)

    const lists = await prisma.list.findMany({
      take: 10,
      skip: opts.input?.getAmount ?? 0,
      orderBy: {
        updatedAt: "desc",
      },
      where: {
        OR: [
          { creatorId: user.id },
          {
            editablyBy: {
              some: user,
            },
          },
        ],
        updatedAt: {
          gte: time,
        },
      },
    })
    return { lists, time: Date.now() }
  })
