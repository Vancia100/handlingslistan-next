"use server"
import { auth } from "@hndl/auth/server"
import { prisma as db } from "@hndl/database"
import { redirect } from "next/navigation"
import { tryCatch } from "@/utils/trycatch"
import { headers } from "next/headers"
import { ingredeintSchema } from "@hndl/validators"

import type { Ingredient } from "@hndl/database/client"
export default async function changeDefaultUnits(
  prevState: { message: string },
  unitsArray: Ingredient[],
) {
  const cookies = await headers()
  const user = (await auth.api.getSession({ headers: cookies }))?.user
  if (!user || user.role !== "ADMIN") {
    redirect("/auth/login")
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
