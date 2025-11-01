"use server"

import { signIn } from "@/server/auth"
import { tryCatch } from "@/utils/trycatch"
import { credentialsSchame } from "@/schemas/credentialsSchema"
import argon2 from "argon2"
import { db } from "@/server/db"
import type { z } from "zod/v4"

type prevtype = {
  message: string
  success?: boolean
  prev: z.infer<typeof credentialsSchame>
}

export default async function createAccount(
  prev: prevtype,
  credentials: z.infer<typeof credentialsSchame>,
): Promise<prevtype> {
  const parsed = credentialsSchame.safeParse(credentials)

  console.log("data!", parsed)
  if (!parsed.success)
    return {
      success: false,
      message: "parsed.error.message",
      prev: credentials,
    }
  const data = parsed.data
  if (data.createAccount) {
    const user = await db.user.findUnique({
      where: {
        email: data.email,
      },
    })
    if (user) {
      return {
        success: false,
        message: "User with that email already exists",
        prev: credentials,
      }
    }
    const hashedPassword = await argon2.hash(data.password)
    await db.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
      },
    })
  }
  const value = await tryCatch(
    signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    }),
  )
  if (value.error) {
    return {
      success: false,
      message: "Your email or password is incorrect.",
      prev: credentials,
    }
  }
  return {
    success: true,
    message: "Your acount has been created!",
    prev: credentials,
  }
}
