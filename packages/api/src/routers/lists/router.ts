import { router, authedProcidure } from "../../trpc.js"
import { tracked, TRPCError } from "@trpc/server"
import { z } from "zod/v4"
import { prisma } from "@hndl/database"
import { newListValidator } from "@hndl/types/validators"

import { ee } from "./eeWrapper.js"
const test = authedProcidure
  .input(
    z.object({
      lastEventId: z.string().nullish(),
      listId: z.number(),
    }),
  )
  .subscription(async function* (opts) {
    const { input, signal, ctx } = opts
    function* yieldIds<T>(
      id: number,
      userSessionId: string,
      arg: T,
    ): Generator<T> {
      // Push updates only to the right lists.
      if (id !== input.listId) {
        return
      }
      // Dont send updates to the one who prompted the update.
      // Session IDs to work with multiple devices with the same account
      if (userSessionId == ctx.session.session.id) {
        return
      }
      yield arg
    }
    for await (const [id, data, userId] of ee.toIterable("new", {
      signal,
    })) {
      yield* yieldIds(id, userId, data)
    }
  })
const addThings = authedProcidure
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
    ee.emit("new", input.listId, input.item, ctx.session.session.id)
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
