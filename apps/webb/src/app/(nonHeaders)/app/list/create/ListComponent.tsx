"use client"

import type { ListType, IngredientsType } from "./serverSideFetchers"

import { useMutation } from "@tanstack/react-query"
import { useTRPC } from "@/utils/trpc"
import { useReducer, use, useEffect } from "react"
import { listReducer, type UpdateType } from "./listreducer"
import { useSubscription } from "@trpc/tanstack-react-query"
import { newListValidator } from "@hndl/types/validators"
import { functionalDebounce as debouce } from "@hndl/utils"

export default function ListComponent(props: {
  startlist?: ListType
  ingredients: IngredientsType
  listId: number
}) {
  const firstList = props.startlist ? use(props.startlist) : null
  const ingredeints = use(props.ingredients)

  console.log(firstList, "List", props.startlist)
  const trpc = useTRPC()
  const {
    mutate: addItemMutate,
    variables,
    isPending,
  } = useMutation(trpc.list.addListItem.mutationOptions())
  const { data: newItemSubscription } = useSubscription(
    trpc.list.newItemInList.subscriptionOptions({
      listId: props.listId,
    }),
  )
  const [list, dispatch] = useReducer(
    listReducer,
    firstList?.items.map((item) => ({
      name: item.recipeCustom ?? item.recipeItem?.name,
      amount: item.amount,
      id: item.id,
      done: false,
    })) ?? [],
  )
  function remove(id: number) {
    dispatch({
      type: "Remove",
      id,
    })
  }
  function check(id: number) {
    dispatch({
      type: "Check",
      id,
    })
  }
  function update(id: number, data: UpdateType) {
    dispatch({
      type: "Update",
      id,
      data,
    })
  }
  const deboucedMutate = debouce(
    (newVal: string, id: number, oldVal: string) => {
      update(id, {
        name: newVal,
      })
      // Do mutate
      // Revert if mutate fails
    },
    1000,
  )
  const deboucedChangeAmount = debouce(
    (newVal: number, id: number, oldVal: number) => {
      update(id, {
        amount: newVal,
      })
      // Do mutate
      // Revert if mutate fails
    },
    1000,
  )
  function newItem(name: string, amount: number) {
    addItemMutate(
      {
        listId: props.listId,
        item: {
          name,
          amount,
          checked: false,
        },
      },
      {
        onSuccess: (id) => {
          dispatch({
            type: "New",
            name,
            amount,
            id,
          })
        },
      },
    )
  }

  useEffect(() => {
    if (newItemSubscription) {
      dispatch({
        type: "New",
        ...newItemSubscription,
      })
    }
  }, [newItemSubscription, dispatch, props.listId])

  return (
    <>
      <h2 className="text-2xl">List {String(props.listId)}</h2>
      <form
        action={(item) => {
          const inp = {
            amount: Number(item.get("amount")),
            name: item.get("name"),
            checked: false,
          }
          const validatedInput = newListValidator.safeParse(inp)
          console.log(validatedInput)
          if (validatedInput.success) {
            newItem(validatedInput.data.name, validatedInput.data.amount)
          }
        }}>
        <label>New item:</label>
        <br />
        <input
          className="border-primary-white rounded-l-2xl border-t-2 border-b-2 border-l-2 px-2 py-1"
          type="text"
          name="name"
          placeholder="item"
        />
        <input
          className="border-primary-white border-2 px-2 py-1"
          type="number"
          placeholder="amount"
          name="amount"
        />
        <button
          className="border-primary-white cursor-pointer rounded-r-2xl border-t-2 border-r-2 border-b-2 px-2 py-1"
          type="submit">
          Add
        </button>
      </form>
      <ul>
        {list.map(({ name, amount, id, done }) => (
          <li key={id}>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                const newName = e.target.value
                update(id, { name: newName })
                // deboucedMutate(newName, id, name ?? "")
              }}
            />
            <input
              type="number"
              defaultValue={amount}
              onChange={(e) => {
                const newAmount = Number(e.target.value)
                update(id, { amount: newAmount })
                // deboucedMutate(newName, id, name ?? "")
              }}
            />
            <input
              type="checkbox"
              checked={done}
              onChange={() => {
                check(id)
              }}
            />
          </li>
        ))}
        {isPending && (
          <li>
            <div>{variables.item.name}</div>
            <div>{variables.item.amount}</div>
          </li>
        )}
      </ul>
    </>
  )
}
