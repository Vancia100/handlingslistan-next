import { redirect } from "next/navigation"
import { auth } from "@hndl/auth/server"
import { headers } from "next/headers"
import { prisma as db } from "@hndl/database"
import RouteReplacer from "./routeChanger"
import ListComponent from "./ListComponent"
import { fetchIngredients } from "./[...id]/page"

export default async function CreateList() {
  const cookies = await headers()
  const user = (await auth.api.getSession({ headers: cookies }))?.user

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
