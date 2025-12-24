"use client"

import { useActionState } from "react"
import searchRecipe from "@/actions/searchRecipe"
import Card from "@/components/card"

export default function RecipePage() {
  const [state, action, isLoading] = useActionState(searchRecipe, {
    message: "",
  })
  const clientAction = async (formData: FormData) => {
    const searchTerm = formData.get("searchTerm")
    if (
      !searchTerm ||
      typeof searchTerm !== "string" ||
      searchTerm.length < 1
    ) {
      return
    }
    action(searchTerm)
  }

  return (
    <div className="flex w-screen flex-col items-center justify-center text-2xl text-white">
      <form action={clientAction}>
        <label className="flex flex-col items-center">
          <span>Search for a recipe or ingredient:</span>
          <input
            className="border-primary-black-50 border-b-primary-white border-2"
            placeholder="Mmm"
            type="text"
            name="searchTerm"
          />
        </label>
      </form>

      <div className="flex flex-col">
        {isLoading && <div>Loading ...</div>}
        {state.message && <div>{state.message}</div>}
        {state.recipes && state.recipes.length > 0 && (
          <div className="flex flex-col items-center">
            {state.recipes.map((recipe) => (
              <Card
                key={recipe.id}
                title={recipe.title}
                description={recipe.description}
                url={`/app/recipe/${recipe.id}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
