import { redirect } from "next/navigation"
import { auth } from "@/server/auth"
import { db } from "@/server/db"
import RouteReplacer from "./routeChanger"
import ListComponent from "./[...id]/ListComponent"
import { fetchIngredients } from "./[...id]/page"

export default async function CreateList() {
  const user = (await auth())?.user

  // Redirect if user is not logged in
  if (!user) redirect("/auth/login#redirect=/list/create")

  const list = await db.list.create({
    data: {
      title: "My new list",
      creator: {
        connect: {
          id: user.id,
        },
      },
    },
  })
  const ingredients = fetchIngredients()
  return (
    <>
      <ListComponent ingredients={ingredients} />
      <RouteReplacer id={list.id} />
    </>
  )
}
