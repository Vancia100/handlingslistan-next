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
): Promise<{ message: string; success: boolean }> {
  const session = await auth()
  if (!session) redirect("/auth/login?redirectTo=/app")
  const user = session.user

  const isValid = recipeSchema.safeParse(formData)
  if (!isValid.success) {
    // console.error(isValid.error.issues)
    return { message: isValid.error.issues[0]!.message, success: false }
  }

  // Make a new array of viewers that always contains the user submitting
  const viewableBy = isValid.data.viewers?.includes(user.id)
    ? isValid.data.viewers
    : [user.id, ...(isValid.data.viewers ?? [])]

  // Helper for query
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
    viewableBy: {
      connect: viewableBy.map((id) => ({
        id,
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
      return { message: "recipe updated", success: true }
    }
    console.error(results.error)
    return { message: results.error.message, success: false }
  }

  // Otherwise, create a new recipe
  const results = await tryCatch(
    db.recipe.create({
      data: {
        ...createOrUpdateData,
        createdBy: {
          connect: {
            id: user.id,
          },
        },
      },
    }),
  )
  // console.log(results.error?.name)
  return {
    message: results.error
      ? results.error.name == "PrismaClientKnownRequestError"
        ? "You already have a reipe with that name!"
        : results.error.message
      : "created new recipe",
    success: !results.error,
  }
}
