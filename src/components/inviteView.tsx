"use client"
import { useState, startTransition, useCallback } from "react"

import { functionalDebounce as Debounce } from "@/utils/simpleDebounce"
import searchPeople from "@/actions/searchPeople"

export default function InviteView({
  addFunction,
}: {
  addFunction: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [shownPeople, setShownPeople] = useState<
    Awaited<ReturnType<typeof searchPeople>>
  >([])

  const debouncedSearchPeople = useCallback(
    Debounce(async (name: string) => {
      startTransition(async () => {
        const users = await searchPeople(name)
        setShownPeople(users)
      })
    }, 2000),
    [setShownPeople],
  )
  return (
    <div>
      <button onClick={() => setOpen((prev) => !prev)}></button>
      {open && (
        <div>
          <label>
            <form
              action={async (data) => {
                const name = data.get("Name")
                if (!name) return
                const users = await searchPeople(name as string)
                setShownPeople(users)
              }}>
              <input
                type="text"
                placeholder="Lars-goran420"
                name="Name"
                onChange={(e) => {
                  const name = e.target.value
                  if (!name) return
                  debouncedSearchPeople(name)
                }}
              />
              <button type="submit"></button>
            </form>
          </label>
          <div>
            {shownPeople.length > 0 ? (
              shownPeople.map((user) => (
                <div
                  key={user.id}
                  onClick={() => {
                    addFunction(user.id)
                  }}>
                  <p>{user.name ?? user.email}</p>
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
