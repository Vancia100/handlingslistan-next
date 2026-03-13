// eslint-disable-next-line
import type { Prisma } from "@hndl/database/client"

import { prisma as db } from "@hndl/database"
export function fetchDataFromDB(userID: string, listID: number) {
  const data = db.list.findUnique({
    include: {
      editablyBy: {
        select: {
          id: true,
        },
      },
      items: {
        include: {
          recipeItem: true,
        },
      },
    },
    where: {
      id: listID,
      editablyBy: {
        some: {
          id: userID,
        },
      },
    },
  })
  return data
}

// Might move to an dedicated lib file to declare that thease are supposed to be used everywhere list related
export type IngredientsType = ReturnType<typeof fetchIngredients>
export type ListType = ReturnType<typeof fetchDataFromDB>

export function fetchIngredients() {
  const ret = db.ingredient.findMany({
    select: {
      name: true,
      aliases: true,
      defaultUnit: true,
    },
  })
  return ret
}
