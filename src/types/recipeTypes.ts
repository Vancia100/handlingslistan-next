import type { z } from "zod"
import type { recipeSchema } from "@/schemas/recipeSchema"

export type IngredientsType = z.infer<typeof recipeSchema>["ingredients"]
export type RecipeType = {
  ingredients: IngredientsType
  instructions: string[]
  title: string
  description: string
  id?: number
  public?: boolean
}
