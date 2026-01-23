"use client"

import type { ListType, IngredientsType } from "./[...id]/page"

import { useMutation } from "@tanstack/react-query"
import { useTRPC } from "@/utils/trpc"
import { useState, use } from "react"
export default function ListComponent(props: {
  startlist?: ListType
  ingredients: IngredientsType
  listId: number
}) {
  const firstList = props.startlist ? use(props.startlist) : null
  const ingredeints = use(props.ingredients)
  const trpc = useTRPC()
  const [list, setList] = useState(firstList)

  const thing = trpc.list.listSubscription.subscriptionOptions({
    listId: props.listId,
  })
  const { mutate } = useMutation(trpc.list.addListItem.mutationOptions())

  const itemlist = list?.items.map((item) => ({
    name: item.recipeCustom ?? item.recipeItem?.name,
    amount: item.amount,
  }))
  return (
    <div>
      {itemlist?.map(({ name, amount }) => (
        <div key={name}>
          <div>{name}</div>
          <div>{amount}</div>
        </div>
      ))}
    </div>
  )
}
