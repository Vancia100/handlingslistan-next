import { authedProcidure } from "../../trpc.js"
import { TRPCError } from "@trpc/server"
import { prisma } from "@hndl/database"
import { newListValidator } from "@hndl/types/validators"
import { z } from "zod/v4"
import { ee } from "./eeWrapper.js"

export const addNewItem = authedProcidure
  .input(
    z.object({
      listId: z.number(),
      item: newListValidator,
    }),
  )
  .mutation(async (opts) => {
    const { input, ctx } = opts
    console.log(input)
    const user = ctx.session.user
    const list = await prisma.list.findUnique({
      where: {
        id: input.listId,
        OR: [
          {
            editablyBy: {
              some: {
                id: user.id,
              },
            },
          },
          {
            creatorId: user.id,
          },
        ],
      },
    })
    if (!list) {
      throw new TRPCError({
        message: "no recipe matched inputs",
        code: "BAD_REQUEST",
      })
    }
    const updatedRecipie = await prisma.listIngredients.create({
      data: {
        amount: input.item.amount,
        unit: "st",
        recipeCustom: input.item.name,
        checked: false,
        listId: input.listId,
      },
    })
    ee.eimtForId(input.listId, ctx.session.session.id, {
      type: "new",
      list: { ...input.item, id: updatedRecipie.id },
    })
    return updatedRecipie.id
  })
