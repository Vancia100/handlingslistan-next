import { db } from "@/server/db"
import { auth } from "@/server/auth"
import type { Role } from "@prisma/client"

export default async function Recipe(props: {
  params: Promise<{ id: string }>
}) {
  const postId = Number((await props.params).id)
  if (!postId) return <NotFount />
  const user = (await auth())?.user

  return <GetRecipe postId={postId} userId={user?.id} userRole={user?.role} />
}

async function GetRecipe(props: {
  postId: number
  userId: string | undefined
  userRole: Role | undefined
}) {
  "use cache"
  const recipe = await db.recipe.findFirst({
    where: {
      id: props.postId,
    },
    include: {
      viewableBy: {
        select: {
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

  if (!recipe.public) {
    if (
      props.userRole !== "ADMIN" ||
      recipe.viewableBy.find((usr) => usr.id === props.userId) === undefined
    ) {
      return <NotAuthed />
    }
  }

  const instructions = recipe.instructions
  const ingredients = recipe.ingredients
  return (
    <>
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

function NotAuthed() {
  return <div>{"You unfortinatly can't view this content"}</div>
}
