"use server"

import { prisma as db } from "@hndl/database"
import { z } from "zod/v4"
import type { Recipe } from "@hndl/database/client"

export default async function searchRecipe(
  prevState: { message: string; recipes?: Recipe[] },
  searchTerm: string,
) {
  // const session = await auth()
  const isValid = z.string().min(1).max(50).safeParse(searchTerm)
  if (!isValid.success) {
    return { message: "nah uh" }
  }
  const recipes = await db.recipe.findMany({
    where: {
      OR: [
        {
          title: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          ingredients: {
            some: {
              OR: [
                {
                  ingredient: {
                    aliases: {
                      has: searchTerm,
                    },
                  },
                },
                {
                  ingredient: {
                    name: {
                      contains: searchTerm,
                      mode: "insensitive",
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    },
  })
  return { message: "Search results:", recipes }
}
