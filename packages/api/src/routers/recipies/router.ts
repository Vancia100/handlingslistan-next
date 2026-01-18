import { router } from "../../trpc.js"

import searchRecipe from "./searchRecipe.js"

export const postRouter = router({
  searchRecipe,
})
