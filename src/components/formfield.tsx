"use client"

import {
  useRef,
  useActionState,
  useState,
  useEffect,
  startTransition,
  type ChangeEvent,
} from "react"

import { type z } from "zod"
import { type Ingredient } from "@prisma/client"
import { recipeSchema } from "@/schemas/recipeSchema"

import sendRecipe from "@/actions/sendRecipe"

import IngredientsTable from "@/components/ingredientsTable"
import InstructionsList from "@/components/instructionsList"

type IngredientsType = z.infer<typeof recipeSchema>["ingredients"]

export default function FormField(props: { ingredeints: Ingredient[] }) {
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
      public: formData.get("public") === "on",
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
        allIngredients={props.ingredeints}
        ingredients={ingredients}
        setIngredients={setIngredients}
      />
      <InstructionsList
        instructions={instructions}
        setInstructions={setInstructions}
      />
      <label>
        <span>Public</span> <input type="checkbox" name="public" />
      </label>
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
