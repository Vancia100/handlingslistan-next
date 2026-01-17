import { router } from "./trpc.js"
export { createContext } from "./trpc.js"
import searchPeople from "./routers/searchPeople.js"
import searchRecipe from "./routers/searchRecipe.js"

export const appRouter = router({
  searchPeople,
  searchRecipe,
})

export type AppRouter = typeof appRouter
