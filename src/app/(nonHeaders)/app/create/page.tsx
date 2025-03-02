import FormField from "@/components/formfield"

export default function CreatePage() {
  return (
    <div className="p-4 bg-primary-black-50 rounded-2xl">
      <h1 className="text-3xl font-bold mb-4">
        {"Create a new recepie"}
      </h1>
      <FormField />
    </div>
  )
}