import type { z } from "zod"
import type { recipeSchema } from "@hndl/validators"

export type IngredientsType = z.infer<typeof recipeSchema>["ingredients"]
export type ClientRecipeType = {
  ingredients: IngredientsType
  instructions: string[]
  title: string
  description: string
  id?: number
  public?: boolean
  viewers?: string[]
}
