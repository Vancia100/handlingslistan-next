import express from "express"
import { auth } from "@hndl/auth/server"
import { toNodeHandler } from "better-auth/node"
import * as trpcExpress from "@trpc/server/adapters/express"
import { appRouter, createContext } from "@hndl/api"
import cors from "cors"
import proxy from "express-http-proxy"

const app = express()

const port = process.env.PORT || 3001

//Make sure that the nextJS backend can be used
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
)
// Auth
app.all("/auth/*splat", toNodeHandler(auth))

//trpc
app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
)
// Do not use this in production code.
app.use("/", proxy("localhost:3000"))
app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`)
})
