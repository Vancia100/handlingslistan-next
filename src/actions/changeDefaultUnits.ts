"use server"
import { auth } from "@/server/auth"
import { db } from "@/server/db"
import { redirect } from "next/navigation"
import { tryCatch } from "@/utils/trycatch"

import { ingredeintSchema } from "@/schemas/ingredientSchema"

import type { Ingredient } from "@/generated/prisma/client"
export default async function changeDefaultUnits(
  prevState: { message: string },
  unitsArray: Ingredient[],
) {
  const user = (await auth())?.user
  if (!user || user.role !== "ADMIN") {
    redirect("/login")
  }
  const isValid = ingredeintSchema.safeParse(unitsArray)
  if (!isValid.success) {
    return { message: isValid.error.issues[0]!.message }
  }
  console.log(isValid.data)
  const res = await tryCatch(
    Promise.all(
      isValid.data.map(({ id, defaultUnit }) =>
        db.ingredient.update({
          where: { id },
          data: { defaultUnit },
        }),
      ),
    ),
  )
  if (res.error) {
    return { message: res.error.message }
  }
  console.log("we good", isValid, res.data)
  return { message: "Units change" }
}
