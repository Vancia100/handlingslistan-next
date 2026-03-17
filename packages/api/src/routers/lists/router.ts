import { router, authedProcidure } from "../../trpc.js"
import { z } from "zod/v4"

import { addNewItem } from "./addNewItem.js"
import { newListValidator } from "@hndl/types/validators"
import { updateItem } from "./updateItem.js"
import { updateItemSub } from "./updateItemSubscription.js"
import { ee } from "./eeWrapper.js"
import { newItemSub } from "./newItemSubscription.js"

import type {} from "qs"
import type {} from "express"

const addNewItemTest = authedProcidure
  .input(
    z.object({
      listId: z.number(),
      item: newListValidator,
    }),
  )
  .mutation(async (opts) => {
    const { input, ctx } = opts
    ee.emit("new", input.listId, input.item, ctx.session.session.id)
    return 100
  })

export default router({
  addListItem: addNewItem,
  newItemInList: newItemSub,
  updateItemInList: updateItem,
  newUpdateOnItem: updateItemSub,
})
