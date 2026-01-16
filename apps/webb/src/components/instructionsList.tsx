"use client"
import type { Dispatch, SetStateAction } from "react"

export default function InstructionsList(props: {
  instructions: string[]
  setInstructions: Dispatch<SetStateAction<string[]>>
}) {
  const { instructions, setInstructions } = props
  console.log("rerendered instrucions!")
  return (
    <div>
      <h3 className="text-start">Instructions:</h3>
      <div className="border-primary-purple bg-primary-black-75 rounded-lg border-2">
        <ol className="mx-5 list-decimal">
          {[...instructions, ""].map((value, index) => {
            return (
              <li key={index}>
                <input
                  value={value}
                  type="text"
                  className="w-full"
                  onChange={(e) => {
                    const newInstructions = [...instructions]
                    newInstructions[index] = e.target.value
                    if (index != instructions.length && e.target.value === "") {
                      newInstructions.splice(index, 1)
                    }
                    setInstructions(newInstructions)
                  }}></input>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
