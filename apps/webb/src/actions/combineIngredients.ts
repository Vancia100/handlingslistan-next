"use server"

import { tryCatch } from "@/utils/trycatch"
import { prisma as db } from "@hndl/database"
import { auth } from "@hndl/auth/server"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

export default async function combineIngredeints({
  changer,
  changeTo,
}: {
  changer: number
  changeTo: number
}) {
  const cookies = await headers()
  const session = await auth.api.getSession({ headers: cookies })
  if (session?.user.role !== "ADMIN") {
    redirect("/app")
  }

  // Ignores units for now...
  const transaction = db.$transaction(async (tx) => {
    const constraints = await tx.recipeIngredient.findMany({
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
    // Update all recipes which conflict with constraints
    await Promise.all(
      constraints.map((constraint) =>
        tx.recipeIngredient.updateMany({
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
  })

  const val = await tryCatch(transaction)
  return {
    removedId: changer,
    error: val.error,
  }
}
