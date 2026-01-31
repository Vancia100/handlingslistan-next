import express from "express"
import { auth } from "@hndl/auth/server"
import { toNodeHandler } from "better-auth/node"
import * as trpcExpress from "@trpc/server/adapters/express"
import { appRouter, createContext } from "@hndl/api"
import httpProxy from "http-proxy"
import http from "http"

const PROD = process.env.ENVIRONMENT == "PRODUCTION"

const app = express()
const port = process.env.PORT || 3001

const server = http.createServer(app)

const apiRouter = express.Router()
// Auth
apiRouter.all("/auth/*splat", toNodeHandler(auth))

//trpc
apiRouter.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
)
app.use(PROD ? "/" : "/api", apiRouter)
// Do not use this in production code.
if (!PROD) {
  const proxy = httpProxy.createProxyServer({
    ws: true,
  })
  server.on("upgrade", (req, socket, head) => {
    console.log("test")
    proxy.ws(req, socket, head, {
      target: "ws://localhost:3000",
    })
  })
  app.use("/", (req, res) => {
    proxy.web(req, res, {
      target: "http://localhost:3000",
    })
  })
}

server.listen(port, () => {
  console.log("Started server on Port", port)
})
