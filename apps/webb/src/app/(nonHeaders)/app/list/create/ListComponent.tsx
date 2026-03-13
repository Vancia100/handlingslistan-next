"use client"

import type { ListType, IngredientsType } from "./serverSideFetchers"

import { useMutation } from "@tanstack/react-query"
import { useTRPC } from "@/utils/trpc"
import { useReducer, use, useEffect } from "react"
import { listReducer } from "./listreducer"
import { useSubscription } from "@trpc/tanstack-react-query"
import { newListValidator } from "@hndl/types/validators"

export default function ListComponent(props: {
  startlist?: ListType
  ingredients: IngredientsType
  listId: number
}) {
  const firstList = props.startlist ? use(props.startlist) : null
  const ingredeints = use(props.ingredients)
  const trpc = useTRPC()
  const { mutate, variables, isPending } = useMutation(
    trpc.list.addListItem.mutationOptions(),
  )
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
  function newItem(name: string, amount: number) {
    mutate(
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
        id: props.listId,
        ...newItemSubscription,
      })
    }
  }, [newItemSubscription, dispatch, props.listId])

  return (
    <>
      <form
        action={(item) => {
          const validatedInput = newListValidator.safeParse({
            ...item,
            checked: false,
          })
          if (validatedInput.success) {
            newItem(validatedInput.data.name, validatedInput.data.amount)
          }
        }}>
        <input type="text" name="name" />
        <input type="number" name="amount" />
      </form>
      <ul>
        {list.map(({ name, amount, id, done }) => (
          <li key={id}>
            <div>{name}</div>
            <div>{amount}</div>
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
