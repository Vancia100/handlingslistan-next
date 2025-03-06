"use client"
import { useRef } from "react"

export default function FormField() {
  const titelRef = useRef<HTMLSpanElement>(null)
  return (
    <form className="flex flex-col gap-4">
      <label className="min-w-2/3">
        <span ref={titelRef} className="p-4 text-2xl font-bold">
          {"Title:"}
        </span>
        <input
          onFocus={(e) => {
            if (titelRef.current?.hidden === undefined) return

            titelRef.current.hidden = true
            e.target.classList.add("border-4")
          }}
          onBlur={(e) => {
            if (titelRef.current?.hidden === undefined) return

            if (e.target.value === "") {
              titelRef.current.hidden = false
            } else {
              e.target.classList.remove("border-4")
            }
          }}
          type={"text"}
          className="border-primary-purple bg-primary-black rounded-lg border-4 p-2 text-2xl font-bold"
        />
      </label>
      <label className="min-w-2/3">
        <div>Description:</div>
        <textarea className="bg-primary-black border-primary-purple w-full rounded-2xl border-4 p-2"></textarea>
      </label>
    </form>
  )
}
