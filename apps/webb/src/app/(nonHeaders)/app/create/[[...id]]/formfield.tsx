"use client"

import {
  useRef,
  useActionState,
  useState,
  useEffect,
  startTransition,
  useMemo,
  memo,
  type ChangeEvent,
  type RefObject,
} from "react"

import { useDebounce } from "use-debounce"

import { recipeSchema } from "@/schemas/recipeSchema"

import { useMessageContext } from "@/context/messageContext"

import { functionalDebounce } from "@/utils/simpleDebounce"

import sendRecipe from "@/actions/sendRecipe"

import IngredientsTable from "@/components/ingredientsTable"
import InstructionsList from "@/components/instructionsList"
import InviteView from "@/components/inviteView"

// Types
import type { ClientRecipeType, IngredientsType } from "@/types/recipeTypes"
import type { Ingredient } from "@hndl/database/client"

// Constatnts
const DEBOUNCETIME = 3000

//Memos
const MemoIngredients = memo(IngredientsTable)
const MemoInstructionsList = memo(InstructionsList)
const MemoInviteView = memo(InviteView)

export default function FormField(props: {
  ingredeints: Ingredient[]
  presetRecipe?: ClientRecipeType
}) {
  // Refs for the title and description
  // No complex logic, no need to rerender
  const titelRef = useRef<HTMLSpanElement>(null)
  const titleInpRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLTextAreaElement>(null)

  // State to keep count of the viewers
  const [viewers, setViewers] = useState<string[]>(
    props.presetRecipe?.viewers ?? [],
  )

  // Memo to make sure that the memoed addViewrs does not reload anytime that the parent does.
  const addUsers = useMemo(() => {
    return (user: string) => {
      setViewers((prev) => [...prev, user])
      return true
    }
  }, [setViewers])

  // Ref to have a consistant value for the checked attribute. Sad that so many refs are used :(
  // Do not know how to use less as all of the values need to be accessed.
  const isPublicRef = useRef<HTMLInputElement>(null)

  // State for ingredeints and instructions
  const [instructions, setInstructions] = useState<string[]>([])
  const [ingredients, setIngredients] = useState<IngredientsType>([])

  // Formstatus and actions
  // status can be manipulated in multiple places
  const [status, setStatus] = useState("")
  const [submitStatus, formAction, pending] = useActionState(sendRecipe, {
    message: "",
    success: true,
  })

  // Title of the recipe currently loaded
  const currentActiveRecipe = useRef<string>(null)

  // Sync status with submitStatus

  console.log("rerendere")
  // const currentStatus = useMemo(() => {
  //   return submitStatus.message ? submitStatus : status
  // }, [status, submitStatus])

  // Causes side effects, preferably use something else?
  useEffect(() => {
    if (submitStatus) {
      setStatus(submitStatus.message)
    }
    // When successfully updating a recipe
    if (submitStatus.success && currentActiveRecipe.current) {
      removeLocalStorageItem(currentActiveRecipe.current)
      currentActiveRecipe.current = null
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
      id: props.presetRecipe?.id,
      viewers,
    })

    if (!parsedForm.success) {
      console.log(parsedForm.error.issues)
      setStatus(parsedForm.error.issues[0]!.message)
      return
    }
    startTransition(() => formAction(parsedForm.data))
  }

  // When inputs haven't changed for 3 sec, update local storage
  const [debouncedIngredients] = useDebounce(ingredients, DEBOUNCETIME)
  const [debouncedInstructions] = useDebounce(instructions, DEBOUNCETIME)

  // Add some sort of message
  const addMessage = useMessageContext()

  const updateLocalFunction = useMemo(() => {
    return () => {
      updateLocalStorage(
        {
          ingredients: debouncedIngredients,
          instructions: debouncedInstructions,
          title: titleInpRef.current?.value ?? "",
          description: descriptionRef.current?.value ?? "",
          public: isPublicRef.current?.checked,
          viewers,
          id: props.presetRecipe?.id,
        },
        currentActiveRecipe,
        addMessage,
      )
    }
  }, [
    debouncedIngredients,
    debouncedInstructions,
    addMessage,
    viewers,
    props.presetRecipe?.id,
  ])

  useEffect(updateLocalFunction, [updateLocalFunction])

  const chageStorage = useMemo(() => {
    return functionalDebounce(updateLocalFunction, DEBOUNCETIME)
  }, [updateLocalFunction])

  // If local storage has a recipe, load it.
  useEffect(() => {
    if (!props.presetRecipe) {
      const localStorageRecipe = Object.keys(getLocalStorage() ?? {})
      const localStorageRecipeId = getLocalStorageItem(
        localStorageRecipe[0] ?? "",
      )
      if (localStorageRecipeId) {
        setIngredients(localStorageRecipeId.ingredients)
        setInstructions(localStorageRecipeId.instructions)
        titleInpRef.current!.value = localStorageRecipeId.title
        descriptionRef.current!.value = localStorageRecipeId.description
        currentActiveRecipe.current = localStorageRecipeId.title
      }
      currentActiveRecipe.current = localStorageRecipe[0] ?? null
    } else {
      const recipe = props.presetRecipe
      setIngredients(recipe.ingredients)
      setInstructions(recipe.instructions)
      titleInpRef.current!.value = recipe.title
      descriptionRef.current!.value = recipe.description
      currentActiveRecipe.current = recipe.title
    }
  }, [props.presetRecipe])

  return (
    <>
      <div className="fixed top-5 right-5">
        <MemoInviteView addFunctionAction={addUsers} excludedPeople={viewers} />
      </div>
      <form className="flex flex-col gap-4" onSubmit={clientAction}>
        <label className="min-w-2/3">
          <span ref={titelRef} className="p-4 text-2xl font-bold">
            {"Title:"}
          </span>
          <input
            name={"title"}
            ref={titleInpRef}
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
            onChange={() => {
              chageStorage()
            }}
            type={"text"}
            className="border-primary-purple bg-primary-black rounded-lg border-4 p-2 text-center text-2xl font-bold"
          />
        </label>
        <label className="min-w-2/3">
          <div>{"Description:"}</div>
          <textarea
            ref={descriptionRef}
            name={"description"}
            className="bg-primary-black border-primary-purple w-full rounded-2xl border-4 p-2"
            onFocus={() => {
              descriptionRef.current?.classList.remove("border-4")
            }}
            onBlur={(e) => {
              if (e.target.value === "") {
                descriptionRef.current?.classList.add("border-4")
              }
            }}
            onChange={() => {
              chageStorage()
            }}></textarea>
        </label>
        <MemoIngredients
          allIngredients={props.ingredeints}
          ingredients={ingredients}
          setIngredients={setIngredients}
        />
        <MemoInstructionsList
          instructions={instructions}
          setInstructions={setInstructions}
        />
        <label className="text-xl">
          <input
            defaultChecked={props.presetRecipe?.public}
            ref={isPublicRef}
            type="checkbox"
            name="public"
            className="accent-primary-purple border-primary-white me-1.5 h-4 w-4 border-2 text-sm font-medium"
            onChange={chageStorage}
          />
          <span>Public</span>
        </label>
        {status && <div>{status}</div>}
        {(pending && <div>loading...</div>) || null}
        <button
          className="bg-primary-black border-primary-black hover:border-primary-white w-max cursor-pointer self-center rounded-xl border-2 p-2"
          type="submit">
          {!props.presetRecipe ? "Publish recipe" : "Save changes"}
        </button>
      </form>
    </>
  )
}

