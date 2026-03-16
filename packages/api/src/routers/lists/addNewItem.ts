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
        editablyBy: {
          some: {
            id: user.id,
          },
        },
      },
    })
    if (!list) {
      throw new TRPCError({
        message: "no recipe matched inputs",
        code: "BAD_REQUEST",
      })
    }
    ee.emit("new", input.listId, input.item, ctx.session.session.id)
    const updatedRecipie = await prisma.list.update({
      where: {
        id: input.listId,
      },
      data: {
        items: {
          create: {
            amount: input.item.amount,
            unit: "st",
            recipeCustom: input.item.name,
            checked: false,
          },
        },
      },
    })
    return updatedRecipie.id
  })
