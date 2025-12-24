import { router } from "./trpc"
export { createContext } from "./trpc"

export const appRouter = router({})

export type AppRouter = typeof appRouter
