import { z } from "zod/v4"

export const newListValidator = z.object({
  amount: z.number(),
  name: z.string(),
})
