"use client"
import type { Ingredient, Units } from "@prisma/client"
import { useRef, useActionState, useState, useEffect } from "react"
import { allowedUnits } from "@/schemas/recipeSchema"
import changeDefaultUnits from "@/actions/changeDefaultUnits"

import { ingredeintSchema } from "@/schemas/ingredientSchema"

export default function IngredietsManager({
  ingredients,
}: {
  ingredients: Ingredient[]
}) {
  const [message, setMessage] = useState("")
  const [state, changeUnits, isPending] = useActionState(changeDefaultUnits, {
    message: "",
  })

  //Sync state and message
  useEffect(() => {
    setMessage(state.message)
  }, [state])

  const ingredientsRef = useRef(ingredients)

  //Call to send Server action
  const clinetAction = async (formData: FormData) => {
    const oldValues = new Map(
      ingredientsRef.current.map((item) => [item.id, item]),
    )
    const newValues = [...formData.entries()]

    console.log(newValues, "new values")
    console.log(oldValues, "old values")

    const changes = newValues.filter(
      (item) => item[1] !== oldValues.get(Number(item[0]))!.defaultUnit,
    )
    const changesObject = changes.map((item) => ({
      id: Number(item[0]),
      name: oldValues.get(Number(item[0]))!.name,
      defaultUnit: item[1],
    }))
    if (changes.length !== 0) {
      const isValid = ingredeintSchema.safeParse(changesObject)
      if (!isValid.success) {
        setMessage("Invalid data")
        console.error(isValid.error)
        return
      }
      ingredientsRef.current = [...oldValues.values()].map((item) => {
        const found = isValid.data.find((change) => change.id === item.id)
        return found ?? item
      })
      console.log(isValid.data, "new values")
      console.log(ingredientsRef.current, "old values")
      changeUnits(isValid.data)
    } else {
      setMessage("You have to change something!")
    }
  }
  console.log(ingredientsRef.current, "ref values")
  return (
    <>
      <form action={clinetAction}>
        <ol>
          {ingredientsRef.current.map((ingredient) => (
            <li key={ingredient.id}>
              <span>{ingredient.name} </span>
              <select
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
          {"Save changes"}
        </button>
      </form>
      <div>{message}</div>
      {isPending && <div>{"Loading..."}</div>}
    </>
  )
}
