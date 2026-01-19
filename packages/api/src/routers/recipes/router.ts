import { router } from "../../trpc.js"

import searchRecipe from "./searchRecipe.js"
import sendRecipe from "./sendRecipe.js"
import combineIngredients from "./combineIngredients.js"
import changeDefaultUnits from "./changeDefaultUnits.js"
export const postRouter = router({
  searchRecipe,
  sendRecipe,
  combineIngredients,
  changeDefaultUnits,
})
