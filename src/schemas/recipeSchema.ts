import { z } from "zod"
import { Units } from "@prisma/client"

export const allowedUnits = Object.values(Units)

export const recipeSchema = z.object({
  title: z
    .string()
    .max(30, "A title should not be longer than 30 characters")
    .min(3, "The title should be at least 3 characters long"),
  metadata: z
    .object({
      serves: z.number().int().min(1),
      time: z.number().int().min(1),
    })
    .nullable(),
  description: z
    .string()
    .min(1, "Must have a description")
    .max(3000, "Max length of description is 3000 characters"),
  public: z.boolean(),
  ingredients: z
    .array(
      z.object({
        name: z
          .string()
          .toLowerCase()
          .max(30, "can't be longer then 30 characters")
          .min(3),
        amount: z
          .number()
          .positive("Cant have a amount of 0 or less")
          .multipleOf(0.1, "Maximum 1 decimal"),
        unit: z.enum(Object.values(Units) as [Units, ...Units[]], {
          message:
            "Not a valid unit, plase use one of the following: " +
            allowedUnits.join(", "),
        }),
      }),
    )
    .min(1, "Must have at least one ingredient")
    .max(30, "Max 30 ingredients")
    .superRefine((ingredeint, ctx) => {
      const seenNames = new Set<string>()
      ingredeint.forEach((ingredeint, index) => {
        if (seenNames.has(ingredeint.name)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Duplicate ingredient name: ${ingredeint.name}`,
            path: [index, "name"],
          })
        } else {
          seenNames.add(ingredeint.name)
        }
      })
    }),
  instructions: z
    .array(
      z
        .string()
        .min(1, "Must have a instruction")
        .max(3000, "Max length of instruction is 3000 characters"),
    )
    .min(1, "Must have at least one instruction")
    .max(30, "Max 30 instructions"),
})
