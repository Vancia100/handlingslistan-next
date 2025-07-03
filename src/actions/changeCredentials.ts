"use server"

interface ActionCalls {
  success: boolean
  message: string
}
export type ServerAction = (
  prevState: ActionCalls,
  arg1: string,
) => Promise<ActionCalls>

import {
  emailValidator,
  usernameValidator,
} from "@/schemas/chageCredentialsSchema"
import { tryCatch } from "@/utils/trycatch"
import { auth } from "@/server/auth"
import { db } from "@/server/db"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

// Currently hard coded to only work with /settings
export const changeUsername: ServerAction = async (prevStete, newName) => {
  const user = (await auth())?.user
  if (!user) {
    redirect("/login")
  }
  const res = usernameValidator.safeParse(newName)
  if (res.error) {
    return { success: false, message: res.error.message }
  }

  if (res.data == user.name) {
    return {
      success: false,
      message: "New username Cant be the same as old username!",
    }
  }

  const update = await tryCatch(
    db.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: res.data,
      },
    }),
  )

  if (update.error) {
    console.error(update.error?.message)
    return { success: false, message: "Database error, could not update" }
  }
  revalidatePath("/settings")
  return { success: true, message: "done" }
}

export const changeMail: ServerAction = async (prevState, mail) => {
  const user = (await auth())?.user
  if (!user) {
    redirect("/login")
  }
  const res = emailValidator.safeParse(mail)
  if (res.error) {
    return { success: false, message: res.error.message }
  }

  if (res.data == user.email) {
    return {
      success: false,
      message: "New email Cant be the same as old email!",
    }
  }

  const update = await tryCatch(
    db.user.update({
      where: {
        id: user.id,
      },
      data: {
        email: res.data,
      },
    }),
  )

  if (update.error) {
    console.error(update.error?.message)
    return { success: false, message: "Database error, could not update" }
  }
  revalidatePath("/settings")
  return { success: true, message: "done" }
}
