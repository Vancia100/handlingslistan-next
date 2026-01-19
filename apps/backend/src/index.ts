import express from "express"
import { auth } from "@hndl/auth/server"
import { toNodeHandler, fromNodeHeaders } from "better-auth/node"
import * as trpcExpress from "@trpc/server/adapters/express"
import { appRouter, createContext } from "@hndl/api"
import cors from "cors"

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

app.get("/", async (req, res) => {
  res.json("test2")
})
app.get("/testAuth", async (req, res) => {
  const ses = auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  })
  return res.json(ses)
})
app.use(express.json())

//trpc
app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
)

app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`)
})