// Local storage shit
function getLocalStorage() {
  const stringJSON = localStorage.getItem("recipeLookup")
  if (!stringJSON) return null

  return JSON.parse(stringJSON) as Record<string, string>
}

function getLocalStorageItem(key: string) {
  const stringJSON = localStorage.getItem(key)
  if (!stringJSON) return null

  return JSON.parse(stringJSON) as ClientRecipeType
}

function removeLocalStorageItem(key: string) {
  const stringJSON = localStorage.getItem("recipeLookup")
  if (!stringJSON) return

  const parsed = JSON.parse(stringJSON) as Record<string, string>
  delete parsed[key]
  localStorage.setItem("recipeLookup", JSON.stringify(parsed))
  localStorage.removeItem(key)
}

function updateLocalStorage(
  recipe: ClientRecipeType & { id?: number },
  currentRecipeId: RefObject<string | null>,
  message?: (message: string) => void,
) {
  // Return if new recipe
  if (!currentRecipeId.current) {
    const id = generateRandomName()
    currentRecipeId.current = id
    return
  }

  const id = currentRecipeId.current

  const stringJson = localStorage.getItem("recipeLookup")

  const parsed = stringJson
    ? (JSON.parse(stringJson) as Record<string, string>)
    : null

  if (parsed) {
    localStorage.setItem(
      "recipeLookup",
      JSON.stringify({ ...parsed, [id]: recipe.title }),
    )
  } else {
    localStorage.setItem("recipeLookup", JSON.stringify({ [id]: recipe.title }))
  }
  localStorage.setItem(id, JSON.stringify(recipe))
  message?.("Saved a draft localy")
}

function generateRandomName() {
  return Math.random().toString(36).substring(2, 15)
}
