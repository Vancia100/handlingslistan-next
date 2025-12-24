import { redirect } from "next/navigation"

import { prisma as db } from "@hndl/database"
import { auth } from "@hndl/auth/server"
import { headers } from "next/headers"
import IngredietsManager from "./manager"

export default async function ManagePage() {
  const cookies = await headers()
  const session = await auth.api.getSession({ headers: cookies })
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
      <IngredietsManager ingredeints={ingredeints} />
    </div>
  )
}
