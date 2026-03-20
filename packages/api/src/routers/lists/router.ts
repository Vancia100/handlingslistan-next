import { router } from "../../trpc.js"

import { addNewItem } from "./addNewItem.js"
import { updateItem } from "./updateItem.js"
import { newItemSub } from "./newItemSubscription.js"

import type {} from "qs"
import type {} from "express"

export default router({
  addListItem: addNewItem,
  newItemInList: newItemSub,
  updateItemInList: updateItem,
})
