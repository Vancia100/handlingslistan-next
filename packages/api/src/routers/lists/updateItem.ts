import { authedProcidure } from "../../trpc.js"
import { TRPCError } from "@trpc/server"
import { prisma } from "@hndl/database"
import { newListValidator } from "@hndl/types/validators"
import { z } from "zod/v4"
import { ee } from "./eeWrapper.js"

export const updateItem = authedProcidure
  .input(
    z.object({
      listId: z.number(),
      item: newListValidator,
      itemId: z.number(),
    }),
  )
  .mutation(async (opts) => {
    const { input, ctx } = opts
    console.log(input)
    const user = ctx.session.user
    // Start the queries for recipe and ingredient
    const listPromise = prisma.list.findUnique({
      where: {
        id: input.listId,
        editablyBy: {
          some: {
            id: user.id,
          },
        },
        items: {
          some: {
            id: input.itemId,
          },
        },
      },
    })
    const isIngredientPromise = prisma.ingredient.findFirst({
      where: {
        OR: [
          {
            name: input.item.name,
          },
          {
            aliases: {
              has: input.item.name,
            },
          },
        ],
      },
    })
    // Must have an recipe
    if (!(await listPromise)) {
      throw new TRPCError({
        message: "no list matched inputs",
        code: "BAD_REQUEST",
      })
    }
    ee.emit(
      "update",
      input.listId,
      input.item,
      ctx.session.session.id,
      input.itemId,
    )
    // If there is an ingredient, connect to that one in DB
    const isIngredient = await isIngredientPromise
    const { amount, name, checked } = input.item
    const update = isIngredient
      ? {
          recipeItemID: isIngredient.id,
        }
      : {
          name,
        }
    const updatedRecipie = await prisma.listIngredients.update({
      where: {
        id: input.itemId,
      },
      data: {
        amount,
        checked,
        ...update,
      },
    })
    return updatedRecipie.id
  })
