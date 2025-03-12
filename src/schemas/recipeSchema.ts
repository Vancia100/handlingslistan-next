import { z } from "zod"

export const allowedUnits = [
  "g",
  "hg",
  "kg",
  "ml",
  "cl",
  "dl",
  "l",
  "tsp",
  "msk",
  "krm",
  "st",
  "pkt",
  "lb",
  "oz",
  "gal",
  "qt",
  "pt",
  "cup",
  "fl oz",
  "tbsp",
] as const

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
  ingredients: z
    .array(
      z.object({
        name: z.string().max(30, "can't be longer then 30 characters").min(3),
        amount: z.number(),
        unit: z.enum(allowedUnits, {
          message:
            "Not a valid unit, plase use one of the following: " +
            allowedUnits.join(", "),
        }),
      }),
    )
    .nullable(), // nullable while this isn't implemented in the UI
  instructions: z
    .array(
      z
        .string()
        .min(1, "Must have a instruction")
        .max(3000, "Max length of instruction is 3000 characters"),
    )
    .min(1, "Must have at least one instruction"),
})
