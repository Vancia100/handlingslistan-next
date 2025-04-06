import FormField from "@/components/formfield"
import { db } from "@/server/db"

export default async function CreatePage() {
  const ingredients = await db.ingredient.findMany()
  return (
    <div className="bg-primary-black-50 rounded-2xl p-4">
      <h1 className="mb-4 text-3xl font-bold">{"Create a new recipe"}</h1>
      <FormField ingredeints={ingredients} />
    </div>
  )
}
