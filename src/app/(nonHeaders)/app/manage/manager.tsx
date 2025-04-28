"use client"
import type { Ingredient } from "@/generated/prisma/client"
import {
  useRef,
  useActionState,
  useState,
  useEffect,
  startTransition,
  useOptimistic,
  useCallback,
} from "react"

// import { allowedUnits } from "@/schemas/recipeSchema"
const allowedUnits = ["g"]
import changeDefaultUnits from "@/actions/changeDefaultUnits"

import { ingredeintSchema } from "@/schemas/ingredientSchema"
// Broken import, does not work on the client

import manager from "./manager.module.css"
import combineIngredeints from "@/actions/combineIngredients"

type InternalIngredient = (Ingredient & {
  blured?: boolean
})[]

export default function IngredietsManager({
  ingredeints: initialIngredietns,
}: {
  ingredeints: Ingredient[]
}) {
  //To store id of clicked item
  const [combinator, setCombinator] = useState<number | null>(null)

  async function combine(id: number) {
    console.log(id)
    if (!combinator) return

    //Start server action
    const isDoneAsync = combineIngredeints({
      changer: id,
      changeTo: combinator,
    })

    //Optimistic update
    startTransition(() => {
      addOptimisticMessage(
        ingredients.map((val) =>
          val.id === id ? { ...val, blured: true } : val,
        ),
      )
    })
    setCombinator(null)
    const isDone = await isDoneAsync
    if (isDone.error) {
      setMessage(isDone.error.message)
      return
    }
    setIngredients((ing) => {
      return ing.filter((val) => val.id != isDone.removedId)
    })
  }
  // Manage styles on the entire list
  const listRef = useRef<HTMLOListElement>(null)

  //To store eventual error messages
  const [message, setMessage] = useState("")

  const [state, changeUnits, isPending] = useActionState(changeDefaultUnits, {
    message: "",
  })

  //Sync state and message
  //Perhaps not prefered with side effects
  useEffect(() => {
    setMessage(state.message)
  }, [state])

  // click of the list item
  useEffect(() => {
    const cancel = new AbortController()
    document.addEventListener(
      "click",
      (e) => {
        if (combinator && e.target !== listRef.current) {
          setCombinator(null)
          listRef.current!.classList.toggle(manager.isHighlight!)
          const items = document.querySelectorAll("." + manager.clickedOn!)

          items.forEach((item) => {
            item.classList.remove(manager.clickedOn!)
          })
        }
      },
      { signal: cancel.signal },
    )

    return () => {
      cancel.abort()
    }
  }, [combinator])

  const [ingredients, setIngredients] =
    useState<InternalIngredient>(initialIngredietns)

  const [optimisticIngredients, addOptimisticMessage] = useOptimistic(
    ingredients,
    (state, newRecipes: InternalIngredient) => newRecipes,
  )
  //Call to send Server action to change units
  const clinetAction = useCallback(
    async (formData: FormData) => {
      const oldValues = new Map(ingredients.map((item) => [item.id, item]))
      const newValues = [...formData.entries()]

      const changes = newValues.filter(
        (item) => item[1] !== oldValues.get(Number(item[0]))!.defaultUnit,
      )
      const changesObject = changes.map((item) => ({
        id: Number(item[0]),
        name: oldValues.get(Number(item[0]))!.name,
        defaultUnit: item[1],
        aliases: [],
      }))
      if (changes.length !== 0) {
        const isValid = ingredeintSchema.safeParse(changesObject)
        if (!isValid.success) {
          setMessage("Invalid data")
          console.error(isValid.error)
          return
        }
        setIngredients(
          [...oldValues.values()].map((item) => {
            const found = isValid.data.find((change) => change.id === item.id)
            return found ?? item
          }),
        )
        changeUnits(isValid.data)
      } else {
        setMessage("You have to change something!")
      }
    },
    [ingredients, changeUnits],
  )

  //Return
  return (
    <>
      <form action={clinetAction}>
        <ol
          ref={listRef}
          className="flex max-w-9/10 min-w-min flex-col items-center">
          {optimisticIngredients.map((ingredient) => (
            <li
              key={ingredient.id}
              className={
                manager.listItem +
                " " +
                (ingredient.blured
                  ? "bg-primary-balck opacity-60 blur-xs" + " "
                  : "") +
                "border-primary-black-75 m-1 w-max rounded-2xl border-2 p-1"
              }>
              <span
                className="bg-primary-blue hidden cursor-pointer rounded-2xl p-1 px-2"
                onClick={async (e) => {
                  if (!combinator) {
                    setCombinator(ingredient.id)
                    e.currentTarget.classList.add(manager.clickedOn!)
                  } else {
                    const combineAsync = combine(ingredient.id)
                    document
                      .querySelectorAll("." + manager.clickedOn!)
                      .forEach((item) => {
                        item.classList.remove(manager.clickedOn!)
                      })
                    await combineAsync
                  }
                  listRef.current!.classList.toggle(manager.isHighlight!)
                }}>
                {!combinator ? "Combine" : "Combine with"}
              </span>
              <span className="px-1">{ingredient.name} </span>
              <select
                className="cursor-pointer"
                key={ingredient.defaultUnit}
                name={ingredient.id.toString()}
                defaultValue={ingredient.defaultUnit ?? ""}>
                {allowedUnits.map((unit, index) => (
                  <option key={index} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </li>
          ))}
        </ol>
        <button
          disabled={isPending}
          type="submit"
          className="border-primary-black-75 hover:border-primary-purple hover:bg-primary-black-75 mt-4 cursor-pointer rounded-2xl border-2 p-2">
          {"Save new units"}
        </button>
      </form>
      <div>{message}</div>
      {isPending && <div>{"Loading..."}</div>}
    </>
  )
}
