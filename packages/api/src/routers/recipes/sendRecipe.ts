import { recipeSchema } from "@hndl/types/validators"
import { prisma as db } from "@hndl/database"
import { Prisma } from "@hndl/database/client"
import { tryCatch } from "@hndl/utils"

import { authedProcidure } from "../../trpc.js"
import { TRPCError } from "@trpc/server"

export default authedProcidure.input(recipeSchema).mutation(async (opts) => {
  const { input, ctx } = opts
  const user = ctx.session.user

  // Make a new array of viewers that always contains the user submitting
  const viewableBy = input.viewers?.includes(user.id)
    ? input.viewers
    : [user.id, ...(input.viewers ?? [])]

  // Helper for query
  const createOrUpdateData = {
    title: input.title,
    description: input.description,
    instructions: input.instructions,
    public: input.public,
    ingredients: {
      create: input.ingredients.map((ing) => ({
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
  if (input.id) {
    const results = await tryCatch(
      db.$transaction(async (tx) => {
        await tx.recipeIngredient.deleteMany({
          where: {
            recipeId: input.id,
          },
        })
        const createdByUser = await tx.recipe.update({
          where: {
            id: input.id,
          },
          select: {
            createdById: true,
          },
          data: {
            ...createOrUpdateData,
          },
        })
        if (createdByUser.createdById !== user.id) {
          throw new TRPCError({
            message: "You are not allowed to update this recipe",
            code: "UNAUTHORIZED",
          })
        }
      }),
    )
    if (!results.error) {
      return
    }
    console.error(results.error)
    throw new TRPCError({
      message: results.error.message,
      code:
        results.error instanceof Prisma.PrismaClientKnownRequestError
          ? "BAD_REQUEST"
          : "INTERNAL_SERVER_ERROR",
    })
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
  if (results.error) {
    throw new TRPCError({
      message: results.error.message,
      code:
        results.error instanceof Prisma.PrismaClientKnownRequestError
          ? "BAD_REQUEST"
          : "INTERNAL_SERVER_ERROR",
    })
  }
  return
})
