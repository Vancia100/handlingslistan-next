"use server"
import { recipeSchema } from "@/schemas/recipeSchema"
import { auth } from "@/server/auth"
import { db } from "@/server/db"
import { redirect } from "next/navigation"

export default async function sendRecipe(
  prevState: any,
  formData: FormData,
): Promise<{ message: string } | void> {
  const sesstion = await auth()
  if (!sesstion) redirect("/auth/login?redirectTo=/app")
  const user = sesstion.user

  const isValid = recipeSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    ingredients: JSON.parse(formData.get("ingredients") as string),
  })
  if (!isValid.success) {
    console.error(isValid.error.issues)
    return { message: isValid.error.issues[0]?.message as string }
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
      ingredients: {
        create: isValid.data.ingredients,
      },
      instructions: "Do something?",
      createdBy: {
        connect: {
          id: user.id,
        },
      },
    },
  })
  return { message: "recipe saved" }
}
