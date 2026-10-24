import { prisma as db } from "@hndl/database"
import { publicProcidure } from "../../trpc.js"
import { z } from "zod/v4"

export default publicProcidure
  .input(z.string().min(1).max(50))
  .query(async (opts) => {
    const searchTerm = opts.input
    const user = (await opts.ctx.session)?.user

    const recipes = await db.recipe.findMany({
      where: {
        AND: [
          {
            OR: [
              {
                public: true,
              },
              {
                viewableBy: {
                  some: {
                    id: user?.id,
                  },
                },
              },
            ],
          },
          {
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
        ],
      },
    })
    return { message: "Search results:", recipes }
  })
