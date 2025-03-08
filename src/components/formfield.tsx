"use client"

import { useRef, useActionState } from "react"
import { z } from "zod"
import { allowedUnits, recipeSchema } from "@/schemas/recipeSchema"
import sendRecipe from "@/actions/sendRecipe"

export default function FormField() {
  const titelRef = useRef<HTMLSpanElement>(null)
  const [state, formAction, pending] = useActionState(sendRecipe, {
    message: "",
  })

  return (
    <form className="flex flex-col gap-4" action={formAction}>
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
          className="border-primary-purple bg-primary-black rounded-lg border-4 p-2 text-2xl font-bold"
        />
      </label>
      <label className="min-w-2/3">
        <div>Description:</div>
        <textarea
          name="description"
          className="bg-primary-black border-primary-purple w-full rounded-2xl border-4 p-2"></textarea>
      </label>
      {state?.message && <div>{state.message}</div>}
      {(pending && <div>loading...</div>) || null}
      <button
        className="bg-primary-black border-primary-black hover:border-primary-white w-max cursor-pointer self-center rounded-xl border-2 p-2"
        type="submit">
        Save recipe
      </button>
    </form>
  )
}
