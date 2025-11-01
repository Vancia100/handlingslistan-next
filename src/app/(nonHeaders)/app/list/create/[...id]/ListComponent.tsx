"use client"

import type { ListType, IngredientsType } from "./page"

import { useState, use, useEffect } from "react"
export default function ListComponent(props: {
  startlist?: ListType
  ingredients: IngredientsType
}) {
  const firstList = props.startlist ? use(props.startlist) : null
  const ingredeints = use(props.ingredients)

  const [list, setList] = useState(firstList)
  useEffect(() => {
    // setup socket connection
    fetch("/api/test")
  }, [])

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
