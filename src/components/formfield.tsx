"use client"
import { useRef } from "react"

export default function FormField(){
  const titelRef = useRef<HTMLSpanElement>(null)
  return (   
  <form className="flex flex-col gap-4">
    <label className="min-w-2/3">
    <span ref={titelRef} className="text-2xl font-bold p-4">{"Title:"}</span>
    <input 
    onFocus={e => {
      if (titelRef.current?.hidden === undefined) return

      titelRef.current.hidden = true
      e.target.classList.add("border-4")
    }}
    onBlur={e => {
      if (titelRef.current?.hidden === undefined) return

      if (e.target.value === "") {
        titelRef.current.hidden = false
      } else {
        e.target.classList.remove("border-4")
      }
    }}
    type={"text"} 
    className="rounded-lg p-2 border-4 border-primary-purple bg-primary-black text-2xl font-bold" />
    </label>
  </form>
  )
}