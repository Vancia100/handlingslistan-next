import { db } from "@/server/db"
import { auth } from "@/server/auth"

import Link from "next/link"

import InviteView from "@/components/inviteView"
export default async function Recipe(props: {
  params: Promise<{ id: string }>
}) {
  const postId = Number((await props.params).id)
  if (!postId) return <NotFount />
  const recipe = await db.recipe.findFirst({
    where: {
      id: postId,
    },
    include: {
      viewableBy: {
        select: {
          email: true,
          name: true,
          id: true,
        },
      },
      ingredients: {
        select: {
          amount: true,
          unit: true,
          ingredient: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  })
  if (!recipe) return <NotFount />
  const user = (await auth())?.user
  if (!recipe.public) {
    if (
      !(
        user &&
        user.role !== "ADMIN" &&
        recipe.viewableBy.find((usr) => usr.id === user.id) !== undefined
      )
    ) {
      console.log("Not authed", user, recipe.viewableBy)
      return <NotAuthed user={user} num={postId} />
    }
  }
  const userCanEdit = user?.id === recipe.createdById || user?.role === "ADMIN"

  const instructions = recipe.instructions
  const ingredients = recipe.ingredients

  const excluded = recipe.viewableBy.map((viewer) => viewer.id)

  return (
    <>
      {userCanEdit && (
        <div className="absolute right-0 flex justify-end gap-2">
          <InviteView
            excludedPeople={excluded}
            addFunctionAction={async (id) => {
              "use server"
              if (userCanEdit) {
                await db.recipe.update({
                  where: {
                    id: postId,
                  },
                  data: {
                    viewableBy: {
                      connect: {
                        id,
                      },
                    },
                  },
                })
              }
            }}
          />
          <Link
            href={`/app/create/${recipe.id}`}
            className="border-primary-black-50 hover:border-primary-purple rounded-2xl border-2 p-2 px-3 text-xl">
            Edit
          </Link>
        </div>
      )}
      <h1 className="text-3xl font-bold">{recipe.title}</h1>
      <div> {recipe.description}</div>
      <div className="border-primary-black-50 rounded-3xl border-2">
        <ol className="m-5 list-inside list-decimal">
          {instructions.map((val, i) => {
            return (
              <li className="mb-1 text-start" key={i}>
                {val}
              </li>
            )
          })}
        </ol>
        <div className="bg-primary-black-50 my-4 mt-4 mr-5 rounded-r-2xl py-4 pr-4">
          <table className="w-full">
            <tbody>
              <tr>
                <td className="p-1.5">Ingrediets</td>
                <td className="p-1.5">Amount</td>
              </tr>
              {ingredients.map((ingredient, index) => (
                <tr key={index}>
                  <td className="p-1.5 text-center">
                    {ingredient.ingredient.name}
                  </td>
                  <td className="p-1.5 text-center">
                    {ingredient.amount} {ingredient.unit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

function NotFount() {
  return <div>Recipe Not Found</div>
}

function NotAuthed({
  user,
  num,
}: {
  user?: { id: string; role: string }
  num?: number
}) {
  const redir = num ? `/auth/login?redirect=/app/recipe/${num}` : "/auth/login"
  return user ? (
    <div>
      <p>{"You unfortinatly can't view this content"}</p>
    </div>
  ) : (
    <div>
      <p>{"You need to be logged in to view this content"}</p>
      <Link href={redir}>Login</Link>
    </div>
  )
}
