import { z } from "zod"

export const allowedUnits = [
  "g",
  "kg",
  "hg",
  "ml",
  "l",
  "cl",
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
  "tsp",
] as const

export const recipeSchema = z.object({
  title: z
    .string()
    .max(30, "A title should not be longer than 30 charachters")
    .min(3, "The title should be at least 3 charachters long"),
  description: z
    .string()
    .min(1, "Must have a description")
    .max(5000, "Max length 5000 charachters"),
  ingredients: z
    .array(
      z.object({
        name: z.string().max(30, "can't be longer then 30 charachters").min(3),
        amount: z.number(),
        unit: z.enum(allowedUnits, {
          message:
            "Not a valid unit, plase use one of the following: " +
            allowedUnits.join(", "),
        }),
      }),
    )
    .nullable(), // nullable while this isn't implemented in the UI
})
