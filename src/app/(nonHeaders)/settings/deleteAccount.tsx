"use client"

export default function DeleteAcount({
  Action,
}: {
  Action: () => Promise<void>
}) {
  return (
    <button
      className="bg-primary-blue border-primary-blue mt-4 w-max cursor-pointer self-center rounded-3xl border-2 p-3 text-xl shadow-white hover:border-white hover:drop-shadow-lg"
      onClick={async () => {
        if (
          !window.confirm(
            "This action can not be undone. All your lists and posts will be deleted. Delete account?",
          )
        ) {
          return
        }
        await Action()
      }}>
      DELETE ACCOUNT
    </button>
  )
}
