"use client"
import {
  useState,
  startTransition,
  useCallback,
  useEffect,
  useRef,
} from "react"

import { functionalDebounce as debounce } from "@/utils/simpleDebounce"
import searchPeople from "@/actions/searchPeople"

type ExtendedUser = (Awaited<ReturnType<typeof searchPeople>>[0] & {
  viewer: boolean
})[]

export default function InviteView({
  addFunctionAction,
  excludedPeople,
}: {
  addFunctionAction: (id: string) => void
  excludedPeople: string[]
}) {
  const [open, setOpen] = useState(false)
  const popupref = useRef<HTMLDivElement>(null)

  const [shownPeople, setShownPeople] = useState<ExtendedUser>([])

  // React optimized debounced api call to get names
  const debouncedSearchPeople = useCallback(
    (name: string) => {
      debounce(async (name: string) => {
        startTransition(async () => {
          const users = await searchPeople(name)
          setShownPeople(
            users.map((item) => ({
              ...item,
              viewer: excludedPeople.includes(item.id),
            })),
          )
        })
      }, 500)(name)
    },
    [setShownPeople, excludedPeople],
  )

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
              action={async (data) => {
                // Check if the user exists and add it to the recipe.

                const name = data.get("Name")
                if (!name) return
                const users = await searchPeople(name as string)
                if (users.length === 1 && users[0]?.name === name) {
                  addFunctionAction(users[0].id)
                }
              }}>
              <input
                className="border-primary-white bg-primary-black-75 my-3 rounded-sm border-2 px-2"
                type="text"
                placeholder="Lars-goran420"
                name="Name"
                onChange={(e) => {
                  // Add clickable options with a debounce
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
                      setShownPeople((cur) => {
                        return cur.map((play) =>
                          play.id == user.id ? { ...play, viewer: true } : play,
                        )
                      })
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
