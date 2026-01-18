import { router } from "./trpc.js"
export { createContext } from "./trpc.js"
import searchPeople from "./routers/searchPeople.js"
import { postRouter } from "./routers/recipies/router.js"

export const appRouter = router({
  searchPeople,
  recipe: postRouter,
})

export type AppRouter = typeof appRouter
