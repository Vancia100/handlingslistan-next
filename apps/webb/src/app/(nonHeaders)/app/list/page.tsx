import { auth } from "@hndl/auth/server"
import { headers } from "next/headers"
import { prisma as db } from "@hndl/database"
import { redirect } from "next/navigation"

export default async function List() {
  const cookies = await headers()
  const session = await auth.api.getSession({ headers: cookies })
  if (!session) {
    redirect("/auth/login?redirect=/app/list")
  }
  const user = session.user
  const yourLists = await db.list.findMany({
    orderBy: {
      updated: "desc",
    },
    take: 10,
    where: {
      OR: [
        {
          creatorId: user.id,
        },
        {
          editablyBy: {
            some: {
              id: user.id,
            },
          },
        },
      ],
    },
    select: {
      title: true,
      updated: true,
    },
  })
  return (
    <div>
      <h3>Your lists:</h3>
    </div>
  )
}
