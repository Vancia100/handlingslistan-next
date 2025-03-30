import { redirect } from "next/navigation"

import { db } from "@/server/db"
import { auth } from "@/server/auth"
import IngredietsManager from "./manager"

export default async function ManagePage() {
  const session = await auth()
  if (!session) {
    return redirect("/auth/login?redirect=/manage")
  }
  const user = session.user
  if (user.role !== "ADMIN") {
    return redirect("/app")
  }
  const ingredeints = await db.ingredient.findMany()
  return (
    <div>
      <h2 className="text-2xl">{"Admin panel"}</h2>
      <p>{"Manage Ingredients"}</p>
      <IngredietsManager ingredients={ingredeints} />
    </div>
  )
}
