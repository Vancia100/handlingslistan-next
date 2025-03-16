import type { Dispatch, SetStateAction } from "react"

export default function InstructionsList(props: {
  instructions: string[]
  setInstructions: Dispatch<SetStateAction<string[]>>
}) {
  const { instructions, setInstructions } = props
  return (
    <div>
      <h3 className="text-start">Instructions:</h3>
      <div className="border-primary-purple bg-primary-black-75 rounded-lg border-2">
        <ol className="mx-5 list-decimal">
          {[...instructions, ""].map((_, index) => {
            return (
              <li key={index}>
                <input
                  value={instructions[index] ?? ""}
                  type="text"
                  className="w-full"
                  onChange={(e) => {
                    const newInstructions = [...instructions]
                    newInstructions[index] = e.target.value
                    if (index != instructions.length && e.target.value === "") {
                      console.log(newInstructions)
                      newInstructions.splice(index, 1)
                      console.log(newInstructions)
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
