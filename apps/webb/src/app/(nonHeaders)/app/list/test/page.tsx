"use client"

import { useMutation } from "@tanstack/react-query"
import { useTRPC } from "@/utils/trpc"
import { useSubscription } from "@trpc/tanstack-react-query"
import { useState } from "react"

export default function TestSubscription() {
  const trpc = useTRPC()
  const { mutate } = useMutation(trpc.list.addListItem.mutationOptions())
  const { data, status, error } = useSubscription(
    trpc.list.listSubscription.subscriptionOptions({
      listId: 200,
    }),
  )
  const [thing, setThing] = useState("")
  return (
    <div>
      {status}
      <br />
      {!error && data?.name}
      <br />
      <input
        className="border-2 border-white"
        type="text"
        value={thing}
        onChange={(e) => {
          setThing(e.target.value)
        }}
      />
      <button
        onClick={() => {
          mutate({
            listId: 200,
            item: {
              amount: 20,
              name: thing,
            },
          })
        }}>
        Send event
      </button>
    </div>
  )
}
