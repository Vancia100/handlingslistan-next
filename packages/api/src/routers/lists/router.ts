import EventEmitter, { on } from "node:events"
import { router, authedPrecidure } from "../../trpc.js"
import { tracked, TRPCError } from "@trpc/server"
import { z } from "zod/v4"
import { prisma } from "@hndl/database"

const ee = new EventEmitter()
const test = authedPrecidure
  .input(
    z.object({
      lastEventId: z.string().nullish(),
      listId: z.number(),
    }),
  )
  .subscription(async function* (opts) {
    for await (const [data] of on(ee, "add", {
      signal: opts.signal,
    }))
      //
      yield data
  })

const addThings = authedPrecidure
  .input(
    z.object({
      listId: z.number(),
      item: z.object({
        amount: z.number(),
        name: z.string(),
      }),
    }),
  )
  .mutation(async (opts) => {
    const { input, ctx } = opts
    const user = ctx.session.user
    const list = await prisma.list.findUnique({
      where: {
        id: input.listId,
        editablyBy: {
          some: {
            id: user.id,
          },
        },
      },
    })
    if (!list) {
      throw new TRPCError({
        message: "no recipe matched inputs",
        code: "BAD_REQUEST",
      })
    }
    ee.emit("new", input.listId)
    await prisma.list.update({
      where: {
        id: input.listId,
      },
      data: {
        items: {
          create: {
            amount: input.item.amount,
            unit: "st",
            recipeCustom: input.item.name,
          },
        },
      },
    })
  })

export default router({
  addListItem: addThings,
  listSubscription: test,
})
