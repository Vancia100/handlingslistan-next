import z from "zod"

export const emailValidator = z.string().email()
export const usernameValidator = z
  .string()
  .min(3, "A username must be at least 3 charachters long")
  .max(22, "Username can only be 22 charachters long")
