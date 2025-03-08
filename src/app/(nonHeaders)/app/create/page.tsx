import FormField from "@/components/formfield"

export default function CreatePage() {
  return (
    <div className="bg-primary-black-50 rounded-2xl p-4">
      <h1 className="mb-4 text-3xl font-bold">{"Create a new recipe"}</h1>
      <FormField />
    </div>
  )
}
