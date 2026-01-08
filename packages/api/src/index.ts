import { router } from "./trpc.js"
export { createContext } from "./trpc.js"

export const appRouter = router({})

export type AppRouter = typeof appRouter
