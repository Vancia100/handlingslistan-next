"use client"

import { type Dispatch, type SetStateAction, useState } from "react"
import { allowedUnits, type recipeSchema } from "@/schemas/recipeSchema"
import { type z } from "zod"

type IngredientsType = z.infer<typeof recipeSchema>["ingredients"]

export default function IngredientsTable(props: {
  ingredients: (typeof recipeSchema)["_input"]["ingredients"]
  setIngredients: Dispatch<SetStateAction<IngredientsType>>
}) {
  const [looseUnit, setLooseUnit] = useState<
    (typeof allowedUnits)[number] | null
  >(null)

  return (
    <table className="bg-primary-black-75 w-full">
      <tbody>
        <tr>
          <td className="border-primary-black border-2">Ingrediets</td>
          <td className="border-primary-black border-2">Amount</td>
          <td className="border-primary-black border-2">Unit</td>
        </tr>
        {[...props.ingredients, { name: "", amount: 0, unit: null }].map(
          (ingredient, index) => (
            <tr key={index}>
              <td className="border-primary-black border-2">
                <input
                  className="w-full text-center"
                  value={ingredient.name}
                  onChange={(e) => {
                    const newIngredients = [...props.ingredients]
                    if (!newIngredients[index]) {
                      const optionalUnit = looseUnit
                      newIngredients[index] = {
                        name: "",
                        amount: 0,
                        unit: optionalUnit ?? "g",
                      }
                      if (optionalUnit) {
                        setLooseUnit(null)
                      }
                    }
                    newIngredients[index].name = e.target.value
                    if (
                      e.target.value === "" &&
                      newIngredients[index].amount === 0
                    ) {
                      if (index === newIngredients.length - 1) {
                        setLooseUnit(newIngredients[index].unit)
                      }
                      newIngredients.splice(index, 1)
                    }
                    props.setIngredients(newIngredients)
                  }}
                />
              </td>
              <td className="border-primary-black border-2">
                <input
                  className="w-full text-center"
                  type="number"
                  value={ingredient.amount}
                  onChange={(e) => {
                    const newIngredients = [...props.ingredients]
                    if (!newIngredients[index]) {
                      const optionalUnit = looseUnit
                      newIngredients[index] = {
                        name: "",
                        amount: 0,
                        unit: optionalUnit ?? "g",
                      }
                      if (optionalUnit) {
                        setLooseUnit(null)
                      }
                    }
                    newIngredients[index].amount = Number(e.target.value)
                    if (
                      e.target.value === "" &&
                      newIngredients[index].name === ""
                    ) {
                      if (index === newIngredients.length - 1) {
                        setLooseUnit(newIngredients[index].unit)
                      }
                      newIngredients.splice(index, 1)
                    }
                    props.setIngredients(newIngredients)
                  }}
                />
              </td>
              <td className="border-primary-black focus-within:border-primary-purple border-2">
                <select
                  value={ingredient.unit ?? looseUnit ?? ""}
                  className="bg-primary-black-75 w-full px-2 text-center"
                  onChange={(e) => {
                    const newIngredients = [...props.ingredients]
                    const value = e.target
                      .value as (typeof allowedUnits)[number]
                    if (!newIngredients[index]) {
                      setLooseUnit(value)
                    } else {
                      newIngredients[index].unit = value
                      props.setIngredients(newIngredients)
                    }
                  }}>
                  {allowedUnits.map((unit) => (
                    <option key={unit} value={unit} className="">
                      {unit}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ),
        )}
      </tbody>
    </table>
  )
}
