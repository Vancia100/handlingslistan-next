import { db } from "@/server/db"
import { auth } from "@/server/auth"

import Link from "next/link"

import Slider from "@/components/slider"
import Card from "@/components/card"

export default async function WebbApp() {
  const user = (await auth())?.user
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
            {
              viewableBy: {
                some: {
                  id: user?.id,
                },
              },
            },
          ],
        },
        {
          NOT: {
            createdById: user?.id,
          },
        },
      ],
    },
  })

  const [myRecepies, recomendedRecepies] = await Promise.all([
    myRecepiesAsync,
    recomendedRecepiesAsync,
  ])
  return (
    <div className="flex w-full flex-col text-center align-middle">
      <h1 className="m-5 w-full text-6xl">WebbApp</h1>
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
      <Link href="/app/create">Create post</Link>
    </div>
  )
}
