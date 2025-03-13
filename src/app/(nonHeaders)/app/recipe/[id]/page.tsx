import { db } from "@/server/db"

export default async function Recipe(props: {
  params: Promise<{ id: string }>
}) {
  const postId = Number((await props.params).id)
  if (!postId) return <NotFount />
  const recipe = await db.recipe.findFirst({
    where: {
      id: postId,
    },
  })
  if (!recipe) return <NotFount />
  console.log(recipe.instructions)
  const instructions = recipe.instructions as string[]
  return (
    <>
      <h1 className="text-3xl font-bold">{recipe.title}</h1>
      <div> {recipe.description}</div>
      <div className="border-primary-black-50 rounded-3xl border-2 p-5">
        <ol className="list-inside list-decimal">
          {instructions.map((val, i) => {
            return (
              <li className="mb-1 text-start" key={i}>
                {val}
              </li>
            )
          })}
        </ol>
      </div>
    </>
  )
}

function NotFount() {
  return <div>Recipe Not Found</div>
}
