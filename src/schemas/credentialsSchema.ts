import { z } from "zod/v4"

export const credentialsSchame = z
  .object({
    email: z.email(),
    password: z
      .string()
      .min(5, "Must have at least 5 charachters")
      .max(50, "You can not have a longer password than 50 charachters"),
    secondPassword: z.string().optional(),
    createAccount: z.boolean().optional(),
  })
  .refine(
    (data) =>
      data.createAccount ? data.secondPassword == data.password : true,
    {
      error: "The second password does not match first password!",
    },
  )
