import { createTRPCContext } from "@trpc/tanstack-react-query"
import type { AppRouter } from "@hndl/api"

// Ugly as shit but whatever floats...
import type {} from "express"
import type {} from "express-serve-static-core"
import type {} from "qs"
export const { TRPCProvider, useTRPC, useTRPCClient } =
  createTRPCContext<AppRouter>()
