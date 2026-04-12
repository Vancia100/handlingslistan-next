import { prisma } from "@hndl/database"
import { authedProcidure } from "../../trpc.js"
import z from "zod/v4"
import { TRPCError } from "@trpc/server"
import { ee } from "./eeWrapper.js"

export const recipeToList = authedProcidure
  .input(
    z.object({
      listId: z.number().optional(),
      recipeId: z.number(),
    }),
  )
  .mutation(async (opts) => {
    // Validate user request
    const user = opts.ctx.session.user
    const { listId, recipeId } = opts.input
    const listValidAsync =
      listId &&
      prisma.list.findUnique({
        where: {
          id: listId,
          OR: [
            {
              editablyBy: {
                some: user,
              },
            },
            {
              creatorId: user.id,
            },
          ],
        },
        select: {},
      })
    // Fråga farsan hur man ska strukturera denna för att optimera queryn.
    const recipeValidAsync = prisma.recipe.findUnique({
      where: {
        id: recipeId,
        OR: [
          {
            public: true,
          },
          {
            viewableBy: {
              some: user,
            },
          },
          {
            createdById: user.id,
          },
        ],
      },
      // Unsure how Prisma does with multi-level joins. Does it query eveything seperatly?
      select: {
        ingredients: {
          select: {
            ingredientId: true,
            amount: true,
            unit: true,
            ingredient: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })
    const [recipeValid, listValid] = await Promise.all([
      recipeValidAsync,
      listValidAsync,
    ])
    // listvalid is null if id exists, and the prisma query returns nothing
    if (recipeValid === null || listValid === null) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Something went wrong!",
      })
    }
    if (listId) {
      // add items to an already existing list
      const updates = await prisma.$transaction(
        recipeValid.ingredients.map((item) => {
          return prisma.listIngredients.upsert({
            where: {
              listId_recipeItemID: {
                listId,
                recipeItemID: item.ingredientId,
              },
            },
            update: {
              amount: {
                increment: item.amount,
              },
            },
            create: {
              amount: item.amount,
              checked: false,
              unit: item.unit,
              listId,
              recipeItemID: item.ingredientId,
            },
            include: {
              recipeItem: {
                select: {
                  name: true,
                },
              },
            },
          })
        }),
      )

      // Send events to update recipe in real time
      for (const update of updates) {
        if (update.updatedAt === update.createdAt) {
          // New thing
          ee.eimtForId(listId, opts.ctx.session.session.id, {
            type: "new",
            list: {
              amount: update.amount,
              checked: false,
              id: update.id,
              name: update.recipeItem!.name,
            },
          })
        } else {
          ee.eimtForId(listId, opts.ctx.session.session.id, {
            type: "update",
            list: {
              amount: update.amount,
              checked: false,
              id: update.id,
            },
            listIngredientId: update.id, // I wonder why I did the design like this...
          })
        }
      }
    } else {
      // If there is no list create one
      prisma.list.create({
        data: {
          title: "My new List", // Make the tile implementation better
          creatorId: user.id,
          items: {
            createMany: {
              data: recipeValid?.ingredients.map((item) => ({
                checked: false,
                amount: item.amount,
                unit: item.unit,
                recipeItemID: item.ingredientId,
              })),
            },
          },
        },
      })
    }
  })
