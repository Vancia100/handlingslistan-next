import { prisma as db } from "@hndl/database"
import { publicPrecidure } from "../../trpc.js"
import { z } from "zod/v4"

export default publicPrecidure
  .input(z.string().min(1).max(50))
  .query(async (opts) => {
    const searchTerm = opts.input

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
  })
