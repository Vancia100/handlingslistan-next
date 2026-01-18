import { router } from "../../trpc.js"

import searchRecipe from "./searchRecipe.js"
import sendRecipe from "./sendRecipe.js"
export const postRouter = router({
  searchRecipe,
  sendRecipe,
})
