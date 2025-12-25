import { auth } from "@hndl/auth/server"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function SignOutButton() {
  const authHeaders = await headers()
  return (
    <button
      className="bg-primary-blue border-primary-blue mt-4 w-max cursor-pointer self-center rounded-3xl border-2 p-3 text-xl shadow-white hover:border-white hover:drop-shadow-lg"
      onClick={async () => {
        "use server"
        const thing = await auth.api.signOut({
          headers: authHeaders,
        })
        if (!thing.success) {
          console.log("could not sign out user")
        } else {
          redirect("/auth/login")
        }
      }}>
      Sign Out
    </button>
  )
}
