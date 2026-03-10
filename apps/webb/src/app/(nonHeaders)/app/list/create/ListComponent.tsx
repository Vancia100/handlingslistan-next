"use client"

import type { ListType, IngredientsType } from "./[...id]/page"

import { useMutation } from "@tanstack/react-query"
import { useTRPC } from "@/utils/trpc"
import { useReducer, use } from "react"
import { listReducer } from "./listreducer"
export default function ListComponent(props: {
  startlist?: ListType
  ingredients: IngredientsType
  listId: number
}) {
  const firstList = props.startlist ? use(props.startlist) : null
  const ingredeints = use(props.ingredients)
  const trpc = useTRPC()
  const [list, dispatch] = useReducer(
    listReducer,
    firstList?.items.map((item) => ({
      name: item.recipeCustom ?? item.recipeItem?.name,
      amount: item.amount,
      id: item.id,
    })) ?? [],
  )
  function test() {
    dispatch({
      type: "test",
      huh: "what",
    })
  }
  const thing = trpc.list.listSubscription.subscriptionOptions({
    listId: props.listId,
  })
  const { mutate } = useMutation(trpc.list.addListItem.mutationOptions())

  return (
    <div>
      {list.map(({ name, amount, id }) => (
        <div key={id}>
          <div>{name}</div>
          <div>{amount}</div>
        </div>
      ))}
    </div>
  )
}
