"use server"

import { tryCatch } from "@/utils/trycatch"
import { db } from "@/server/db"
import { auth } from "@/server/auth"
import { redirect } from "next/navigation"

export default async function combineIngredeints({
  changer,
  changeTo,
}: {
  changer: number
  changeTo: number
}) {
  const session = await auth()
  if (session?.user.role !== "ADMIN") {
    redirect("/app")
  }

  // Ignores units for now...

  const val = await tryCatch(
    (async () => {
      // Get all recipes which conflict with constraints
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return
      const constraints = await db.recipeIngredient.findMany({
        relationLoadStrategy: "join",
        select: {
          amount: true,
          id: true,
          recipe: {
            select: {
              id: true,
              ingredients: {
                select: {
                  ingredientId: true,
                  amount: true,
                },
              },
            },
          },
        },
        where: {
          AND: [
            {
              ingredientId: changeTo,
            },
            {
              recipe: {
                ingredients: {
                  some: {
                    ingredientId: changer,
                  },
                },
              },
            },
          ],
        },
      })
      console.log(constraints, "constraints")
      // Update all recipes which conflict with constraints
      await Promise.all(
        constraints.map((constraint) =>
          db.recipeIngredient.updateMany({
            data: {
              amount: {
                increment: constraint.recipe.ingredients.find(
                  (ingredient) => ingredient.ingredientId === changer,
                )?.amount,
              },
            },
            where: {
              id: constraint.id,
            },
          }),
        ),
      )

      // Delete all recipe ingredients which are not needed anymore
      await db.recipeIngredient.deleteMany({
        where: {
          AND: [
            {
              ingredientId: changer,
            },
            {
              recipe: {
                ingredients: {
                  some: {
                    ingredientId: changeTo,
                  },
                },
              },
            },
          ],
        },
      })
      await db.recipeIngredient.updateMany({
        where: {
          ingredientId: changer,
        },
        data: {
          ingredientId: changeTo,
        },
      })
      const secc = db.ingredient.delete({
        select: {
          name: true,
          id: true,
        },
        where: {
          id: changer,
        },
      })
      const name = (await secc).name
      await db.ingredient.update({
        where: {
          id: changeTo,
        },
        data: {
          aliases: {
            push: name,
          },
        },
      })
    })(),
  )
  return {
    removedId: changer,
    error: val.error,
  }
}
