"use client"

import type { ListType, IngredientsType } from "./serverSideFetchers"

import { useMutation } from "@tanstack/react-query"
import { useTRPC } from "@/utils/trpc"
import { useReducer, use, useEffect, useMemo } from "react"
import { listReducer, type UpdateType } from "./listreducer"
import { useSubscription } from "@trpc/tanstack-react-query"
import { newListValidator } from "@hndl/types/validators"
import { functionalDebounce as debounce } from "@hndl/utils"

export default function ListComponent(props: {
  startlist?: Awaited<ListType>
  ingredients: IngredientsType
  listId: number
}) {
  const firstList = props.startlist ?? null
  const ingredeints = use(props.ingredients)

  const trpc = useTRPC()
  const {
    mutate: addItemMutate,
    variables,
    isPending,
  } = useMutation(trpc.list.addListItem.mutationOptions())
  const { mutate: updateItemMutate } = useMutation(
    trpc.list.updateItemInList.mutationOptions(),
  )
  const { data: subscriptionData } = useSubscription(
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
      checked: item.checked,
    })) ?? [],
  )
  function remove(id: number) {
    dispatch({
      type: "remove",
      id,
    })
  }
  function check(id: number, checked: boolean) {
    updateItemMutate(
      {
        listId: props.listId,
        itemId: id,
        item: {
          checked,
        },
      },
      {
        onError: (e) => {
          console.log(e)
          dispatch({
            type: "update",
            id,
            data: {
              check: !checked,
            },
          })
        },
      },
    )
    dispatch({
      type: "check",
      id,
    })
  }
  function update(id: number, data: UpdateType) {
    dispatch({
      type: "update",
      id,
      data,
    })
  }
  const debouncedMutate = useMemo(() => {
    return debounce((newVal: UpdateType, id: number, oldVal: UpdateType) => {
      // Do mutate
      updateItemMutate(
        {
          listId: props.listId,
          itemId: id,
          item: newVal,
        },
        {
          onError: (e) => {
            // Revert if there is an error
            update(id, oldVal)
            // Should have an error box so that the user knows
          },
        },
      )
    }, 2000)
  }, [updateItemMutate, props.listId])
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
            type: "new",
            name,
            amount,
            id,
          })
        },
      },
    )
  }

  useEffect(() => {
    if (subscriptionData) {
      switch (subscriptionData.type) {
        case "new":
          dispatch({
            type: "new",
            ...subscriptionData.list,
          })
          break
        case "update":
          update(subscriptionData.listIngredientId, subscriptionData.list)
      }
    }
  }, [subscriptionData, dispatch, props.listId])
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
        {list.map(({ name, amount, id, checked }) => (
          <li key={id}>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                const newName = { name: e.target.value }
                update(id, newName)
                debouncedMutate(newName, id, name ? { name } : {})
              }}
            />
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                const newAmount = { amount: Number(e.target.value) }
                update(id, newAmount)
                debouncedMutate(newAmount, id, amount ? { amount } : {})
              }}
            />
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => {
                const checked = e.target.checked
                console.log(checked)
                check(id, checked)
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
