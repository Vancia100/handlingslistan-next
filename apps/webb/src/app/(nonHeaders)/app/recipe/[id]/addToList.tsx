"use client"
import { useState, useEffect } from "react"
import { useMutation } from "@tanstack/react-query"
import { useTRPC } from "@/utils/trpc"
import { useQuery } from "@tanstack/react-query"
export default function AddToList(props: { recipeId: number }) {
  const trpc = useTRPC()
  const [open, setIsOpen] = useState(false)
  const { mutate } = useMutation(trpc.list.addRecipeToList.mutationOptions())
  console.log("Rerendered")
  const [time, setTime] = useState(1)
  const query = useQuery(
    trpc.list.fetchLists.queryOptions(
      { timeStamp: time },
      {
        refetchInterval: 10000,
        select: (data) => {
          if (data.lists.length != 0) {
            setTime(data.time)
            setReturn((prev) => prev.concat(data.lists))
          }
          return data.lists
        },
      },
    ),
  )
  const { isPending, refetch } = query
  const [data, setReturn] = useState<NonNullable<typeof query.data>>([])
  useEffect(() => {
    if (open == true) {
      refetch()
    }
  }, [open, refetch])
  return (
    // TODO: add styles
    <div>
      <button
        onClick={() => {
          setIsOpen((prev) => !prev)
        }}>
        {!open ? "Open" : "Close"}
      </button>
      {open && (
        <>
          {isPending && "Loading..."}
          {!isPending && data && (
            <ul>
              {data.map((list) => (
                <li
                  className="cursor-pointer rounded-2xl border-2 border-none p-1 hover:border-white"
                  key={list.id}
                  onClick={() => {
                    setIsOpen(false)
                    mutate({ recipeId: props.recipeId, listId: list.id })
                  }}>
                  {list.title}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}
