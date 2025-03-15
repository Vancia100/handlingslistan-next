"use server"
import { recipeSchema } from "@/schemas/recipeSchema"
import { auth } from "@/server/auth"
import { db } from "@/server/db"
import { redirect } from "next/navigation"

export default async function sendRecipe(
  prevState: { message: string },
  formData: (typeof recipeSchema)["_input"],
): Promise<{ message: string }> {
  const sesstion = await auth()
  if (!sesstion) redirect("/auth/login?redirectTo=/app")
  const user = sesstion.user
  console.log(formData)
  const isValid = recipeSchema.safeParse(formData)
  if (!isValid.success) {
    console.error(isValid.error.issues)
    return { message: isValid.error.issues[0]!.message }
  }

  const recipesFromDB = await db.recipe.findFirst({
    where: {
      title: isValid.data.title,
      createdById: user.id,
    },
  })
  if (recipesFromDB) {
    return { message: "You already have a recipe with that title" }
  }

  await db.recipe.create({
    data: {
      title: isValid.data.title,
      description: isValid.data.description,
      ingredients: isValid.data.ingredients,
      instructions: isValid.data.instructions,
      createdBy: {
        connect: {
          id: user.id,
        },
      },
    },
  })
  return { message: "recipe saved" }
}
