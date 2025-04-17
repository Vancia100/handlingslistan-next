"use client"

import {
  type Dispatch,
  type SetStateAction,
  useState,
  startTransition,
} from "react"

import { allowedUnits, type recipeSchema } from "@/schemas/recipeSchema"
import type { z } from "zod"
import type { Ingredient } from "@prisma/client"

import spellCheck from "@/utils/spellcheck"

type IngredientsType = z.infer<typeof recipeSchema>["ingredients"]

type AlternativesType = {
  forIndex: number
  alternatives: Ingredient[]
}

export default function IngredientsTable(props: {
  ingredients: (typeof recipeSchema)["_input"]["ingredients"]
  setIngredients: Dispatch<SetStateAction<IngredientsType>>
  allIngredients: Ingredient[]
}) {
  const [looseUnit, setLooseUnit] = useState<
    (typeof allowedUnits)[number] | null
  >(null)

  console.log("rerendered!")
  // Dictionaty for spellcheck

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
                {/* Input goes here */}
                <DropDownMenu
                  ingredientName={ingredient.name}
                  index={index}
                  setIngredients={props.setIngredients}
                  ingredients={props.ingredients}
                  allIngredients={props.allIngredients}
                  looseUnit={looseUnit}
                  setLooseUnit={setLooseUnit}
                />
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

function DropDownMenu({
  index,
  setIngredients,
  ingredientName,
  ingredients,
  allIngredients,
  looseUnit,
  setLooseUnit,
}: {
  index: number
  ingredientName: string
  setIngredients: Dispatch<SetStateAction<IngredientsType>>
  ingredients: (typeof recipeSchema)["_input"]["ingredients"]
  allIngredients: Ingredient[]

  looseUnit: (typeof allowedUnits)[number] | null
  setLooseUnit: Dispatch<SetStateAction<(typeof allowedUnits)[number] | null>>
}) {
  const [isHovering, setIsHovering] = useState(false)
  const [alternatives, setAlternatives] = useState<AlternativesType | null>(
    null,
  )

  const dictionary = useMemo(() => {
    return Object.fromEntries(
      allIngredients.map(
        (ingredient) => [ingredient.name, ingredient] as const,
      ),
    )
  }, [allIngredients])

  // change event on the input field
  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const newIngredients = [...ingredients]
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
    if (e.target.value === "" && newIngredients[index].amount === 0) {
      if (index === newIngredients.length - 1) {
        setLooseUnit(newIngredients[index].unit)
      }
      newIngredients.splice(index, 1)
    }
    setIngredients(newIngredients)
    if (!e.target.value) {
      setAlternatives(null)
      return
    }

    startTransition(() => {
      const suggestions = spellCheck(e.target.value, Object.keys(dictionary))
      setAlternatives({
        forIndex: index,
        alternatives: suggestions.map((ing) => dictionary[ing]!),
      })

      // Not working, commented out. Supposed to look for aliases
      // things like multiple names and common misspellings

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
  }

  return (
    <>
      <input
        className="w-full text-center"
        value={ingredientName}
        onBlur={() => {
          if (!isHovering) {
            setAlternatives(null)
          }
        }}
        onChange={(e) => handleChange(e, index)}
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
                  setIngredients((prev) => {
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
    </>
  )
}
