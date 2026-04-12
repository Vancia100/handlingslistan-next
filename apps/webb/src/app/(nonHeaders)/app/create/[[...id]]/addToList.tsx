"use client"
import { useTRPC } from "@/utils/trpc"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useState, useEffect } from "react"

export default function AddToList(props: { recipeId: number }) {
  // Unsure if this component should load the lists
  // Or get them passed as an prop to get streamed in
  const trpc = useTRPC()
  const [time, setTime] = useState(0)
  const { data, refetch, isLoading } = useQuery(
    trpc.list.fetchLists.queryOptions({ timeStamp: time }),
  )
  const { mutate } = useMutation(trpc.list.addRecipeToList.mutationOptions())

  const [open, setIsOpen] = useState(false)

  useEffect(() => {
    if (open == true) {
      refetch({})
    }
  }, [open])
}
