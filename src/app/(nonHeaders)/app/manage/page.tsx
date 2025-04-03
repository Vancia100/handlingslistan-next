import { redirect } from "next/navigation"

import { db } from "@/server/db"
import { auth } from "@/server/auth"
import IngredietsManager from "./manager"

import { unstable_cacheLife as cacheLife } from "next/cache"

export default async function ManagePage() {
  const session = await auth()
  if (!session) {
    return redirect("/auth/login?redirect=/manage")
  }
  const user = session.user
  if (user.role !== "ADMIN") {
    return redirect("/app")
  }
  return <Stashed />
}
async function Stashed() {
  "use cache"
  cacheLife("hours")
  const ingredeints = await db.ingredient.findMany()
  return (
    <div>
      <h2 className="text-2xl">{"Admin panel"}</h2>
      <p>{"Manage Ingredients"}</p>
      <IngredietsManager ingredeints={ingredeints} />
    </div>
  )
}
