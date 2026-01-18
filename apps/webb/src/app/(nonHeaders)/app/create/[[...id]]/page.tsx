import FormField from "./formfield"
import ContextProvider from "./contextProvider"

import { prisma as db } from "@hndl/database"
import { auth } from "@hndl/auth/server"
import { headers } from "next/headers"

import type { ClientRecipeType } from "@hndl/types"

export default async function CreatePage(props: {
  params: Promise<{
    id: string[] | undefined
  }>
}) {
  const ingredientsAsync = db.ingredient.findMany()
  const [param, awaitedHeaders] = await Promise.all([props.params, headers()])

  const session = await auth.api.getSession({
    headers: awaitedHeaders,
  })
  const user = session?.user
  const userId = user?.id
  const numParam = Number(param.id ? param.id[0] : NaN)

  const prelodRecipeAsync =
    numParam && userId
      ? db.recipe.findUnique({
          relationLoadStrategy: "join",
          where: {
            id: numParam,
          },
          select: {
            id: true,
            title: true,
            description: true,
            instructions: true,
            public: true,
            createdById: true,
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
            viewableBy: {
              select: {
                id: true,
              },
            },
          },
        })
      : null

  const [ingredients, preLoadRecipe] = await Promise.all([
    ingredientsAsync,
    prelodRecipeAsync,
  ])

  // Fance way of saying no preloadrecipe and number exists
  if (!(preLoadRecipe || !numParam)) {
    return <div>There is no recipe with an id of {numParam}</div>
  }

  // Premissions exclude
  if (
    preLoadRecipe &&
    user?.role != "ADMIN" &&
    userId != preLoadRecipe?.createdById
  ) {
    return <div>You are not allowed to edit this recipe!</div>
  }

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
        viewers: preLoadRecipe.viewableBy.map((person) => person.id),
        public: preLoadRecipe.public,
      } satisfies ClientRecipeType)
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
