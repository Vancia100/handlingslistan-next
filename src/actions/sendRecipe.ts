"use server"
import { recipeSchema } from "@/schemas/recipeSchema"
import { auth } from "@/server/auth"
import { db } from "@/server/db"
import { redirect } from "next/navigation"

import { tryCatch } from "@/utils/trycatch"

import type z from "zod"

export default async function sendRecipe(
  prevState: { message: string },
  formData: z.infer<typeof recipeSchema>,
): Promise<{ message: string }> {
  const session = await auth()
  if (!session) redirect("/auth/login?redirectTo=/app")
  const user = session.user

  const isValid = recipeSchema.safeParse(formData)
  if (!isValid.success) {
    // console.error(isValid.error.issues)
    return { message: isValid.error.issues[0]!.message }
  }

  const createOrUpdateData = {
    title: isValid.data.title,
    description: isValid.data.description,
    instructions: isValid.data.instructions,
    public: isValid.data.public,
    ingredients: {
      create: isValid.data.ingredients.map((ing) => ({
        amount: ing.amount,
        unit: ing.unit,
        ingredient: {
          connectOrCreate: {
            where: {
              name: ing.name,
            },
            create: {
              name: ing.name,
              defaultUnit: ing.unit,
            },
          },
        },
      })),
    },
  }

  // if we have the id, update the current recipe
  if (isValid.data.id) {
    const results = await tryCatch(
      db.$transaction(async (tx) => {
        await tx.recipeIngredient.deleteMany({
          where: {
            recipeId: isValid.data.id,
          },
        })
        const createdByUser = await tx.recipe.update({
          where: {
            id: isValid.data.id,
          },
          select: {
            createdById: true,
          },
          data: {
            ...createOrUpdateData,
          },
        })
        if (createdByUser.createdById !== user.id) {
          throw new Error("You are not allowed to update this recipe")
        }
      }),
    )
    if (!results.error) {
      return { message: "recipe updated" }
    }
    console.error(results.error)
    return { message: results.error.message }
  }

  // Otherwise, create a new recipe
  await db.recipe.create({
    data: {
      ...createOrUpdateData,
      createdBy: {
        connect: {
          id: user.id,
        },
      },
      viewableBy: {
        connect: {
          id: user.id,
        },
      },
    },
  })
  return { message: "created new recipe" }
}
