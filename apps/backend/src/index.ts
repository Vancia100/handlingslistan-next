import express from "express"
import { auth } from "@hndl/auth/server"
import { toNodeHandler } from "better-auth/node"
import * as trpcExpress from "@trpc/server/adapters/express"
import { appRouter, createContext } from "@hndl/api"
import cors from "cors"
import httpProxy from "http-proxy"
import http from "http"
const app = express()
const port = process.env.PORT || 3001

const server = http.createServer(app)

server.on("upgrade", (req, socket, head) => {
  console.log("test")
  proxy.ws(req, socket, head, {
    target: "ws://localhost:3000",
  })
})
const proxy = httpProxy.createProxyServer({
  ws: true,
})
//Make sure that the nextJS backend can be used
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
)
// Auth
app.all("/api/auth/*splat", toNodeHandler(auth))

//trpc
app.use(
  "/api/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
)
// Do not use this in production code.
app.use("/", (req, res) => {
  proxy.web(req, res, {
    target: "http://localhost:3000",
  })
})

server.listen(port, () => {
  console.log("Started server on Port", port)
})
