"use client"

import {
  useRef,
  useActionState,
  useState,
  useEffect,
  startTransition,
} from "react"
import type { Dispatch, SetStateAction, ChangeEvent } from "react"

import { z } from "zod"
import { allowedUnits, recipeSchema } from "@/schemas/recipeSchema"
import sendRecipe from "@/actions/sendRecipe"

type IngredientsType = z.infer<typeof recipeSchema>["ingredients"]

export default function FormField() {
  const titelRef = useRef<HTMLSpanElement>(null)
  const [submitStatus, formAction, pending] = useActionState(sendRecipe, {
    message: "",
  })

  const [status, setStatus] = useState("")
  const [instructions, setInstructions] = useState<string[]>([])
  const [ingredients, setIngredients] = useState<IngredientsType>([])

  useEffect(() => {
    if (submitStatus) {
      setStatus(submitStatus.message)
    }
  }, [submitStatus])

  const clientAction = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const parsedForm = recipeSchema.safeParse({
      title: formData.get("title"),
      metadata: null,
      description: formData.get("description"),
      ingredients,
      instructions,
    })

    if (!parsedForm.success) {
      console.log(parsedForm.error.issues)
      setStatus(parsedForm.error.issues[0]!.message)
      return
    }
    startTransition(() => formAction(parsedForm.data))
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={clientAction}>
      <label className="min-w-2/3">
        <span ref={titelRef} className="p-4 text-2xl font-bold">
          {"Title:"}
        </span>
        <input
          name={"title"}
          onFocus={(e) => {
            if (titelRef.current?.hidden === undefined) return

            titelRef.current.hidden = true
            e.target.classList.add("border-4")
          }}
          onBlur={(e) => {
            if (titelRef.current?.hidden === undefined) return

            if (e.target.value === "") {
              titelRef.current.hidden = false
            } else {
              e.target.classList.remove("border-4")
            }
          }}
          type={"text"}
          className="border-primary-purple bg-primary-black rounded-lg border-4 p-2 text-center text-2xl font-bold"
        />
      </label>
      <StylesTextArea name="description" title="Description:" />
      <IngredientsTable
        ingredients={ingredients}
        setIngredients={setIngredients}
      />
      <InstructionsList
        instructions={instructions}
        setInstructions={setInstructions}
      />
      {status && <div>{status}</div>}
      {(pending && <div>loading...</div>) || null}
      <button
        className="bg-primary-black border-primary-black hover:border-primary-white w-max cursor-pointer self-center rounded-xl border-2 p-2"
        type="submit">
        Save recipe
      </button>
    </form>
  )
}

function StylesTextArea(props: { name: string; title: string }) {
  const descriptionRef = useRef<HTMLTextAreaElement>(null)
  return (
    <label className="min-w-2/3">
      <div>{props.title}</div>
      <textarea
        ref={descriptionRef}
        name={props.name}
        className="bg-primary-black border-primary-purple w-full rounded-2xl border-4 p-2"
        onFocus={() => {
          descriptionRef.current?.classList.remove("border-4")
        }}
        onBlur={(e) => {
          if (e.target.value === "") {
            descriptionRef.current?.classList.add("border-4")
          }
        }}></textarea>
    </label>
  )
}

function IngredientsTable(props: {
  ingredients: (typeof recipeSchema)["_input"]["ingredients"]
  setIngredients: Dispatch<SetStateAction<IngredientsType>>
}) {
  const UnitRef = useRef<(typeof allowedUnits)[number] | null>(null)
  return (
    <table className="bg-primary-black-75 w-full">
      <tbody>
        <tr>
          <td className="border-primary-black border-2">Ingrediets</td>
          <td className="border-primary-black border-2">Amount</td>
          <td className="border-primary-black border-2">Unit</td>
        </tr>
        {[...props.ingredients, { name: "", amount: 0, unit: "g" }].map(
          (ingredient, index) => (
            <tr key={index}>
              <td className="border-primary-black border-2">
                <input
                  className="w-full text-center"
                  value={ingredient.name}
                  onChange={(e) => {
                    const newIngredients = [...props.ingredients]
                    if (!newIngredients[index]) {
                      const optionalUnit = UnitRef.current
                      newIngredients[index] = {
                        name: "",
                        amount: 0,
                        unit: optionalUnit ?? "g",
                      }
                      if (optionalUnit) {
                        UnitRef.current = null
                      }
                    }
                    newIngredients[index].name = e.target.value
                    if (
                      e.target.value === "" &&
                      newIngredients[index].amount === 0
                    ) {
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
                      const optionalUnit = UnitRef.current
                      newIngredients[index] = {
                        name: "",
                        amount: 0,
                        unit: optionalUnit ?? "g",
                      }
                      if (optionalUnit) {
                        UnitRef.current = null
                      }
                    }
                    newIngredients[index].amount = Number(e.target.value)
                    if (
                      e.target.value === "" &&
                      newIngredients[index]!.name === ""
                    ) {
                      newIngredients.splice(index, 1)
                    }
                    props.setIngredients(newIngredients)
                  }}
                />
              </td>
              <td className="border-primary-black focus-within:border-primary-purple border-2">
                <select
                  className="bg-primary-black-75 w-full px-2 text-center"
                  onChange={(e) => {
                    const newIngredients = [...props.ingredients]
                    const value = e.target
                      .value as (typeof allowedUnits)[number]
                    if (!newIngredients[index]) {
                      UnitRef.current = value
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

function InstructionsList(props: {
  instructions: string[]
  setInstructions: Dispatch<SetStateAction<string[]>>
}) {
  const { instructions, setInstructions } = props
  return (
    <div>
      <h3 className="text-start">Instructions:</h3>
      <div className="border-primary-purple bg-primary-black-75 rounded-lg border-2">
        <ol className="mx-5 list-decimal">
          {[...instructions, ""].map((_, index) => {
            return (
              <li key={index}>
                <input
                  value={instructions[index] ?? ""}
                  type="text"
                  className="w-full"
                  onChange={(e) => {
                    const newInstructions = [...instructions]
                    newInstructions[index] = e.target.value
                    if (index != instructions.length && e.target.value === "") {
                      console.log(newInstructions)
                      newInstructions.splice(index, 1)
                      console.log(newInstructions)
                    }
                    setInstructions(newInstructions)
                  }}></input>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
