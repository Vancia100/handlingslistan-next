import generateExampleData from "@/utils/generateExampleData"

export default function Page() {
  return (
    <form action={generateExampleData}>
      <button type="submit"> {"Cook some lasagna :)"}</button>
    </form>
  )
}
