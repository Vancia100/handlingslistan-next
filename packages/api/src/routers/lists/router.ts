import { router } from "../../trpc.js"

import { addNewItem } from "./addNewItem.js"
import { updateItem } from "./updateItem.js"
import { newItemSub } from "./newItemSubscription.js"
import { recipeToList } from "./addRecipeToList.js"
import { getLists } from "./getLists.js"
import type {} from "qs"
import type {} from "express"

export default router({
  addListItem: addNewItem,
  newItemInList: newItemSub,
  updateItemInList: updateItem,
  addRecipeToList: recipeToList,
  fetchLists: getLists,
})
