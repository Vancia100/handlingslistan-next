"use client"

import {
  useRef,
  useActionState,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react"
import { z } from "zod"

import { allowedUnits, recipeSchema } from "@/schemas/recipeSchema"
import sendRecipe from "@/actions/sendRecipe"

export default function FormField() {
  const titelRef = useRef<HTMLSpanElement>(null)
  const [submitStatus, formAction, pending] = useActionState(sendRecipe, {
    message: "",
  })

  const [status, setStatus] = useState("")
  const [instructions, setInstructions] = useState<string[]>([])

  useEffect(() => {
    if (submitStatus) {
      setStatus(submitStatus.message)
    }
  }, [submitStatus])

  const clientAction = async (formData: FormData) => {
    const parsedForm = recipeSchema.safeParse({
      title: formData.get("title"),
      metadata: null,
      description: formData.get("description"),
      ingredients: null,
      instructions,
    })

    if (!parsedForm.success) {
      console.log(parsedForm.error.issues)
      setStatus(parsedForm.error.issues[0]!.message)
      return
    }
    await formAction(parsedForm.data!)
  }

  return (
    <form className="flex flex-col gap-4" action={clientAction}>
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
      <IngredientsTable />
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
        onFocus={(e) => {
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

function IngredientsTable() {
  const [ingredients, setIngredients] = useState<number>()
  return (
    <table className="bg-primary-black-75 w-full">
      <tbody>
        <tr>
          <td className="border-primary-black border-2">Ingrediets</td>
          <td className="border-primary-black border-2">Amount</td>
          <td className="border-primary-black border-2">Unit</td>
        </tr>
        {
          <tr>
            <td className="border-primary-black border-2">
              <input name={"ingredient"} className="w-full text-center" />
            </td>
            <td className="border-primary-black border-2">
              <input
                name={"Amount"}
                className="w-full text-center"
                type="number"
              />
            </td>
            <td className="border-primary-black focus-within:border-primary-purple border-2">
              <select
                name="unit"
                className="bg-primary-black-75 w-full px-2 text-center">
                {allowedUnits.map((unit) => (
                  <option key={unit} value={unit} className="">
                    {unit}
                  </option>
                ))}
              </select>
            </td>
          </tr>
        }
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
