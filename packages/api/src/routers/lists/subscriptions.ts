import { z } from "zod/v4"
import { authedProcidure } from "../../trpc.js"
import { ee } from "./eeWrapper.js"

export const test = authedProcidure
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

export const update = authedProcidure
  .input(
    z.object({
      lastEventId: z.string().nullish(),
      listId: z.number(),
    }),
  )
  .subscription(async function* (opts) {
    const { input, signal, ctx } = opts
    // Function to yield only the lists that a user is subscribed i
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
    for await (const [id, data, userId, listIngredientId] of ee.toIterable(
      "update",
      {
        signal,
      },
    )) {
      yield* yieldIds(id, userId, { ...data, listIngredientId })
    }
  })
