import { allowedUnits } from "./recipeSchema"
import { z } from "zod"
import type { Units } from "@prisma/client"

export const ingredeintSchema = z.array(
  z.object({
    id: z.number().int().positive(),
    defaultUnit: z.enum(allowedUnits as [Units, ...Units[]]),
    name: z.string().min(1).max(50),
    aliases: z.array(z.string().max(30).min(2)),
  }),
)
