import EventEmitter, { on } from "node:events"
import { router, authedPrecidure } from "../../trpc.js"
import { tracked } from "@trpc/server"
import { z } from "zod/v4"

const ee = new EventEmitter()
export default router({})

const test = authedPrecidure
  .input(
    z
      .object({
        lastEventId: z.string().nullish(),
        listId: z.uuid()
      })
  )
  .subscription(async function* (opts) {
    for await [] of on(ee, opts.input.listId) 
  })
