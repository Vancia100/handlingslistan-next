import { router, authedPrecidure } from "../../trpc.js"
import { tracked, TRPCError } from "@trpc/server"
import { z } from "zod/v4"
import { prisma } from "@hndl/database"
import { newListValidator } from "@hndl/types/validators"

import { ee } from "./eeWrapper.js"
const test = authedPrecidure
  .input(
    z.object({
      lastEventId: z.string().nullish(),
      listId: z.number(),
    }),
  )
  .subscription(async function* (opts) {
    const { input, signal } = opts
    function* yieldIds<T>(id: number, arg: T): Generator<T> {
      if (id !== input.listId) {
        return
      }
      yield arg
    }
    for await (const [id, data] of ee.toIterable("new", {
      signal,
    })) {
      yield* yieldIds(id, data)
    }
  })
const addThings = authedPrecidure
  .input(
    z.object({
      listId: z.number(),
      item: newListValidator,
    }),
  )
  .mutation(async (opts) => {
    const { input, ctx } = opts
    console.log(input)
    // const user = ctx.session.user
    // const list = await prisma.list.findUnique({
    //   where: {
    //     id: input.listId,
    //     editablyBy: {
    //       some: {
    //         id: user.id,
    //       },
    //     },
    //   },
    // })
    // if (!list) {
    //   throw new TRPCError({
    //     message: "no recipe matched inputs",
    //     code: "BAD_REQUEST",
    //   })
    // }
    ee.emit("new", input.listId, input.item)
    // await prisma.list.update({
    //   where: {
    //     id: input.listId,
    //   },
    //   data: {
    //     items: {
    //       create: {
    //         amount: input.item.amount,
    //         unit: "st",
    //         recipeCustom: input.item.name,
    //       },
    //     },
    //   },
    // })
  })

export default router({
  addListItem: addThings,
  listSubscription: test,
})
