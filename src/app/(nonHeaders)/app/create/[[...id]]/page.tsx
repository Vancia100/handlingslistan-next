import FormField from "@/components/formfield"
import ContextProvider from "./contextProvider"

import { db } from "@/server/db"
import { auth } from "@/server/auth"

import type { RecipeType } from "@/types/recipeTypes"

export default async function CreatePage(props: {
  params: Promise<{
    id: string[] | undefined
  }>
}) {
  const ingredientsAsync = db.ingredient.findMany()
  const [param, user] = await Promise.all([props.params, auth()])

  const userId = user?.user.id
  const numParam = Number(param.id ? param.id[0] : NaN)

  const prelodRecipeAsync =
    numParam && userId
      ? db.recipe.findUnique({
          relationLoadStrategy: "join",
          where: {
            id: numParam,
            createdById: userId,
          },
          select: {
            id: true,
            title: true,
            description: true,
            instructions: true,
            ingredients: {
              select: {
                ingredient: {
                  select: {
                    name: true,
                  },
                },
                amount: true,
                unit: true,
              },
            },
          },
        })
      : null

  const [ingredients, preLoadRecipe] = await Promise.all([
    ingredientsAsync,
    prelodRecipeAsync,
  ])
  const recipe = preLoadRecipe
    ? ({
        id: preLoadRecipe.id,
        title: preLoadRecipe.title,
        description: preLoadRecipe.description,
        instructions: preLoadRecipe.instructions,
        ingredients: preLoadRecipe.ingredients.map((ingredient) => ({
          name: ingredient.ingredient.name,
          amount: ingredient.amount,
          unit: ingredient.unit,
        })),
      } satisfies RecipeType & { id: number })
    : undefined

  return (
    <div className="bg-primary-black-50 rounded-2xl p-4">
      <h1 className="mb-4 text-3xl font-bold">{"Create a new recipe"}</h1>
      <ContextProvider>
        <FormField ingredeints={ingredients} presetRecipe={recipe} />
      </ContextProvider>
    </div>
  )
}
