import { z } from "zod/v4"

export const credentialsSchame = z
  .object({
    email: z.email(),
    password: z
      .string()
      .min(5, "Must have at least 5 charachters")
      .max(50, "You can not have a longer password than 50 charachters"),
    secondPassword: z.string().optional(),
    name: z
      .string()
      .min(3, "your name must be at least 3 charachters")
      .max(30, "Your name can't be longer then 30 charachters")
      .optional(),
    createAccount: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    const signUpDoublePassword = data.createAccount
      ? data.secondPassword == data.password
      : true

    if (!signUpDoublePassword) {
      ctx.addIssue("The second password does not match first password!")
    }
    const hasName = data.createAccount ? data.name : true
    if (!hasName) {
      ctx.addIssue("You have no name supplied when creting the account!")
    }
  })
