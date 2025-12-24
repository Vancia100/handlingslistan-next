import ListComponent from "../ListComponent"
import { prisma as db } from "@hndl/database"
import { auth } from "@hndl/auth/server"
import { headers } from "next/headers"

export default async function CreateListWithID(props: { id: Promise<string> }) {
  const id = Number(await props.id)
  if (Number.isNaN(id)) {
    return <ArguemntError />
  }
  const cookies = await headers()
  const user = (await auth.api.getSession({ headers: cookies }))?.user
  if (!user) {
    return <UnAuthed />
  }

  const list = fetchDataFromDB(user.id, id)
  const ingredients = fetchIngredients()
  return <ListComponent startlist={list} ingredients={ingredients} />
}

function fetchDataFromDB(userID: string, listID: number) {
  return db.list.findUnique({
    include: {
      editablyBy: {
        select: {
          id: true,
        },
      },
      items: {
        include: {
          recipeItem: true,
        },
      },
    },
    where: {
      id: listID,
      editablyBy: {
        some: {
          id: userID,
        },
      },
    },
  })
}

// Might move to an dedicated lib file to declare that thease are supposed to be used everywhere list related
export type IngredientsType = ReturnType<typeof fetchIngredients>
export type ListType = ReturnType<typeof fetchDataFromDB>

export function fetchIngredients() {
  const ret = db.ingredient.findMany({
    select: {
      name: true,
      aliases: true,
      defaultUnit: true,
    },
  })
  return ret
}

function ArguemntError() {
  return <div></div>
}
function UnAuthed() {
  return <div></div>
}
