import { initTRPC, TRPCError } from "@trpc/server"
import * as trpcExpress from "@trpc/server/adapters/express"
import { auth } from "@hndl/auth/server"
import { fromNodeHeaders } from "better-auth/node"

export const createContext = async ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => {
  const session = auth.api.getSession({ headers: fromNodeHeaders(req.headers) })
  return {
    req,
    res,
    session,
  }
}
type Context = Awaited<ReturnType<typeof createContext>>

const t = initTRPC.context<Context>().create()

export const router = t.router
export const publicPrecidure = t.procedure
export const authedPrecidure = t.procedure.use(async (opts) => {
  const { ctx } = opts
  const ses = await ctx.session
  if (!ses) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }

  return opts.next({
    ctx: {
      session: ses,
    },
  })
})
export const adminPrecidure = authedPrecidure.use(async (opts) => {
  const { ctx } = opts
  console.log(ctx.session.user.role)
  if (ctx.session.user.role !== "ADMIN") {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }

  return opts.next()
})
