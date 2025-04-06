"use client"

import {
  type Dispatch,
  type SetStateAction,
  useState,
  useTransition,
} from "react"

import { allowedUnits, type recipeSchema } from "@/schemas/recipeSchema"
import type { z } from "zod"
import type { Ingredient } from "@prisma/client"

import spellCheck from "@/utils/spellcheck"

type IngredientsType = z.infer<typeof recipeSchema>["ingredients"]

export default function IngredientsTable(props: {
  ingredients: (typeof recipeSchema)["_input"]["ingredients"]
  setIngredients: Dispatch<SetStateAction<IngredientsType>>
  allIngredients: Ingredient[]
}) {
  const [looseUnit, setLooseUnit] = useState<
    (typeof allowedUnits)[number] | null
  >(null)

  const [isPending, startTransition] = useTransition()
  const [alternatives, setAlternatives] = useState<{
    forIndex: number
    alternatives: Ingredient[]
  } | null>(null)

  const [isHovering, setIsHovering] = useState(false)
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
                <label>
                  <input
                    className="w-full text-center"
                    value={ingredient.name}
                    onBlur={() => {
                      if (!isHovering) {
                        setAlternatives(null)
                      }
                    }}
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
                      if (!e.target.value) {
                        setAlternatives(null)
                        return
                      }

                      startTransition(() => {
                        const dictionary = props.allIngredients.map(
                          (ingredient) => ingredient.name,
                        )
                        const suggestions = spellCheck(
                          e.target.value,
                          dictionary,
                        )
                        setAlternatives({
                          forIndex: index,
                          alternatives: suggestions.map(
                            (ing) =>
                              props.allIngredients.find(
                                (ingredient) => ingredient.name === ing,
                              )!,
                          ),
                        })

                        // const deepSearch = props.allIngredients.flatMap(
                        //   (ing) => ing.aliases,
                        // )
                        // const newSuggestions = spellCheck(
                        //   e.target.value,
                        //   deepSearch,
                        // )

                        // const filteredSug = [
                        //   ...new Set([
                        //     ...newSuggestions.map((ing) => {
                        //       props.allIngredients.find((ingredient) =>
                        //         ingredient.aliases.includes(ing),
                        //       )!.name
                        //     }),
                        //     ...suggestions,
                        //   ]),
                        // ]

                        // setAlternatives({
                        //   forIndex: index,
                        //   alternatives: filteredSug.map(
                        //     (ing) =>
                        //       props.allIngredients.find(
                        //         (ingredient) => ingredient.name === ing,
                        //       ) as Ingredient,
                        //   ),
                        // })
                      })
                    }}
                  />
                  {alternatives?.forIndex === index &&
                    alternatives.alternatives.length > 0 && (
                      <div
                        className="bg-primary-black-75 border-primary-black absolute z-10 border-x-2 border-t-2"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}>
                        {alternatives.alternatives.map((ingredient) => (
                          <div
                            className="border-primary-black cursor-pointer border-b-2 p-1"
                            key={ingredient.id}
                            onClick={() => {
                              console.log("click")
                              props.setIngredients((prev) => {
                                const newIngredients = [...prev]
                                newIngredients[index]!.name = ingredient.name
                                return newIngredients
                              })
                              setAlternatives(null)
                            }}>
                            {ingredient.name}
                          </div>
                        ))}
                      </div>
                    )}
                  {isPending && (
                    <div className="bg-primary-black-75 border-primary-black absolute z-10 border-x-2 border-t-2">
                      <div className="border-primary-black cursor-pointer border-b-2 p-1">
                        Loading...
                      </div>
                    </div>
                  )}
                </label>
              </td>
              <td className="border-primary-black border-2">
                <input
                  className="w-full text-center"
                  type="number"
                  step={0.1}
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
