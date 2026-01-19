import { adminPrecidure } from "../../trpc.js"

import { prisma as db } from "@hndl/database"
import { tryCatch } from "@hndl/utils"
import { ingredeintSchema } from "@hndl/types/validators"

export default adminPrecidure.input(ingredeintSchema).mutation(async (opts) => {
  console.log("TEST")
  const { input } = opts
  const res = await tryCatch(
    Promise.all(
      input.map(({ id, defaultUnit }) =>
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
  return { message: "Units change" }
})
