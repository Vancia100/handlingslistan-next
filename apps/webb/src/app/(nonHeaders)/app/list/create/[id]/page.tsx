import ListComponent from "../ListComponent"
import { auth } from "@hndl/auth/server"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { fetchDataFromDB, fetchIngredients } from "../serverSideFetchers"

export default async function CreateListWithID({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = Number((await params).id)
  if (Number.isNaN(id)) {
    return <ArguemntError errnum={(await params).id} />
  }
  const cookies = await headers()
  const user = (await auth.api.getSession({ headers: cookies }))?.user
  if (!user) {
    redirect(`/auth/login?redirect=/app/list/create/${id}`)
  }

  const list = fetchDataFromDB(user.id, id)
  const ingredients = fetchIngredients()
  return (
    <ListComponent listId={id} startlist={list} ingredients={ingredients} />
  )
}

function ArguemntError(props: { errnum: string }) {
  return <div>Something wrong with args {props.errnum}</div>
}
