import { z } from "zod/v4"

export const newListValidator = z.object({
  amount: z.number().positive(),
  name: z.string(),
  checked: z.boolean(),
})

export const updateListValidator = z.object({
  amount: z.number().positive().optional(),
  name: z.string().optional(),
  checked: z.boolean().optional(),
})
