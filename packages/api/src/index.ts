import { router } from "./trpc.js"
export { createContext } from "./trpc.js"
import searchPeople from "./routers/searchPeople.js"
import { postRouter } from "./routers/recipes/router.js"
import listRouter from "./routers/lists/router.js"
export const appRouter = router({
  searchPeople,
  recipe: postRouter,
  list: listRouter,
})

export type AppRouter = typeof appRouter
