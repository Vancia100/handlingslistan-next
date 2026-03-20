import { z } from "zod/v4"
import { authedProcidure } from "../../trpc.js"
import { ee } from "./eeWrapper.js"

export const newItemSub = authedProcidure
  .input(
    z.object({
      lastEventId: z.string().nullish(),
      listId: z.number(),
    }),
  )
  .subscription(async function* (opts) {
    const { input, signal, ctx } = opts
    function* yieldIds<T>(userSessionId: string, arg: T): Generator<T> {
      // Dont send updates to the one who prompted the update.
      // Session IDs to work with multiple devices with the same account
      if (userSessionId == ctx.session.session.id) {
        return
      }
      yield arg
    }
    for await (const [id, data] of ee.toIterable(String(input.listId), {
      signal,
    })) {
      yield* yieldIds(id, data)
    }
  })
