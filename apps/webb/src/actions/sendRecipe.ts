"use server"
import { recipeSchema } from "@/schemas/recipeSchema"
import { auth } from "@hndl/auth/server"
import { prisma as db } from "@hndl/database"
import { redirect } from "next/navigation"

import { tryCatch } from "@/utils/trycatch"
import { headers } from "next/headers"

import type z from "zod/v4"

export default async function sendRecipe(
  prevState: { message: string },
  formData: z.infer<typeof recipeSchema>,
): Promise<{ message: string; success: boolean }> {
  const cookies = await headers()
  const session = await auth.api.getSession({ headers: cookies })
  if (!session) redirect("/auth/login?redirectTo=/app")
  const user = session.user

  const isValid = recipeSchema.safeParse(formData)
  if (!isValid.success) {
    // console.error(isValid.error.issues)
    return { message: isValid.error.issues[0]!.message, success: false }
  }

  // Validate all the IDS
  const validatedUsers =
    isValid.data.viewers &&
    (
      await Promise.all(
        isValid.data.viewers.map((userId) => {
          return db.user.findUnique({
            where: {
              id: userId,
            },
            select: {
              id: true,
            },
          })
        }),
      )
    )
      .filter((user) => {
        return user
      })
      .map((filteredUser) => {
        return filteredUser?.id
      })
  if (validatedUsers?.length !== isValid.data.viewers?.length) {
    //
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
