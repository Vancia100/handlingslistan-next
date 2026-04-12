import { auth } from "@hndl/auth/server"
import { headers } from "next/headers"
import { prisma as db } from "@hndl/database"
import { redirect } from "next/navigation"
import Link from "next/link"

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
      id: true,
    },
  })
  return (
    <>
      <h1 className="text-2xl">Your lists:</h1>
      <ul>
        {yourLists.map((list) => (
          <li className="cursor-pointer underline" key={list.id}>
            <Link
              href={`/app/list/create/${list.id}`}
              className="hover:text-primary-blue">
              {list.title}
            </Link>
          </li>
        ))}
      </ul>
      <Link href={"/app/list/create"}>Create new list</Link>
    </>
  )
}
