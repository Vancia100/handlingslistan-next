import { allowedUnits } from "./recipeSchema"
import { z } from "zod/v4"
import type { Units } from "@hndl/database/client"

export const ingredeintSchema = z.array(
  z.object({
    id: z.number().int().positive(),
    defaultUnit: z.enum(allowedUnits as unknown as [Units, ...Units[]]),
    name: z.string().min(1).max(50),
    aliases: z.array(z.string().max(30).min(2)),
  }),
)
