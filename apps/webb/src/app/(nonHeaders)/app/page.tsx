import { prisma as db } from "@hndl/database"
import { auth } from "@hndl/auth/server"

import Link from "next/link"
import { headers } from "next/headers"
import Slider from "@/components/slider"
import Card from "@/components/card"

export default async function WebbApp() {
  const user = (await auth.api.getSession({ headers: await headers() }))?.user
  const myRecepiesAsync = user
    ? db.recipe.findMany({
        take: 5,
        orderBy: {
          updatedAt: "desc",
        },
        where: { createdById: user.id },
      })
    : null

  const recomendedRecepiesAsync = db.recipe.findMany({
    take: 10,
    include: {
      viewableBy: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
    where: {
      AND: [
        {
          OR: [
            {
              public: true,
            },
            user
              ? {
                  viewableBy: {
                    some: {
                      id: user?.id,
                    },
                  },
                }
              : {},
          ],
        },
        user
          ? {
              NOT: {
                createdById: user?.id,
              },
            }
          : {},
      ],
    },
  })
  const myListsAsync = user
    ? db.list.findMany({
        orderBy: {
          updatedAt: "desc",
        },
        take: 10,
        where: {
          OR: [
            {
              creatorId: user.id,
            },
            {
              editablyBy: {
                some: user,
              },
            },
          ],
        },
      })
    : null
  const [myRecepies, recomendedRecepies, myLists] = await Promise.all([
    myRecepiesAsync,
    recomendedRecepiesAsync,
    myListsAsync,
  ])
  return (
    <div className="flex w-full flex-col text-center align-middle">
      <h1 className="m-5 w-full text-6xl">WebbApp</h1>
      {user?.role === "ADMIN" && (
        <div className="m-5 flex flex-col items-start">
          <h2 className="mb-1 text-start text-4xl">Admin panel:</h2>
          <Link className="text-start text-2xl underline" href="/app/manage">
            Manage
          </Link>
        </div>
      )}
      {myRecepies && myRecepies.length > 0 && (
        <div className="m-5">
          <h2 className="mb-1 text-start text-4xl">Your recipes:</h2>
          <Slider>
            {myRecepies.map((recipe, index) => (
              <Card
                key={index}
                url={`/app/recipe/${recipe.id}`}
                title={recipe.title}
                description={recipe.description}
              />
            ))}
          </Slider>
        </div>
      )}

      {recomendedRecepies && recomendedRecepies.length > 0 && (
        <div className="m-5">
          <h2 className="mb-1 text-start text-4xl">Recmended recipes:</h2>
          <Slider>
            {recomendedRecepies.map((recipe, index) => (
              <Card
                key={index}
                url={`/app/recipe/${recipe.id}`}
                title={recipe.title}
                description={recipe.description}
              />
            ))}
          </Slider>
        </div>
      )}
      {myLists && myLists.length > 0 && (
        <div className="m-5">
          <h2 className="mb-1 text-start text-4xl">Your lists:</h2>
          <Slider>
            {myLists.map((list, index) => (
              <Card
                key={index}
                url={`/app/list/create/${list.id}`}
                title={list.title}
              />
            ))}
          </Slider>
        </div>
      )}
      <Link href={"/app/recipe"}>Search for post</Link>
      {/* @ts-expect-error Next type does not generate for dynamic routes */}
      <Link href={"/app/create"}>Create post</Link>
    </div>
  )
}
