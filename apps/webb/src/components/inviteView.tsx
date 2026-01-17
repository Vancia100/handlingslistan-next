"use client"
import { useState, useEffect, useRef } from "react"

import { useTRPC, useTRPCClient } from "@/utils/trpc"
import { useQuery } from "@tanstack/react-query"
import { useDebounce } from "use-debounce"

export default function InviteView({
  addFunctionAction,
  excludedPeople,
}: {
  addFunctionAction: (id: string) => Promise<boolean> | boolean
  excludedPeople: string[]
}) {
  const [excluded, setExcluded] = useState(excludedPeople)

  const trpcClient = useTRPCClient()
  const trpc = useTRPC()
  const [search, setSearch] = useState("")

  const [debouncedSearch] = useDebounce(search, 500)
  const myQueryOptions = trpc.searchPeople.queryOptions(debouncedSearch, {
    enabled: search.length > 1,
  })
  const { data } = useQuery(myQueryOptions)

  const shownPeople =
    data?.map((item) => ({
      ...item,
      viewer: excluded.includes(item.id),
    })) || []

  // Popup logic
  const [open, setOpen] = useState(false)
  const popupref = useRef<HTMLDivElement>(null)
  // Clicking outside will close the popup
  useEffect(() => {
    const controller = new AbortController()

    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupref.current &&
        !popupref.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside, {
        signal: controller.signal,
      })
    }

    return () => {
      controller.abort()
    }
  }, [open, setOpen])

  return (
    <div ref={popupref} className="max-w-max">
      <button
        className="border-primary-black-50 hover:border-primary-purple rounded-2xl border-2 p-2 px-3 text-xl"
        onClick={() => setOpen((prev) => !prev)}>
        Invite People
      </button>
      {open && (
        <div className="border-primary-black-50 absolute mt-2 rounded-2xl border-2 p-2">
          <label>
            <form
              action={async () => {
                const cur = search
                setSearch("")
                const users = await trpcClient.searchPeople.query(cur)
                const filusers =
                  users.length === 1
                    ? users
                    : users.filter(
                        (usr) => usr.name === cur || usr.email === cur,
                      )
                if (filusers.length === 1) {
                  const addUser = filusers[0]!.id
                  const succ = await addFunctionAction(addUser)
                  if (succ) {
                    setExcluded((prev) => prev.concat(addUser))
                  }
                } else {
                  console.log("Search did not work")
                  // Add errors and such here
                }
              }}>
              <input
                className="border-primary-white bg-primary-black-75 my-3 rounded-sm border-2 px-2"
                type="text"
                placeholder="Lars-goran420"
                name="Name"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                }}
              />
              <button type="submit"></button>
            </form>
          </label>
          <div>
            {shownPeople.length > 0 ? (
              shownPeople.map((user) => (
                <div
                  className={
                    (user.viewer
                      ? // Not supposed to be clicked
                        "bg-primary-black-75 cursor-not-allowed border-0 opacity-50"
                      : // Supposed to be clicked
                        "bg-primary-black cursor-pointer border-2") +
                    " " +
                    "border-primary-purple rounded-2xl"
                  }
                  key={user.id}
                  onClick={() => {
                    if (!user.viewer) {
                      addFunctionAction(user.id)
                      // Optimisticly blur their name
                      setExcluded((prev) => prev.concat(user.id))
                    }
                  }}>
                  <p className="px-2 text-start">{user.name ?? user.email}</p>
                </div>
              ))
            ) : (
              <div>
                <p>{"Such empty"}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
